import { authenticatedApiClient } from "@/lib/axios";
import type { SearchResponse } from "@/lib/type";

export const globalSearch = async (
  q: string,
  wabaId: string
): Promise<SearchResponse> => {
  const res = await authenticatedApiClient().get("/whatsApp/search", {
    params: { q, wabaId },
  });
  return res.data.result;
};
