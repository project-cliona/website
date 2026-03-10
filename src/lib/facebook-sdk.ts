declare global {
  interface Window {
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
  | { status: "success"; code: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

/**
 * Opens the Meta Embedded Signup popup. Returns a typed result indicating
 * success (with auth code), cancellation, or error.
 *
 * CRITICAL: `response_type: "code"` and `override_default_response_type: true`
 * are REQUIRED. Without them, `authResponse.code` will be undefined and the
 * flow will silently fail at the backend exchange step.
 */
export async function launchEmbeddedSignup(): Promise<EmbeddedSignupResult> {
  await loadFacebookSDK();

  return new Promise((resolve) => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse?.code) {
          resolve({ status: "success", code: response.authResponse.code });
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
