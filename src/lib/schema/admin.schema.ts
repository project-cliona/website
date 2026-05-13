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
