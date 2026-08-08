import { useCallback, useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "local-storage:change";

function dispatchStorageChange(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key } })
  );
}

export function useLocalStorageValue(
  key: string,
  defaultValue: string | null = null
) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      return localStorage.getItem(key);
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const handleStorage = (event: StorageEvent) => {
        if (event.key === key) callback();
      };
      const handleCustom = (event: Event) => {
        const custom = event as CustomEvent<{ key: string }>;
        if (custom.detail?.key === key) callback();
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_CHANGE_EVENT, handleCustom);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustom);
      };
    },
    [key]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);
}

export function setLocalStorageValue(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
  dispatchStorageChange(key);
}
