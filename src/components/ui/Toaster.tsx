"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast outlet. Mounted once in the root layout so notifications are
 * available on every route (auth, kyc, dashboard…). Fire toasts with the
 * `notify` helper in `@/lib/toast`.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      duration={4000}
      closeButton
      toastOptions={{
        className:
          "rounded-lg border border-border bg-card text-foreground shadow-e3",
      }}
    />
  );
}
