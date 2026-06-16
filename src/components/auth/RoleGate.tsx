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
