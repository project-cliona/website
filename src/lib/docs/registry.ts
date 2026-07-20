// Internal documentation registry (admin-only).
//
// This powers the /app/admin/documentation hub. Each entry is one self-contained doc.
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
  // ── Architecture ──────────────────────────────────────────────────────────
  {
    slug: "meta-whatsapp-saas-foundation",
    title: "Meta WhatsApp SaaS Foundation",
    description:
      "The core Meta concepts for a multi-tenant WhatsApp SaaS: developer account, Business Manager, Meta App, WhatsApp product, Embedded Signup, the three access-token stages, onboarding flow, and per-tenant asset ownership.",
    category: "Architecture",
    updatedAt: "2026-07-20",
  },
  {
    slug: "meta-ecosystem",
    title: "Meta Ecosystem",
    description:
      "The Meta platform hierarchy for a multi-tenant WhatsApp SaaS — developer account, Business Manager, Meta App, WABAs, phone numbers, system users, tokens, and onboarding.",
    category: "Architecture",
    updatedAt: "2026-07-20",
  },
  // ── Integrations ──────────────────────────────────────────────────────────
  {
    slug: "authentication-and-access-tokens",
    title: "Authentication & Access Tokens",
    description:
      "Every access token in a WhatsApp SaaS — who issues it, who owns it, when it's used, and how your backend authenticates with Meta.",
    category: "Integrations",
    updatedAt: "2026-07-20",
  },
  {
    slug: "embedded-signup",
    title: "Embedded Signup",
    description:
      "How Meta's Embedded Signup lets a customer connect their WhatsApp Business Account to your SaaS — the OAuth flow, asset ownership, and what the backend stores.",
    category: "Integrations",
    updatedAt: "2026-07-20",
  },
  {
    slug: "customer-onboarding-flow",
    title: "Customer Onboarding Flow",
    description:
      "How a multi-tenant WhatsApp SaaS takes a customer from signup through Embedded Signup and provisioning to their first sent message.",
    category: "Integrations",
    updatedAt: "2026-07-20",
  },
  {
    slug: "whatsapp-integration",
    title: "WhatsApp Integration",
    description:
      "How WhatsApp plugs into the platform: credentials & identifiers, account connection, authentication, and Meta's permissions & compliance.",
    category: "Integrations",
    updatedAt: "2026-06-30",
  },
  // ── Operations ────────────────────────────────────────────────────────────
  {
    slug: "billing-and-pricing",
    title: "Billing & Pricing",
    description:
      "How to monetize a multi-tenant WhatsApp SaaS — costs, revenue models, pricing strategies, usage tracking, and a scalable billing architecture.",
    category: "Operations",
    updatedAt: "2026-07-20",
  },
];

/** Lazy loaders for each doc's HTML, keyed by slug (code-split per doc). */
export const docLoaders: Record<string, () => Promise<string>> = {
  "meta-whatsapp-saas-foundation": () =>
    import("./content/meta-whatsapp-saas-foundation").then((m) => m.html),
  "meta-ecosystem": () => import("./content/meta-ecosystem").then((m) => m.html),
  "authentication-and-access-tokens": () =>
    import("./content/authentication-and-access-tokens").then((m) => m.html),
  "embedded-signup": () => import("./content/embedded-signup").then((m) => m.html),
  "customer-onboarding-flow": () =>
    import("./content/customer-onboarding-flow").then((m) => m.html),
  "whatsapp-integration": () =>
    import("./content/whatsapp-integration").then((m) => m.html),
  "billing-and-pricing": () =>
    import("./content/billing-and-pricing").then((m) => m.html),
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
