import { authenticatedApiClient } from "@/lib/axios";
import type {
  WhatsappContact,
  WhatsappContactTag,
  CsvImportResult,
} from "@/lib/type";

export interface FetchContactsParams {
  q?: string;
  tags?: string[];
  listId?: number;
  page?: number;
  limit?: number;
}

export interface FetchContactsResult {
  contacts: WhatsappContact[];
  total: number;
  page: number;
  limit: number;
}

function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    new URLSearchParams(
      entries.map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)])
    ).toString()
  );
}

export const fetchContacts = async (
  params: FetchContactsParams = {}
): Promise<FetchContactsResult> => {
  const qs = toQueryString({
    q: params.q,
    tags: params.tags,
    listId: params.listId,
    page: params.page,
    limit: params.limit,
  });
  const res = await authenticatedApiClient().get(`/whatsApp/contacts${qs}`);
  return res.data.result;
};

export const createContact = async (input: {
  phone: string;
  name?: string | null;
  email?: string | null;
  tags?: string[];
}): Promise<WhatsappContact> => {
  const res = await authenticatedApiClient().post("/whatsApp/contacts", {
    phone: input.phone,
    name: input.name ?? null,
    email: input.email ?? null,
    tags: input.tags ?? [],
  });
  return res.data.result;
};

export const updateContact = async (
  id: number,
  patch: Partial<Pick<WhatsappContact, "phone" | "name" | "email" | "tags">>
): Promise<WhatsappContact> => {
  const res = await authenticatedApiClient().put(`/whatsApp/contacts/${id}`, patch);
  return res.data.result;
};

export const deleteContact = async (id: number): Promise<boolean> => {
  await authenticatedApiClient().delete(`/whatsApp/contacts/${id}`);
  return true;
};

export const bulkDeleteContacts = async (
  contactIds: number[]
): Promise<{ deleted: number }> => {
  const res = await authenticatedApiClient().post(
    "/whatsApp/contacts/bulk/delete",
    { contactIds }
  );
  return res.data.result;
};

export const importContactsCsv = async (
  file: File,
  opts: { saveAsList?: string | null }
): Promise<CsvImportResult> => {
  const form = new FormData();
  form.append("file", file);
  if (opts.saveAsList) form.append("saveAsList", opts.saveAsList);

  const res = await authenticatedApiClient().post(
    "/whatsApp/contacts/import",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.result;
};

export const fetchTags = async (): Promise<WhatsappContactTag[]> => {
  const res = await authenticatedApiClient().get("/whatsApp/tags");
  return res.data.result;
};
