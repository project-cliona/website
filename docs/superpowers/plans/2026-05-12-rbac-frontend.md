# RBAC — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the frontend match the backend RBAC model — Clients/Resellers/Admins see role-appropriate UI, admins can promote/demote users from a screen (not curl), and unauthorised actions fail gracefully with a toast.

**Architecture:** Consume the `role` already returned by `/auth/me`. Add a small primitives layer (`rbac.ts` constants, `<RoleGate>`, `<RequireRole>`) on top of the existing `<ProtectedRoute>` (which stays auth-only). The Admin link lives inside the existing `UserDock` dropdown — the actively-rendered sidebar is `whatsappLinks` and Admin is account-level. A new admin-only `GET /admin/users` endpoint feeds the new `/app/admin/users` page; the existing `PATCH /admin/users/:id/role` handles mutations. A 403 axios interceptor surfaces sonner toasts; sonner is already mounted.

**Tech Stack:** Next.js 15 (App Router, Turbopack), TypeScript 5, Tailwind CSS v4, Radix UI primitives (DropdownMenu, AlertDialog, Select), TanStack Query/Table, Sonner, Zod, React Hook Form, Axios. Backend: Express 5, Drizzle ORM, PostgreSQL, t3-env, Zod.

**Spec:** [`website/docs/superpowers/specs/2026-05-12-rbac-frontend-design.md`](../specs/2026-05-12-rbac-frontend-design.md). Read it first.

**Branch state:** `feat/rbac` in `website` is rebased onto `origin/design/ui-polish-pass`. Open the PR with `design/ui-polish-pass` as base. When PR #16 merges to `main`, GitHub auto-retargets.

---

## Conventions for this plan

- **Working directories:**
  - `website` repo: `/Users/harshitsingh/code/personal-code/website`
  - `cliona-backend` repo: `/Users/harshitsingh/code/personal-code/cliona-backend`
  - Most tasks are in `website`. Phase 3's one task is in `cliona-backend`.
- **Dev server (frontend):** `npm run dev` → http://localhost:3000
- **Dev server (backend):** `pnpm dev` → http://localhost:7000
- **Type/lint check (frontend):** `npm run lint` and `npm run build` (Turbopack typechecks during build)
- **Type/lint check (backend):** `pnpm lint`
- **Verification:** No automated test infra exists. Each task ends with a manual smoke + type-check step.
- **Commits:** Every task or task-group ends in one commit. Follow existing style: `<type>(<scope>): <subject>`.
- **No new comments in code** unless the WHY is genuinely non-obvious (per repo CLAUDE.md). Don't narrate WHAT — names should do that.
- **Path imports:** use `@/` alias.
- **Rebase cadence while PR #16 is open:** every few days, `cd website && git fetch && git rebase origin/design/ui-polish-pass`. Dispatch a parallel reviewer subagent after rebases with conflicts.

---

## Phase 1 — Primitives (no visible UI change)

Adds the role types, helpers, and gating components. Nothing renders differently after Phase 1; this is pure foundation. Each task individually compiles and the app boots.

### Task 1: Add `rbac.ts` constants module

**Files:**
- Create: `website/src/lib/rbac.ts`

- [ ] **Step 1: Create the constants file**

Path: `website/src/lib/rbac.ts`

```ts
export const ROLE_ADMIN = 0 as const;
export const ROLE_RESELLER = 1 as const;
export const ROLE_CLIENT = 2 as const;

export type Role = typeof ROLE_ADMIN | typeof ROLE_RESELLER | typeof ROLE_CLIENT;

export const ROLE_LABEL: Record<Role, string> = {
  [ROLE_ADMIN]: "Admin",
  [ROLE_RESELLER]: "Reseller",
  [ROLE_CLIENT]: "Client",
};
```

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: passes (no other files reference this yet).

- [ ] **Step 3: Commit**

```bash
cd /Users/harshitsingh/code/personal-code/website
git add src/lib/rbac.ts
git commit -m "feat(rbac-fe): role constants mirroring backend authz"
```

---

### Task 2: Narrow the `User` type

**Files:**
- Modify: `website/src/lib/type.ts` (lines 84–93)

**Why:** `/auth/me` returns `{ email, userId, role }` (the JWT payload). The existing `User` interface lists six fields that the API does not return. Grep confirms zero callsites read the soon-to-be-removed fields.

- [ ] **Step 1: Read the current type definition**

Run: `grep -n "^export interface User" src/lib/type.ts`
Expected: shows the line where the User interface starts (~line 84).

- [ ] **Step 2: Replace the User interface**

In `src/lib/type.ts`, replace the existing `User` interface block with:

```ts
import type { Role } from "@/lib/rbac";

export interface User {
  userId: number;
  email: string;
  role: Role;
}
```

