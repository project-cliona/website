import type { WabaAccount, WabaHealth } from "@/lib/type";

/**
 * Collapse an account's health into one of three states.
 *
 * status, connectionState, banState and qualityRating vary independently --
 * an account can be active and connected while Meta has it scheduled for
 * disable -- so a two-colour green/red reading would paint an account that
 * still needs attention as fine.
 */
export function wabaHealth(account: WabaAccount): WabaHealth {
  if (account.banState === "DISABLE") return "down";
  if (account.status !== "active") return "down";
  if (account.connectionState && account.connectionState !== "connected") {
    return "down";
  }
  if (account.tokenExpired) return "down";

  // Recoverable: the user can still act to save the account, so it must not
  // read as healthy.
  if (account.banState === "SCHEDULE_FOR_DISABLE") return "warning";
  const quality = account.qualityRating?.toUpperCase();
  if (quality === "RED" || quality === "YELLOW") return "warning";

  return "healthy";
}

/** The server decides this; we only mirror it for disabling controls early. */
export function canSend(account: WabaAccount | null): boolean {
  return !!account && account.sendable;
}

/**
 * What to call this account in the UI.
 *
 * Falls through to the phone number before the raw id: accounts onboarded
 * before Meta's verified name was captured have no business name, and a
 * 15-digit id identifies nothing to a human.
 */
export function wabaLabel(account: WabaAccount): string {
  return (
    account.businessName?.trim() ||
    account.displayPhoneNumber?.trim() ||
    account.wabaId
  );
}

export function wabaStatusLabel(account: WabaAccount): string {
  if (account.banState === "DISABLE") return "Disabled by Meta";
  if (account.banState === "SCHEDULE_FOR_DISABLE") return "Scheduled for disable";
  if (account.tokenExpired) return "Token expired";
  if (account.status === "active") {
    const quality = account.qualityRating?.toUpperCase();
    if (quality === "RED") return "Low quality rating";
    if (quality === "YELLOW") return "Medium quality rating";
    return "Connected";
  }
  return account.status.charAt(0).toUpperCase() + account.status.slice(1);
}

/** Why this account cannot send, phrased for a banner. Null when it can. */
export function readOnlyReason(account: WabaAccount | null): string | null {
  if (!account) return "No WhatsApp Business Account connected.";
  if (account.sendable) return null;
  if (account.banState === "DISABLE") {
    return "Meta has disabled this WhatsApp Business Account. You can view its history, but cannot send.";
  }
  if (account.tokenExpired || account.status === "expired") {
    return "This account's connection to Meta has expired. Reconnect it to send messages.";
  }
  if (account.status === "suspended") {
    return "Meta has suspended this WhatsApp Business Account.";
  }
  return "This account is disconnected. Reconnect it to send messages.";
}

export const HEALTH_DOT_CLASS: Record<WabaHealth, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  down: "bg-destructive",
};
