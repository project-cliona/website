import { authenticatedApiClient } from "@/lib/axios";
import type { WhatsappContactList } from "@/lib/type";

export const fetchLists = async (): Promise<WhatsappContactList[]> => {
  const res = await authenticatedApiClient().get("/whatsApp/lists");
  return res.data.result;
};

export const createList = async (
  name: string,
  description?: string | null
): Promise<WhatsappContactList> => {
  const res = await authenticatedApiClient().post("/whatsApp/lists", {
    name,
    description: description ?? null,
  });
  return res.data.result;
};

export const updateList = async (
  id: number,
  patch: { name?: string; description?: string | null }
): Promise<WhatsappContactList> => {
  const res = await authenticatedApiClient().put(`/whatsApp/lists/${id}`, patch);
  return res.data.result;
};

export const deleteList = async (id: number): Promise<boolean> => {
  await authenticatedApiClient().delete(`/whatsApp/lists/${id}`);
  return true;
};

export const addContactsToList = async (
  listId: number,
  contactIds: number[]
): Promise<{ added: number; alreadyInList: number; skippedInvalid?: number }> => {
  const res = await authenticatedApiClient().post(
    "/whatsApp/contacts/bulk/add-to-list",
    { listId, contactIds }
  );
  return res.data.result;
};

export const removeContactsFromList = async (
  listId: number,
  contactIds: number[]
): Promise<{ removed: number }> => {
  const res = await authenticatedApiClient().post(
    "/whatsApp/contacts/bulk/remove-from-list",
    { listId, contactIds }
  );
  return res.data.result;
};
