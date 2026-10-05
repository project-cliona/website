"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchWabaAccounts } from "@/lib/api/whatsapp/accounts";
import { wabaKeys } from "@/lib/queryKeys";
import { readOnlyReason as deriveReadOnlyReason, wabaHealth } from "@/lib/waba";
import type { WabaAccount, WabaHealth } from "@/lib/type";

const STORAGE_KEY = "squalto:waba:selected";

interface WabaContextValue {
  accounts: WabaAccount[];
  selected: WabaAccount | null;
  selectedWabaId: string | null;
  setSelectedWabaId: (wabaId: string) => void;

  isLoading: boolean;
  isError: boolean;
  refetchAccounts: () => Promise<unknown>;

  hasWaba: boolean;
  /** The selected account cannot send. Reads stay available. */
  isReadOnly: boolean;
  readOnlyReason: string | null;
  health: WabaHealth | null;
}

const WabaContext = createContext<WabaContextValue | null>(null);

export function useWaba(): WabaContextValue {
  const ctx = useContext(WabaContext);
  if (!ctx) throw new Error("useWaba must be used within a WabaProvider");
  return ctx;
}

/** Prefer a healthy account, then a reachable one, then anything. */
function pickDefault(accounts: WabaAccount[]): WabaAccount | null {
  if (accounts.length === 0) return null;
  const rank = (a: WabaAccount) =>
    wabaHealth(a) === "healthy" ? 0 : wabaHealth(a) === "warning" ? 1 : 2;
  return [...accounts].sort((a, b) => rank(a) - rank(b))[0] ?? null;
}

export function WabaProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [selectedWabaId, setSelectedWabaIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: wabaKeys.accounts(),
    queryFn: fetchWabaAccounts,
    // Changes only on connect/disconnect, both of which invalidate explicitly.
    staleTime: 5 * 60 * 1000,
  });

  const accounts = useMemo(() => data?.accounts ?? [], [data]);

  // localStorage is read in an effect rather than during render: this is an
  // App Router app, and reading it inline is a hydration mismatch.
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || accounts.length === 0) return;

    const exists = (id: string | null | undefined) =>
      !!id && accounts.some((a) => a.wabaId === id);

    // Already on a valid account -- including a disconnected one, which is
    // kept on purpose so its history stays browsable.
    if (exists(selectedWabaId)) return;

    // A ?wabaId= in the URL is adopted once, so a pasted link lands on the
    // right account. It is never written back; owning the query string would
    // collide with the analytics filter hook.
    const fromUrl = searchParams.get("wabaId");
    const fromStorage =
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;

    const next =
      (exists(fromUrl) && fromUrl) ||
      (exists(fromStorage) && fromStorage) ||
      pickDefault(accounts)?.wabaId ||
      null;

    if (next) {
      setSelectedWabaIdState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, [hydrated, accounts, selectedWabaId, searchParams]);

  const setSelectedWabaId = useCallback(
    (wabaId: string) => {
      if (wabaId === selectedWabaId) return;
      setSelectedWabaIdState(wabaId);
      window.localStorage.setItem(STORAGE_KEY, wabaId);

      // Drop rather than invalidate. Invalidating keeps serving the previous
      // account's data while the refetch is in flight, so for a moment the
      // user reads one account's campaigns under another account's name.
      // Removing sends every mounted query to its loading state instead.
      // Matched by predicate rather than by key prefix. A prefix of
      // ["whatsapp"] only matches keys whose first element is exactly
      // "whatsapp", so legacy keys like ["whatsapp-dlr"] and ["wa-thread"]
      // slipped through and kept serving the previous account's data.
      queryClient.removeQueries({
        predicate: (query) => {
          const [head] = query.queryKey;
          if (typeof head !== "string") return false;
          // The account list itself must survive, or the switcher drops back
          // into its loading state on every switch.
          if (query.queryKey[1] === "accounts") return false;
          return (
            head === "whatsapp" ||
            head.startsWith("whatsapp-") ||
            head.startsWith("wa-")
          );
        },
      });
    },
    [queryClient, selectedWabaId]
  );

  const selected = useMemo(
    () => accounts.find((a) => a.wabaId === selectedWabaId) ?? null,
    [accounts, selectedWabaId]
  );

  const value = useMemo<WabaContextValue>(
    () => ({
      accounts,
      selected,
      selectedWabaId: selected?.wabaId ?? null,
      setSelectedWabaId,
      isLoading: isLoading || !hydrated,
      isError,
      refetchAccounts: refetch,
      hasWaba: accounts.length > 0,
      isReadOnly: !!selected && !selected.sendable,
      readOnlyReason: selected ? deriveReadOnlyReason(selected) : null,
      health: selected ? wabaHealth(selected) : null,
    }),
    [accounts, selected, setSelectedWabaId, isLoading, hydrated, isError, refetch]
  );

  return <WabaContext.Provider value={value}>{children}</WabaContext.Provider>;
}
