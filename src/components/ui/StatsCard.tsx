import React from "react";
import { StatsCardProps } from "@/lib/type";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const iconVariantClasses: Record<number, string> = {
  0: "bg-primary/10 text-primary",
  1: "bg-blue-50 text-blue-600",
  2: "bg-green-50 text-green-700",
  3: "bg-amber-50 text-amber-700",
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  iconVariant = 0,
}: StatsCardProps) {
  const iconBoxClass = iconVariantClasses[iconVariant] ?? iconVariantClasses[0];

  return (
    <div className="card-warm transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBoxClass
          )}
        >
          {React.cloneElement(icon, { size: 18, strokeWidth: 2 })}
        </div>
      </div>
      <p className="stat-number mt-4">{value}</p>
      {trend && (
        <div
          className={cn(
            "inline-flex items-center gap-1 mt-3 text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          )}
        >
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
}
