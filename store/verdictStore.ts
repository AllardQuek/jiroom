import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Verdict } from "@/types/verdict";

interface VerdictState {
  verdicts: Verdict[];
  addVerdict: (verdict: Verdict) => void;
  updateVerdict: (id: string, updates: Partial<Verdict>) => void;
  deleteVerdict: (id: string) => void;
  getVerdict: (id: string) => Verdict | undefined;
  getVerdictByListingId: (listingId: string) => Verdict | undefined;
}

export const useVerdictStore = create<VerdictState>()(
  persist(
    (set, get) => ({
      verdicts: [],
      addVerdict: (verdict) =>
        set((state) => ({ verdicts: [...state.verdicts, verdict] })),
      updateVerdict: (id, updates) =>
        set((state) => ({
          verdicts: state.verdicts.map((verdict) =>
            verdict.id === id ? { ...verdict, ...updates } : verdict
          ),
        })),
      deleteVerdict: (id) =>
        set((state) => ({
          verdicts: state.verdicts.filter((verdict) => verdict.id !== id),
        })),
      getVerdict: (id) => get().verdicts.find((verdict) => verdict.id === id),
      getVerdictByListingId: (listingId) =>
        get().verdicts.find((verdict) => verdict.listing_id === listingId),
    }),
    {
      name: "verdict-storage",
    }
  )
);
