import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_LISTINGS = 3;

interface ComparisonState {
  selectedListingIds: string[];
  addToListing: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isSelected: (id: string) => boolean;
  canAddMore: () => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedListingIds: [],
      addToListing: (id) => {
        const { selectedListingIds } = get();
        if (selectedListingIds.length >= MAX_LISTINGS) {
          return;
        }
        if (!selectedListingIds.includes(id)) {
          set({ selectedListingIds: [...selectedListingIds, id] });
        }
      },
      removeFromComparison: (id) => {
        const { selectedListingIds } = get();
        set({
          selectedListingIds: selectedListingIds.filter((listingId) => listingId !== id),
        });
      },
      clearComparison: () => {
        set({ selectedListingIds: [] });
      },
      isSelected: (id) => {
        const { selectedListingIds } = get();
        return selectedListingIds.includes(id);
      },
      canAddMore: () => {
        const { selectedListingIds } = get();
        return selectedListingIds.length < MAX_LISTINGS;
      },
    }),
    {
      name: "comparison-storage",
    }
  )
);
