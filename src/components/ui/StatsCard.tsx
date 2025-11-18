import { StatsCardProps } from "@/lib/type";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  tooltip,
}: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <div>{icon}</div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <Tooltip >
                <TooltipTrigger><Info className="text-gray-400 h-3 w-3" /></TooltipTrigger>
                <TooltipContent sideOffset={8}>
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {value}
              </p>
              {trend && (
                <div
                  className={`flex items-center mt-2 text-sm font-medium ${
                    trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 mr-1 ${trendUp ? "" : "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                  {trend}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
