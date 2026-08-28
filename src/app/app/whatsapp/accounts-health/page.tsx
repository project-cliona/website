"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  ShieldAlert,
  Ban,
  Unplug,
  ArrowRight,
} from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  AreaChart,
  DonutChart,
  HorizontalBarChart,
  CHART_COLORS,
} from "@/components/ui/chart";
import { fetchAccountsHealth } from "@/lib/api/whatsapp/accountsHealth";
import { useUser } from "@/providers/userProvider";
import { cn } from "@/lib/utils";

const CONNECTION_COLORS: Record<string, string> = {
  connected: "#16A34A",
  offboarded: "#F59E0B",
  removed: "#FB923C",
  deleted: "#DC2626",
};

/** "RESTRICTED_BIZ_INITIATED_MESSAGING" -> "biz initiated messaging" */
const humanize = (s: string) =>
  s.replace(/^RESTRICTED_/, "").replace(/_/g, " ").toLowerCase();

function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-card p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-caption text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <p className="py-10 text-center text-sm text-muted-foreground">{label}</p>
  );
}

export default function AccountsHealthPage() {
  const { isAdmin, userAuthLoading } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["whatsapp", "accounts-health"],
    queryFn: fetchAccountsHealth,
    enabled: isAdmin,
    staleTime: 1000 * 60,
  });

  if (userAuthLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <PageHeading
          title="Accounts Health"
          subtitle="This fleet-wide view is available to administrators only."
        />
      </div>
    );
  }

  const s = data?.summary;

  return (
    <div className="p-6 space-y-6">
      <PageHeading
        eyebrow="WhatsApp"
        title="Accounts Health"
        subtitle="Bans, restrictions, disconnections and pricing changes across every WhatsApp Business Account, sourced from Meta's account_update webhook."
      />

      {isLoading && !data ? (
        <div className="text-sm text-muted-foreground">Loading account health…</div>
      ) : !data ? (
        <Empty label="Could not load account health." />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Healthy accounts"
              value={`${s?.healthy ?? 0}`}
              trend={{ value: s?.healthyPercent ?? "0%", positive: true }}
            />
            <StatsCard
              icon={<Ban className="h-4 w-4" />}
              iconBg="bg-destructive/10 text-destructive"
              label="Banned / scheduled"
              value={`${s?.banned ?? 0}`}
              trend={{ value: s?.atRiskTrend ?? "+0", positive: (s?.banned ?? 0) === 0 }}
            />
            <StatsCard
              icon={<ShieldAlert className="h-4 w-4" />}
              iconBg="bg-warning/10 text-warning"
              label="Restricted"
              value={`${s?.restricted ?? 0}`}
            />
            <StatsCard
              icon={<Unplug className="h-4 w-4" />}
              iconBg="bg-warning/10 text-warning"
              label="Disconnected"
              value={`${s?.disconnected ?? 0}`}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Panel title="Connection state" subtitle={`${s?.totalAccounts ?? 0} accounts`}>
              {data.connectionBreakdown.length === 0 ? (
                <Empty label="No accounts yet." />
              ) : (
                <DonutChart
                  data={data.connectionBreakdown.map((d) => ({
                    name: d.name,
                    value: d.value,
                    color: CONNECTION_COLORS[d.name],
                  }))}
                  centerLabel={{
                    primary: `${s?.totalAccounts ?? 0}`,
                    secondary: "Accounts",
                  }}
                />
              )}
            </Panel>

            <Panel
              title="Active restrictions"
              subtitle="Accounts affected, by restriction type"
              className="lg:col-span-2"
            >
              {data.restrictionBreakdown.length === 0 ? (
                <Empty label="No accounts are currently restricted." />
              ) : (
                <HorizontalBarChart
                  data={data.restrictionBreakdown.map((d) => ({
                    label: humanize(d.name),
                    value: d.value,
                  }))}
                />
              )}
            </Panel>
          </div>

          <Panel
            title="Account events"
            subtitle="Daily account_update volume over the last 30 days, by severity"
          >
            {data.eventSeries.length === 0 ? (
              <Empty label="No account events in the last 30 days." />
            ) : (
              <AreaChart
                data={data.eventSeries}
                xKey="day"
                series={[
                  { key: "critical", label: "Critical", color: "#DC2626" },
                  { key: "warning", label: "Warning", color: "#F59E0B" },
                  { key: "info", label: "Info", color: CHART_COLORS[0] },
                ]}
                height={260}
              />
            )}
          </Panel>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Panel title="Policy violations" subtitle="Accounts by violation type">
              {data.violationBreakdown.length === 0 ? (
                <Empty label="No violations recorded." />
              ) : (
                <HorizontalBarChart
                  data={data.violationBreakdown.map((d) => ({
                    label: humanize(d.name),
                    value: d.value,
                  }))}
                  height={200}
                />
              )}
            </Panel>

            <Panel title="Business verification" subtitle="Partner-led verification status">
              {data.verificationFunnel.length === 0 ? (
                <Empty label="No verification submissions." />
              ) : (
                <>
                  <HorizontalBarChart
                    data={data.verificationFunnel.map((d) => ({
                      label: d.name.toLowerCase(),
                      value: d.value,
                    }))}
                    height={160}
                  />
                  {data.rejectionReasons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border space-y-1.5">
                      <p className="text-caption text-muted-foreground">Top rejection reasons</p>
                      {data.rejectionReasons.slice(0, 4).map((r) => (
                        <div key={r.name} className="flex justify-between text-xs">
                          <span className="text-foreground truncate">{r.name.toLowerCase()}</span>
                          <span className="text-muted-foreground tabular-nums">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Panel>

            <Panel title="Pricing" subtitle="Volume tiers and international auth rates">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Auth-intl eligible</span>
                  <span className="text-sm font-semibold tabular-nums">{data.authIntl.eligible}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">With exception countries</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {data.authIntl.withExceptions}
                  </span>
                </div>

                {data.pricingTiers.length === 0 ? (
                  <p className="text-xs text-muted-foreground pt-2">No tier updates received yet.</p>
                ) : (
                  <div className="pt-2 space-y-1.5">
                    <p className="text-caption text-muted-foreground">Volume tiers</p>
                    {data.pricingTiers.slice(0, 6).map((t, i) => (
                      <div key={i} className="flex justify-between text-xs gap-2">
                        <span className="text-foreground truncate">
                          {t.category ?? "—"} · {t.region ?? "—"}
                        </span>
                        <span className="text-muted-foreground tabular-nums shrink-0">
                          {t.tier ?? "—"} ({t.value})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          </div>

          <Panel
            title="Accounts needing attention"
            subtitle="Banned, restricted or disconnected accounts, most recently changed first"
          >
            {data.atRisk.length === 0 ? (
              <Empty label="Every account is healthy." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-caption text-muted-foreground border-b border-border">
                      <th className="pb-2 pr-4 font-medium">Business</th>
                      <th className="pb-2 pr-4 font-medium">Owner</th>
                      <th className="pb-2 pr-4 font-medium">State</th>
                      <th className="pb-2 pr-4 font-medium">Issue</th>
                      <th className="pb-2 pr-4 font-medium">Last event</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.atRisk.map((a) => {
                      const issues: string[] = [];
                      if (a.banState) issues.push(a.banState.toLowerCase().replace(/_/g, " "));
                      for (const r of a.restrictions ?? []) issues.push(humanize(r.restriction_type));
                      if (a.violationType) issues.push(a.violationType.toLowerCase());

                      return (
                        <tr key={a.wabaId} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4">
                            <p className="font-medium text-foreground">
                              {a.businessName ?? "Unnamed"}
                            </p>
                            <p className="text-xs text-muted-foreground">{a.displayPhoneNumber}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-foreground">{a.ownerCompany ?? a.ownerName ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{a.ownerEmail}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                                a.connectionState === "connected"
                                  ? "bg-success/15 text-success"
                                  : "bg-destructive/15 text-destructive"
                              )}
                            >
                              {a.connectionState}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground max-w-[260px]">
                            {issues.length ? issues.join(", ") : "—"}
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                            {a.lastAccountEventAt
                              ? new Date(a.lastAccountEventAt).toLocaleString()
                              : "—"}
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/app/whatsapp/accounts-health/${a.wabaId}`}
                              className="inline-flex items-center gap-1 text-xs text-primary-700 hover:underline"
                            >
                              View <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
