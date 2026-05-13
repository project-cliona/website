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
