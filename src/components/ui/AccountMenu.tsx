"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGate } from "@/components/auth/RoleGate";
import { ROLE_ADMIN } from "@/lib/rbac";
import { useUser } from "@/providers/userProvider";
import { useWaba } from "@/providers/wabaProvider";
import { useConnectWaba } from "@/hooks/useConnectWaba";
import { getInitials } from "@/lib/utils";
import { HEALTH_DOT_CLASS, wabaHealth, wabaLabel, wabaStatusLabel } from "@/lib/waba";
import type { WabaAccount } from "@/lib/type";

function HealthDot({ account }: { account: WabaAccount }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full shrink-0 ${
        HEALTH_DOT_CLASS[wabaHealth(account)]
      }`}
    />
  );
}

/**
 * The single account control in the top bar: who you are signed in as, and
 * which WhatsApp account you are working in.
 *
 * These were two separate controls -- a switcher in the top bar and a user
 * menu in the sidebar footer -- which meant the account you were acting as
 * and the identity acting on it were read in two different places.
 */
export function AccountMenu() {
  const { user, profile, logout } = useUser();
  const {
    accounts,
    selected,
    selectedWabaId,
    setSelectedWabaId,
    isLoading,
    isError,
    refetchAccounts,
    hasWaba,
  } = useWaba();
  const router = useRouter();
  const pathname = usePathname();

  const { connect, isConnecting } = useConnectWaba({
    onConnected: (wabaId) => setSelectedWabaId(wabaId),
  });

  const initials = getInitials(profile?.fullName, user?.email);
  const displayName = profile?.fullName?.trim() || user?.email || "User";

  const handleSelect = (wabaId: string) => {
    setSelectedWabaId(wabaId);
    // This route carries the account in its path, so the page has to move
    // with the selection. Every other page just re-reads it.
    if (pathname?.match(/^\/app\/whatsapp\/accounts-health\/[^/]+$/)) {
      router.replace(`/app/whatsapp/accounts-health/${wabaId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 pl-1">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-8 w-[120px] rounded-md hidden lg:block" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Collapsed to just the avatar. The account name rolls out to the
            left on hover -- leftward because the control is anchored to the
            right edge, so growing the other way would push the bar around. */}
        <button
          type="button"
          className="group h-11 inline-flex items-center justify-end rounded-full p-1 hover:bg-secondary focus-ring text-left transition-colors duration-[var(--motion-fast)]"
          title={
            selected
              ? `${displayName} · ${wabaLabel(selected)} (${selected.wabaId})`
              : displayName
          }
        >
          <span
            className={
              // max-width rather than width: the label is variable-length, and
              // this animates without having to measure it. Opens on keyboard
              // focus too, so it is not hover-only.
              "overflow-hidden whitespace-nowrap max-w-0 opacity-0 " +
              "group-hover:max-w-[200px] group-hover:opacity-100 " +
              "group-focus-visible:max-w-[200px] group-focus-visible:opacity-100 " +
              // Radix marks the button, not this span, so the open state has to
              // be read through the group -- keeps the label out while the menu is.
              "group-data-[state=open]:max-w-[200px] group-data-[state=open]:opacity-100 " +
              "transition-[max-width,opacity] duration-[var(--motion-base)] ease-[var(--ease-out-default)]"
            }
          >
            <span className="flex flex-col items-end pl-3 pr-2 leading-tight">
              <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">
                {selected ? wabaLabel(selected) : displayName}
              </span>
              <span className="text-caption text-muted-foreground truncate max-w-[180px]">
                {selected
                  ? wabaStatusLabel(selected)
                  : isError
                    ? "Accounts unavailable"
                    : "No account connected"}
              </span>
            </span>
          </span>

          <span className="relative shrink-0">
            <span className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </span>
            {/* Health rides on the avatar, which is the only thing visible at
                rest -- otherwise a disconnected account would look fine until
                hovered. */}
            {selected && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background ${
                  HEALTH_DOT_CLASS[wabaHealth(selected)]
                }`}
              />
            )}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[320px]">
        {/* The trigger shows the WhatsApp account, so the signed-in identity
            has to be legible somewhere. */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">
              {displayName}
            </div>
            <div className="text-caption text-muted-foreground truncate">
              {user?.email}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {isError ? (
          <DropdownMenuItem onSelect={() => void refetchAccounts()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry loading accounts
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuLabel>
              WhatsApp accounts{hasWaba ? ` (${accounts.length})` : ""}
            </DropdownMenuLabel>

            {hasWaba ? (
              // Tinted and inset so the list reads as a distinct region of
              // the menu rather than more menu items. Capped at four rows,
              // then scrolls -- an unbounded list would run off the viewport.
              <div className="mx-1 mb-1 rounded-md bg-secondary/60 p-1 max-h-[216px] overflow-y-auto">
                {accounts.map((account) => {
                  const isActive = account.wabaId === selectedWabaId;
                  return (
                    <button
                      key={account.wabaId}
                      type="button"
                      onClick={() => handleSelect(account.wabaId)}
                      aria-current={isActive}
                      className={`w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-[var(--motion-fast)] focus-ring ${
                        isActive
                          ? "bg-primary-100 text-primary-700"
                          : "hover:bg-background"
                      }`}
                    >
                      <HealthDot account={account} />
                      <span
                        className={`flex-1 min-w-0 text-sm truncate ${
                          isActive ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {wabaLabel(account)}
                      </span>
                      {/* Trails the name on one line rather than sitting under
                          it: a second line per row doubled the list's height
                          for a detail that is secondary to the name. shrink-0
                          so the name truncates before the status does. */}
                      {wabaHealth(account) !== "healthy" && (
                        <span className="shrink-0 text-[11px] leading-none text-muted-foreground/70">
                          {wabaStatusLabel(account)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-2 py-1.5 text-caption text-muted-foreground">
                No WhatsApp account connected yet.
              </p>
            )}

            <DropdownMenuItem
              disabled={isConnecting}
              onSelect={(event) => {
                // Keep the menu open: closing it unmounts the trigger, and the
                // browser then treats Meta's popup as one opened without a user
                // gesture and blocks it.
                event.preventDefault();
                void connect();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting…" : "Connect new account"}
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

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
        <RoleGate roles={[ROLE_ADMIN]}>
          <DropdownMenuItem asChild>
            <Link href="/app/admin/users">
              <ShieldCheck className="h-4 w-4 mr-2" /> Admin
            </Link>
          </DropdownMenuItem>
        </RoleGate>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void logout()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
