"use client";

import { Info, TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StatsCardProps } from "@/lib/type";
import { cn } from "@/lib/utils";

export function StatsCard({
  icon,
  iconBg,
  label,
  value,
  trend,
  accent,
  info,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 border-gray-200",
        accent && "border-primary-200 bg-primary-50/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className={cn("h-8 w-8 rounded-md flex items-center justify-center shrink-0", iconBg ?? "bg-primary-50 text-primary-700")}>
              {icon}
            </div>
          )}
          <span className="text-caption text-muted-foreground truncate">{label}</span>
        </div>
        {/* Rendered only when there is something to say. The overflow menu
            that used to sit here was never wired to anything, so every card
            carried an affordance that did nothing when clicked. */}
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`What is ${label}?`}
                // A button rather than a bare icon so it is reachable by
                // keyboard, and so tapping it opens the tooltip on touch,
                // where hover does not exist.
                className="h-7 w-7 shrink-0 rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary focus-ring transition-colors duration-[var(--motion-fast)]"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="max-w-[260px]">
              {info}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-[32px] leading-none font-bold tabular-nums text-foreground">{value}</p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.positive
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
