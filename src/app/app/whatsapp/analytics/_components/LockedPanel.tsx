"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A surface that is intentionally held back, drawn muted with the real layout
 * faintly visible behind it so it reads as "not yet" rather than "empty".
 */
export function LockedPanel({
  title,
  note,
  className,
  height = 240,
}: {
  title: string;
  note: string;
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-gray-200 bg-card p-5",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      </div>

      {/* Ghost of the chart this panel will hold. */}
      <div
        className="flex items-end gap-2 opacity-[0.18]"
        style={{ height }}
        aria-hidden
      >
        {[38, 62, 45, 78, 55, 88, 66, 72, 50, 84, 60, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-primary-500"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-[2px]">
        <div className="max-w-xs px-6 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-card">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Coming soon</p>
          <p className="mt-1 text-caption text-muted-foreground">{note}</p>
        </div>
      </div>
    </div>
  );
}
