# RBAC — Frontend Design

**Status:** Design approved, implementation pending
**Date:** 2026-05-12 (rebased against `design/ui-polish-pass` 2026-05-13)
**Branches:** `feat/rbac` in `website` (rebased onto `origin/design/ui-polish-pass`) and `feat/rbac` in `cliona-backend` (cut from `main`).
**Depends on:** Backend RBAC already shipped on `feat/rbac` in `cliona-backend` (role in JWT, scoped reads, `PATCH /admin/users/:id/role`).
**PR target:** Open the RBAC PR with **`design/ui-polish-pass`** as base (not `main`). When PR #16 (the polish pass) merges to `main`, GitHub auto-retargets the RBAC PR.
**Companion section in CLAUDE.md:** existing `## RBAC` block (backend); a new `## RBAC — Frontend` block lands as part of this work.

---

## 1. Context and goals

### Why this feature exists

The backend has rolled out a one-level RBAC model (`Admin → Reseller → Client`). Every list endpoint is now scoped by `getScopedUserIds`, every single-resource write is gated by `assertOwnershipOrChild`, and `PATCH /admin/users/:id/role` exists for role transitions — but only callable via curl today.

The frontend still treats every user identically. It exposes the same sidebar to all roles, hardcodes `userId = 2` in three RCS pages, and surfaces no UI for changing roles. A Client logging in today sees `userId=2`'s data in agents/templates/sendMessage because the page bypasses the auth context.

This pass closes the frontend gap so:
- The UI a user sees matches the data the backend will return them.
- Admin operations (promote/demote) move out of curl into a screen.
- Backend 403s fail gracefully instead of crashing forms.

### What v1 ships

- **Role primitives** on the client: a constants module mirroring `authz.ts`, role helpers on `useUser()`, a `<RoleGate>` component for in-page action hiding, a `<RequireRole>` component for whole-page role checks. `<RequireRole>` is a **sibling** of the existing `<ProtectedRoute>` (which checks auth-only), not a replacement.
- **Admin link in `UserDock`**: a new admin-only `DropdownMenuItem` ("Admin") inside the existing `UserDock` (sidebar account menu). The actively-rendered sidebar list (`whatsappLinks`) is **not** modified — Admin is account-level, not WhatsApp-level.
- **Admin Users page** at `/app/admin/users`: minimal list + per-row role change. Replaces curl-only role management.
- **Backend addition**: `GET /api/v1/admin/users` returning enriched profile rows (joined with `Users` for email) for the admin table to consume.
- **403 handling**: global axios interceptor surfaces toasts via the already-mounted `sonner` `<Toaster />` in `src/app/app/layout.tsx`.
- **Cleanup folded in**: replace remaining `userId = 2` hardcodings in three RCS pages with `useUser()`.
- **Documentation**: add a feature-wise `## RBAC — Frontend` section to the root `CLAUDE.md`.

### What v1 does NOT ship (explicit non-goals)

- Create user / deactivate / suspend / change email — admin tooling stays minimal.
- Search, filter, or pagination on the admin users table — fine for current user counts; reconsider once the list grows beyond ~50.
- View child accounts inline under a reseller row — defer to v1.5.
- Reseller-facing "my clients" page — Option C in brainstorming, deferred.
- Per-user balance crediting UI for admins — `POST /rcs/balance` is admin-only on the backend but no balance UI exists yet; this pass adds **no** balance UI.
- Wiring the existing partial pages (`/app/rcs` dashboard, send/delivery/campaign reports, balance) to the new scoped endpoints — separate work; scoping is transparent to the client and needs no RBAC-specific change.
- Audit log of role changes.
- Frontend-side decoding of the JWT for instant gating — `/auth/me` is the single source of truth.
- Migration of the access token from `localStorage` to an HTTP-only cookie (would unblock Next middleware-based gating but is a separate, larger auth concern).
- Refresh-token rotation, retry-on-401, automatic logout on 401 — out of scope.
- Removal or rework of the pre-existing stub links (`/app/integrations`, `/app/billing`, `/app/usage`, `/app/profile`). They predate RBAC and remain unchanged.
- Re-introducing `appLinks` / `rcsLinks` to the sidebar. The polish-pass design intentionally renders only `whatsappLinks`; multi-product navigation, if needed, is a separate design decision.
- KYC `userId` prop fix — already resolved on `design/ui-polish-pass` (`src/app/kyc/page.tsx` uses `useUser()`).
- Installing or mounting `sonner` — already present on `design/ui-polish-pass`.
- Removing the `ProtectedRoute.tsx` CLAUDE.md reference — not stale on `design/ui-polish-pass`; the file exists.