(Add the `import` near the top of the file with other imports. Keep all other interfaces in the file unchanged.)

- [ ] **Step 3: Confirm no callsites break**

Run:
```bash
grep -rn "user\.userName\|user\.isSocialLogin\|user\.status\|user\.isEmailConfirmed\|user\.isPhoneConfirmed\|user\.createdOn" src --include="*.tsx" --include="*.ts"
```
Expected: no matches. If matches appear, those are real bugs (they read fields the API never returned); fix them by replacing with the equivalent field from `profile` (e.g., `user.userName` → `profile?.fullName`).

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: passes. If a type error surfaces, it's a real callsite reading the dropped fields; fix at the breakage.

- [ ] **Step 5: Commit**

```bash
git add src/lib/type.ts
git commit -m "feat(rbac-fe): narrow User type to /auth/me shape (userId, email, role)"
```

---

### Task 3: Expose role helpers on `useUser()`

**Files:**
- Modify: `website/src/providers/userProvider.tsx`

- [ ] **Step 1: Update the imports and context type**

In `src/providers/userProvider.tsx`, replace the existing `UserContextType` interface with:

```ts
import { ROLE_ADMIN, ROLE_RESELLER, ROLE_CLIENT, type Role } from "@/lib/rbac";

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    userAuthLoading: boolean;
    role: Role | null;
    isAdmin: boolean;
    isReseller: boolean;
    isClient: boolean;
    hasRole: (allowed: Role[]) => boolean;
    refetchUser: () => Promise<QueryObserverResult<User, Error>>;
    refetchProfile: () => Promise<QueryObserverResult<UserProfile, Error>>;
    logout: () => Promise<void>;
}
```

- [ ] **Step 2: Derive and expose the helpers**

Inside `UserProvider`, after the `userAuthLoading` line and before `logout`, add:

```ts
    const role: Role | null = user?.role ?? null;
    const isAdmin = role === ROLE_ADMIN;
    const isReseller = role === ROLE_RESELLER;
    const isClient = role === ROLE_CLIENT;
    const hasRole = (allowed: Role[]) => role !== null && allowed.includes(role);
```

In the `<UserContext.Provider value={...}>` JSX, add `role`, `isAdmin`, `isReseller`, `isClient`, `hasRole` to the value object alongside the existing fields.

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 4: Smoke test in browser**

Run: `npm run dev` (if not already running), open http://localhost:3000, log in as any user. Open the React DevTools, find the `UserProvider` context value, and confirm `role` is a number (0, 1, or 2) and the boolean helpers match.

- [ ] **Step 5: Commit**

```bash
git add src/providers/userProvider.tsx
git commit -m "feat(rbac-fe): expose role + isAdmin/isReseller/isClient/hasRole on useUser"
```

---

### Task 4: Create `<RoleGate>` component

**Files:**
- Create: `website/src/components/auth/RoleGate.tsx`

- [ ] **Step 1: Create the component**

Path: `website/src/components/auth/RoleGate.tsx`

```tsx
"use client";

import { useUser } from "@/providers/userProvider";
import type { Role } from "@/lib/rbac";
import type { ReactNode } from "react";

interface RoleGateProps {
  roles: Role[];
  children: ReactNode;
}

export function RoleGate({ roles, children }: RoleGateProps) {
  const { hasRole, userAuthLoading } = useUser();
  if (userAuthLoading) return null;
  if (!hasRole(roles)) return null;
  return <>{children}</>;
}
```

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 3: Commit** (will be combined with Task 5)

Hold the commit; Task 5 commits both primitives together.

---

### Task 5: Create `<RequireRole>` component

**Files:**
- Create: `website/src/components/auth/RequireRole.tsx`

**Note:** `<RequireRole>` is a **sibling** of the existing `<ProtectedRoute>` (which checks auth). It's used inside individual pages that need additional role gating. It assumes auth has already been verified by the wrapping `<ProtectedRoute>` in `src/app/app/layout.tsx`.

- [ ] **Step 1: Create the component**

Path: `website/src/components/auth/RequireRole.tsx`

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/userProvider";
import type { Role } from "@/lib/rbac";

interface RequireRoleProps {
  roles: Role[];
  children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { hasRole, userAuthLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userAuthLoading) return;
    if (!hasRole(roles)) router.replace("/app");
  }, [userAuthLoading, hasRole, roles, router]);

  if (userAuthLoading) return null;
  if (!hasRole(roles)) return null;
  return <>{children}</>;
}
```

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 3: Commit Tasks 4 + 5 together**

```bash
git add src/components/auth/RoleGate.tsx src/components/auth/RequireRole.tsx
git commit -m "feat(rbac-fe): add RoleGate + RequireRole primitives"
```

---

## Phase 2 — Cross-cutting glue

### Task 6: 403 axios interceptor → sonner toast

**Files:**
- Modify: `website/src/lib/axios.ts`

**Notes:**
- `sonner`'s `<Toaster />` is already mounted in `src/app/app/layout.tsx` for routes under `/app`. For 403s outside `/app` (rare; pre-login flows mostly), the toast still fires — sonner queues until a Toaster mounts.
- Attach the interceptor to **both** clients: the response stage doesn't depend on auth, and it's one shared helper.

- [ ] **Step 1: Replace `src/lib/axios.ts` contents**

Path: `website/src/lib/axios.ts`

```ts
import axios, { AxiosHeaders, type AxiosInstance } from 'axios';
import { toast } from 'sonner';

function attachForbiddenInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        const message =
          error?.response?.data?.message ??
          "You don't have permission for that action.";
        toast.error(message);
      }
      return Promise.reject(error);
    }
  );
}

export const apiClient = (headers?: AxiosHeaders) => {
  const systemHeader = new AxiosHeaders();
  systemHeader.set('ngrok-skip-browser-warning', true);

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false,
    headers: {
      ...systemHeader,
      ...headers,
    },
  });

  attachForbiddenInterceptor(instance);
  return instance;
};

export const authenticatedApiClient = () => {
  const axiosInstance = apiClient();
  axiosInstance.interceptors.request.use(async (config: any) => {
    const access_token = localStorage.getItem("accessToken");
    if (!access_token) {
      return Promise.reject(new Error("Unauthorized: No token found"));
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });
  return axiosInstance;
}
```

(`attachForbiddenInterceptor` is called inside `apiClient`, so `authenticatedApiClient` inherits the same interceptor.)

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 3: Smoke test in browser**

While logged in as a non-admin, open DevTools console and run:

```js
fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7000/api/v1'}/admin/users/1/role`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  },
  body: JSON.stringify({ roleId: 0 }),
});
```

Expected: 403 response, sonner toast appears with "Admin only" (or similar server `message`).

(For this to work you need a non-admin token. If you only have admin set up, sign up a fresh user first.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/axios.ts
git commit -m "feat(rbac-fe): 403 axios interceptor surfaces sonner toast"
```

---

### Task 7: Admin link inside `UserDock` dropdown

**Files:**
- Modify: `website/src/components/ui/UserDock.tsx`

- [ ] **Step 1: Add imports**

In `src/components/ui/UserDock.tsx`, alongside the existing lucide-react imports, add `ShieldCheck`:

```ts
import { ChevronUp, LogOut, User as UserIcon, Settings, Repeat, ShieldCheck } from "lucide-react";
```

Add at the top with other imports:

```ts
import { RoleGate } from "@/components/auth/RoleGate";
import { ROLE_ADMIN } from "@/lib/rbac";
```

- [ ] **Step 2: Insert the Admin dropdown item**

In the `<DropdownMenuContent>` block, after the "Switch service" `<DropdownMenuItem>` and **before** the `<DropdownMenuSeparator />`, insert:

```tsx
        <RoleGate roles={[ROLE_ADMIN]}>
          <DropdownMenuItem asChild>
            <Link href="/app/admin/users">
              <ShieldCheck className="h-4 w-4 mr-2" /> Admin
            </Link>
          </DropdownMenuItem>
        </RoleGate>
```

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 4: Smoke test in browser**

Log in as the seeded admin. Open the `UserDock` (click the user pill at the bottom-left of the sidebar). Confirm "Admin" appears between "Switch service" and "Log out". Log out, log in as a non-admin (sign up a new user if needed). Confirm "Admin" does NOT appear.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/UserDock.tsx
git commit -m "feat(rbac-fe): Admin link in UserDock dropdown (role-gated)"
```

---

## Phase 3 — Backend admin list endpoint

This is the only task in `cliona-backend`. Frontend Phase 4 depends on it.

### Task 8: `GET /api/v1/admin/users` (admin-only list with email)

**Files:**
- Modify: `cliona-backend/src/services/admin/users.ts`
- Modify: `cliona-backend/src/controllers/v1/admin/userController.ts`
- Modify: `cliona-backend/src/routes/v1/adminRoutes.ts`

**Note:** Working dir for this task is `/Users/harshitsingh/code/personal-code/cliona-backend`.

- [ ] **Step 1: Add a service method to list all users with email**

In `cliona-backend/src/services/admin/users.ts`, inside the exported `adminUsersService` object (after `setUserRole`), add:

```ts
  async listUsers() {
    const rows = await db
      .select({
        userId: userProfiles.userId,
        fullName: userProfiles.fullName,
        roleId: userProfiles.roleId,
        parentId: userProfiles.parentId,
        profileStatus: userProfiles.profileStatus,
        createdAt: userProfiles.createdAt,
        email: users.email,
      })
      .from(userProfiles)
      .innerJoin(users, eq(users.id, userProfiles.userId))
      .orderBy(userProfiles.createdAt);
    return rows;
  },
