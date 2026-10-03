import { authenticatedApiClient } from "@/lib/axios";
import { WhatsappTemplate } from "@/lib/type";

/**
 * Templates belonging to one account.
 *
 * Scoped by wabaId, not userId: the old form merged templates from every
 * account a user owned, so the picker could offer one the sending account
 * did not have and Meta rejected the send with 132001.
 *
 * Errors are no longer swallowed into an empty list -- that turned "you
 * cannot see this account" into a convincing "this account has no
 * templates".
 */
export const fetchWhatsappTemplates = async (
  wabaId: string
): Promise<WhatsappTemplate[]> => {
  const res = await authenticatedApiClient().get(
    `/whatsApp/template?wabaId=${encodeURIComponent(wabaId)}`
  );
  return res.data.result ?? [];
};

export const getWhatsappTemplateById = async (id: string) => {
  try {
    const res = await authenticatedApiClient().get(`/whatsApp/template?id=${id}`);
    return res.data.result;
  } catch (error) {
    console.log("Error fetching WhatsApp template:", error);
    return null;
  }
};

export const updateWhatsappTemplate = async (id: number, data: Record<string, unknown>) => {
  const res = await authenticatedApiClient().put(`/whatsApp/template/${id}`, data);
  return res.data.result;
};
