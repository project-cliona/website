import { toast } from "sonner";

/**
 * Pull a human-readable message out of an unknown error.
 *
 * Understands axios errors (`{ response: { data: { message | error } } }`),
 * plain `Error` instances, and raw strings. Falls back to `fallback` when
 * nothing useful can be extracted.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (typeof error === "string" && error.trim()) return error;

  const e = error as
    | {
        response?: { data?: { message?: unknown; error?: unknown } };
        message?: unknown;
      }
    | null
    | undefined;

  const data = e?.response?.data;
  const apiMessage = data?.message ?? data?.error;
  if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;

  if (typeof e?.message === "string" && e.message.trim()) return e.message;

  return fallback;
}

type ToastOptions = { description?: string };

/**
 * App-wide toast helper. Wraps `sonner` so every surface fires notifications
 * the same way. Render the <Toaster /> (see `@/components/ui/Toaster`) once in
 * the root layout, then call these from anywhere.
 *
 *   notify.success("Contact added");
 *   notify.error(err, "Could not add contact"); // extracts the API message
 */
export const notify = {
  /** Success toast, with an optional secondary line. */
  success: (message: string, opts?: ToastOptions) => toast.success(message, opts),

  /**
   * Error toast. Accepts a plain message string OR any thrown value — for
   * thrown values the human-readable message is extracted (axios-aware),
   * falling back to `fallback`.
   */
  error: (error: unknown, fallback?: string) =>
    toast.error(getErrorMessage(error, fallback)),

  /** Informational toast. */
  info: (message: string, opts?: ToastOptions) => toast.info(message, opts),

  /** Warning toast. */
  warning: (message: string, opts?: ToastOptions) => toast.warning(message, opts),

  /** Loading toast — returns the id so it can be updated/dismissed. */
  loading: (message: string) => toast.loading(message),

  /** Dismiss a specific toast (by id) or all of them. */
  dismiss: (id?: string | number) => toast.dismiss(id),

  /** Drive a toast through an async action's loading → success/error states. */
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error?: string;
    }
  ) =>
    toast.promise(promise, {
      loading: msgs.loading,
      success: msgs.success,
      error: (err: unknown) => getErrorMessage(err, msgs.error),
    }),
};

// Re-export the raw sonner toast for the rare advanced/custom case.
export { toast };
