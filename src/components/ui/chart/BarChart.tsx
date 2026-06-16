"use client";

import {
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  highlightIndex?: number;
  height?: number;
}

export function BarChart({ data, xKey, yKey, highlightIndex, height = 240 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={highlightIndex === undefined || i === highlightIndex ? "#4F46E5" : "#E2E8F0"}
            />
          ))}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}
