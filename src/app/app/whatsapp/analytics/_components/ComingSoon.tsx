"use client";

import { Lock } from "lucide-react";

/**
 * Placeholder for the three Graph-backed tabs. States plainly what the tab will
 * show and why it isn't here yet — an empty tab with no explanation reads as a
 * bug, and these metrics genuinely cannot be computed from our own tables.
 */
export function ComingSoon({
  title,
  reason,
  metrics,
}: {
  title: string;
  reason: string;
  metrics: string[];
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-card p-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{reason}</p>
        <ul className="mt-4 inline-flex flex-col gap-1.5 text-left">
          {metrics.map((metric) => (
            <li
              key={metric}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              {metric}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
