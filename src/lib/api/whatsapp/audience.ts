import { authenticatedApiClient } from "@/lib/axios";
import type { AudienceMode, AudiencePreview } from "@/lib/type";

export interface AudiencePreviewRequest {
  mode: AudienceMode;
  listId?: number;
  tags?: string[];
  phones?: string[];
}

// Map the picker's `mode` field to the backend's discriminator `source`.
function toBackendBody(req: AudiencePreviewRequest): Record<string, unknown> | null {
  if (req.mode === "list" && req.listId !== undefined) {
    return { source: "list", listId: req.listId };
  }
  if (req.mode === "tags" && req.tags && req.tags.length > 0) {
    return { source: "tags", tags: req.tags };
  }
  if (req.mode === "paste" && req.phones && req.phones.length > 0) {
    return { source: "paste", phones: req.phones };
  }
  return null;
}

export const previewAudience = async (
  req: AudiencePreviewRequest
): Promise<AudiencePreview> => {
  const body = toBackendBody(req);
  if (!body) return { matched: 0, sampleRecipients: [] };

  const res = await authenticatedApiClient().post(
    "/whatsApp/audience/preview",
    body
  );
  return res.data.result;
};

// Helper used by the campaign create payload — converts the picker state into
// the audience union the backend's createCampaign endpoint expects.
export function toCampaignAudience(req: AudiencePreviewRequest):
  | { source: "list"; listId: number }
  | { source: "tags"; tags: string[] }
  | { source: "paste"; phones: string[] }
  | null {
  return toBackendBody(req) as
    | { source: "list"; listId: number }
    | { source: "tags"; tags: string[] }
    | { source: "paste"; phones: string[] }
    | null;
}
