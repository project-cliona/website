"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Minus,
  Trash2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableSubject,
  TableActions,
} from "@/components/ui/table";
import { StatusPill } from "@/components/ui/StatusPill";
import type { WhatsappContact, WhatsappContactList } from "@/lib/type";

interface Props {
  contacts: WhatsappContact[];
  loading: boolean;
  viewingListId: number | null;
  lists: WhatsappContactList[];
  onEdit: (c: WhatsappContact) => void;
  onAddToList: (contactIds: number[], listId: number) => void;
  onRemoveFromList: (contactIds: number[], listId: number) => void;
  onBulkDelete: (contactIds: number[]) => void;
  onExport: (contactIds: number[]) => void;
}

function getInitial(c: WhatsappContact): string {
  const source = c.name?.trim() || c.email?.trim() || c.phone;
  return (source?.[0] ?? "?").toUpperCase();
}

export function ContactsTable({
  contacts,
  loading,
  viewingListId,
  lists,
  onEdit,
  onAddToList,
  onRemoveFromList,
  onBulkDelete,
  onExport,
}: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const allSelected = contacts.length > 0 && selected.size === contacts.length;
  const someSelected = selected.size > 0 && selected.size < contacts.length;

  const toggleOne = (id: number, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(contacts.map((c) => c.id)) : new Set());

  const clear = () => setSelected(new Set());
  const ids = [...selected];

  return (
    <div className="flex flex-col">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-primary-50 border-y border-primary-100 px-4 py-2 text-sm">
          <span className="font-medium text-primary-800">
            {selected.size} selected
          </span>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded hover:bg-card text-primary-700">
              Add to list ▾
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {lists.length === 0 ? (
                <DropdownMenuItem disabled>No lists yet</DropdownMenuItem>
              ) : (
                lists.map((l) => (
                  <DropdownMenuItem
                    key={l.id}
                    onClick={() => {
                      onAddToList(ids, l.id);
                      clear();
                    }}
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {viewingListId !== null && (
            <button
              onClick={() => {
                onRemoveFromList(ids, viewingListId);
                clear();
              }}
              className="px-2 py-1 rounded hover:bg-card text-primary-700"
            >
              Remove from list
            </button>
          )}
          <button
            onClick={() => {
              const msg =
                selected.size > 50
                  ? `Type DELETE to confirm deleting ${selected.size} contacts.`
                  : `Delete ${selected.size} contact${
                      selected.size === 1 ? "" : "s"
                    }?`;
              const ok =
                selected.size > 50 ? prompt(msg) === "DELETE" : confirm(msg);
              if (ok) {
                onBulkDelete(ids);
                clear();
              }
            }}
            className="px-2 py-1 rounded hover:bg-card text-destructive"
          >
            Delete
          </button>
          <button
            onClick={() => onExport(ids)}
            className="px-2 py-1 rounded hover:bg-card text-primary-700 inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={
                  allSelected
                    ? true
                    : someSelected
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={(v) => toggleAll(!!v)}
              />
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-10 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableLoading rows={6} columns={5} />
          ) : contacts.length === 0 ? (
            <TableEmpty colSpan={5}>
              <p className="text-sm text-muted-foreground">
                No contacts match these filters.
              </p>
            </TableEmpty>
          ) : (
            contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(c.id)}
                    onCheckedChange={(v) => toggleOne(c.id, !!v)}
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onEdit(c)}
                    className="text-left focus-ring rounded-md"
                  >
                    <TableSubject
                      avatar={
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                          {getInitial(c)}
                        </div>
                      }
                      primary={c.name || c.phone}
                      secondary={c.name ? c.phone : c.email ?? undefined}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <StatusPill status="subscribed">Subscribed</StatusPill>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                      >
                        {t}
                      </span>
                    ))}
                    {c.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{c.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <TableActions>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary focus-ring"
                        aria-label="Row actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {viewingListId !== null && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                onRemoveFromList([c.id], viewingListId)
                              }
                            >
                              <Minus className="w-4 h-4 mr-2" /> Remove from list
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm(`Delete ${c.phone}?`))
                              onBulkDelete([c.id]);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableActions>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
