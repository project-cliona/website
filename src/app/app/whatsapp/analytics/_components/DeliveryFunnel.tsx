"use client";

import type { AnalyticsFunnelStage } from "@/lib/type";
import { cn } from "@/lib/utils";

const STAGE_COLOR = [
  "bg-slate-300",
  "bg-primary-300",
  "bg-primary-500",
  "bg-primary-700",
];

/**
 * Accepted → Sent → Delivered → Read as stacked bars widthed by share of the
 * funnel's mouth, with the loss against the previous stage called out. This is
 * the chart that actually diagnoses a delivery problem, and it's entirely ours —
 * Meta's analytics field has no read count at all.
 */
export function DeliveryFunnel({ stages }: { stages: AnalyticsFunnelStage[] }) {
  const total = stages[0]?.value ?? 0;

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No messages in this period.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.stage}>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{stage.stage}</span>
            <span className="text-caption text-muted-foreground tabular-nums">
              {stage.value.toLocaleString()}
              <span className="ml-1.5">{stage.pctOfTotal}%</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full transition-all", STAGE_COLOR[i])}
              style={{ width: `${Math.max(stage.pctOfTotal, 0)}%` }}
            />
          </div>
          {i > 0 && stage.dropOff > 0 && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              −{stage.dropOff}% from {stages[i - 1]?.stage.toLowerCase()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