---

## 2. Product decisions

Each is a hard decision from brainstorming, not a suggestion.

### 2.1 Scope shape: gating + minimal Admin Users page

Gate the UI by role and ship a single new admin screen that replaces curl. No reseller-facing pages, no full admin console.

### 2.2 Unauthorized UX: silent redirect to `/app`

When a user navigates to a route they don't have access to (e.g., a Client URL-guessing `/app/admin/users`), the guard runs `router.replace("/app")` once the user's role has resolved. No banner, no flash of the protected content. While the role is still loading, the guard renders nothing (no redirect, no children) — avoids flicker for legitimate admins.

### 2.3 Admin-only actions: hide entirely

For mutations the current user is not authorised to perform, the affordance is removed from the DOM rather than disabled with a tooltip. Backend still enforces — hiding is purely cosmetic.

**One deliberate exception**, on the Admin Users page: the "last admin" row's `Change role` button is **disabled with tooltip** ("Can't demote the last admin") rather than hidden. The row itself exists and the action would be available if the constraint changed; hiding the button would be confusing. The own-row case stays hidden — there is no scenario where an admin should demote themselves from this UI.

### 2.4 Role source: `useUser().user.role` from `/auth/me`

`/auth/me` already returns the JWT payload `{ email, userId, role }`. The frontend treats this as the single source of truth, matching what the backend enforces. `profile.roleId` from `/common/profile` exists but is not used for gating decisions — the JWT can disagree with the DB column for one request right after a role change, and using JWT keeps the client consistent with what the same request's authz check used server-side.

### 2.5 Admin Users page: list + promote/demote only

Single table. Per-row "Change role" action that opens a dialog with role + conditional parent picker. No search, filter, pagination, or expand-children.

### 2.6 Architecture: `useUser`-extended + small primitives (Approach A)

Rejected: a centralised route-role config object (Approach B) and a Next.js middleware-level guard (Approach C). B is overkill at one gated route; C is infeasible without moving the access token out of `localStorage`.

---

## 3. Architecture overview

### 3.1 Role primitives

**`website/src/lib/rbac.ts`** — mirrors `cliona-backend/src/utils/authz.ts`:

```ts
export const ROLE_ADMIN    = 0 as const;
export const ROLE_RESELLER = 1 as const;
export const ROLE_CLIENT   = 2 as const;
export type Role = typeof ROLE_ADMIN | typeof ROLE_RESELLER | typeof ROLE_CLIENT;

export const ROLE_LABEL: Record<Role, string> = {
  [ROLE_ADMIN]: "Admin",
  [ROLE_RESELLER]: "Reseller",
  [ROLE_CLIENT]: "Client",
};
```

### 3.2 `User` type narrowing

The current `User` interface in `lib/type.ts` claims fields (`userName`, `isSocialLogin`, `status`, `isEmailConfirmed`, `isPhoneConfirmed`, `createdOn`) that the `/auth/me` response does not return. Grep confirms zero callsites read those fields. Replace with the actual response shape:

```ts
export interface User {
  userId: number;
  email: string;
  role: Role;
}
```

### 3.3 `useUser()` extensions

In `providers/userProvider.tsx`, derive role helpers from `user` and add them to the context value. No new network calls.

```ts
const role: Role | null = user?.role ?? null;
const isAdmin    = role === ROLE_ADMIN;
const isReseller = role === ROLE_RESELLER;
const isClient   = role === ROLE_CLIENT;
const hasRole = (allowed: Role[]) => role !== null && allowed.includes(role);
```

