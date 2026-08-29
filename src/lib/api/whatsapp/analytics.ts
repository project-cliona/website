import { authenticatedApiClient } from "@/lib/axios";
import type {
  AnalyticsFilters,
  AnalyticsFilterOptions,
  AnalyticsOverview,
} from "@/lib/type";

/** Serialise filter state into the query params the backend expects. */
export const analyticsQueryParams = (
  filters: AnalyticsFilters
): Record<string, string> => {
  const params: Record<string, string> = {
    from: filters.from.toISOString(),
    to: filters.to.toISOString(),
    granularity: filters.granularity,
  };
  if (filters.wabaIds.length) params.wabaIds = filters.wabaIds.join(",");
  if (filters.categories.length) params.categories = filters.categories.join(",");
  if (filters.compare) params.compare = "true";
  return params;
};

export const fetchAnalyticsOverview = async (
  filters: AnalyticsFilters
): Promise<AnalyticsOverview | null> => {
  try {
    const res = await authenticatedApiClient().get("/whatsApp/analytics/overview", {
      params: analyticsQueryParams(filters),
    });
    return res.data.result;
  } catch (error) {
    console.log("Error fetching analytics overview:", error);
    return null;
  }
};

export const fetchAnalyticsFilterOptions =
  async (): Promise<AnalyticsFilterOptions | null> => {
    try {
      const res = await authenticatedApiClient().get("/whatsApp/analytics/filters");
      return res.data.result;
    } catch (error) {
      console.log("Error fetching analytics filter options:", error);
      return null;
    }
  };
