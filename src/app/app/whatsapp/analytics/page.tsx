"use client";

import { Suspense } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Send,
  CheckCheck,
  Eye,
  XCircle,
  Percent,
  BookOpenCheck,
  ShieldAlert,
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
import {
  fetchAnalyticsOverview,
  fetchAnalyticsFilterOptions,
} from "@/lib/api/whatsapp/analytics";
import { analyticsQueryParams } from "@/lib/api/whatsapp/analytics";
import { useUser } from "@/providers/userProvider";
import { cn } from "@/lib/utils";
import { AnalyticsFilterBar } from "./_components/AnalyticsFilterBar";
import { DeliveryFunnel } from "./_components/DeliveryFunnel";
import { useAnalyticsFilters } from "./_components/useAnalyticsFilters";

const CATEGORY_COLORS = ["#4F46E5", "#A5B4FC", "#FB923C", "#16A34A", "#94A3B8"];

/** A trend string like "-4.2%" or "+0" is positive unless it starts with a minus. */
const isPositive = (trend: string) => !trend.startsWith("-");

function Panel({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-card p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{label}</p>;
}

function AnalyticsPageInner() {
  const { isClient } = useUser();
  const {
    filters,
    setPreset,
    setCustomRange,
    setGranularity,
    setWabaIds,
    setCategories,
    setCompare,
    reset,
    isDefault,
  } = useAnalyticsFilters();

  const { data: options } = useQuery({
    queryKey: ["whatsapp", "analytics", "filters"],
    queryFn: fetchAnalyticsFilterOptions,
    staleTime: 1000 * 60 * 5,
  });

  const { data, isLoading, isFetching } = useQuery({
    // Key on the serialised params, not the Date objects — Dates are never
    // referentially equal and would refetch on every render.
    queryKey: ["whatsapp", "analytics", "overview", analyticsQueryParams(filters)],
    queryFn: () => fetchAnalyticsOverview(filters),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  // A client with a single account has nothing to choose between.
  const showAccountFilter = !isClient || (options?.accounts.length ?? 0) > 1;

  const tiles = data?.tiles;
  const bucketFormat =
    filters.granularity === "half_hour"
      ? "HH:mm"
      : filters.granularity === "month"
        ? "MMM yy"
        : "d MMM";

  const series =
    data?.series.map((point) => ({
      ...point,
      label: format(parseISO(String(point.bucket)), bucketFormat),
    })) ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Analytics"
        subtitle="Messaging performance across your WhatsApp accounts"
      />

      <AnalyticsFilterBar
        filters={filters}
        options={options ?? null}
        showAccountFilter={showAccountFilter}
        onPreset={setPreset}
        onCustomRange={setCustomRange}
        onGranularity={setGranularity}
        onWabaIds={setWabaIds}
        onCategories={setCategories}
        onCompare={setCompare}
        onReset={reset}
        isDefault={isDefault}
      />

      <div
        className={cn(
          "space-y-6 transition-opacity",
          isFetching && !isLoading && "opacity-60"
        )}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatsCard
            icon={<Send className="h-4 w-4" />}
            label="Sent"
            value={(tiles?.sent ?? 0).toLocaleString()}
            trend={
              tiles ? { value: tiles.sentTrend, positive: isPositive(tiles.sentTrend) } : undefined
            }
          />
          <StatsCard
            icon={<CheckCheck className="h-4 w-4" />}
            label="Delivered"
            value={(tiles?.delivered ?? 0).toLocaleString()}
            trend={
              tiles
                ? { value: tiles.deliveredTrend, positive: isPositive(tiles.deliveredTrend) }
                : undefined
            }
          />
          <StatsCard
            icon={<Eye className="h-4 w-4" />}
            label="Read"
            value={(tiles?.read ?? 0).toLocaleString()}
            trend={
              tiles ? { value: tiles.readTrend, positive: isPositive(tiles.readTrend) } : undefined
            }
          />
          <StatsCard
            icon={<XCircle className="h-4 w-4" />}
            label="Failed"
            value={(tiles?.failed ?? 0).toLocaleString()}
            // Fewer failures is the good direction, so the sign is inverted here.
            trend={
              tiles
                ? { value: tiles.failedTrend, positive: !isPositive(tiles.failedTrend) }
                : undefined
            }
          />
          <StatsCard
            icon={<Percent className="h-4 w-4" />}
            label="Delivery rate"
            value={tiles?.deliveryRate ?? "0.0%"}
            trend={
              tiles
                ? {
                    value: tiles.deliveryRateTrend,
                    positive: isPositive(tiles.deliveryRateTrend),
                  }
                : undefined
            }
          />
          <StatsCard
            icon={<BookOpenCheck className="h-4 w-4" />}
            label="Read rate"
            value={tiles?.readRate ?? "0.0%"}
            trend={
              tiles
                ? { value: tiles.readRateTrend, positive: isPositive(tiles.readRateTrend) }
                : undefined
            }
            accent
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel
            title="Volume over time"
            subtitle="Outbound messages by outcome"
            className="lg:col-span-8"
          >
            {series.length === 0 ? (
              <Empty label={isLoading ? "Loading…" : "No messages in this period."} />
            ) : (
              <AreaChart
                data={series}
                xKey="label"
                series={[
                  { key: "sent", label: "Sent", color: CHART_COLORS[0] },
                  { key: "delivered", label: "Delivered", color: CHART_COLORS[1] },
                  { key: "read", label: "Read", color: "#16A34A" },
                  { key: "failed", label: "Failed", color: "#DC2626" },
                ]}
                height={280}
              />
            )}
          </Panel>

          <Panel
            title="Delivery funnel"
            subtitle="Drop-off at each stage"
            className="lg:col-span-4"
          >
            <DeliveryFunnel stages={data?.funnel ?? []} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel
            title="Why messages failed"
            subtitle="Top reasons in this period"
            className="lg:col-span-7"
            action={
              <Link
                href="/app/whatsapp/deliveryReport"
                className="flex items-center gap-1 text-caption text-primary-700 hover:underline"
              >
                Delivery report <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {(data?.failureReasons.length ?? 0) === 0 ? (
              <Empty label="No failures in this period." />
            ) : (
              <HorizontalBarChart
                data={(data?.failureReasons ?? []).map((r) => ({
                  label: r.name,
                  value: r.value,
                }))}
                height={240}
              />
            )}
          </Panel>

          <Panel
            title="Category mix"
            subtitle="Delivered messages by pricing category"
            className="lg:col-span-5"
          >
            {(data?.categoryMix.length ?? 0) === 0 ? (
              <Empty label="No categorised messages yet." />
            ) : (
              <DonutChart
                data={(data?.categoryMix ?? []).map((c, i) => ({
                  name: c.name,
                  value: c.value,
                  color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                }))}
                height={240}
              />
            )}
          </Panel>
        </div>

        <Panel
          title="Account health"
          subtitle="Quality and standing of the accounts behind these numbers"
          action={
            <Link
              href="/app/whatsapp/accounts-health"
              className="flex items-center gap-1 text-caption text-primary-700 hover:underline"
            >
              Accounts health <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {(data?.accounts.length ?? 0) === 0 ? (
            <Empty label="No WhatsApp accounts connected." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data?.accounts.map((a) => {
                const banned =
                  a.banState === "DISABLE" || a.banState === "SCHEDULE_FOR_DISABLE";
                const unhealthy =
                  banned || a.restrictionCount > 0 || a.connectionState !== "connected";
                return (
                  <Link
                    key={a.wabaId}
                    href={`/app/whatsapp/accounts-health/${a.wabaId}`}
                    className={cn(
                      "rounded-md border p-3 transition-colors hover:bg-secondary/50",
                      unhealthy ? "border-amber-300 bg-amber-50/40" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {a.businessName ?? a.wabaId}
                        </p>
                        <p className="text-caption text-muted-foreground">
                          {a.displayPhoneNumber}
                        </p>
                      </div>
                      {unhealthy && (
                        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                        Quality: {a.qualityRating ?? "unknown"}
                      </span>
                      {banned && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">
                          {a.banState}
                        </span>
                      )}
                      {a.restrictionCount > 0 && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                          {a.restrictionCount} restriction
                          {a.restrictionCount === 1 ? "" : "s"}
                        </span>
                      )}
                      {a.connectionState !== "connected" && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700">
                          {a.connectionState}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>

        <p className="text-caption text-muted-foreground">
          Computed from delivery receipts recorded by this platform. Conversation
          counts, cost and template button clicks come from Meta and arrive in a
          later release.
        </p>
      </div>
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
