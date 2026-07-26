import { authenticatedApiClient } from "@/lib/axios";
import { WhatsappTemplate } from "@/lib/type";

/** Meta template statuses we treat as send-eligible (case-variants Meta returns). */
export const APPROVED_TEMPLATE_STATUSES = new Set(["APPROVED", "approved", "active", "ACTIVE"]);

export const isApprovedTemplateStatus = (status: string | null | undefined): boolean =>
  !!status && APPROVED_TEMPLATE_STATUSES.has(status);

export const fetchWhatsappTemplates = async (userId: number): Promise<WhatsappTemplate[]> => {
  try {
    const res = await authenticatedApiClient().get(`/whatsApp/template?userId=${userId}`);
    return res.data.result;
  } catch (error) {
    console.log("Error fetching WhatsApp templates:", error);
    return [];
  }
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

/** Only templates that can actually be sent — used by the Flow Builder template node. */
export const fetchApprovedWhatsappTemplates = async (userId: number): Promise<WhatsappTemplate[]> => {
  const templates = await fetchWhatsappTemplates(userId);
  return templates.filter((t) => isApprovedTemplateStatus(t.status));
};
