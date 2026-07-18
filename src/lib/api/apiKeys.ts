import { authenticatedApiClient } from "@/lib/axios";

export type ApiKeyScope = "whatsapp";
export type ApiKeyStatus = "active" | "revoked";

/** Public shape returned by the backend — never includes the secret. */
export interface ApiKey {
  id: number;
  sid: string;
  userId: number;
  label: string | null;
  scopes: ApiKeyScope[];
  status: ApiKeyStatus;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Returned once, at creation time — the secret is never retrievable again. */
export interface CreatedApiKey {
  sid: string;
  secret: string;
  label: string | null;
  scopes: ApiKeyScope[];
  createdAt: string;
}

export interface CreateApiKeyPayload {
  label?: string;
  scopes?: ApiKeyScope[];
}

/** GET /api/v1/api-keys */
export const fetchApiKeys = async (): Promise<ApiKey[]> => {
  const res = await authenticatedApiClient().get("/api-keys");
  return res.data.result;
};

/** POST /api/v1/api-keys */
export const createApiKey = async (
  payload: CreateApiKeyPayload,
): Promise<CreatedApiKey> => {
  const res = await authenticatedApiClient().post("/api-keys", payload);
  return res.data.result;
};

/** DELETE /api/v1/api-keys/:sid */
export const revokeApiKey = async (sid: string): Promise<void> => {
  await authenticatedApiClient().delete(`/api-keys/${encodeURIComponent(sid)}`);
};
