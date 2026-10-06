"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ChevronRight } from "lucide-react";
import { buildBreadcrumb } from "@/lib/breadcrumbMap";
import { AIInsightModal } from "@/components/ui/AIInsightModal";

// Temporarily hidden. The modal stays wired up, so restoring it is this one
// flag rather than reassembling the button and its state.
const SHOW_AI_INSIGHT = false;
import { NotificationBell } from "@/components/ui/NotificationBell";
import { AccountMenu } from "@/components/ui/AccountMenu";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

export function TopBar() {
  const pathname = usePathname();
  const breadcrumb = buildBreadcrumb(pathname);
  const [aiOpen, setAiOpen] = useState(false);


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

        <GlobalSearch />

        <NotificationBell />

        {SHOW_AI_INSIGHT && (
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="h-10 px-4 rounded-md inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-ai-gradient shadow-e2 hover:shadow-e3 transition-shadow duration-[var(--motion-fast)] focus-ring"
          >
            <Sparkles className="h-4 w-4" />
            Get AI Insight
          </button>
        )}

        <AccountMenu />
      </div>

      <AIInsightModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
