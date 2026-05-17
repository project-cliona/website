"use client";

import type { TooltipContentProps } from "recharts";

type ChartTooltipProps = Partial<TooltipContentProps<number, string>>;

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card shadow-e3 px-3 py-2 text-sm">
      {label !== undefined && (
        <div className="text-caption text-muted-foreground mb-1">{label}</div>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: typeof item.color === "string" ? item.color : "#6366F1" }}
          />
          <span className="text-foreground">
            {item.name}: <span className="font-semibold">{item.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
