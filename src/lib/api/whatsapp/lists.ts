import { mockListsStore } from "@/lib/mocks/whatsappLists";
import type { WhatsappContactList } from "@/lib/type";

const simulate = <T>(fn: () => T): Promise<T> =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, 60)
  );

export const fetchLists = () =>
  simulate((): WhatsappContactList[] => mockListsStore.all());

export const createList = (name: string, description?: string | null) =>
  simulate(() => mockListsStore.create(name, description ?? null));

export const updateList = (
  id: number,
  patch: { name?: string; description?: string | null }
) => simulate(() => mockListsStore.update(id, patch));

export const deleteList = (id: number) =>
  simulate(() => mockListsStore.delete(id));

export const addContactsToList = (listId: number, contactIds: number[]) =>
  simulate(() => mockListsStore.addMembers(listId, contactIds));

export const removeContactsFromList = (listId: number, contactIds: number[]) =>
  simulate(() => mockListsStore.removeMembers(listId, contactIds));
