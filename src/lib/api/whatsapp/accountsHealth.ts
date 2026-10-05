import { authenticatedApiClient } from "@/lib/axios";
import type {
  AccountsHealthOverview,
  AccountHealthDetail,
} from "@/lib/type";

/** Fleet-wide account health. Admin-only server-side; returns null on 403. */
export const fetchAccountsHealth = async (): Promise<AccountsHealthOverview | null> => {
  try {
    const res = await authenticatedApiClient().get("/whatsApp/accounts-health");
    return res.data.result;
  } catch (error) {
    console.log("Error fetching accounts health:", error);
    return null;
  }
};

export const fetchAccountHealthDetail = async (
  wabaId: string
): Promise<AccountHealthDetail | null> => {
  try {
    const res = await authenticatedApiClient().get(
      `/whatsApp/accounts-health/${wabaId}`
    );
    return res.data.result;
  } catch (error) {
    console.log("Error fetching account health detail:", error);
    return null;
  }
};
