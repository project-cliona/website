"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MessageBubble } from "@/components/whatsapp/MessageBubble";
import type { WhatsappMessage } from "@/lib/type";

interface ConversationThreadProps {
  phone: string;
  contactName: string | null;
  messages: WhatsappMessage[];
  loading: boolean;
  sending: boolean;
  onSend: (text: string) => void;
}

function initials(name: string | null, phone: string): string {
  const base = (name ?? phone).trim();
  return base.slice(0, 2).toUpperCase();
}

export function ConversationThread({
  phone,
  contactName,
  messages,
  loading,
  sending,
  onSend,
}: ConversationThreadProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message whenever the thread changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, phone]);

  const submit = () => {
    const text = draft.trim();
    if (!text || sending) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
          {initials(contactName, phone)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{contactName ?? phone}</p>
          {contactName && <p className="truncate text-xs text-muted-foreground">{phone}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-muted/30 px-5 py-4">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No messages yet. Say hello 👋
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="flex items-end gap-2 border-t border-border px-4 py-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="max-h-32 min-h-10 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <Button onClick={submit} loading={sending} disabled={!draft.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
