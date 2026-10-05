"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AnalyticsFilters, AnalyticsGranularity } from "@/lib/type";

const DAY_MS = 24 * 60 * 60 * 1000;

export const RANGE_PRESETS = [
  { id: "today", label: "Today", days: 0 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "365d", label: "Last 12 months", days: 365 },
] as const;

export type RangePresetId = (typeof RANGE_PRESETS)[number]["id"] | "custom";

export const GRANULARITY_LABELS: Record<AnalyticsGranularity, string> = {
  half_hour: "Half-hourly",
  day: "Daily",
  month: "Monthly",
};

export const DEFAULT_PRESET: RangePresetId = "30d";

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Resolve a preset to a concrete range. `today` runs from midnight to now. */
export const rangeForPreset = (preset: RangePresetId): { from: Date; to: Date } => {
  const to = new Date();
  const match = RANGE_PRESETS.find((p) => p.id === preset);
  if (!match || match.days === 0) return { from: startOfDay(to), to };
  return { from: new Date(to.getTime() - match.days * DAY_MS), to };
};

/**
 * Granularity the range can actually support. Half-hourly past two days returns
 * a useless number of points, and monthly under 60 days collapses to one bar —
 * so both are offered only where they mean something.
 */
export const allowedGranularities = (
  from: Date,
  to: Date
): AnalyticsGranularity[] => {
  const days = (to.getTime() - from.getTime()) / DAY_MS;
  const out: AnalyticsGranularity[] = [];
  if (days <= 2) out.push("half_hour");
  out.push("day");
  if (days >= 60) out.push("month");
  return out;
};

const defaultGranularity = (from: Date, to: Date): AnalyticsGranularity => {
  const days = (to.getTime() - from.getTime()) / DAY_MS;
  if (days <= 2) return "half_hour";
  if (days <= 90) return "day";
  return "month";
};

const parseList = (raw: string | null): string[] =>
  raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];

export interface AnalyticsFilterState extends AnalyticsFilters {
  preset: RangePresetId;
}

/**
 * Analytics filter state, stored in the URL so a view is shareable and survives
 * the back button. Every setter patches the query string; nothing lives in
 * component state.
 */
export const useAnalyticsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: AnalyticsFilterState = useMemo(() => {
    const presetParam = (searchParams.get("preset") ?? DEFAULT_PRESET) as RangePresetId;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    let from: Date;
    let to: Date;
    let preset: RangePresetId = presetParam;

    if (presetParam === "custom" && fromParam && toParam) {
      from = new Date(fromParam);
      to = new Date(toParam);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        preset = DEFAULT_PRESET;
        ({ from, to } = rangeForPreset(DEFAULT_PRESET));
      }
    } else {
      const known = RANGE_PRESETS.some((p) => p.id === presetParam);
      preset = known ? presetParam : DEFAULT_PRESET;
      ({ from, to } = rangeForPreset(preset));
    }

    const granularityParam = searchParams.get("granularity") as AnalyticsGranularity | null;
    const allowed = allowedGranularities(from, to);
    const granularity =
      granularityParam && allowed.includes(granularityParam)
        ? granularityParam
        : defaultGranularity(from, to);

    return {
      preset,
      from,
      to,
      granularity,
      wabaIds: parseList(searchParams.get("wabaIds")),
      categories: parseList(searchParams.get("categories")),
      compare: searchParams.get("compare") === "true",
    };
  }, [searchParams]);

  const patch = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setPreset = useCallback(
    (preset: RangePresetId) => {
      if (preset === "custom") {
        // Seed the custom range from whatever is on screen, so opening the
        // custom picker doesn't blank the page out.
        patch({
          preset,
          from: filters.from.toISOString(),
          to: filters.to.toISOString(),
          granularity: null,
        });
        return;
      }
      patch({ preset, from: null, to: null, granularity: null });
    },
    [filters.from, filters.to, patch]
  );

  const setCustomRange = useCallback(
    (from: Date, to: Date) => {
      patch({
        preset: "custom",
        from: from.toISOString(),
        to: to.toISOString(),
        granularity: null,
      });
    },
    [patch]
  );

  const setGranularity = useCallback(
    (granularity: AnalyticsGranularity) => patch({ granularity }),
    [patch]
  );

  const setWabaIds = useCallback(
    (ids: string[]) => patch({ wabaIds: ids.join(",") }),
    [patch]
  );

  const setCategories = useCallback(
    (values: string[]) => patch({ categories: values.join(",") }),
    [patch]
  );

  const setCompare = useCallback(
    (on: boolean) => patch({ compare: on ? "true" : null }),
    [patch]
  );

  const setTab = useCallback((tab: string) => patch({ tab }), [patch]);

  /** Reset clears the filters but keeps the tab — you're resetting a view, not leaving it. */
  const reset = useCallback(() => {
    const tab = searchParams.get("tab");
    router.replace(tab ? `${pathname}?tab=${tab}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const isDefault =
    filters.preset === DEFAULT_PRESET &&
    filters.wabaIds.length === 0 &&
    filters.categories.length === 0 &&
    !filters.compare &&
    !searchParams.get("granularity");

  return {
    filters,
    tab: searchParams.get("tab") ?? "overview",
    setTab,
    setPreset,
    setCustomRange,
    setGranularity,
    setWabaIds,
    setCategories,
    setCompare,
    reset,
    isDefault,
  };
};
