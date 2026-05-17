"use client";

import { ChevronUp, LogOut, User as UserIcon, Settings, Repeat, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/providers/userProvider";
import { RoleGate } from "@/components/auth/RoleGate";
import { ROLE_ADMIN } from "@/lib/rbac";
import Link from "next/link";

interface UserDockProps {
  collapsed?: boolean;
}

function getInitials(fullName: string | null | undefined, email: string | null | undefined): string {
  if (fullName && fullName.trim().length > 0) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "U";
  }
  return (email?.[0] ?? "U").toUpperCase();
}

export function UserDock({ collapsed = false }: UserDockProps) {
  const { user, profile, logout } = useUser();

  const initials = getInitials(profile?.fullName, user?.email);
  const displayName = profile?.fullName?.trim() || user?.email || "User";
  const planLabel = "Free Plan";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-secondary focus-ring text-left"
        >
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{displayName}</div>
                <div className="text-caption text-muted-foreground truncate">{planLabel}</div>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/app/profile">
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/settings">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app">
            <Repeat className="h-4 w-4 mr-2" /> Switch service
          </Link>
        </DropdownMenuItem>
        <RoleGate roles={[ROLE_ADMIN]}>
          <DropdownMenuItem asChild>
            <Link href="/app/admin/users">
              <ShieldCheck className="h-4 w-4 mr-2" /> Admin
            </Link>
          </DropdownMenuItem>
        </RoleGate>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
