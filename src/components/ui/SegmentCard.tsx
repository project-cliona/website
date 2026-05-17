"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
  className?: string;
}

export function SegmentCard({ label, value, trend, onClick, className }: SegmentCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "block w-full text-left rounded-lg border border-border bg-card p-4 shadow-e1",
        onClick && "hover:shadow-e2 transition-shadow duration-[var(--motion-base)] cursor-pointer focus-ring",
        className,
      )}
    >
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tabular-nums text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend.positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </Comp>
  );
}
