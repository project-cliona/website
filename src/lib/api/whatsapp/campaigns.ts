import { authenticatedApiClient } from "@/lib/axios";

export const sendWhatsappCampaign = async (data: any) => {
  const res = await authenticatedApiClient().post("/whatsApp/campaign", data);
  return res.data.result;
};
