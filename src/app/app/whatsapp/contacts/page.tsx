"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchContacts,
  fetchTags,
  bulkDeleteContacts,
} from "@/lib/api/whatsapp/contacts";
import {
  addContactsToList,
  removeContactsFromList,
  fetchLists,
} from "@/lib/api/whatsapp/lists";
import { PageHeading } from "@/components/ui/PageHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Plus, Upload, Search } from "lucide-react";
import { ContactsSidebar } from "@/components/whatsapp/ContactsSidebar";
import { ContactsTable } from "@/components/whatsapp/ContactsTable";
import { AddContactModal } from "@/components/whatsapp/AddContactModal";
import { EditContactModal } from "@/components/whatsapp/EditContactModal";
import { CsvImportModal } from "@/components/whatsapp/CsvImportModal";
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

  const { data: tags = [] } = useQuery({
    queryKey: ["whatsapp-tags"],
    queryFn: fetchTags,
  });

  const { data: lists = [] } = useQuery({
    queryKey: ["whatsapp-lists"],
    queryFn: fetchLists,
  });

  const totalContacts = allForCounts?.total ?? 0;

  const addToListMut = useMutation({
    mutationFn: (p: { contactIds: number[]; listId: number }) =>
      addContactsToList(p.listId, p.contactIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
    },
  });

  const removeFromListMut = useMutation({
    mutationFn: (p: { contactIds: number[]; listId: number }) =>
      removeContactsFromList(p.listId, p.contactIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
    },
  });

  const bulkDeleteMut = useMutation({
    mutationFn: bulkDeleteContacts,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] }),
  });

  const exportCsv = (ids: number[]) => {
    const rows = contactsData?.contacts.filter((c) => ids.includes(c.id)) ?? [];
    const csv = [
      "phone,name,email,tags",
      ...rows.map((c) =>
        [c.phone, c.name ?? "", c.email ?? "", c.tags.join("|")]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ContactsSidebar
        selected={view}
        onSelect={setView}
        totalContacts={totalContacts}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b">
          <PageHeading
            title="Contacts"
            subtitle="Manage your WhatsApp recipients and lists"
          />
        </div>

        <div className="px-6 py-3 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search phone, name, email"
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <Select
            value={tagFilter[0] ?? "all"}
            onValueChange={(v) => setTagFilter(v === "all" ? [] : [v])}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tags: all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tags: all</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.tag} value={t.tag}>
                  {t.tag} ({t.contactCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="w-4 h-4 mr-1" /> Import CSV
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add contact
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

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditContactModal
        open={!!editing}
        contact={editing}
        onClose={() => setEditing(null)}
      />
      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
