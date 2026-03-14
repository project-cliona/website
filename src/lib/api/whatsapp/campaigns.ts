import { authenticatedApiClient } from "@/lib/axios";

export const sendWhatsappCampaign = async (data: Record<string, unknown>) => {
  const res = await authenticatedApiClient().post("/whatsApp/campaign", data);
  return res.data.result;
};
