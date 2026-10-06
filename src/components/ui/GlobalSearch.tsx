"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Users, ListFilter, FileText, Megaphone } from "lucide-react";
import { globalSearch } from "@/lib/api/whatsapp/search";
import { useWaba } from "@/providers/wabaProvider";
import type { SearchResult, SearchResultType } from "@/lib/type";

const GROUP_LABEL: Record<SearchResultType, string> = {
  contact: "Contacts",
  list: "Lists",
  template: "Templates",
  campaign: "Campaigns",
};

const GROUP_ICON: Record<SearchResultType, React.ElementType> = {
  contact: Users,
  list: ListFilter,
  template: FileText,
  campaign: Megaphone,
};

const GROUP_ORDER: SearchResultType[] = ["contact", "list", "template", "campaign"];
const MIN_CHARS = 2;

export function GlobalSearch() {
  const router = useRouter();
  const { selectedWabaId } = useWaba();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing outpaces the round trip; without this every keystroke is a query
  // and the panel flickers between stale responses.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(id);
  }, [term]);

  const { data, isFetching } = useQuery({
    queryKey: ["whatsapp", selectedWabaId ?? "", "search", debounced],
    queryFn: () => globalSearch(debounced, selectedWabaId!),
    enabled: debounced.length >= MIN_CHARS && !!selectedWabaId,
    staleTime: 30_000,
  });

  const results = useMemo(() => data?.results ?? [], [data]);

  const grouped = useMemo(() => {
    const map = new Map<SearchResultType, SearchResult[]>();
    for (const type of GROUP_ORDER) {
      const rows = results.filter((r) => r.type === type);
      if (rows.length) map.set(type, rows);
    }
    return map;
  }, [results]);

  // Flattened in render order, so the arrow keys walk what is on screen
  // rather than the response's own ordering.
  const flat = useMemo(() => [...grouped.values()].flat(), [grouped]);

  useEffect(() => setActive(0), [debounced]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  // Without a shortcut, search sitting in the chrome is mouse-only.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (result: SearchResult) => {
    setOpen(false);
    setTerm("");
    router.push(result.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = flat[active];
      if (hit) go(hit);
    }
  };

  const showPanel = open && debounced.length >= MIN_CHARS;
  let index = -1;

  return (
    <div ref={containerRef} className="relative w-full max-w-[400px] hidden md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={term}
        placeholder="Search contacts, templates, campaigns…"
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="global-search-results"
        className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-16 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-[box-shadow,border-color] duration-[var(--motion-fast)]"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        {!term && (
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        )}
      </span>

      {showPanel && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg border border-border bg-popover shadow-e3 overflow-hidden"
        >
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {isFetching ? "Searching…" : `No matches for "${debounced}"`}
            </p>
          ) : (
            <div className="max-h-[380px] overflow-y-auto py-1">
              {[...grouped.entries()].map(([type, rows]) => {
                const Icon = GROUP_ICON[type];
                return (
                  <div key={type}>
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                      {GROUP_LABEL[type]}
                    </p>
                    {rows.map((r) => {
                      index += 1;
                      const myIndex = index;
                      const isActive = myIndex === active;
                      return (
                        <button
                          key={`${r.type}-${r.id}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(myIndex)}
                          onClick={() => go(r)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left ${
                            isActive ? "bg-secondary" : ""
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground truncate">
                              {r.title}
                            </span>
                            {r.subtitle && (
                              <span className="block text-xs text-muted-foreground/70 truncate">
                                {r.subtitle}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {data?.truncated && (
                <p className="px-3 py-2 text-[11px] text-muted-foreground/70 border-t border-border">
                  Closest matches only — refine your search to narrow it.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
