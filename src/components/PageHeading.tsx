import React from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};
