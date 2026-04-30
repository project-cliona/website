"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface SearchConfig {
  placeholder: string;
  onChange: (value: string) => void;
}

interface SearchContextValue {
  config: SearchConfig | null;
  query: string;
  setQuery: (value: string) => void;
  registerConfig: (config: SearchConfig) => () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SearchConfig | null>(null);
  const [query, setQueryState] = useState("");
  const configRef = useRef<SearchConfig | null>(null);
  configRef.current = config;

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    configRef.current?.onChange(value);
  }, []);

  const registerConfig = useCallback((next: SearchConfig) => {
    setConfig(next);
    setQueryState("");
    return () => {
      setConfig((current) => (current === next ? null : current));
      setQueryState("");
    };
  }, []);

  return (
    <SearchContext.Provider value={{ config, query, setQuery, registerConfig }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
}

export function usePageSearch(config: SearchConfig | null) {
  const { registerConfig } = useSearch();
  const placeholder = config?.placeholder ?? null;
  const onChangeRef = useRef(config?.onChange);
  onChangeRef.current = config?.onChange;

  useEffect(() => {
    if (!placeholder) return;
    return registerConfig({
      placeholder,
      onChange: (v) => onChangeRef.current?.(v),
    });
  }, [placeholder, registerConfig]);
}
