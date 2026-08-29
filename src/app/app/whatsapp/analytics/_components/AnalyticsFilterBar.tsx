"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/Switch";
import type { AnalyticsFilterOptions, AnalyticsGranularity } from "@/lib/type";
import { cn } from "@/lib/utils";
import { MultiSelect } from "./MultiSelect";
import {
  GRANULARITY_LABELS,
  RANGE_PRESETS,
  allowedGranularities,
  type AnalyticsFilterState,
  type RangePresetId,
} from "./useAnalyticsFilters";

interface Props {
  filters: AnalyticsFilterState;
  options: AnalyticsFilterOptions | null;
  showAccountFilter: boolean;
  onPreset: (preset: RangePresetId) => void;
  onCustomRange: (from: Date, to: Date) => void;
  onGranularity: (g: AnalyticsGranularity) => void;
  onWabaIds: (ids: string[]) => void;
  onCategories: (values: string[]) => void;
  onCompare: (on: boolean) => void;
  onReset: () => void;
  isDefault: boolean;
}

/** "utility" -> "Utility", "AUTHENTICATION_INTERNATIONAL" -> "Authentication international" */
const humanizeCategory = (raw: string) => {
  const s = raw.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-800">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full hover:bg-primary-100 focus-ring"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function AnalyticsFilterBar({
  filters,
  options,
  showAccountFilter,
  onPreset,
  onCustomRange,
  onGranularity,
  onWabaIds,
  onCategories,
  onCompare,
  onReset,
  isDefault,
}: Props) {
  const [draftFrom, setDraftFrom] = useState<Date | undefined>(filters.from);
  const [draftTo, setDraftTo] = useState<Date | undefined>(filters.to);
  const [customOpen, setCustomOpen] = useState(false);

  const granularities = allowedGranularities(filters.from, filters.to);

  const accountOptions =
    options?.accounts.map((a) => ({
      value: a.wabaId,
      label: a.businessName ?? a.wabaId,
      hint: a.displayPhoneNumber,
    })) ?? [];

  const categoryOptions =
    options?.categories.map((c) => ({
      value: c,
      label: humanizeCategory(c),
    })) ?? [];

  const applyCustom = () => {
    if (!draftFrom || !draftTo) return;
    // Tolerate the range being picked backwards rather than rejecting it.
    const [from, to] = draftFrom <= draftTo ? [draftFrom, draftTo] : [draftTo, draftFrom];
    // Include the whole end day — a picker returns midnight, which would
    // otherwise silently drop everything sent that day.
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    onCustomRange(from, end);
    setCustomOpen(false);
  };

  const accountLabel = (id: string) =>
    options?.accounts.find((a) => a.wabaId === id)?.businessName ?? id;

  return (
    <div className="sticky top-0 z-20 rounded-lg border border-gray-200 bg-card/95 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {/* Date range presets */}
        <div className="flex items-center rounded-md border border-gray-200 p-0.5">
          {RANGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPreset(preset.id)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors focus-ring",
                filters.preset === preset.id
                  ? "bg-primary-100 text-primary-800"
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              {preset.label}
            </button>
          ))}
          <Popover open={customOpen} onOpenChange={setCustomOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors focus-ring",
                  filters.preset === "custom"
                    ? "bg-primary-100 text-primary-800"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Custom
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">From</p>
                  <Calendar
                    mode="single"
                    selected={draftFrom}
                    onSelect={setDraftFrom}
                    defaultMonth={draftFrom}
                    disabled={{ after: new Date() }}
                  />
                </div>
                <div>
                  <p className="mb-1 text-caption text-muted-foreground">To</p>
                  <Calendar
                    mode="single"
                    selected={draftTo}
                    onSelect={setDraftTo}
                    defaultMonth={draftTo}
                    disabled={{ after: new Date() }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-caption text-muted-foreground">
                  Up to 12 months of history
                </p>
                <button
                  type="button"
                  onClick={applyCustom}
                  disabled={!draftFrom || !draftTo}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50 focus-ring"
                >
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Granularity — only the buckets this range can meaningfully support */}
        <div className="flex items-center rounded-md border border-gray-200 p-0.5">
          {granularities.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGranularity(g)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors focus-ring",
                filters.granularity === g
                  ? "bg-primary-100 text-primary-800"
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              {GRANULARITY_LABELS[g]}
            </button>
          ))}
        </div>

        {showAccountFilter && (
          <MultiSelect
            options={accountOptions}
            selected={filters.wabaIds}
            onChange={onWabaIds}
            allLabel="All accounts"
          />
        )}

        <MultiSelect
          options={categoryOptions}
          selected={filters.categories}
          onChange={onCategories}
          allLabel="All categories"
        />

        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Compare to previous period
          <Switch enabled={filters.compare} onChange={onCompare} />
        </label>
      </div>

      {/* Active filters — silent filtering is how an analytics page lies to you. */}
      {!isDefault && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2">
          <span className="text-caption text-muted-foreground">
            {format(filters.from, "d MMM yyyy")} – {format(filters.to, "d MMM yyyy")}
          </span>
          {filters.wabaIds.map((id) => (
            <Chip
              key={id}
              label={accountLabel(id)}
              onRemove={() => onWabaIds(filters.wabaIds.filter((v) => v !== id))}
            />
          ))}
          {filters.categories.map((c) => (
            <Chip
              key={c}
              label={humanizeCategory(c)}
              onRemove={() => onCategories(filters.categories.filter((v) => v !== c))}
            />
          ))}
          {filters.compare && (
            <Chip label="Comparing periods" onRemove={() => onCompare(false)} />
          )}
          <button
            type="button"
            onClick={onReset}
            className="ml-1 text-caption text-primary-700 underline-offset-2 hover:underline focus-ring"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
