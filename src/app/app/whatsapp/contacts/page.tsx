"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  Upload,
  Download,
} from "lucide-react";
import {
  fetchContacts,
  bulkDeleteContacts,
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
  const [view] = useState<View>({ kind: "all" });
  const [q, setQ] = useState("");
  const [tagFilter] = useState<string[]>([]);
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

  const totalContacts = allForCounts?.total ?? 0;
  // Stub: backend doesn't yet return subscribe/unsubscribe split.
  const subscribed = totalContacts;
  const unsubscribed = 0;
  const engagementRate = "68.5%";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Users className="h-4 w-4" />}
          label="Total Contacts"
          value={totalContacts.toLocaleString()}
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<UserCheck className="h-4 w-4" />}
          label="Subscribed"
          value={subscribed.toLocaleString()}
          trend={{ value: "+23%", positive: true }}
        />
        <StatsCard
          icon={<UserX className="h-4 w-4" />}
          label="Unsubscribed"
          value={unsubscribed.toLocaleString()}
          trend={{ value: "-5%", positive: false }}
        />
        <StatsCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Engagement Rate"
          value={engagementRate}
          trend={{ value: "+5.2%", positive: true }}
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

        <aside className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-h3">Segments</h3>
            <button className="text-sm text-primary-700 hover:underline" type="button">
              Create New
            </button>
          </div>
          <SegmentCard
            label="All Subscribers"
            value={totalContacts.toLocaleString()}
            trend={{ value: "+12%", positive: true }}
          />
          <SegmentCard
            label="Active Customers"
            value="2,450"
            trend={{ value: "+8%", positive: true }}
          />
          <SegmentCard
            label="VIP Members"
            value="890"
            trend={{ value: "+15%", positive: true }}
          />
          <SegmentCard
            label="Inactive Users"
            value="1,234"
            trend={{ value: "-5%", positive: false }}
          />
        </aside>
      </div>

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditContactModal open={!!editing} contact={editing} onClose={() => setEditing(null)} />
      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
