"use client";

import type { AnalyticsHeatmapCell } from "@/lib/type";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Delivery rate by weekday × hour. Cells with too little traffic are drawn
 * neutral rather than coloured — a 100% rate from two messages is noise, and
 * colouring it would send someone to send at 4am on a Tuesday.
 */
const MIN_SAMPLE = 3;

const shadeFor = (cell: AnalyticsHeatmapCell | undefined) => {
  if (!cell || cell.attempted === 0) return "bg-secondary/40";
  if (cell.attempted < MIN_SAMPLE) return "bg-slate-200";
  if (cell.deliveryRate >= 95) return "bg-primary-700";
  if (cell.deliveryRate >= 85) return "bg-primary-500";
  if (cell.deliveryRate >= 70) return "bg-primary-300";
  if (cell.deliveryRate >= 50) return "bg-amber-300";
  return "bg-red-300";
};

export function SendHeatmap({ cells }: { cells: AnalyticsHeatmapCell[] }) {
  const byKey = new Map(cells.map((c) => [`${c.weekday}-${c.hour}`, c]));
  const hasData = cells.some((c) => c.attempted > 0);

  if (!hasData) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No messages in this period.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="min-w-[34rem]">
          <div className="mb-1 flex gap-[2px] pl-9">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-[9px] text-muted-foreground"
              >
                {hour % 3 === 0 ? hour : ""}
              </div>
            ))}
          </div>
          {WEEKDAYS.map((day, weekday) => (
            <div key={day} className="mb-[2px] flex items-center gap-[2px]">
              <span className="w-9 shrink-0 text-[10px] text-muted-foreground">
                {day}
              </span>
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = byKey.get(`${weekday}-${hour}`);
                return (
                  <div
                    key={hour}
                    title={
                      cell && cell.attempted > 0
                        ? `${day} ${hour}:00 — ${cell.deliveryRate}% delivered (${cell.attempted} sent)`
                        : `${day} ${hour}:00 — no messages`
                    }
                    className={cn(
                      "h-5 flex-1 rounded-[2px] transition-colors",
                      shadeFor(cell)
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-secondary/40" /> No data
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-slate-200" /> Too few to judge
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-red-300" /> &lt;50%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-amber-300" /> 50–70%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-primary-300" /> 70–85%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-primary-500" /> 85–95%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[2px] bg-primary-700" /> 95%+
        </span>
        <span className="ml-auto">Times shown in UTC</span>
      </div>
    </div>
  );
}
