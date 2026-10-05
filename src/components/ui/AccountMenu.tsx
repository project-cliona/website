"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Plus,
  RefreshCw,
  Repeat,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
        <button
          type="button"
          className="h-11 flex items-center gap-2.5 rounded-full border border-input pl-1 pr-2.5 hover:bg-secondary focus-ring text-left max-w-[240px] transition-colors duration-[var(--motion-fast)]"
          title={
            selected
              ? `${displayName} · ${wabaLabel(selected)} (${selected.wabaId})`
              : displayName
          }
        >
          <span className="relative shrink-0">
            <span className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </span>
            {/* The account's health rides on the avatar so it stays visible
                when the label is hidden on narrow screens. */}
            {selected && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background ${
                  HEALTH_DOT_CLASS[wabaHealth(selected)]
                }`}
              />
            )}
          </span>

          <span className="hidden lg:flex flex-col min-w-0 leading-tight">
            {selected ? (
              <>
                <span className="text-sm font-semibold text-foreground truncate">
                  {wabaLabel(selected)}
                </span>
                <span className="text-caption text-muted-foreground truncate">
                  {selected.displayPhoneNumber ?? "No phone number"}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </span>
                <span className="text-caption text-muted-foreground truncate">
                  {isError ? "Accounts unavailable" : "No account connected"}
                </span>
              </>
            )}
          </span>

          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
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
              <DropdownMenuRadioGroup
                value={selectedWabaId ?? ""}
                onValueChange={handleSelect}
              >
                {accounts.map((account) => (
                  <DropdownMenuRadioItem
                    key={account.wabaId}
                    value={account.wabaId}
                  >
                    <span className="flex items-center gap-2.5 min-w-0 w-full">
                      <HealthDot account={account} />
                      <span className="flex flex-col min-w-0 flex-1 leading-tight">
                        <span className="text-sm font-medium truncate">
                          {wabaLabel(account)}
                        </span>
                        <span className="text-caption text-muted-foreground truncate">
                          {account.displayPhoneNumber ?? account.wabaId}
                          {wabaHealth(account) !== "healthy" &&
                            ` · ${wabaStatusLabel(account)}`}
                        </span>
                      </span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
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
          onClick={() => void logout()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
