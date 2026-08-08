import { useCallback, useSyncExternalStore } from "react";

export function useWindowWidth(defaultValue = 0) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return defaultValue;
    return window.innerWidth;
  }, [defaultValue]);

  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);
}
