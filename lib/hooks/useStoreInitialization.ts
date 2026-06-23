import { useEffect, useRef } from "react";
import { useTemplateStore } from "@/store/templateStore";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { isAnyStoreEmpty, loadSeedData } from "@/lib/data/seedData";

// Module-level flag to ensure initialization runs only once across all instances
let hasInitialized = false;

/**
 * Centralized hook for initializing all stores.
 * Uses a module-level flag to ensure initialization happens exactly once,
 * preventing the infinite re-render loop caused by unstable dependencies.
 */
export function useStoreInitialization() {
  const initRef = useRef(false);

  useEffect(() => {
    // Skip if already initialized (either in this instance or globally)
    if (initRef.current || hasInitialized) {
      return;
    }

    initRef.current = true;
    hasInitialized = true;

    // Get store functions fresh to avoid dependency issues
    const templateStore = useTemplateStore.getState();
    const agentQuestionStore = useAgentQuestionStore.getState();

    // Initialize templates and agent questions
    templateStore.initializeTemplates();
    agentQuestionStore.initializeTemplates();

    // Load seed data if stores are empty (only on initial load)
    // This replaces the reload-based approach in ListingsPageInner
    if (isAnyStoreEmpty() && typeof window !== "undefined") {
      // Check if we're not already in seed mode
      const isSeedMode = localStorage.getItem("seed-mode-active") === "true";
      if (!isSeedMode) {
        loadSeedData();
      }
    }
  }, []); // Empty dependency array - runs once on mount
}