Context value gains: `role`, `isAdmin`, `isReseller`, `isClient`, `hasRole`.

### 3.4 `<RoleGate>` — inline action hiding

```tsx
// components/auth/RoleGate.tsx
export function RoleGate({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { hasRole, userAuthLoading } = useUser();
  if (userAuthLoading) return null;
  if (!hasRole(roles)) return null;
  return <>{children}</>;
}
```

Renders `null` while loading to avoid a momentary flash of an admin-only button. No `fallback` prop in v1 — the design landed on "hide entirely," so any "you don't have access" message would contradict that.

### 3.5 `<RequireRole>` — page-level role check (sibling of `ProtectedRoute`)

The existing `src/components/auth/ProtectedRoute.tsx` handles **auth-only** gating (redirects unauthenticated users to `/auth/login`) and wraps the entire `/app` tree from `src/app/app/layout.tsx`. It is intentionally untouched in this pass.

`<RequireRole>` is a separate component used **inside** specific pages that need additional role-level gating (today: only `/app/admin/users`). It assumes auth has already been verified by the surrounding `ProtectedRoute`.

```tsx
// components/auth/RequireRole.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/userProvider";
import type { Role } from "@/lib/rbac";

export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
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

No `redirectTo` prop in v1. If a future admin sub-page needs to redirect elsewhere, add the prop then.

### 3.6 Admin link placement — inside `UserDock`

The polish-pass layout (`src/app/app/layout.tsx`) renders only `whatsappLinks` in the main sidebar. `appLinks` and `rcsLinks` are still exported from `sidebarLinks.tsx` but no longer rendered — likely dead code on this branch. The Admin entry is **account-level**, not WhatsApp-level, so it belongs in the existing `UserDock` dropdown (already houses Profile / Settings / Switch service / Log out) rather than the WhatsApp feature list.

**Change in `src/components/ui/UserDock.tsx`** — add one conditional `DropdownMenuItem` between "Switch service" and the separator, wrapped in `<RoleGate>`:

```tsx
<RoleGate roles={[ROLE_ADMIN]}>
  <DropdownMenuItem asChild>
    <Link href="/app/admin/users">
      <ShieldCheck className="h-4 w-4 mr-2" /> Admin
    </Link>
  </DropdownMenuItem>
</RoleGate>
```

`<RoleGate>` returns `null` while `userAuthLoading`, so non-admins never see the item flash. The Radix dropdown handles a `null` child gracefully — no menu-item gap appears.

**Out of scope for this pass:** adding `roles?` to the `SidebarLink` shape or filtering link arrays at render. That generalisation is justified only when a second role-gated sidebar link appears; for v1 it's YAGNI. `sidebarLinks.tsx` is unchanged.

### 3.7 403 handling — axios interceptor

`sonner` is already a dependency and `<Toaster />` is already mounted by `src/app/app/layout.tsx` (with project styling). No install needed; just attach the interceptor.

**`lib/axios.ts`** — attach a response interceptor to **both** clients (`apiClient()` and `authenticatedApiClient()`; the unauthenticated one rarely sees 403 but installing universally is one line):

```ts
client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 403) {
      toast.error(err?.response?.data?.message ?? "You don't have permission for that action.");
    }
    return Promise.reject(err);
  }
);
```

The error still propagates so individual mutations can override with their own `onError` and form-level handling.

### 3.8 Admin Users page

**Backend prerequisite — new endpoint:**

```
GET /api/v1/admin/users
  Auth: authMiddleware + requireAdmin
  Returns: [
    { userId, email, fullName, roleId, parentId, profileStatus, createdAt },
    ...
  ]
