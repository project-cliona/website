"use client";

import {
  Area,
  AreaChart as RAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "./LineChart";

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: Array<{ key: string; label: string; color?: string }>;
  height?: number;
}

export function AreaChart({ data, xKey, series, height = 240 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
            return (
              <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E2E8F0" }} />
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={color}
              strokeWidth={2}
              fill={`url(#area-${s.key})`}
            />
          );
        })}
      </RAreaChart>
    </ResponsiveContainer>
  );
}
