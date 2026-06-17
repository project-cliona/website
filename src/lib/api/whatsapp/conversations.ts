import { authenticatedApiClient } from "@/lib/axios";
import type { ConversationSummary, WhatsappMessage } from "@/lib/type";

/** List every contact the user has exchanged messages with, newest first. */
export const fetchConversations = async (): Promise<ConversationSummary[]> => {
  const res = await authenticatedApiClient().get("/whatsApp/conversations");
  return res.data.result;
};

/** Full message thread with one contact phone, oldest-first. */
export const fetchThread = async (
  phone: string,
  limit = 100
): Promise<WhatsappMessage[]> => {
  const res = await authenticatedApiClient().get(
    `/whatsApp/conversations/${encodeURIComponent(phone)}/messages?limit=${limit}`
  );
  return res.data.result;
};

/** Mark all unread inbound messages from a contact as read. */
export const markConversationRead = async (
  phone: string
): Promise<{ markedCount: number }> => {
  const res = await authenticatedApiClient().post(
    `/whatsApp/conversations/${encodeURIComponent(phone)}/read`,
    {}
  );
  return res.data.result;
};

/** Send a free-form text reply (reuses the existing messaging endpoint). */
export const sendTextReply = async (input: {
  to: string;
  text: string;
}): Promise<unknown> => {
  const res = await authenticatedApiClient().post("/whatsApp/message/text", {
    to: input.to,
    text: input.text,
  });
  return res.data.result;
};

/**
 * Derive a human-readable string from a message's jsonb content. Inbound content
 * is the raw Meta message ({ text: { body } }); outbound text is { text }.
 */
export function getMessageText(m: WhatsappMessage): string {
  const c = (m.content ?? {}) as Record<string, any>;
  switch (m.type) {
    case "text":
      return c.text?.body ?? (typeof c.text === "string" ? c.text : "") ?? "";
    case "template":
      return m.templateName ? `Template: ${m.templateName}` : "Template message";
    case "image":
      return c.image?.caption ?? "📷 Image";
    case "video":
      return c.video?.caption ?? "🎥 Video";
    case "audio":
      return "🎤 Audio message";
    case "document":
      return c.document?.filename ?? "📄 Document";
    case "sticker":
      return "Sticker";
    case "location":
      return c.location?.name ?? "📍 Location";
    case "interactive":
      return (
        c.interactive?.button_reply?.title ??
        c.interactive?.list_reply?.title ??
        "Interactive reply"
      );
    case "button":
      return c.button?.text ?? "Button reply";
    case "reaction":
      return c.reaction?.emoji ?? "Reaction";
    default:
      return m.type;
  }
}
