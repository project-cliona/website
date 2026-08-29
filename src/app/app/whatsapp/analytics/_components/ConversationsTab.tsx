"use client";

import { format, parseISO } from "date-fns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertTriangle, MessagesSquare } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { AreaChart, DonutChart, HorizontalBarChart } from "@/components/ui/chart";
import {
  fetchAnalyticsConversations,
  analyticsQueryParams,
} from "@/lib/api/whatsapp/analytics";
import type { AnalyticsAccountFetchStatus, MetaAnalyticsFailure } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Panel, Empty } from "./Panel";
import { LockedPanel } from "./LockedPanel";
import type { AnalyticsFilterState } from "./useAnalyticsFilters";

const CATEGORY_COLORS = ["#4F46E5", "#A5B4FC", "#FB923C", "#16A34A", "#94A3B8"];

/** Plain-language explanation per documented Meta failure mode. */
const FAILURE_COPY: Record<MetaAnalyticsFailure, string> = {
  cost_withheld:
    "Meta does not report cost for accounts billed through a partner.",
  insights_not_enabled: "Insights have not been enabled for this account.",
  region_unsupported: "Meta does not provide this data in the account's region.",
  token_invalid: "The stored access token is expired or invalid — reconnect the account.",
  unavailable: "Meta could not return data for this account.",
};

const REGION_NAMES =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const countryName = (code: string) => {
  if (!code || code === "UNKNOWN") return "Unknown";
  try {
    return REGION_NAMES?.of(code) ?? code;
  } catch {
    return code;
  }
};

/** "BUSINESS_INITIATED" -> "Business initiated" */
const humanize = (raw: string) => {
  const s = raw.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function AccountIssues({ accounts }: { accounts: AnalyticsAccountFetchStatus[] }) {
  const failed = accounts.filter((a) => !a.ok);
  if (failed.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-900">
            {failed.length} of {accounts.length} account
            {accounts.length === 1 ? "" : "s"} returned no data
          </p>
          <p className="mt-0.5 text-caption text-amber-800">
            The totals below exclude {failed.length === 1 ? "it" : "them"}.
          </p>
          <ul className="mt-2 space-y-1">
            {failed.map((a) => (
              <li key={a.wabaId} className="text-caption text-amber-900">
                <span className="font-medium">
                  {a.businessName?.trim() || a.wabaId}
                </span>
                {" — "}
                {FAILURE_COPY[a.failure ?? "unavailable"]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ConversationsTab({ filters }: { filters: AnalyticsFilterState }) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "whatsapp",
      "analytics",
      "conversations",
      analyticsQueryParams(filters),
    ],
    queryFn: () => fetchAnalyticsConversations(filters),
    // Graph responses are cached server-side for 15 minutes; matching that here
    // avoids a refetch that can only return the same cached payload.
    staleTime: 1000 * 60 * 15,
    placeholderData: keepPreviousData,
  });

  const bucketFormat =
    filters.granularity === "half_hour"
      ? "HH:mm"
      : filters.granularity === "month"
        ? "MMM yy"
        : "d MMM";

  const series =
    data?.series.map((point) => ({
      label: format(parseISO(point.bucket), bucketFormat),
      conversations: point.conversations,
    })) ?? [];

  const noAccounts = (data?.accounts.length ?? 0) === 0;

  return (
    <div
      className={cn(
        "space-y-6 transition-opacity",
        isFetching && !isLoading && "opacity-60"
      )}
    >
      {noAccounts && !isLoading && (
        <div className="rounded-lg border border-gray-200 bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No connected WhatsApp accounts to read conversation data from.
          </p>
        </div>
      )}

      <AccountIssues accounts={data?.accounts ?? []} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<MessagesSquare className="h-4 w-4" />}
          label="Conversations"
          value={(data?.totalConversations ?? 0).toLocaleString()}
        />
      </div>

      <Panel
        title="Conversations over time"
        subtitle="24-hour conversation windows opened, as counted by Meta"
      >
        {series.length === 0 ? (
          <Empty
            label={isLoading ? "Loading…" : "No conversation data for this period."}
          />
        ) : (
          <AreaChart
            data={series}
            xKey="label"
            series={[{ key: "conversations", label: "Conversations" }]}
            height={280}
          />
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="By category" subtitle="Authentication, marketing, service, utility">
          {(data?.byCategory.length ?? 0) === 0 ? (
            <Empty label="No data." />
          ) : (
            <DonutChart
              data={(data?.byCategory ?? []).map((c, i) => ({
                name: humanize(c.name),
                value: c.value,
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
              }))}
              height={220}
            />
          )}
        </Panel>

        <Panel title="By type" subtitle="Regular, free tier, free entry point">
          {(data?.byType.length ?? 0) === 0 ? (
            <Empty label="No data." />
          ) : (
            <DonutChart
              data={(data?.byType ?? []).map((c, i) => ({
                name: humanize(c.name),
                value: c.value,
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
              }))}
              height={220}
            />
          )}
        </Panel>

        <Panel title="By direction" subtitle="Who opened the conversation">
          {(data?.byDirection.length ?? 0) === 0 ? (
            <Empty label="No data." />
          ) : (
            <DonutChart
              data={(data?.byDirection ?? []).map((c, i) => ({
                name: humanize(c.name),
                value: c.value,
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
              }))}
              height={220}
            />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="By country" subtitle="Top markets by conversation volume">
          {(data?.byCountry.length ?? 0) === 0 ? (
            <Empty label="No data." />
          ) : (
            <HorizontalBarChart
              data={(data?.byCountry ?? []).map((c) => ({
                label: countryName(c.name),
                value: c.value,
              }))}
              height={260}
            />
          )}
        </Panel>

        <LockedPanel
          title="Cost per conversation"
          note="Conversation spend is not switched on yet. Meta withholds cost for accounts billed through a partner, so this needs verifying against a live account before we show a number."
          height={260}
        />
      </div>
    </div>
  );
}
