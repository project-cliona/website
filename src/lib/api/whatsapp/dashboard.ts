import { authenticatedApiClient } from "@/lib/axios";
import { WhatsappDeliveryReportResponse } from "@/lib/type";

export const fetchWhatsappDashboard = async (wabaId: string) => {
  try {
    const res = await authenticatedApiClient().get(
      `/whatsApp/dashboard?wabaId=${encodeURIComponent(wabaId)}`
    );
    return res.data.result;
  } catch (error) {
    console.log("Error fetching WhatsApp dashboard:", error);
    return null;
  }
};

export const fetchWhatsappDeliveryReport = async (): Promise<WhatsappDeliveryReportResponse | null> => {
  try {
    const res = await authenticatedApiClient().get("/whatsApp/deliveryReport");
    return res.data.result;
  } catch (error) {
    console.log("Error fetching WhatsApp delivery report:", error);
    return null;
  }
};
