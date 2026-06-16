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
