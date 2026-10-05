"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchLists } from "@/lib/api/whatsapp/lists";
import { fetchTags } from "@/lib/api/whatsapp/contacts";
import { previewAudience } from "@/lib/api/whatsapp/audience";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Users, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { AudiencePreview } from "@/lib/type";

export type RecipientSelection =
  | { mode: "list"; listId: number }
  | { mode: "tags"; tags: string[] }
  | { mode: "paste"; phones: string[] };

interface Props {
  onChange: (
    sel: RecipientSelection | null,
    preview: AudiencePreview | null
  ) => void;
}

export function RecipientPicker({ onChange }: Props) {
  const [tab, setTab] = useState<"contacts" | "paste">("contacts");
  const [contactsMode, setContactsMode] = useState<"list" | "tags">("list");
  const [listId, setListId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [pasted, setPasted] = useState("");
  const [dedup, setDedup] = useState(true);

  const { data: lists = [] } = useQuery({
    queryKey: ["whatsapp-lists"],
    queryFn: fetchLists,
  });
  const { data: tagOpts = [] } = useQuery({
    queryKey: ["whatsapp-tags"],
    queryFn: fetchTags,
  });

  // Drives the stronger wording: with nothing to pick from, the note is the
  // only thing on the panel telling the user where audiences come from.
  const hasNoAudience = lists.length === 0 && tagOpts.length === 0;

  const pastedPhones = useMemo(() => {
    const raw = pasted
      .split(/[,\n]+/)
      .map((n) => n.replace(/\D/g, ""))
      .filter((n) => n.length >= 10);
    return dedup ? [...new Set(raw)] : raw;
  }, [pasted, dedup]);

  const previewQuery = useQuery<AudiencePreview>({
    queryKey: [
      "audience-preview",
      tab,
      contactsMode,
      listId,
      tags,
      pastedPhones,
    ],
    queryFn: () => {
      if (tab === "paste")
        return previewAudience({ mode: "paste", phones: pastedPhones });
      if (contactsMode === "list" && listId !== null)
        return previewAudience({ mode: "list", listId });
      if (contactsMode === "tags" && tags.length)
        return previewAudience({ mode: "tags", tags });
      return Promise.resolve<AudiencePreview>({
        matched: 0,
        sampleRecipients: [],
      });
    },
    staleTime: 300,
  });

  useEffect(() => {
    let sel: RecipientSelection | null = null;
    if (tab === "contacts") {
      if (contactsMode === "list" && listId !== null)
        sel = { mode: "list", listId };
      if (contactsMode === "tags" && tags.length > 0)
        sel = { mode: "tags", tags };
    } else {
      if (pastedPhones.length > 0)
        sel = { mode: "paste", phones: pastedPhones };
    }
    onChange(sel, previewQuery.data ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, contactsMode, listId, tags, pastedPhones, previewQuery.data]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recipients</h2>
        {previewQuery.data && (
          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {previewQuery.data.matched.toLocaleString()} will receive
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-4 border-b border-border">
        {(["contacts", "paste"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="relative px-4 py-2 text-sm font-medium transition-colors"
          >
            <span
              className={
                tab === t ? "text-foreground" : "text-muted-foreground"
              }
            >
              {t === "contacts" ? "From Contacts" : "Paste numbers"}
            </span>
            {tab === t && (
              <motion.div
                layoutId="recipient-picker-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {tab === "contacts" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-6 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={contactsMode === "list"}
                onChange={() => setContactsMode("list")}
              />
              Pick a list
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={contactsMode === "tags"}
                onChange={() => setContactsMode("tags")}
              />
              Filter by tag
            </label>
          </div>

          {contactsMode === "list" ? (
            <div>
              <Label className="mb-1 block">List</Label>
              <Select
                value={listId?.toString() ?? ""}
                onValueChange={(v) => setListId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a list" />
                </SelectTrigger>
                <SelectContent>
                  {lists.length === 0 ? (
                    <p className="px-2 py-1.5 text-xs text-muted-foreground/70">
                      No lists yet.
                    </p>
                  ) : (
                    lists.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>
                        {l.name} ({l.memberCount})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label className="mb-1 block">Tags (OR semantics)</Label>
              {tagOpts.length === 0 && (
                // Previously rendered an empty div, which looked like the tag
                // feature was broken rather than unused.
                <p className="text-xs leading-relaxed text-muted-foreground/70">
                  No tags yet. Add them when creating a contact, or in the tags
                  column of a CSV import.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {tagOpts.map((t) => {
                  const active = tags.includes(t.tag);
                  return (
                    <button
                      type="button"
                      key={t.tag}
                      onClick={() =>
                        setTags(
                          active
                            ? tags.filter((x) => x !== t.tag)
                            : [...tags, t.tag]
                        )
                      }
                      className={`px-3 py-1 rounded-full border text-sm ${
                        active
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {t.tag} ({t.contactCount})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lists and tags are built on the contacts page, not here, and
              nothing on this screen said so -- a user with no lists met an
              empty dropdown and no way to know what to do about it. */}
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground/70">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {hasNoAudience
                ? "You don't have any lists or tags yet. Import contacts on the "
                : "Need another list? Import contacts on the "}
              <Link
                href="/app/whatsapp/contacts"
                // Carries the only emphasis in the line, so it still reads as a link
                // without the note competing with the controls above it.
                className="text-primary-700/80 underline underline-offset-2 hover:text-primary-700"
              >
                Contacts page
              </Link>
              {" to create one."}
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label className="mb-1 block">Mobile numbers</Label>
            <Textarea
              rows={6}
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="919876543210, 919811112222…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={dedup}
              onCheckedChange={(v) => setDedup(!!v)}
            />
            Remove duplicates
          </label>
          {pastedPhones.length > 0 && (
            <p className="text-xs text-gray-500">
              {pastedPhones.length.toLocaleString()} unique numbers detected
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
