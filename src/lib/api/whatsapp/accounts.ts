import { authenticatedApiClient } from "@/lib/axios";
import type { WabaAccountDetail, WabaAccountsResponse } from "@/lib/type";

/**
 * Every WhatsApp account the user owns, connected or not.
 *
 * Deliberately does not swallow errors into an empty list the way the other
 * WhatsApp services do: this is the one call where "the request failed" and
 * "you have no accounts" must stay distinguishable, or a user with accounts
 * is shown the first-run connect screen.
 */
export const fetchWabaAccounts = async (): Promise<WabaAccountsResponse> => {
  const res = await authenticatedApiClient().get("/whatsApp/accounts");
  return res.data.result;
};

export const fetchWabaAccountDetail = async (
  wabaId: string
): Promise<WabaAccountDetail> => {
  const res = await authenticatedApiClient().get(`/whatsApp/accounts/${wabaId}`);
  return res.data.result;
};
