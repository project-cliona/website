// Mirror of the backend's utils/phone.ts normalizePhone. Keep the two in sync.
// Output is E.164 digits without "+", the form Meta uses for wa_id, so a chat
// started by hand lands in the same thread as the customer's own messages.
const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE ?? "91";

export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const international = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = trimmed.replace(/\D/g, "");

  if (international) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    return digits.length >= 8 && digits.length <= 15 ? digits : null;
  }

  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = DEFAULT_COUNTRY_CODE + digits;
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}
