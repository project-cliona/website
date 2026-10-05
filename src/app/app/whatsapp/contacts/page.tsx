"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  UserX,
  Tag as TagIcon,
  Plus,
  Upload,
  Download,
  X,
} from "lucide-react";
import {
  fetchContacts,
  bulkDeleteContacts,
  fetchTags,
} from "@/lib/api/whatsapp/contacts";
import {
  addContactsToList,
  removeContactsFromList,
  fetchLists,
} from "@/lib/api/whatsapp/lists";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { SegmentCard } from "@/components/ui/SegmentCard";
import { ContactsTable } from "@/components/whatsapp/ContactsTable";
import { AddContactModal } from "@/components/whatsapp/AddContactModal";
import { EditContactModal } from "@/components/whatsapp/EditContactModal";
import { CsvImportModal } from "@/components/whatsapp/CsvImportModal";
import { usePageSearch } from "@/providers/searchProvider";
import { notify } from "@/lib/toast";
import type { WhatsappContact } from "@/lib/type";

type View = { kind: "all" } | { kind: "list"; listId: number };

export default function WhatsappContactsPage() {
  const qc = useQueryClient();
  const [view, setView] = useState<View>({ kind: "all" });
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<WhatsappContact | null>(null);

  usePageSearch({
    placeholder: "Search phone, name, email",
    onChange: setQ,
  });

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["whatsapp-contacts", view, q, tagFilter],
    queryFn: () =>
      fetchContacts({
        q,
        tags: tagFilter,
        listId: view.kind === "list" ? view.listId : undefined,
      }),
  });

  const { data: allForCounts } = useQuery({
    queryKey: ["whatsapp-contacts", "counts"],
    queryFn: () => fetchContacts({ limit: 10_000 }),
    staleTime: 30_000,
  });

  const { data: lists = [] } = useQuery({
    queryKey: ["whatsapp-lists"],
    queryFn: fetchLists,
  });

  const { data: tagOpts = [] } = useQuery({
    queryKey: ["whatsapp-tags"],
    queryFn: fetchTags,
  });

  const toggleTag = (tag: string) =>
    setTagFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const totalContacts = allForCounts?.total ?? 0;

  // optInStatus has been on every contact the API returns all along; the
  // split was only ever stubbed because nothing read it.
  const { subscribed, unsubscribed, tagged } = useMemo(() => {
    const rows = allForCounts?.contacts ?? [];
    let optedOut = 0;
    let withTags = 0;
    for (const c of rows) {
      if (c.optInStatus?.toLowerCase() === "opted_out") optedOut += 1;
      if (c.tags?.length) withTags += 1;
    }
    return {
      subscribed: rows.length - optedOut,
      unsubscribed: optedOut,
      tagged: withTags,
    };
  }, [allForCounts]);

  const addToListMut = useMutation({
    mutationFn: (p: { contactIds: number[]; listId: number }) =>
      addContactsToList(p.listId, p.contactIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      notify.success("Added to list");
    },
    onError: (err) => notify.error(err, "Could not add contacts to list"),
  });

  const removeFromListMut = useMutation({
    mutationFn: (p: { contactIds: number[]; listId: number }) =>
      removeContactsFromList(p.listId, p.contactIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      notify.success("Removed from list");
    },
    onError: (err) => notify.error(err, "Could not remove contacts from list"),
  });

  const bulkDeleteMut = useMutation({
    mutationFn: bulkDeleteContacts,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      notify.success("Contacts deleted");
    },
    onError: (err) => notify.error(err, "Could not delete contacts"),
  });

  const exportCsv = (ids: number[]) => {
    const rows = contactsData?.contacts.filter((c) => ids.includes(c.id)) ?? [];
    if (rows.length === 0) {
      notify.error("No contacts selected to export");
      return;
    }
    const csv = [
      "phone,name,email,tags",
      ...rows.map((c) =>
        [c.phone, c.name ?? "", c.email ?? "", c.tags.join("|")]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify.success(`Exported ${rows.length} contact${rows.length === 1 ? "" : "s"}`);
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Audience"
        subtitle="Manage your contacts and segments"
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add Contact
            </Button>
          </>
        }
      />

      {/* Trends were hardcoded percentages next to real counts, which read
          as measured movement and was not. Dropped until something computes
          them. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Users className="h-4 w-4" />}
          label="Total Contacts"
          info="Everyone in your phonebook, shared across all accounts."
          value={totalContacts.toLocaleString()}
        />
        <StatsCard
          icon={<UserCheck className="h-4 w-4" />}
          label="Subscribed"
          info="Contacts who have not opted out; campaigns can reach them."
          value={subscribed.toLocaleString()}
        />
        <StatsCard
          icon={<UserX className="h-4 w-4" />}
          label="Unsubscribed"
          info="Contacts who opted out; campaigns skip them."
          value={unsubscribed.toLocaleString()}
        />
        <StatsCard
          icon={<TagIcon className="h-4 w-4" />}
          label="Tagged"
          info="Contacts carrying at least one tag, so they can be targeted by tag."
          value={tagged.toLocaleString()}
          accent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-lg border border-border bg-card shadow-e1">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-h3">All Contacts</h3>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
          </div>
          <ContactsTable
            contacts={contactsData?.contacts ?? []}
            loading={isLoading}
            viewingListId={view.kind === "list" ? view.listId : null}
            lists={lists}
            onEdit={setEditing}
            onAddToList={(ids, listId) =>
              addToListMut.mutate({ contactIds: ids, listId })
            }
            onRemoveFromList={(ids, listId) =>
              removeFromListMut.mutate({ contactIds: ids, listId })
            }
            onBulkDelete={(ids) => bulkDeleteMut.mutate(ids)}
            onExport={exportCsv}
          />
        </div>

        <aside className="lg:col-span-4 space-y-4">
          {/* These were four hardcoded cards -- "Active Customers", "VIP
              Members" and "Inactive Users" with invented counts. Replaced
              with the lists and tags that actually exist, which also gives
              the filters on this page something to drive them. */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-h3">Lists</h3>
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="text-sm text-primary-700 hover:underline"
              >
                Import contacts
              </button>
            </div>

            <SegmentCard
              label="All contacts"
              value={totalContacts.toLocaleString()}
              onClick={() => setView({ kind: "all" })}
              className={view.kind === "all" ? "border-primary-300 bg-primary-50/40" : undefined}
            />
            {lists.map((l) => (
              <SegmentCard
                key={l.id}
                label={l.name}
                value={l.memberCount.toLocaleString()}
                onClick={() => setView({ kind: "list", listId: l.id })}
                className={
                  view.kind === "list" && view.listId === l.id
                    ? "border-primary-300 bg-primary-50/40"
                    : undefined
                }
              />
            ))}
            {lists.length === 0 && (
              <p className="px-1 text-xs leading-relaxed text-muted-foreground/70">
                No lists yet. Import contacts to create one.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-h3">Tags</h3>
              {tagFilter.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTagFilter([])}
                  className="inline-flex items-center gap-1 text-sm text-primary-700 hover:underline"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            {tagOpts.length === 0 ? (
              <p className="px-1 text-xs leading-relaxed text-muted-foreground/70">
                No tags yet. Add them when creating a contact, or in the{" "}
                <code className="text-[11px]">tags</code> column of a CSV import.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 px-1">
                {tagOpts.map((t) => {
                  const active = tagFilter.includes(t.tag);
                  return (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => toggleTag(t.tag)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors duration-[var(--motion-fast)] focus-ring ${
                        active
                          ? "border-primary-300 bg-primary-100 text-primary-700"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      {t.tag} ({t.contactCount})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditContactModal open={!!editing} contact={editing} onClose={() => setEditing(null)} />
      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
