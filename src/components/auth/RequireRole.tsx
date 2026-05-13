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
