"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/lib/type";

function shortTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function initials(name: string | null, phone: string): string {
  return (name ?? phone).trim().slice(0, 2).toUpperCase();
}

interface ConversationListProps {
  conversations: ConversationSummary[];
  loading: boolean;
  selectedPhone: string | null;
  search: string;
  onSearch: (v: string) => void;
  onSelect: (phone: string) => void;
}

export function ConversationList({
  conversations,
  loading,
  selectedPhone,
  search,
  onSearch,
  onSelect,
}: ConversationListProps) {
  const q = search.trim().toLowerCase();
  const filtered = q
    ? conversations.filter(
        (c) =>
          c.contactPhone.toLowerCase().includes(q) ||
          (c.contactName ?? "").toLowerCase().includes(q),
      )
    : conversations;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <Input
          leadingIcon={Search}
          placeholder="Search conversations"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet.
          </p>
        ) : (
          filtered.map((c) => {
            const active = c.contactPhone === selectedPhone;
            return (
              <button
                key={c.contactPhone}
                type="button"
                onClick={() => onSelect(c.contactPhone)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-accent",
                  active && "bg-accent",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {initials(c.contactName, c.contactPhone)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {c.contactName ?? c.contactPhone}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {shortTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {c.lastMessageDirection === "outbound" && "You: "}
                      {c.lastMessagePreview}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
