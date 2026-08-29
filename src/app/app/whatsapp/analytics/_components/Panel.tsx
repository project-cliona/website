"use client";

import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-card p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{label}</p>;
}