```

Add imports at the top of the file (next to existing imports):

```ts
import { users } from "@/db/schema/users";
```

(`userProfiles` and `eq` are already imported.)

- [ ] **Step 2: Add the controller handler**

In `cliona-backend/src/controllers/v1/admin/userController.ts`, append after `setUserRole`:

```ts
export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ctx = requireAuth(req);
    requireAdmin(ctx);

    const rows = await adminUsersService.listUsers();
    sendResponse(res, "Users fetched", rows, "SUCCESS");
  } catch (err) {
    next(err);
  }
}
```

(All needed imports are already present at the top of the file.)

- [ ] **Step 3: Register the route**

In `cliona-backend/src/routes/v1/adminRoutes.ts`, replace the file contents with:

```ts
import type { Router } from "express";
import { createRouter } from "@/utils/router";
import { setUserRole, listUsers } from "@/controllers/v1/admin/userController";

const adminRouter = createRouter((router: Router) => {
  router.get("/users", listUsers);
  router.patch("/users/:id/role", setUserRole);
});

export default adminRouter;
```

- [ ] **Step 4: Lint**

Run: `cd /Users/harshitsingh/code/personal-code/cliona-backend && pnpm lint`
Expected: passes.

- [ ] **Step 5: Smoke test the endpoint**

Start the backend: `pnpm dev` (if not running).

In a separate terminal:

```bash
# Get an admin token first (login or seed-admin then login).
TOKEN="$(curl -s -X POST http://localhost:7000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<admin-email>","password":"<admin-password>"}' \
  | jq -r '.result.accessToken')"

curl -s -H "Authorization: Bearer $TOKEN" http://localhost:7000/api/v1/admin/users | jq
```

Expected: JSON `{ code: "SUCCESS", message: "Users fetched", result: [ { userId, email, fullName, roleId, parentId, profileStatus, createdAt }, ... ] }`.

Repeat with a non-admin token:

```bash
curl -s -i -H "Authorization: Bearer <non-admin-token>" http://localhost:7000/api/v1/admin/users
```

Expected: HTTP 403 with `{ code: "FORBIDDEN", message: "Admin only" }`.

- [ ] **Step 6: Commit**

```bash
cd /Users/harshitsingh/code/personal-code/cliona-backend
git add src/services/admin/users.ts src/controllers/v1/admin/userController.ts src/routes/v1/adminRoutes.ts
git commit -m "feat(rbac): GET /admin/users admin-only list with email join"
```

---

## Phase 4 — Admin Users page

### Task 9: API client + types + zod schema

**Files:**
- Create: `website/src/lib/api/admin/users.ts`
- Create: `website/src/lib/schema/admin.schema.ts`
- Modify: `website/src/lib/type.ts`

- [ ] **Step 1: Add the `AdminUserRow` type to `type.ts`**

In `src/lib/type.ts`, after the existing `User`/`UserProfile` interfaces, add:

```ts
import type { Role } from "@/lib/rbac";

export interface AdminUserRow {
  userId: number;
  email: string;
  fullName: string | null;
  roleId: Role;
  parentId: number | null;
  profileStatus: "active" | "incomplete" | "suspended" | "inactive";
  createdAt: string;
}
```

(If the `Role` import is already present from Task 2, don't duplicate it.)

- [ ] **Step 2: Create the zod schema**

Path: `website/src/lib/schema/admin.schema.ts`

```ts
import { z } from "zod";
import { ROLE_ADMIN, ROLE_RESELLER, ROLE_CLIENT } from "@/lib/rbac";

export const changeRoleSchema = z
  .object({
    roleId: z.union([
      z.literal(ROLE_ADMIN),
      z.literal(ROLE_RESELLER),
      z.literal(ROLE_CLIENT),
    ]),
    parentId: z.number().int().positive().nullable(),
  })
  .refine(
    (data) => (data.roleId === ROLE_ADMIN ? data.parentId === null : data.parentId !== null),
    { message: "parentId must be null for Admin and required for Reseller/Client", path: ["parentId"] }
  );

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
```

- [ ] **Step 3: Create the API client**

Path: `website/src/lib/api/admin/users.ts`

```ts
import { authenticatedApiClient } from "@/lib/axios";
import type { AdminUserRow } from "@/lib/type";
import type { ChangeRoleInput } from "@/lib/schema/admin.schema";

export async function listUsers(): Promise<AdminUserRow[]> {
  const res = await authenticatedApiClient().get("/admin/users");
  return res.data.result;
}

