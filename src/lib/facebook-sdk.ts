declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
    fbAsyncInit: () => void;
  }
}

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const CONFIG_ID = process.env.NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID;

/**
 * Dynamically injects the Facebook JavaScript SDK into the page.
 * Resolves immediately if the SDK is already loaded. Rejects if
 * the required env vars are missing.
 */
export function loadFacebookSDK(): Promise<void> {
  if (!META_APP_ID || !CONFIG_ID) {
    return Promise.reject(
      new Error(
        "NEXT_PUBLIC_META_APP_ID and NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID must be set"
      )
    );
  }

  return new Promise((resolve) => {
    if (typeof window.FB !== "undefined") {
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v22.0",
      });
      resolve();
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

export type EmbeddedSignupResult =
  | { status: "success"; code: string; wabaId: string; phoneNumberId: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

/**
 * Opens the Meta Embedded Signup popup. Returns a typed result indicating
 * success (with auth code, wabaId, phoneNumberId), cancellation, or error.
 *
 * CRITICAL: `response_type: "code"` and `override_default_response_type: true`
 * are REQUIRED. Without them, `authResponse.code` will be undefined and the
 * flow will silently fail at the backend exchange step.
 *
 * The session info listener captures waba_id and phone_number_id from the
 * Meta Embedded Signup message event, so the backend doesn't need to
 * discover them via API (which requires the business_management permission).
 */
export async function launchEmbeddedSignup(): Promise<EmbeddedSignupResult> {
  await loadFacebookSDK();

  return new Promise((resolve) => {
    let sessionWabaId = "";
    let sessionPhoneNumberId = "";

    // Listen for session info from the Embedded Signup popup.
    // Meta posts a message event with waba_id and phone_number_id
    // when the user completes the signup flow.
    const sessionInfoListener = (event: MessageEvent) => {
      if (
        typeof event.origin !== "string" ||
        !event.origin.endsWith("facebook.com")
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "WA_EMBEDDED_SIGNUP") {
          if (data.event === "FINISH") {
            sessionWabaId = data.data.waba_id ?? "";
            sessionPhoneNumberId = data.data.phone_number_id ?? "";
          } else if (data.event === "CANCEL") {
            // User cancelled inside the popup — FB.login callback will handle this
          }
        }
      } catch {
        // Non-JSON message from Facebook iframe, ignore
      }
    };

    window.addEventListener("message", sessionInfoListener);

    window.FB.login(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        window.removeEventListener("message", sessionInfoListener);

        if (response.authResponse?.code) {
          if (!sessionWabaId || !sessionPhoneNumberId) {
            resolve({
              status: "error",
              message:
                "WhatsApp signup completed but WABA or phone number info was not received. Please try again.",
            });
            return;
          }

          resolve({
            status: "success",
            code: response.authResponse.code,
            wabaId: sessionWabaId,
            phoneNumberId: sessionPhoneNumberId,
          });
        } else if (
          response.status === "not_authorized" ||
          response.status === "unknown"
        ) {
          resolve({ status: "cancelled" });
        } else {
          resolve({
            status: "error",
            message: "Unexpected response from Facebook SDK",
          });
        }
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  });
}
