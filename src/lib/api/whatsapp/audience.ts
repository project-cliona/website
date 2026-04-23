import { mockContactsStore } from "@/lib/mocks/whatsappContacts";
import { mockListsStore } from "@/lib/mocks/whatsappLists";
import type { AudienceMode, AudiencePreview } from "@/lib/type";

const simulate = <T>(fn: () => T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(fn()), 120));

export interface AudiencePreviewRequest {
  mode: AudienceMode;
  listId?: number;
  tags?: string[];
  phones?: string[];
}

export const previewAudience = (req: AudiencePreviewRequest) =>
  simulate((): AudiencePreview => {
    const all = mockContactsStore.all();

    if (req.mode === "list" && req.listId !== undefined) {
      const members = mockListsStore.membersOf(req.listId);
      const candidates = all.filter((c) => members.has(c.id));
      return {
        matched: candidates.length,
        sampleRecipients: candidates
          .slice(0, 50)
          .map((c) => ({ phone: c.phone, name: c.name })),
      };
    }

    if (req.mode === "tags" && req.tags && req.tags.length) {
      const candidates = all.filter((c) =>
        c.tags.some((t) => req.tags!.includes(t))
      );
      return {
        matched: candidates.length,
        sampleRecipients: candidates
          .slice(0, 50)
          .map((c) => ({ phone: c.phone, name: c.name })),
      };
    }

    if (req.mode === "paste" && req.phones) {
      const normalized = new Set(
        req.phones.map((p) => p.replace(/\D/g, "")).filter(Boolean)
      );
      return {
        matched: normalized.size,
        sampleRecipients: [...normalized].slice(0, 50).map((phone) => {
          const known = all.find((c) => c.phone === phone);
          return { phone, name: known?.name ?? null };
        }),
      };
    }

    return { matched: 0, sampleRecipients: [] };
  });
