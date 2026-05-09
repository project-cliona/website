"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Users } from "lucide-react";
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
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recipients</h2>
        {previewQuery.data && (
          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {previewQuery.data.matched.toLocaleString()} will receive
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-4 border-b">
        {(["contacts", "paste"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm -mb-px border-b-2 ${
              tab === t
                ? "border-blue-600 text-blue-700 font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {t === "contacts" ? "From Contacts" : "Paste numbers"}
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
                  {lists.map((l) => (
                    <SelectItem key={l.id} value={l.id.toString()}>
                      {l.name} ({l.memberCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label className="mb-1 block">Tags (OR semantics)</Label>
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
    </div>
  );
}
