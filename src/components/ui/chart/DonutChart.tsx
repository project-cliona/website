"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "./LineChart";

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  centerLabel?: { primary: string; secondary?: string };
}

export function DonutChart({ data, height = 240, centerLabel }: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius="60%" outerRadius="90%" dataKey="value" stroke="none">
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color ?? (i === 0 ? CHART_COLORS[0] : "#E2E8F0")}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerLabel.secondary && (
            <span className="text-caption text-muted-foreground">{centerLabel.secondary}</span>
          )}
          <span className="text-h2 font-bold text-foreground">{centerLabel.primary}</span>
        </div>
      )}
    </div>
  );
}
