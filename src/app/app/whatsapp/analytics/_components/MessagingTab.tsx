"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Timer, ArrowRight } from "lucide-react";
import {
  BarChart,
  DonutChart,
  HorizontalBarChart,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAnalyticsMessaging,
  analyticsQueryParams,
} from "@/lib/api/whatsapp/analytics";
import { cn } from "@/lib/utils";
import { Panel, Empty } from "./Panel";
import { SendHeatmap } from "./SendHeatmap";
import type { AnalyticsFilterState } from "./useAnalyticsFilters";

const TYPE_COLORS = ["#4F46E5", "#A5B4FC", "#FB923C", "#16A34A", "#94A3B8"];

const REGION_NAMES =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

/** "IN" -> "India". Falls back to the raw code, including our "Unknown" bucket. */
const countryName = (code: string) => {
  if (code === "Unknown") return "Unknown";
  try {
    return REGION_NAMES?.of(code) ?? code;
  } catch {
    return code;
  }
};

const formatSeconds = (seconds: number) => {
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
};

/** Colour the rate cells so a bad account is visible without reading numbers. */
const rateTone = (value: number, warn: number, bad: number) =>
  value < bad ? "text-red-600" : value < warn ? "text-amber-600" : "text-foreground";

export function MessagingTab({ filters }: { filters: AnalyticsFilterState }) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["whatsapp", "analytics", "messaging", analyticsQueryParams(filters)],
    queryFn: () => fetchAnalyticsMessaging(filters),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  const median = data?.medianDeliverySeconds;

  return (
    <div
      className={cn(
        "space-y-6 transition-opacity",
        isFetching && !isLoading && "opacity-60"
      )}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel
          title="Where messages went"
          subtitle="Top markets by delivered volume"
          className="lg:col-span-7"
        >
          {(data?.countries.length ?? 0) === 0 ? (
            <Empty label={isLoading ? "Loading…" : "No messages in this period."} />
          ) : (
            <HorizontalBarChart
              data={(data?.countries ?? []).map((c) => ({
                label: countryName(c.name),
                value: c.value,
              }))}
              height={260}
            />
          )}
          <p className="mt-3 text-caption text-muted-foreground">
            Derived from each recipient&apos;s calling code, so numbers with an
            unrecognised prefix land in Unknown.
          </p>
        </Panel>

        <Panel
          title="Message types"
          subtitle="Templates vs session messages"
          className="lg:col-span-5"
        >
          {(data?.types.length ?? 0) === 0 ? (
            <Empty label="No messages in this period." />
          ) : (
            <DonutChart
              data={(data?.types ?? []).map((t, i) => ({
                name: t.name,
                value: t.value,
                color: TYPE_COLORS[i % TYPE_COLORS.length],
              }))}
              height={260}
            />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel
          title="Time to delivery"
          subtitle="From reaching Meta to a delivery receipt"
          className="lg:col-span-5"
          action={
            median !== null && median !== undefined ? (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                <Timer className="h-3 w-3" />
                Median {formatSeconds(median)}
              </span>
            ) : undefined
          }
        >
          {(data?.latency ?? []).every((b) => b.value === 0) ? (
            <Empty label="No delivered messages in this period." />
          ) : (
            <BarChart
              data={(data?.latency ?? []).map((b) => ({
                label: b.name,
                value: b.value,
              }))}
              xKey="label"
              yKey="value"
              height={260}
            />
          )}
        </Panel>

        <Panel
          title="When to send"
          subtitle="Delivery rate by weekday and hour"
          className="lg:col-span-7"
        >
          <SendHeatmap cells={data?.heatmap ?? []} />
        </Panel>
      </div>

      <Panel
        title="Account performance"
        subtitle="Every account behind these numbers, worst delivery rate first"
        action={
          <Link
            href="/app/whatsapp/deliveryReport"
            className="flex items-center gap-1 text-caption text-primary-700 hover:underline"
          >
            Delivery report <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        {(data?.accounts.length ?? 0) === 0 ? (
          <Empty label="No messages in this period." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Read</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead className="text-right">Delivery rate</TableHead>
                  <TableHead className="text-right">Read rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(data?.accounts ?? [])]
                  .sort((a, b) => a.deliveryRate - b.deliveryRate)
                  .map((a) => (
                    <TableRow key={a.wabaId}>
                      <TableCell>
                        <Link
                          href={`/app/whatsapp/accounts-health/${a.wabaId}`}
                          className="font-medium hover:underline"
                        >
                          {a.businessName ?? a.wabaId}
                        </Link>
                        {a.displayPhoneNumber && (
                          <p className="text-caption text-muted-foreground">
                            {a.displayPhoneNumber}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.sent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.delivered.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.read.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.failed.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums font-medium",
                          rateTone(a.deliveryRate, 90, 75)
                        )}
                      >
                        {a.deliveryRate}%
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          rateTone(a.readRate, 40, 20)
                        )}
                      >
                        {a.readRate}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>
    </div>
  );
}
