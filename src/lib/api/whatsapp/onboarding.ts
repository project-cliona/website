import { authenticatedApiClient } from "@/lib/axios";
import type { WhatsappConnectionStatus } from "@/lib/type";

export async function exchangeWhatsappCode(code: string): Promise<void> {
  await authenticatedApiClient().post("/whatsApp/onboarding/exchange-token", {
    code,
  });
}

export async function getWhatsappConnectionStatus(): Promise<WhatsappConnectionStatus> {
  const res = await authenticatedApiClient().get(
    "/whatsApp/onboarding/status"
  );
  return res.data.result as WhatsappConnectionStatus;
}

export async function disconnectWhatsapp(): Promise<void> {
  await authenticatedApiClient().delete("/whatsApp/onboarding/disconnect");
}
