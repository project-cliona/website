"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Phone } from "lucide-react";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { fetchContacts } from "@/lib/api/whatsapp/contacts";

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (phone: string, name: string | null) => void;
}

// Loose check: a string that's mostly digits (optionally +) looks like a phone.
function looksLikePhone(v: string): boolean {
  const cleaned = v.replace(/[\s-]/g, "");
  return /^\+?\d{8,15}$/.test(cleaned);
}

export function NewChatModal({ open, onClose, onStart }: NewChatModalProps) {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["wa-newchat-contacts", q],
    queryFn: () => fetchContacts({ q, limit: 50 }),
    enabled: open,
  });

  const contacts = data?.contacts ?? [];
  const rawPhone = q.replace(/[\s-]/g, "");

  const start = (phone: string, name: string | null) => {
    onStart(phone, name);
    setQ("");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="md">
      <ModalHeader title="New conversation" description="Pick a contact or enter a phone number" />
      <ModalBody className="space-y-3">
        <Input
          leadingIcon={Search}
          placeholder="Search name or type a phone number"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        {looksLikePhone(q) && (
          <button
            type="button"
            onClick={() => start(rawPhone, null)}
            className="flex w-full items-center gap-3 rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-accent"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span>
              Start chat with <span className="font-medium">{rawPhone}</span>
            </span>
          </button>
        )}

        <div className="max-h-72 overflow-y-auto">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Loading…</p>
          ) : contacts.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No contacts found.</p>
          ) : (
            contacts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => start(c.phone, c.name)}
                className="flex w-full items-center gap-3 border-b border-border px-1 py-2.5 text-left hover:bg-accent"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {(c.name ?? c.phone).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name ?? c.phone}</p>
                  {c.name && <p className="truncate text-xs text-muted-foreground">{c.phone}</p>}
                </div>
              </button>
            ))
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
