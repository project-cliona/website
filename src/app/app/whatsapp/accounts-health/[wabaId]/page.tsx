"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { fetchAccountHealthDetail } from "@/lib/api/whatsapp/accountsHealth";
import { cn } from "@/lib/utils";
import type { NotificationSeverity } from "@/lib/type";

const SEVERITY_ICON = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const SEVERITY_CLASS: Record<NotificationSeverity, string> = {
  critical: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
  info: "text-primary-700 bg-primary-50",
};

const humanize = (s: string) =>
  s.replace(/^RESTRICTED_/, "").replace(/_/g, " ").toLowerCase();

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value ?? "—"}</span>
    </div>
  );
}

function EventRow({
  event,
  severity,
  timestamp,
  payload,
}: {
  event: string;
  severity: NotificationSeverity;
  timestamp: string;
  payload: Record<string, unknown>;
}) {
  const [open, setOpen] = useState(false);
  const Icon = SEVERITY_ICON[severity] ?? Info;

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 py-3 text-left hover:bg-secondary/40 transition-colors px-1"
      >
        <div
          className={cn(
            "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
            SEVERITY_CLASS[severity] ?? SEVERITY_CLASS.info
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{event}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <pre className="mb-3 mx-1 rounded-md bg-secondary/60 p-3 text-[11px] leading-relaxed text-foreground overflow-x-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function AccountHealthDetailPage() {
  const params = useParams<{ wabaId: string }>();
  const wabaId = params?.wabaId;

  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp", "account-health", wabaId],
    queryFn: () => fetchAccountHealthDetail(wabaId as string),
    enabled: Boolean(wabaId),
  });

  const a = data?.account;

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/app/whatsapp/accounts-health"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Accounts Health
      </Link>

      <PageHeading
        eyebrow={`WABA ${wabaId}`}
        title={a?.businessName ?? "Account health"}
        subtitle={a ? `${a.displayPhoneNumber} · owned by ${a.ownerCompany ?? a.ownerName ?? a.ownerEmail}` : undefined}
      />

      {isLoading && !data ? (
        <p className="text-sm text-muted-foreground">Loading account…</p>
      ) : !a ? (
        <p className="text-sm text-muted-foreground">
          Account not found, or you don&apos;t have access to it.
        </p>
      ) : (
        <>
          {(a.banState === "DISABLE" || a.banState === "SCHEDULE_FOR_DISABLE") && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">
                {a.banState === "DISABLE"
                  ? "This account is disabled by Meta"
                  : "This account is scheduled to be disabled"}
              </p>
              {a.banDate && (
                <p className="text-xs text-muted-foreground mt-1">Ban date: {a.banDate}</p>
              )}
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Current state</h3>
              <Field label="Connection" value={a.connectionState} />
              <Field label="Status" value={a.status} />
              <Field label="Quality rating" value={a.qualityRating} />
              <Field label="Ban state" value={a.banState ?? "none"} />
              <Field label="Violation" value={a.violationType ?? "none"} />
              <Field label="Verification" value={a.partnerVerificationStatus ?? "not submitted"} />
              <Field label="Primary location" value={a.primaryLocationCountry} />
              <Field
                label="Disconnection"
                value={
                  a.disconnectionReason
                    ? `${humanize(a.disconnectionReason)}${a.disconnectionInitiatedBy ? ` (${a.disconnectionInitiatedBy.toLowerCase()})` : ""}`
                    : "—"
                }
              />
              <Field
                label="Last event"
                value={a.lastAccountEventAt ? new Date(a.lastAccountEventAt).toLocaleString() : "—"}
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Restrictions ({a.restrictions?.length ?? 0})
                </h3>
                {!a.restrictions || a.restrictions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active restrictions.</p>
                ) : (
                  <div className="space-y-3">
                    {a.restrictions.map((r, i) => (
                      <div key={i} className="rounded-md bg-secondary/60 px-3 py-2.5">
                        <p className="text-sm font-medium text-foreground">
                          {humanize(r.restriction_type)}
                        </p>
                        {r.expiration && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Expires {new Date(r.expiration * 1000).toLocaleString()}
                          </p>
                        )}
                        {r.remediation && (
                          <p className="text-xs text-foreground mt-1.5">{r.remediation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Pricing</h3>
                {a.pricingTier ? (
                  <>
                    <Field label="Category" value={a.pricingTier.pricing_category} />
                    <Field label="Tier" value={a.pricingTier.tier} />
                    <Field label="Region" value={a.pricingTier.region} />
                    <Field label="Effective" value={a.pricingTier.effective_month} />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No pricing tier updates received.</p>
                )}
                <Field
                  label="Auth-intl rates"
                  value={a.authIntlEligibility ? "eligible" : "not eligible"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Event timeline</h3>
            <p className="text-caption text-muted-foreground mb-3">
              Every account_update webhook Meta sent for this account. Expand a row for the raw payload.
            </p>
            {data.timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No account events recorded yet.
              </p>
            ) : (
              data.timeline.map((e) => (
                <EventRow
                  key={e.id}
                  event={e.event}
                  severity={e.severity}
                  timestamp={e.webhookTimestamp}
                  payload={e.payload}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
