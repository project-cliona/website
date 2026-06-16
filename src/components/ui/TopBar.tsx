"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Sparkles, ChevronRight } from "lucide-react";
import { useSearch } from "@/providers/searchProvider";
import { buildBreadcrumb } from "@/lib/breadcrumbMap";
import { AIInsightModal } from "@/components/ui/AIInsightModal";

export function TopBar() {
  const pathname = usePathname();
  const breadcrumb = buildBreadcrumb(pathname);
  const { config, query, setQuery } = useSearch();
  const [aiOpen, setAiOpen] = useState(false);

  const placeholder = config?.placeholder ?? "Search here…";
  const searchEnabled = config !== null;

  return (
    <>
      <div className="sticky top-0 z-30 h-14 px-6 flex items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-caption">
          {breadcrumb.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              {seg.href ? (
                <Link
                  href={seg.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {seg.label}
                </Link>
              ) : (
                <span className="text-foreground">{seg.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="relative w-full max-w-[400px] hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!searchEnabled}
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed transition-[box-shadow,border-color] duration-[var(--motion-fast)]"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative h-10 w-10 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary focus-ring"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="h-10 px-4 rounded-md inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-ai-gradient shadow-e2 hover:shadow-e3 transition-shadow duration-[var(--motion-fast)] focus-ring"
        >
          <Sparkles className="h-4 w-4" />
          Get AI Insight
        </button>
      </div>

      <AIInsightModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
