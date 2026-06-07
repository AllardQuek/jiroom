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
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, ...updates } : listing
          ),
        })),
      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id),
        })),
      getListing: (id) => get().listings.find((listing) => listing.id === id),
    }),
    {
      name: "listing-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