export async function updateUserRole(userId: number, body: ChangeRoleInput) {
  const res = await authenticatedApiClient().patch(
    `/admin/users/${userId}/role`,
    body
  );
  return res.data.result;
}
```

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: passes.

- [ ] **Step 5: Commit** (will combine with Tasks 10–12)

Hold the commit; the admin page tasks ship together.

---

### Task 10: Admin Users page shell (`/app/admin/users`)

**Files:**
- Create: `website/src/app/app/admin/users/page.tsx`

**Note:** The wrapping `<ProtectedRoute>` from `src/app/app/layout.tsx` already provides auth gating. We add `<RequireRole>` here for the role check.

- [ ] **Step 1: Create the page**

Path: `website/src/app/app/admin/users/page.tsx`

```tsx
"use client";

import { RequireRole } from "@/components/auth/RequireRole";
import { ROLE_ADMIN } from "@/lib/rbac";
import { UsersTable } from "@/components/admin/UsersTable";
import { PageHeading } from "@/components/ui/PageHeading";

export default function AdminUsersPage() {
  return (
    <RequireRole roles={[ROLE_ADMIN]}>
      <div className="space-y-8">
        <PageHeading
          title="Admin"
          subtitle="Manage user roles and parent relationships"
        />
        <UsersTable />
      </div>
    </RequireRole>
  );
}
```

- [ ] **Step 2: Type-check (will fail until Task 11)**

Run: `npm run lint`
Expected: fails with "Cannot find module '@/components/admin/UsersTable'". Proceed to Task 11.

---

### Task 11: `UsersTable` component + `ChangeRoleDialog`

**Files:**
- Create: `website/src/components/admin/UsersTable.tsx`
- Create: `website/src/components/admin/ChangeRoleDialog.tsx`

- [ ] **Step 1: Confirm prerequisites — Select primitive exists**

Run: `ls src/components/ui/Select.tsx 2>/dev/null || ls src/components/ui/select.tsx 2>/dev/null`
Expected: one of them exists (the Radix Select primitive is in the polish-pass tree). Note the exact filename case for imports below.

If neither exists, use the Radix primitives directly — but check first. The repo also has `dropdown-menu.tsx`, `alert-dialog.tsx`, `popover.tsx` available.

- [ ] **Step 2: Create `ChangeRoleDialog`**

Path: `website/src/components/admin/ChangeRoleDialog.tsx`

```tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { updateUserRole } from "@/lib/api/admin/users";
import { changeRoleSchema, type ChangeRoleInput } from "@/lib/schema/admin.schema";
import { ROLE_ADMIN, ROLE_RESELLER, ROLE_CLIENT, ROLE_LABEL, type Role } from "@/lib/rbac";
import type { AdminUserRow } from "@/lib/type";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: AdminUserRow;
  allUsers: AdminUserRow[];
}

