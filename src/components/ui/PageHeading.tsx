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
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};
