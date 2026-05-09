import { authenticatedApiClient } from "@/lib/axios";
import type {
  WhatsappCampaign,
  WhatsappCampaignCancelResult,
  WhatsappCampaignCreateResult,
  WhatsappCampaignListResponse,
  WhatsappCampaignMessagesResponse,
} from "@/lib/type";

export interface CreateCampaignRecipient {
  phone: string;
  variables?: string[] | Record<string, string>;
}

export type CampaignAudience =
  | { source: "list"; listId: number }
  | { source: "tags"; tags: string[] }
  | { source: "paste"; phones: string[] };

export interface CreateCampaignPayload {
  campaignName: string;
  templateName: string;
  templateLanguage: string;
  // Either explicit recipients[] (with optional per-recipient variables) or
  // an audience union the server resolves to phones from the phonebook.
  recipients?: CreateCampaignRecipient[];
  audience?: CampaignAudience;
  // Shared variables applied to every audience-resolved recipient. Ignored
  // when `recipients[]` is given (each recipient carries its own variables).
  variables?: string[] | Record<string, string>;
  components?: Record<string, unknown>[];
  scheduledAt?: string | null;
}

export interface ListCampaignsFilters {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListCampaignMessagesFilters {
  status?: string;
  page?: number;
  limit?: number;
}

function toQueryString(params: Record<string, unknown> | object): string {
  const entries = Object.entries(params as Record<string, unknown>).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const createCampaign = async (
  payload: CreateCampaignPayload
): Promise<WhatsappCampaignCreateResult> => {
  const res = await authenticatedApiClient().post("/whatsApp/campaign", payload);
  return res.data.result;
};

export const fetchCampaigns = async (
  filters: ListCampaignsFilters = {}
): Promise<WhatsappCampaignListResponse> => {
  const qs = toQueryString(filters);
  const res = await authenticatedApiClient().get(`/whatsApp/campaign${qs}`);
  return res.data.result;
};

export const fetchCampaignById = async (
  id: number | string
): Promise<WhatsappCampaign> => {
  const res = await authenticatedApiClient().get(`/whatsApp/campaign/${id}`);
  return res.data.result;
};

export const fetchCampaignMessages = async (
  id: number | string,
  filters: ListCampaignMessagesFilters = {}
): Promise<WhatsappCampaignMessagesResponse> => {
  const qs = toQueryString(filters);
  const res = await authenticatedApiClient().get(
    `/whatsApp/campaign/${id}/messages${qs}`
  );
  return res.data.result;
};

export const cancelCampaign = async (
  id: number | string
): Promise<WhatsappCampaignCancelResult> => {
  const res = await authenticatedApiClient().post(
    `/whatsApp/campaign/${id}/cancel`,
    {}
  );
  return res.data.result;
};
