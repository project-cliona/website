export const ROLE_ADMIN = 0 as const;
export const ROLE_RESELLER = 1 as const;
export const ROLE_CLIENT = 2 as const;

export type Role = typeof ROLE_ADMIN | typeof ROLE_RESELLER | typeof ROLE_CLIENT;

export const ROLE_LABEL: Record<Role, string> = {
  [ROLE_ADMIN]: "Admin",
  [ROLE_RESELLER]: "Reseller",
  [ROLE_CLIENT]: "Client",
};
