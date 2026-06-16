"use client";

import {
  Bar,
  BarChart as RBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface HorizontalBarChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
}

export function HorizontalBarChart({ data, height = 240 }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 10 }}>
        <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="label"
          type="category"
          stroke="#94A3B8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey="value" fill="#4F46E5" radius={[0, 6, 6, 0]} />
      </RBarChart>
    </ResponsiveContainer>
  );
}
