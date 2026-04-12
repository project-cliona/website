import { authenticatedApiClient } from "@/lib/axios";
import { WhatsappTemplate } from "@/lib/type";

export const fetchWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  try {
    const res = await authenticatedApiClient().get("/whatsApp/templates");
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
