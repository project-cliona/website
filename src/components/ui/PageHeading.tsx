import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeading({ title, subtitle, eyebrow, actions, className }: PageHeadingProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-caption text-muted-foreground mb-1">{eyebrow}</div>
        )}
        <h1 className="text-h1 text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-small text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
