import type { WhatsappContactList } from "@/lib/type";

let idSeq = 100;
const nextId = () => ++idSeq;
const nowIso = () => new Date().toISOString();

const lists: WhatsappContactList[] = [
  {
    id: nextId(),
    userId: 1,
    name: "Nov 2026 leads",
    description: null,
    memberCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nextId(),
    userId: 1,
    name: "VIPs",
    description: "Hand-picked top customers",
    memberCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nextId(),
    userId: 1,
    name: "Event attendees — Mumbai",
    description: null,
    memberCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const memberships = new Map<number, Set<number>>();

export const mockListsStore = {
  all: (): WhatsappContactList[] =>
    lists.map((l) => ({
      ...l,
      memberCount: memberships.get(l.id)?.size ?? 0,
    })),

  findById: (id: number) => lists.find((l) => l.id === id) ?? null,

  create: (name: string, description: string | null) => {
    if (lists.some((l) => l.name === name)) {
      throw new Error("List name already exists");
    }
    const l: WhatsappContactList = {
      id: nextId(),
      userId: 1,
      name,
      description,
      memberCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    lists.unshift(l);
    memberships.set(l.id, new Set());
    return l;
  },

  update: (
    id: number,
    patch: Partial<Pick<WhatsappContactList, "name" | "description">>
  ) => {
    const l = lists.find((x) => x.id === id);
    if (!l) throw new Error("Not found");
    if (
      patch.name &&
      patch.name !== l.name &&
      lists.some((x) => x.name === patch.name)
    ) {
      throw new Error("List name already exists");
    }
    Object.assign(l, patch, { updatedAt: nowIso() });
    return l;
  },

  delete: (id: number) => {
    const idx = lists.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    lists.splice(idx, 1);
    memberships.delete(id);
    return true;
  },

  addMembers: (listId: number, contactIds: number[]) => {
    const set = memberships.get(listId) ?? new Set<number>();
    let added = 0;
    for (const cid of contactIds) {
      if (!set.has(cid)) {
        set.add(cid);
        added++;
      }
    }
    memberships.set(listId, set);
    return { added, alreadyInList: contactIds.length - added };
  },

  removeMembers: (listId: number, contactIds: number[]) => {
    const set = memberships.get(listId);
    if (!set) return { removed: 0 };
    let removed = 0;
    for (const cid of contactIds) if (set.delete(cid)) removed++;
    return { removed };
  },

  membersOf: (listId: number): Set<number> =>
    memberships.get(listId) ?? new Set(),
};
