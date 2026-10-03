/**
 * Query keys for WhatsApp data.
 *
 * Every key carries the account it belongs to. Without that, switching
 * accounts serves the previous account's cached data under the new
 * account's name -- which looks like it is working.
 *
 * wabaId sits second so the whole namespace, or one account's slice of it,
 * can be addressed in one call.
 */
export const wabaKeys = {
  /** Not account-scoped: this is the list of accounts itself. */
  accounts: () => ["whatsapp", "accounts"] as const,
  accountDetail: (wabaId: string) =>
    ["whatsapp", "accounts", "detail", wabaId] as const,

  all: (wabaId: string) => ["whatsapp", wabaId] as const,

  templates: (wabaId: string) => ["whatsapp", wabaId, "templates"] as const,
  template: (wabaId: string, id: string | number) =>
    ["whatsapp", wabaId, "template", String(id)] as const,

  campaigns: (wabaId: string, filters?: unknown) =>
    ["whatsapp", wabaId, "campaigns", filters ?? null] as const,
  campaign: (wabaId: string, id: string | number) =>
    ["whatsapp", wabaId, "campaign", String(id)] as const,
  campaignMessages: (wabaId: string, id: string | number, filters?: unknown) =>
    ["whatsapp", wabaId, "campaign", String(id), "messages", filters ?? null] as const,

  conversations: (wabaId: string) =>
    ["whatsapp", wabaId, "conversations"] as const,
  thread: (wabaId: string, phone: string) =>
    ["whatsapp", wabaId, "thread", phone] as const,

  dlr: (wabaId: string, filters?: unknown) =>
    ["whatsapp", wabaId, "dlr", filters ?? null] as const,
  dashboard: (wabaId: string) => ["whatsapp", wabaId, "dashboard"] as const,
  analytics: (wabaId: string, tab: string, params?: unknown) =>
    ["whatsapp", wabaId, "analytics", tab, params ?? null] as const,
} as const;
