import { authenticatedApiClient } from "@/lib/axios";
import type { WhatsappMessagesResponse } from "@/lib/type";

export const fetchMessages = async (params?: {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<WhatsappMessagesResponse> => {
  const res = await authenticatedApiClient().get("/whatsApp/messages", { params });
  return res.data.result;
};

export const getMessageByWamid = async (wamid: string) => {
  const res = await authenticatedApiClient().get(`/whatsApp/messages/${encodeURIComponent(wamid)}`);
  return res.data.result;
};
