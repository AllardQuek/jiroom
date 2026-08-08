import { useCallback } from "react";
import {
  useLocalStorageValue,
  setLocalStorageValue,
} from "./useLocalStorageValue";

export function useLocalStorageState(key: string, defaultValue: string) {
  const value = useLocalStorageValue(key, defaultValue) ?? defaultValue;

  const setValue = useCallback(
    (next: string | null | ((prev: string) => string | null)) => {
      const current = localStorage.getItem(key) ?? defaultValue;
      const resolved =
        typeof next === "function"
          ? (next as (prev: string) => string | null)(current)
          : next;
      setLocalStorageValue(key, resolved);
    },
    [key, defaultValue]
  );

  return [value, setValue] as const;
}
