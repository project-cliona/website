// Internal documentation registry (admin-only).
//
// This powers the /app/documentation hub. Each entry is one self-contained doc.
//
// ─── To add a new doc ──────────────────────────────────────────────────────
//   1. Create  src/lib/docs/content/<slug>.ts  exporting a full, self-contained
//      HTML document string:  export const html = `<!doctype html>...`;
//   2. Add one entry to the `docs` array below (slug must match the file name).
//   3. Register its loader in `docLoaders` so the detail page can fetch it.
// The content is dynamically imported, so each doc is code-split and only
// downloaded when an admin actually opens it.

export const DOC_CATEGORIES = ["Architecture", "Integrations", "Operations"] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export interface DocMeta {
  /** URL-safe id; must match the content file name in ./content. */
  slug: string;
  title: string;
  /** One-line summary shown on the index card. */
  description: string;
  category: DocCategory;
  /** ISO date (YYYY-MM-DD) the doc was last updated. */
  updatedAt: string;
}

export const docs: DocMeta[] = [
  {
    slug: "whatsapp-integration",
    title: "WhatsApp Integration",
    description:
      "How WhatsApp plugs into the platform: credentials & identifiers, account connection, authentication, and Meta's permissions & compliance.",
    category: "Integrations",
    updatedAt: "2026-06-30",
  },
];

/** Lazy loaders for each doc's HTML, keyed by slug (code-split per doc). */
export const docLoaders: Record<string, () => Promise<string>> = {
  "whatsapp-integration": () =>
    import("./content/whatsapp-integration").then((m) => m.html),
};

export function getDocMeta(slug: string): DocMeta | null {
  return docs.find((d) => d.slug === slug) ?? null;
}

/** Returns the HTML for a doc, or null if the slug is unknown. */
export async function loadDocHtml(slug: string): Promise<string | null> {
  const loader = docLoaders[slug];
  if (!loader) return null;
  return loader();
}

/** Docs grouped by category, preserving DOC_CATEGORIES order; empties dropped. */
export function docsByCategory(): { category: DocCategory; items: DocMeta[] }[] {
  return DOC_CATEGORIES.map((category) => ({
    category,
    items: docs.filter((d) => d.category === category),
  })).filter((group) => group.items.length > 0);
}
