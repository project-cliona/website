export const ANALYTICS_TABS = [
  {
    id: "overview",
    label: "Overview",
    source: "local",
  },
  {
    id: "messaging",
    label: "Messaging",
    source: "local",
  },
  {
    id: "conversations",
    label: "Conversations & Cost",
    source: "meta",
  },
  {
    id: "pricing",
    label: "Pricing & Tiers",
    source: "meta",
  },
  {
    id: "templates",
    label: "Templates",
    source: "meta",
  },
] as const;

export type AnalyticsTabId = (typeof ANALYTICS_TABS)[number]["id"];

export const isAnalyticsTab = (value: string): value is AnalyticsTabId =>
  ANALYTICS_TABS.some((t) => t.id === value);

/**
 * Which filters each tab actually honours. A filter that doesn't apply is
 * removed from the bar rather than greyed out — a disabled control still reads
 * as "this could work", which is worse than not offering it.
 */
export const TAB_FILTERS: Record<
  AnalyticsTabId,
  { account: boolean; category: boolean; compare: boolean }
> = {
  overview: { account: true, category: true, compare: true },
  messaging: { account: true, category: true, compare: false },
  conversations: { account: true, category: true, compare: true },
  pricing: { account: true, category: true, compare: false },
  templates: { account: true, category: false, compare: false },
};

/** Meta caps template analytics at 90 days; everything else at 12 months. */
export const MAX_RANGE_DAYS: Record<AnalyticsTabId, number> = {
  overview: 365,
  messaging: 365,
  conversations: 365,
  pricing: 365,
  templates: 90,
};
