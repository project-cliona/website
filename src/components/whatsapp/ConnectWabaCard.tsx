"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useConnectWaba } from "@/hooks/useConnectWaba";
import { useWaba } from "@/providers/wabaProvider";

interface ConnectWabaCardProps {
  /** "full" is the first-run empty state; "compact" is an inline action. */
  variant?: "full" | "compact";
  title?: string;
  description?: string;
  className?: string;
}

export function ConnectWabaCard({
  variant = "full",
  title = "Connect your WhatsApp Business Account",
  description = "Connect an account to start sending campaigns, managing templates and tracking delivery reports.",
  className,
}: ConnectWabaCardProps) {
  const { setSelectedWabaId } = useWaba();
  const { connect, isConnecting, error } = useConnectWaba({
    onConnected: (wabaId) => setSelectedWabaId(wabaId),
  });

  const button = (
    <Button onClick={() => void connect()} loading={isConnecting}>
      Connect WhatsApp
    </Button>
  );

  if (variant === "compact") {
    return (
      <div className={className}>
        {button}
        {error && <p className="mt-2 text-caption text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className ?? ""}`}>
      <h3 className="text-h3 mb-2">{title}</h3>
      <p className="text-small text-muted-foreground mb-4">{description}</p>
      {button}
      {error && (
        <div className="mt-3 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}
    </Card>
  );
}
