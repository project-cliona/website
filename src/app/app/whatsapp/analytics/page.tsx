"use client";

import { Suspense } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsFilterOptions } from "@/lib/api/whatsapp/analytics";
import { useUser } from "@/providers/userProvider";
import { cn } from "@/lib/utils";
import { AnalyticsFilterBar } from "./_components/AnalyticsFilterBar";
import { OverviewTab } from "./_components/OverviewTab";
import { MessagingTab } from "./_components/MessagingTab";
import { ConversationsTab } from "./_components/ConversationsTab";
import { ComingSoon } from "./_components/ComingSoon";
import { useAnalyticsFilters } from "./_components/useAnalyticsFilters";
import {
  ANALYTICS_TABS,
  TAB_FILTERS,
  isAnalyticsTab,
  type AnalyticsTabId,
} from "./_components/tabs";

function AnalyticsPageInner() {
  const { isClient } = useUser();
  const {
    filters,
    tab: rawTab,
    setTab,
    setPreset,
    setCustomRange,
    setGranularity,
    setWabaIds,
    setCategories,
    setCompare,
    reset,
    isDefault,
  } = useAnalyticsFilters();

  const tab: AnalyticsTabId = isAnalyticsTab(rawTab) ? rawTab : "overview";
  const tabFilters = TAB_FILTERS[tab];

  const { data: options } = useQuery({
    queryKey: ["whatsapp", "analytics", "filters"],
    queryFn: fetchAnalyticsFilterOptions,
    staleTime: 1000 * 60 * 5,
  });

  // A client with a single account has nothing to choose between.
  const showAccountFilter =
    tabFilters.account && (!isClient || (options?.accounts.length ?? 0) > 1);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Analytics"
        subtitle="Messaging performance across your WhatsApp accounts"
      />

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {ANALYTICS_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors focus-ring",
              tab === t.id
                ? "text-primary-700"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary-600" />
            )}
          </button>
        ))}
      </div>

      <AnalyticsFilterBar
        filters={filters}
        options={options ?? null}
        showAccountFilter={showAccountFilter}
        showCategoryFilter={tabFilters.category}
        showCompare={tabFilters.compare}
        onPreset={setPreset}
        onCustomRange={setCustomRange}
        onGranularity={setGranularity}
        onWabaIds={setWabaIds}
        onCategories={setCategories}
        onCompare={setCompare}
        onReset={reset}
        isDefault={isDefault}
      />

      {tab === "overview" && <OverviewTab filters={filters} />}
      {tab === "messaging" && <MessagingTab filters={filters} />}

      {tab === "conversations" && <ConversationsTab filters={filters} />}

      {tab === "pricing" && (
        <ComingSoon
          title="Pricing & Tiers"
          reason="Volume tier position is held by Meta and isn't derivable from our own send history."
          metrics={[
            "Progress towards the next volume tier, per market and category",
            "Volume and cost by pricing category",
            "Free vs billable split over time",
          ]}
        />
      )}

      {tab === "templates" && (
        <ComingSoon
          title="Templates"
          reason="Button clicks never reach our webhook, so template engagement is only available from Meta — and it needs a one-time, permanent opt-in on each account before Meta starts recording it."
          metrics={[
            "URL and quick-reply button clicks per template",
            "Click-through rate against delivered",
            "Cost per delivered message and per click",
          ]}
        />
      )}
    </div>
  );
}

/** useSearchParams needs a Suspense boundary in the App Router. */
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<PageHeading title="Analytics" subtitle="Loading…" />}>
      <AnalyticsPageInner />
    </Suspense>
  );
}
