"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Activity, Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { fetchWabaAccountDetail } from "@/lib/api/whatsapp/accounts";
import { wabaKeys } from "@/lib/queryKeys";
import { HEALTH_DOT_CLASS, wabaHealth, wabaLabel, wabaStatusLabel } from "@/lib/waba";
import type { WabaAccount } from "@/lib/type";

interface WabaCardProps {
  account: WabaAccount;
  isSelected: boolean;
  onSelect: (wabaId: string) => void;
  onDisconnect: (account: WabaAccount) => void;
  disconnecting?: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground truncate">{children}</dd>
    </div>
  );
}

function qualityVariant(rating: string | null) {
  switch (rating?.toUpperCase()) {
    case "GREEN":
      return "text-success";
    case "YELLOW":
      return "text-warning";
    case "RED":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function WabaCard({
  account,
  isSelected,
  onSelect,
  onDisconnect,
  disconnecting,
}: WabaCardProps) {
  const [copied, setCopied] = useState(false);
  const health = wabaHealth(account);

  // Counts live on the detail endpoint so the switcher's list stays cheap.
  const { data: detail } = useQuery({
    queryKey: wabaKeys.accountDetail(account.wabaId),
    queryFn: () => fetchWabaAccountDetail(account.wabaId),
    staleTime: 5 * 60 * 1000,
  });

  const copyId = async () => {
    await navigator.clipboard.writeText(account.wabaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`mt-1.5 inline-block h-2.5 w-2.5 rounded-full shrink-0 ${HEALTH_DOT_CLASS[health]}`}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {wabaLabel(account)}
            </p>
            <p className="text-small text-muted-foreground">
              {account.displayPhoneNumber ?? "No phone number"}
            </p>
          </div>
        </div>
        {isSelected && <Badge>Current</Badge>}
      </div>

      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
        <Field label="Status">{wabaStatusLabel(account)}</Field>
        <Field label="Quality rating">
          <span className={qualityVariant(account.qualityRating)}>
            {account.qualityRating ?? "Unknown"}
          </span>
        </Field>
        <Field label="Connection">{account.connectionState ?? "—"}</Field>
        <Field label="Connected on">
          {new Date(account.createdAt).toLocaleDateString()}
        </Field>
        <Field label="Phone number ID">
          <span className="font-mono text-caption">{account.phoneNumberId}</span>
        </Field>
        <Field label="Account ID">
          <button
            type="button"
            onClick={copyId}
            className="font-mono text-caption inline-flex items-center gap-1 hover:text-primary focus-ring rounded"
            title="Copy account ID"
          >
            {account.wabaId}
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </Field>
      </dl>

      {account.banState && (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-caption text-destructive">
          Meta restriction: {account.banState}
          {account.banDate && ` (since ${new Date(account.banDate).toLocaleDateString()})`}
        </p>
      )}

      {detail && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-caption text-muted-foreground border-t border-border pt-3">
          <span>
            <strong className="text-foreground">{detail.counts.templates}</strong>{" "}
            templates ({detail.counts.templatesApproved} approved)
          </span>
          <span>
            <strong className="text-foreground">{detail.counts.campaigns}</strong>{" "}
            campaigns
          </span>
          <span>
            <strong className="text-foreground">{detail.counts.messagesSent30d}</strong>{" "}
            sent in 30 days
          </span>
          <span>
            <strong className="text-foreground">{detail.counts.conversations}</strong>{" "}
            conversations
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!isSelected && (
          <Button variant="outline" size="sm" onClick={() => onSelect(account.wabaId)}>
            Set as current
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/app/whatsapp/accounts-health/${account.wabaId}`}>
            <Activity className="h-4 w-4" />
            View health
          </Link>
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDisconnect(account)}
          loading={disconnecting}
          disabled={account.status === "disconnected"}
        >
          {account.status === "disconnected" ? "Disconnected" : "Disconnect"}
        </Button>
      </div>
    </Card>
  );
}
