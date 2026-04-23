import { mockContactsStore } from "@/lib/mocks/whatsappContacts";
import { mockListsStore } from "@/lib/mocks/whatsappLists";
import type {
  WhatsappContact,
  WhatsappContactTag,
  CsvImportResult,
} from "@/lib/type";

// Phase 1 implementation: mock-backed. Phase 3 swaps each body for an
// authenticatedApiClient() call. Keep functions async so callers treat
// them like real network calls.

const simulate = <T>(fn: () => T): Promise<T> =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, 80)
  );

export interface FetchContactsParams {
  q?: string;
  tags?: string[];
  listId?: number;
  page?: number;
  limit?: number;
}

export const fetchContacts = (params: FetchContactsParams = {}) =>
  simulate(() => {
    const { q, tags, listId, page = 1, limit = 50 } = params;
    let rows = mockContactsStore.all();

    if (listId !== undefined) {
      const members = mockListsStore.membersOf(listId);
      rows = rows.filter((c) => members.has(c.id));
    }
    if (tags && tags.length > 0) {
      rows = rows.filter((c) => c.tags.some((t) => tags.includes(t)));
    }
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.phone.includes(needle) ||
          (c.name ?? "").toLowerCase().includes(needle) ||
          (c.email ?? "").toLowerCase().includes(needle)
      );
    }

    const total = rows.length;
    const start = (page - 1) * limit;
    return {
      contacts: rows.slice(start, start + limit),
      total,
      page,
    };
  });

export const createContact = (input: {
  phone: string;
  name?: string | null;
  email?: string | null;
  tags?: string[];
}) =>
  simulate(() =>
    mockContactsStore.create({
      phone: input.phone,
      name: input.name ?? null,
      email: input.email ?? null,
      tags: input.tags ?? [],
    })
  );

export const updateContact = (id: number, patch: Partial<WhatsappContact>) =>
  simulate(() => mockContactsStore.update(id, patch));

export const deleteContact = (id: number) =>
  simulate(() => mockContactsStore.delete(id));

export const bulkDeleteContacts = (contactIds: number[]) =>
  simulate(() => ({ deleted: mockContactsStore.bulkDelete(contactIds) }));

export const importContactsCsv = async (
  file: File,
  opts: { saveAsList?: string | null }
): Promise<CsvImportResult> => {
  const text = await file.text();
  const result = mockContactsStore.importCsv(text);
  if (opts.saveAsList) {
    const list = mockListsStore.create(opts.saveAsList, null);
    const newIds = mockContactsStore
      .all()
      .slice(0, result.added)
      .map((c) => c.id);
    mockListsStore.addMembers(list.id, newIds);
    return { ...result, listId: list.id };
  }
  return result;
};

export const fetchTags = () =>
  simulate((): WhatsappContactTag[] => mockContactsStore.tags());
