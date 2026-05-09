"use client";

import { Users, Plus } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchLists,
  createList,
  updateList,
  deleteList,
} from "@/lib/api/whatsapp/lists";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ListMenu } from "./ListMenu";

type SelectedView =
  | { kind: "all" }
  | { kind: "list"; listId: number };

interface Props {
  selected: SelectedView;
  onSelect: (view: SelectedView) => void;
  totalContacts: number;
}

export function ContactsSidebar({
  selected,
  onSelect,
  totalContacts,
}: Props) {
  const qc = useQueryClient();
  const { data: lists = [] } = useQuery({
    queryKey: ["whatsapp-lists"],
    queryFn: fetchLists,
  });

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState("");

  const createMut = useMutation({
    mutationFn: (name: string) => createList(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      setCreating(false);
      setCreateName("");
    },
  });

  const renameMut = useMutation({
    mutationFn: (p: { id: number; name: string }) =>
      updateList(p.id, { name: p.name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      setRenamingId(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteList(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp-lists"] }),
  });

  const isSel = (v: SelectedView) =>
    selected.kind === v.kind &&
    (v.kind !== "list" ||
      (selected.kind === "list" && selected.listId === v.listId));

  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Contacts</h2>
          <button
            onClick={() => setCreating(true)}
            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> New list
          </button>
        </div>

        <button
          onClick={() => onSelect({ kind: "all" })}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left",
            isSel({ kind: "all" })
              ? "bg-blue-100 text-blue-700 font-medium"
              : "hover:bg-gray-100"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Users className="w-4 h-4" /> All contacts
          </span>
          <span className="text-xs text-gray-500">{totalContacts}</span>
        </button>

        <div className="mt-6 mb-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          My lists
        </div>

        {creating && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (createName.trim()) createMut.mutate(createName.trim());
            }}
            className="px-3 py-2"
          >
            <input
              autoFocus
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onBlur={() => {
                if (!createName.trim()) setCreating(false);
              }}
              placeholder="List name"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </form>
        )}

        {lists.map((l) => (
          <div key={l.id} className="group relative">
            {renamingId === l.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newName.trim())
                    renameMut.mutate({ id: l.id, name: newName.trim() });
                }}
                className="px-3 py-2"
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setRenamingId(null)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </form>
            ) : (
              <button
                onClick={() => onSelect({ kind: "list", listId: l.id })}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left pr-9",
                  isSel({ kind: "list", listId: l.id })
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="truncate">{l.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {l.memberCount}
                </span>
              </button>
            )}
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <ListMenu
                onRename={() => {
                  setRenamingId(l.id);
                  setNewName(l.name);
                }}
                onDelete={() => {
                  if (
                    confirm(
                      `Delete list "${l.name}"? Contacts will not be removed.`
                    )
                  ) {
                    deleteMut.mutate(l.id);
                    if (isSel({ kind: "list", listId: l.id }))
                      onSelect({ kind: "all" });
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
