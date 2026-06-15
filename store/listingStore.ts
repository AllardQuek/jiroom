import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Listing } from "@/types/listing";

interface ListingState {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListing: (id: string) => Listing | undefined;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set, get) => ({
      listings: [],
      addListing: (listing) =>
        set((state) => ({ listings: [...state.listings, listing] })),
      updateListing: (id, updates) =>
        set((state) => {
          const idx = state.listings.findIndex((l) => l.id === id);
          if (idx === -1) return state;
          const updated = { ...state.listings[idx], ...updates };
          return {
            listings: [
              updated,
              ...state.listings.slice(0, idx),
              ...state.listings.slice(idx + 1),
            ],
          };
        }),
      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id),
        })),
      getListing: (id) => get().listings.find((listing) => listing.id === id),
    }),
    {
      name: "listing-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as {
          listings?: Array<Record<string, unknown>>;
        };
        if (version < 1 && state.listings) {
          state.listings = state.listings.map((l) =>
            l.status === "archived" ? { ...l, status: "viewed" } : l
          );
        }
        return state as unknown as Partial<ListingState>;
      },
    }
  )
);
