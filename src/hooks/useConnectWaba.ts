"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exchangeWhatsappCode } from "@/lib/api/whatsapp/onboarding";
import { launchEmbeddedSignup } from "@/lib/facebook-sdk";
import { wabaKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";

interface UseConnectWabaOptions {
  /** Defaults to selecting the account that was just connected. */
  onConnected?: (wabaId: string) => void;
}

/**
 * Run Meta's Embedded Signup and register the resulting account.
 *
 * Shared by the dashboard, the account switcher and the profile page, so the
 * flow lives here rather than inline in a page.
 */
export function useConnectWaba(opts: UseConnectWabaOptions = {}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  // Covers the popup, which the mutation's own pending flag does not -- the
  // button otherwise looks idle for the whole time Meta's window is open and
  // can be clicked again.
  const [popupOpen, setPopupOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: exchangeWhatsappCode,
    onSuccess: (_data, variables) => {
      setError(null);
      notify.success("WhatsApp account connected");
      queryClient.invalidateQueries({ queryKey: wabaKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-connection-status"] });
      opts.onConnected?.(variables.wabaId);
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      setError(
        err?.response?.data?.message ??
          "Failed to connect WhatsApp account. Please try again."
      );
    },
  });

  const connect = useCallback(async () => {
    setError(null);
    setPopupOpen(true);
    try {
      const result = await launchEmbeddedSignup();
      if (result.status === "success") {
        mutation.mutate({
          code: result.code,
          wabaId: result.wabaId,
          phoneNumberId: result.phoneNumberId,
        });
      } else if (result.status === "error") {
        setError(result.message);
      }
    } finally {
      setPopupOpen(false);
    }
  }, [mutation]);

  return {
    connect,
    isConnecting: popupOpen || mutation.isPending,
    error,
    reset: () => setError(null),
  };
}
