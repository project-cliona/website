"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWaba } from "@/providers/wabaProvider";
import { useConnectWaba } from "@/hooks/useConnectWaba";
import { wabaLabel } from "@/lib/waba";

/**
 * Shown whenever the selected account cannot send.
 *
 * Rendered once in the layout rather than per page: fifteen pages each
 * remembering to include it is fifteen chances to forget, and forgetting is
 * what lets someone believe a campaign went out.
 */
export function WabaReadOnlyBanner() {
  const { selected, isReadOnly, readOnlyReason, isLoading, setSelectedWabaId } =
    useWaba();
  const { connect, isConnecting } = useConnectWaba({
    onConnected: (wabaId) => setSelectedWabaId(wabaId),
  });

  if (isLoading || !isReadOnly || !selected || !readOnlyReason) return null;

  return (
    <div className="mx-6 mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {wabaLabel(selected)} is read-only
          </p>
          <p className="text-small text-muted-foreground mt-0.5">
            {readOnlyReason} Templates, campaigns and message history remain
            available to view.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void connect()}
          loading={isConnecting}
        >
          Reconnect
        </Button>
      </div>
    </div>
  );
}
