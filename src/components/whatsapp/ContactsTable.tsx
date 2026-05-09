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
    <div className="flex flex-col min-h-0 flex-1">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border-y border-blue-200 px-4 py-2 text-sm">
          <span className="font-medium text-blue-900">
            {selected.size} selected
          </span>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded hover:bg-white text-blue-700">
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
              className="px-2 py-1 rounded hover:bg-white text-blue-700"
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
            className="px-2 py-1 rounded hover:bg-white text-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => onExport(ids)}
            className="px-2 py-1 rounded hover:bg-white text-blue-700 inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
      )}

      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
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
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 w-36">
                Phone
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Tags
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="p-3">
                    <div className="h-6 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  No contacts match these filters.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selected.has(c.id)}
                      onCheckedChange={(v) => toggleOne(c.id, !!v)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="text-left hover:underline"
                    >
                      {c.name || (
                        <span className="text-gray-400">—</span>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{c.phone}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {t}
                        </span>
                      ))}
                      {c.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{c.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-200">
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
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
