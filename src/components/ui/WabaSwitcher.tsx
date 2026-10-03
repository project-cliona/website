"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Plus, RefreshCw } from "lucide-react";
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
import { Button } from "@/components/ui/Button";
import { useWaba } from "@/providers/wabaProvider";
import { useConnectWaba } from "@/hooks/useConnectWaba";
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

export function WabaSwitcher() {
  const {
    accounts,
    selected,
    selectedWabaId,
    setSelectedWabaId,
    isLoading,
    isError,
    refetchAccounts,
  } = useWaba();
  const router = useRouter();
  const pathname = usePathname();

  const { connect, isConnecting } = useConnectWaba({
    onConnected: (wabaId) => setSelectedWabaId(wabaId),
  });

  const handleSelect = (wabaId: string) => {
    setSelectedWabaId(wabaId);
    // This route carries the account in its path, so the page itself has to
    // move. Every other page simply re-reads the selection.
    const healthDetail = pathname?.match(/^\/app\/whatsapp\/accounts-health\/[^/]+$/);
    if (healthDetail) {
      router.replace(`/app/whatsapp/accounts-health/${wabaId}`);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-[180px] rounded-md" />;
  }

  if (isError) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-10 px-3 inline-flex items-center gap-2 rounded-md border border-input hover:bg-secondary focus-ring text-sm"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
            <span className="hidden lg:inline text-muted-foreground">
              Accounts unavailable
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem onSelect={() => void refetchAccounts()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (accounts.length === 0) {
    return (
      <Button size="sm" onClick={() => void connect()} loading={isConnecting}>
        Connect WhatsApp
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-10 px-3 inline-flex items-center gap-2 rounded-md border border-input hover:bg-secondary focus-ring text-left max-w-[260px]"
          title={selected ? `${wabaLabel(selected)} · ${selected.wabaId}` : undefined}
        >
          {selected && <HealthDot account={selected} />}
          <span className="hidden lg:flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate leading-tight">
              {selected ? wabaLabel(selected) : "Select account"}
            </span>
            {selected?.displayPhoneNumber && (
              <span className="text-caption text-muted-foreground truncate leading-tight">
                {selected.displayPhoneNumber}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>WhatsApp accounts</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={selectedWabaId ?? ""}
          onValueChange={handleSelect}
        >
          {accounts.map((account) => {
            const health = wabaHealth(account);
            return (
              <DropdownMenuRadioItem key={account.wabaId} value={account.wabaId}>
                <span className="flex items-center gap-2.5 min-w-0 w-full">
                  <HealthDot account={account} />
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {wabaLabel(account)}
                    </span>
                    <span className="text-caption text-muted-foreground truncate">
                      {account.displayPhoneNumber ?? account.wabaId}
                      {health !== "healthy" && ` · ${wabaStatusLabel(account)}`}
                    </span>
                  </span>
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isConnecting}
          onSelect={(event) => {
            // Let the menu stay open: closing it unmounts the trigger, and the
            // browser then treats Meta's popup as one we opened without a user
            // gesture and blocks it.
            event.preventDefault();
            void connect();
          }}
        >
          <Plus className="h-4 w-4" />
          {isConnecting ? "Connecting…" : "Connect new account"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
