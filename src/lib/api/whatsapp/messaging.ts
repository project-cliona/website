import { authenticatedApiClient } from "@/lib/axios";
import type { WhatsappSendTemplatePayload, WhatsappSendTextPayload } from "@/lib/type";

export const sendTemplateMessage = async (data: WhatsappSendTemplatePayload) => {
  const res = await authenticatedApiClient().post("/whatsApp/message/template", data);
  return res.data.result;
};

export const sendTextMessage = async (data: WhatsappSendTextPayload) => {
  const res = await authenticatedApiClient().post("/whatsApp/message/text", data);
  return res.data.result;
};