export function ChangeRoleDialog({ open, onOpenChange, row, allUsers }: ChangeRoleDialogProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangeRoleInput>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      roleId: row.roleId,
      parentId: row.parentId,
    },
  });

  useEffect(() => {
    reset({ roleId: row.roleId, parentId: row.parentId });
  }, [row, reset]);

  const selectedRole = watch("roleId") as Role;

  const eligibleParents = useMemo(() => {
    if (selectedRole === ROLE_ADMIN) return [];
    if (selectedRole === ROLE_RESELLER) {
      return allUsers.filter((u) => u.roleId === ROLE_ADMIN && u.userId !== row.userId);
    }
    return allUsers.filter(
      (u) => (u.roleId === ROLE_ADMIN || u.roleId === ROLE_RESELLER) && u.userId !== row.userId
    );
  }, [selectedRole, allUsers, row.userId]);

  useEffect(() => {
    if (selectedRole === ROLE_ADMIN) {
      setValue("parentId", null, { shouldValidate: true });
    } else if (watch("parentId") === null && eligibleParents.length > 0) {
      setValue("parentId", eligibleParents[0].userId, { shouldValidate: true });
    }
  }, [selectedRole, eligibleParents, setValue, watch]);

  const mutation = useMutation({
    mutationFn: (body: ChangeRoleInput) => updateUserRole(row.userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(`${row.email}: role updated`);
      onOpenChange(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Could not update role";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ChangeRoleInput) => {
    mutation.mutate(data);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Change role — {row.email}</AlertDialogTitle>
            <AlertDialogDescription>
              Update this user's role and parent. Demotions are atomic; the last admin cannot be demoted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value) as Role)}
                  >
                    <option value={ROLE_ADMIN}>{ROLE_LABEL[ROLE_ADMIN]}</option>
                    <option value={ROLE_RESELLER}>{ROLE_LABEL[ROLE_RESELLER]}</option>
                    <option value={ROLE_CLIENT}>{ROLE_LABEL[ROLE_CLIENT]}</option>
                  </select>
                )}
              />
            </div>

            {selectedRole !== ROLE_ADMIN && (
              <div className="space-y-2">
                <Label>Parent</Label>
                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <select
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {eligibleParents.length === 0 && (
                        <option value="">No eligible parents</option>
                      )}
                      {eligibleParents.map((p) => (
                        <option key={p.userId} value={p.userId}>
                          {p.email} ({ROLE_LABEL[p.roleId]})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.parentId && (
                  <p className="text-xs text-destructive">{errors.parentId.message}</p>
                )}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending ? "Saving…" : "Save"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 3: Create `UsersTable`**

Path: `website/src/components/admin/UsersTable.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/lib/api/admin/users";
import { useUser } from "@/providers/userProvider";
import { ROLE_ADMIN, ROLE_LABEL, type Role } from "@/lib/rbac";
import type { AdminUserRow } from "@/lib/type";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableSkeleton } from "@/components/ui/skeleton/table";
import { ChangeRoleDialog } from "./ChangeRoleDialog";

export function UsersTable() {
  const { user } = useUser();
  const [selected, setSelected] = useState<AdminUserRow | null>(null);

  const { data: rows = [], isLoading } = useQuery<AdminUserRow[]>({
    queryKey: ["adminUsers"],
    queryFn: listUsers,
  });

  const adminCount = useMemo(
    () => rows.filter((r) => r.roleId === ROLE_ADMIN).length,
    [rows]
  );

  const parentEmail = (parentId: number | null) => {
    if (parentId === null) return "—";
    const parent = rows.find((r) => r.userId === parentId);
    return parent ? parent.email : `#${parentId}`;
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Parent</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isOwnRow = row.userId === user?.userId;
              const isLastAdmin = row.roleId === ROLE_ADMIN && adminCount === 1;

              return (
                <tr key={row.userId} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{row.email}</td>
                  <td className="px-4 py-2">{row.fullName ?? "—"}</td>
                  <td className="px-4 py-2">{ROLE_LABEL[row.roleId as Role]}</td>
                  <td className="px-4 py-2">{parentEmail(row.parentId)}</td>
                  <td className="px-4 py-2 capitalize">{row.profileStatus}</td>
                  <td className="px-4 py-2 text-right">
                    {isOwnRow ? null : isLastAdmin ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button size="sm" variant="ghost" disabled>
                                Change role
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Can't demote the last admin.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelected(row)}
                      >
                        Change role
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground py-8">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <ChangeRoleDialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          row={selected}
          allUsers={rows}
        />
      )}
    </>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: passes. If `Button` or `Tooltip` import paths don't match, run `ls src/components/ui/` and adjust. The polish-pass tree has both `Button.tsx` and `tooltip.tsx`.

If `Tooltip*` exports differ, check `cat src/components/ui/tooltip.tsx | head -20` and adjust the import line. If `TableSkeleton` from `@/components/ui/skeleton/table` has a different export name, fix the import.

- [ ] **Step 5: Smoke test in browser**

Make sure both backend (`pnpm dev` in cliona-backend) and frontend (`npm run dev` in website) are running. Log in as admin. Open the `UserDock` dropdown → "Admin". The table should render with all users.

Verify each visible state:
1. **Own row**: Find your own admin user; the "Change role" cell should be empty.
2. **Last admin row**: If you are the only admin, your own row already has no button — sign up a second test user first, log back in as admin, then verify another admin would show disabled+tooltip. (For initial verification, this can be cross-checked by promoting a test user to Admin, then trying to demote the seeded admin → button enabled. Then demote the test user back → seeded admin button disabled.)
3. **Normal row**: Click "Change role" on a non-self, non-last-admin row → dialog opens. Pick "Reseller" → parent picker appears with admin rows. Pick "Client" → parent picker shows admins + resellers. Pick "Admin" → parent picker hidden.
4. **Submit**: Save → toast confirms, dialog closes, table refetches with updated role.

- [ ] **Step 6: Commit Tasks 9–11 together**

```bash
git add src/lib/type.ts \
        src/lib/schema/admin.schema.ts \
        src/lib/api/admin/users.ts \
        src/app/app/admin/users/page.tsx \
        src/components/admin/UsersTable.tsx \
        src/components/admin/ChangeRoleDialog.tsx
git commit -m "feat(rbac-fe): /app/admin/users page with role change dialog"
```

---

### Task 12: Edge-case verification (no code, just confirm behavior)

This task is a verification gate. If anything fails, fix in the relevant prior task before continuing.

- [ ] **Step 1: Run the full edge-case matrix**

With backend + frontend running:

1. **Reseller path**: Log out, log in as a reseller (use the admin to promote a test client first). Open `UserDock` → no "Admin" item. Manually navigate to `/app/admin/users` → silent redirect to `/app`, no flash of the admin table.
2. **Client path**: Same as reseller, with a Client account.
3. **403 fallback**: Stay logged in as Client. From DevTools, fire `fetch('http://localhost:7000/api/v1/admin/users', { headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') } })` → 403 + sonner toast.
4. **409 on last admin**: Log in as admin. If there's only one admin, demote yourself via DevTools (`fetch('/admin/users/<your-id>/role', { method: 'PATCH', body: JSON.stringify({ roleId: 2, parentId: null }) ... })`) → expect 400 "Admins cannot change their own role" with a toast.
5. **Build**: `cd /Users/harshitsingh/code/personal-code/website && npm run build` passes.

- [ ] **Step 2: No commit for this verification task.**

---

## Phase 5 — Cleanup

### Task 13: Replace hardcoded `userId = 2` in three RCS pages

**Files:**
- Modify: `website/src/app/app/rcs/agents/page.tsx:104`
- Modify: `website/src/app/app/rcs/templates/page.tsx:102`
- Modify: `website/src/app/app/rcs/sendMessage/page.tsx:40`

- [ ] **Step 1: Fix `rcs/agents/page.tsx`**

In `src/app/app/rcs/agents/page.tsx`, find this block around line 103:

```tsx
export default function UsersTable() {
  const userId = 2;

  const { data: agentData, isLoading } = useQuery<Agent[]>({
    queryKey: ["agents", userId],
    queryFn: () => fetchAgents(userId),
  });
```

Replace with:

```tsx
export default function UsersTable() {
  const { user } = useUser();
  const userId = user?.userId;

  const { data: agentData, isLoading } = useQuery<Agent[]>({
    queryKey: ["agents", userId],
    queryFn: () => fetchAgents(userId!),
    enabled: !!userId,
  });
```

Add the import at the top of the file (next to the other `@/` imports):

```tsx
import { useUser } from "@/providers/userProvider";
```

- [ ] **Step 2: Fix `rcs/templates/page.tsx`**

In `src/app/app/rcs/templates/page.tsx`, find around line 101:

```tsx
export default function UsersTable() {
  const userId = 2;

  const { data: templateData, isLoading } = useQuery({
    queryKey: ["templates", userId],
    queryFn: () => fetchTemplates(userId),
  });
```

Replace with:

```tsx
export default function UsersTable() {
  const { user } = useUser();
  const userId = user?.userId;

  const { data: templateData, isLoading } = useQuery({
    queryKey: ["templates", userId],
    queryFn: () => fetchTemplates(userId!),
    enabled: !!userId,
  });
```

Add the same `useUser` import if not already present.

- [ ] **Step 3: Fix `rcs/sendMessage/page.tsx`**

In `src/app/app/rcs/sendMessage/page.tsx`, find around line 40:

```tsx
  const userId = 2

  const { data: agentData } = useQuery<Agent[]>({
    queryKey: ['agents', userId],
    queryFn: () => fetchAgents(userId),
  })
```

Replace with:

```tsx
  const { user } = useUser();
  const userId = user?.userId;

  const { data: agentData } = useQuery<Agent[]>({
    queryKey: ['agents', userId],
    queryFn: () => fetchAgents(userId!),
    enabled: !!userId,
  })
```

Add the `useUser` import if not already present.

- [ ] **Step 4: Confirm no other hardcoded userIds remain**

Run:
```bash
grep -rn "userId = 2\|userId: 2" src --include="*.tsx" --include="*.ts"
```
Expected: no matches.

- [ ] **Step 5: Type-check + smoke test**

Run: `npm run lint`
Expected: passes.

In the browser, log in as any non-seeded user. Visit `/app/rcs/agents`, `/app/rcs/templates`, `/app/rcs/sendMessage`. Confirm each page renders the **logged-in user's** data (or empty state for a new user) — not `userId=2`'s data. The Network tab will show requests with the new user's id.

- [ ] **Step 6: Commit**

```bash
git add src/app/app/rcs/agents/page.tsx \
        src/app/app/rcs/templates/page.tsx \
        src/app/app/rcs/sendMessage/page.tsx
git commit -m "fix(rbac-fe): use useUser instead of hardcoded userId=2 in rcs pages"
```

---

### Task 14: Update root `CLAUDE.md`

**Files:**
- Modify: `/Users/harshitsingh/code/personal-code/CLAUDE.md`

- [ ] **Step 1: Locate the existing `## RBAC` section**

Run: `grep -n "^## RBAC" /Users/harshitsingh/code/personal-code/CLAUDE.md`
Expected: shows the line number of the existing backend `## RBAC` section.

- [ ] **Step 2: Add the `GET /admin/users` bullet under the existing Endpoints subsection**

In the `## RBAC` block of `CLAUDE.md`, find the `### Endpoints (new in this branch)` subsection. Add a bullet at the top of that list (above `PATCH /api/v1/admin/users/:id/role`):

```markdown
- `GET /api/v1/admin/users` — admin-only. Returns `[{ userId, email, fullName, roleId, parentId, profileStatus, createdAt }, ...]`. Joins `Users` for email; includes all profile statuses.
```

- [ ] **Step 3: Add a new `## RBAC — Frontend` section**

Insert directly below the existing `## RBAC` section (before the next top-level `##` heading):

```markdown
## RBAC — Frontend

- **Role constants:** `website/src/lib/rbac.ts` mirrors backend `authz.ts` (`ROLE_ADMIN=0`, `ROLE_RESELLER=1`, `ROLE_CLIENT=2`).
- **`useUser()` exposes:** `role`, `isAdmin`, `isReseller`, `isClient`, `hasRole(allowed[])`. Role source = JWT payload returned by `/auth/me`. Do not use `profile.roleId` for gating decisions.
- **`<ProtectedRoute>`** (`website/src/components/auth/ProtectedRoute.tsx`) — pre-existing; auth-only gate at `/app` layout. Unchanged by RBAC.
- **`<RoleGate roles={[...]}>`** (`website/src/components/auth/RoleGate.tsx`) — hides inline actions and dropdown items. Renders `null` while role is loading.
- **`<RequireRole roles={[...]}>`** (`website/src/components/auth/RequireRole.tsx`) — sibling of `ProtectedRoute`, used inside pages that need additional role gating. Silent redirect to `/app` on miss.
- **Admin link:** lives in the `UserDock` dropdown (`website/src/components/ui/UserDock.tsx`), wrapped in `<RoleGate>`. Not in the sidebar link arrays — `whatsappLinks` is the only rendered list and Admin is account-level.
- **403 handling:** axios response interceptor in `website/src/lib/axios.ts` fires `sonner.toast.error(server.message)`. `<Toaster />` is already mounted in `src/app/app/layout.tsx`. Mutations can override via their own `onError`.
- **Admin page:** `/app/admin/users` (admin only) — table + per-row role change. Consumes `GET /admin/users` + `PATCH /admin/users/:id/role`. Own row hides the action; last-admin row disables with tooltip.
```

- [ ] **Step 4: Confirm CLAUDE.md still parses**

Run: `head -20 /Users/harshitsingh/code/personal-code/CLAUDE.md`
Expected: no syntax issues; markdown is well-formed.

- [ ] **Step 5: Commit**

Since `CLAUDE.md` lives in the parent directory (`personal-code/`), commit it from whichever repo's convention applies. In this monorepo-style layout, `CLAUDE.md` is shared and not tracked by either sub-repo's `.git`. Confirm:

```bash
cd /Users/harshitsingh/code/personal-code
git status 2>&1
```

If the parent dir is a git repo, commit there. If not (the workspace likely isn't versioned), the CLAUDE.md change is local-only — note in the PR description that CLAUDE.md was updated locally. **Most likely outcome:** there's no parent-level git; the file is shared scaffolding. In that case skip the commit and the change is just on disk.

If the parent is a git repo, commit:

```bash
cd /Users/harshitsingh/code/personal-code
git add CLAUDE.md
git commit -m "docs(rbac): add RBAC Frontend section and /admin/users endpoint"
```

---

## Wrap-up

After Task 14:

1. **Final verification pass.** Run `npm run build` (website) and `pnpm lint` (cliona-backend). Both pass.
2. **Push branches.**
   ```bash
   cd /Users/harshitsingh/code/personal-code/website && git push -u origin feat/rbac
   cd /Users/harshitsingh/code/personal-code/cliona-backend && git push -u origin feat/rbac
   ```
   (Verify `gh auth status` first — repo memory note: personal-code repos use `harshit8741`, not the currently-active account. Confirm with the user before pushing if uncertain.)
3. **Open the PR.** Use `gh pr create --base design/ui-polish-pass` for the website repo. Backend PR targets `main`.
4. **Periodically rebase** `website` `feat/rbac` onto `origin/design/ui-polish-pass` until PR #16 merges. Use a parallel reviewer subagent after non-trivial rebases.

---

## Spec coverage check

| Spec section | Plan task(s) |
|---|---|
| §3.1 Role primitives | Task 1 |
| §3.2 User type narrowing | Task 2 |
| §3.3 useUser extensions | Task 3 |
| §3.4 `<RoleGate>` | Task 4 |
| §3.5 `<RequireRole>` | Task 5 |
| §3.6 Admin link in UserDock | Task 7 |
| §3.7 403 axios interceptor | Task 6 |
| §3.8 Admin Users page (backend) | Task 8 |
| §3.8 Admin Users page (frontend) | Tasks 9–11 |
| §3.9 CLAUDE.md updates | Task 14 |
| §3.10 Hardcoded userId=2 | Task 13 |
| §7 Verification (admin/reseller/client paths, 403 toast, build) | Task 12 + Wrap-up |