```

Joins `Users` for `email`, returns rows for **all** profile statuses (not just `active`). Handler lives next to the existing `setUserRole` in `cliona-backend/src/controllers/v1/admin/userController.ts`; route added to `src/routes/v1/adminRoutes.ts`.

**Frontend file layout:**

```
website/src/
  app/app/admin/users/page.tsx            // <RequireRole roles={[ADMIN]}> + table
  components/admin/UsersTable.tsx         // TanStack Table; renders rows
  components/admin/ChangeRoleDialog.tsx   // role + conditional parent picker
  lib/api/admin/users.ts                  // listUsers(), updateUserRole(id, body)
  lib/schema/admin.schema.ts              // zod changeRoleSchema
  lib/type.ts                             // add AdminUserRow type
```

**Types:**

```ts
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

**Table columns:** Email · Full name · Role (label) · Parent (email or `—`) · Status (badge) · Actions (`Change role`).

**Parent display:** rendered by looking up `parentId` in the same list — no extra fetch. If `parentId` is not in the list (shouldn't happen for current data; defensive), render the numeric id with a tooltip.

**`Change role` dialog behaviour:**

- Role select: Admin / Reseller / Client
- Parent picker is **derived from the selected role**:
  - Selected role = Admin → parent forced to `null`, picker hidden
  - Selected role = Reseller → parent picker lists rows where `roleId === ROLE_ADMIN`
  - Selected role = Client → parent picker lists rows where `roleId === ROLE_ADMIN || roleId === ROLE_RESELLER`
- Submit calls `PATCH /admin/users/:id/role` with `{ roleId, parentId }`.
- On success: invalidate `["adminUsers"]`, close dialog, toast confirms.
- On 403/409: surface server `message` in a dialog-level toast (does **not** redirect — admin is authorised, the request lost a race or violated a constraint).

**Per-row edge cases:**

- **Own row** (`row.userId === user.userId`): `Change role` button hidden entirely.
- **Last admin row** (computed: `users.filter(u => u.roleId === ROLE_ADMIN).length === 1 && row.roleId === ROLE_ADMIN`): button rendered disabled with tooltip `"Can't demote the last admin."` Backend still enforces; UI is a friendlier explanation. Documented exception to §2.3's hide-entirely rule.

### 3.9 CLAUDE.md updates

There is a single `CLAUDE.md` at the project root (`/Users/harshitsingh/code/personal-code/CLAUDE.md`) covering both repos. It gains a new feature section:

```
## RBAC — Frontend
- Role constants: src/lib/rbac.ts mirrors backend authz.ts
- useUser() exposes: role, isAdmin, isReseller, isClient, hasRole(allowed[])
- <ProtectedRoute> (existing) handles auth-only gating at the app layout level
- <RoleGate roles={[...]}> hides inline actions and dropdown items
- <RequireRole roles={[...]}> sibling of ProtectedRoute, used inside pages that need a role check; silent redirect to /app on miss
- Admin link lives in UserDock dropdown (not the sidebar list); rendered via RoleGate
- 403 axios interceptor → sonner toast (Toaster already mounted in app/layout.tsx); mutations can override via onError
- Admin page: /app/admin/users (admin only)
```

The existing `## RBAC` section in the same file gets one additional bullet under "Endpoints" for `GET /api/v1/admin/users`. The `components/ProtectedRoute.tsx` line in the directory structure and "Key Files Reference" tables is **not** removed — it exists on `design/ui-polish-pass` and remains accurate.

### 3.10 Hardcoded `userId = 2`

Three RCS pages still read `const userId = 2` on `design/ui-polish-pass`:

- `src/app/app/rcs/agents/page.tsx:104`
- `src/app/app/rcs/templates/page.tsx:102`
- `src/app/app/rcs/sendMessage/page.tsx:40`

Each becomes:

```tsx
const { user } = useUser();
const userId = user?.userId;
```

with `enabled: !!userId` guards on dependent `useQuery` calls.

**KYC page** — already fixed on `design/ui-polish-pass` (`src/app/kyc/page.tsx` reads `userId` from `useUser()`). No change needed in this pass.

---

## 4. Data flow

### 4.1 Login

1. User logs in via any auth path (password, OTP, OAuth).
2. Backend returns `{ accessToken, refreshToken }` where the access token's payload is `{ email, userId, role }`.
3. Frontend stores access token in `localStorage`.
4. `UserProvider` mounts → `useQuery(["currentUser"])` calls `/auth/me` → returns `{ email, userId, role }` → exposed via `useUser()`.
5. `useQuery(["userProfile", userId])` calls `/common/profile?userId=X` for the profile fields.
6. `useUser().role` is now populated; sidebar and guards re-render with role-aware visibility.

### 4.2 Navigating to `/app/admin/users`

1. `ProtectedRoute` (mounted by `src/app/app/layout.tsx`) verifies auth — unauthenticated → `/auth/login`.
2. Page renders `<RequireRole roles={[ROLE_ADMIN]}>`.
3. **Admin**: `<RequireRole>` passes → `listUsers()` calls `GET /admin/users` → backend `requireAdmin` passes → table populates.
4. **Reseller / Client**: `<RequireRole>` redirects to `/app`. Even if the request reached the backend, `requireAdmin` would 403; the redirect runs first.
5. **During role load**: `<RequireRole>` renders `null` (no redirect, no flicker). Resolves once `/auth/me` completes via `UserProvider`.

### 4.3 Changing a role

1. Admin clicks `Change role` on a row → dialog opens.
2. Admin picks new role; if non-admin, picker shows eligible parents.
3. Submit → `PATCH /admin/users/:id/role` with `{ roleId, parentId }`.
4. Success → invalidate `["adminUsers"]` → table refetches → dialog closes → success toast.
5. 403/409 → dialog-level error toast with server message. Dialog stays open so the admin can retry or close manually.

### 4.4 A Client hitting an admin-only mutation

(Defensive — they shouldn't be able to from the UI.)

1. Client somehow triggers an admin-only mutation (DevTools, stale tab).
2. Backend returns 403.
3. Axios interceptor fires → sonner toast: server `message` (or fallback "You don't have permission for that action.").
4. Mutation's own `onError` (if defined) also runs; can suppress the toast by handling the error.

---

## 5. Error handling

| Scenario | Behaviour |
|---|---|
| `/auth/me` returns 401 (token expired) | Existing behaviour — no change in this pass. (Refresh-token rotation is out of scope.) |
| `/auth/me` returns 403 | Toast fires; user lands on whatever page they were on. Edge case; shouldn't happen in normal flow. |
| Scoped GET returns 403 | Toast fires; page renders empty. Most scoped GETs return an empty array rather than 403, so this is rare. |
| Scoped GET returns 200 with empty array | Page renders its empty state. No special RBAC handling needed. |
| Mutation returns 403 | Interceptor toast + caller's `onError` handler. Form keeps user input intact. |
| `PATCH /admin/users/:id/role` returns 409 (last admin, self-demote) | Dialog-level toast with server message; dialog stays open. |
| Network error | Existing axios behaviour unchanged. |
| `localStorage` access blocked (privacy mode) | Pre-existing issue; out of scope. |

---

## 6. Implementation order

Each commit compiles and the app boots. Steps 1–5 and 8–9 can ship without step 6; only step 7 strictly depends on step 6.

1. `feat(rbac-fe): role constants + User type narrowed to /auth/me shape` (`website`)
2. `feat(rbac-fe): expose role helpers on useUser (isAdmin, hasRole, ...)` (`website`)
3. `feat(rbac-fe): RoleGate + RequireRole primitives` (`website`)
4. `feat(rbac-fe): 403 axios interceptor → sonner toast` (`website`)
5. `feat(rbac-fe): Admin link in UserDock dropdown` (`website`)
6. `feat(rbac): GET /admin/users (admin-only list with email join)` (**`cliona-backend`**)
7. `feat(rbac-fe): /app/admin/users page + change-role dialog` (`website`)
8. `fix(rbac-fe): replace hardcoded userId=2 in rcs agents/templates/sendMessage` (`website`)
9. `docs(rbac): CLAUDE.md — add RBAC Frontend section, add /admin/users endpoint bullet` (root `CLAUDE.md`)

**Rebase cadence.** While PR #16 is still open, rebase `feat/rbac` onto `origin/design/ui-polish-pass` every few days and after any new commits on that branch. Dispatch a parallel reviewer subagent on each rebase to catch regressions the rebase introduces — per project convention for refactors. When PR #16 merges to `main`, rebase once more onto `main`; expect minimal conflicts since the rebase cadence kept the branch current.

---

## 7. Verification

Manual, in a browser. The project has no automated test infra; per project conventions UI changes are validated by running the app.

**Pre-step.** Confirm `pnpm seed:admin` has been run against the dev DB. If unsure, run it — it's idempotent.

1. **Admin path.** Log in as the seeded admin.
   - ✓ Open the `UserDock` dropdown — "Admin" item visible between "Switch service" and the log-out separator.
   - ✓ Click "Admin" → `/app/admin/users` renders the table with all profiles (including `incomplete`).
   - ✓ Promote a test user from Client → Reseller. Table refetches, toast confirms.
   - ✓ Own row has no `Change role` button.
   - ✓ Single-admin row (the seeded one) has button disabled with the "last admin" tooltip.

2. **Reseller path.** Log out, log in as the user just promoted.
   - ✓ Open `UserDock` dropdown — no "Admin" item.
   - ✓ Manually navigate to `/app/admin/users` → silent redirect to `/app`. No flash of the admin table.

3. **Client path.** Sign up a fresh user.
   - ✓ KYC form completes (already works on polish-pass; this validates we didn't regress it).
   - ✓ `UserDock` dropdown does not show "Admin".
   - ✓ RCS agents/templates/sendMessage pages render the new user's data — not `userId=2`'s (validates §3.10).

4. **403 toast.** From a non-admin session, trigger an admin-only mutation (e.g., DevTools fetch to `PATCH /admin/users/:id/role`).
   - ✓ Sonner toast fires with the server `message`.

5. **Build + lint.** `npm run build` (Turbopack typechecks) and `npm run lint` both pass.

**Not validated automatically** — RoleGate "no flicker" on slow networks (visual check only); cross-browser dropdown rendering; that the `UserDock` dropdown collapses correctly when `Admin` is the longest label.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The narrowed `User` type breaks a callsite I missed in grep | Grep was exhaustive (`user.userName`, `user.isSocialLogin`, etc.); narrowing reveals real bugs (callsites reading fields the API never returned). Fix at the breakage. |
| PR #16 evolves before our PR merges, invalidating `UserDock`/`ProtectedRoute` assumptions | Rebase cadence (§6) catches this early. If `UserDock` is restructured significantly, the Admin-link integration moves to whatever component owns the account menu. |
| Backend `GET /admin/users` slips its review | Steps 1–5 + 8–9 still ship and improve baseline RBAC posture; only step 7 (the admin page) waits. |
| User decodes the JWT to spoof a role client-side | Backend re-verifies on every request. Frontend gating is UX, not security. |
| A future admin sub-page needs a different redirect target | Add a `redirectTo` prop to `RequireRole` then. YAGNI now. |
| `useUser()` is called outside `UserProvider` (e.g. in `/auth/login`) | The hook already throws; no new failure mode. Guards live inside the `/app` tree where the provider wraps them. |
| `RoleGate` returning `null` causes a visible gap in the `UserDock` dropdown | Radix `DropdownMenu` handles `null` children gracefully; sanity-checked during verification step 1. |

---

## 9. Out of scope, recap

Listed in §1 already; restated here for emphasis because these are likely follow-up asks:

- **Admin tooling beyond list + role change** — no create/deactivate/suspend, no audit log, no search/filter/pagination, no view-children inline.
- **Reseller-facing pages** — no "my clients" view, no per-client drill-down.
- **Balance UI** — `POST /rcs/balance` is admin-only but no UI exists; this pass adds none.
- **Wiring existing partial pages to scoped reads** — scoping is transparent; those pages are separate work.
- **Auth-token storage migration** — keeps `localStorage`; Next middleware-level guards are not added.

Each can become its own spec when prioritised.
