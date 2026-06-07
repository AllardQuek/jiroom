import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Viewing } from "@/types/listing";

interface ViewingState {
  viewings: Viewing[];
  addViewing: (viewing: Viewing) => void;
  updateViewing: (id: string, updates: Partial<Viewing>) => void;
  deleteViewing: (id: string) => void;
  getViewing: (id: string) => Viewing | undefined;
  getViewingByListingId: (listingId: string) => Viewing | undefined;
}

export const useViewingStore = create<ViewingState>()(
  persist(
    (set, get) => ({
      viewings: [],
      addViewing: (viewing) =>
        set((state) => ({ viewings: [...state.viewings, viewing] })),
      updateViewing: (id, updates) =>
        set((state) => ({
          viewings: state.viewings.map((viewing) =>
            viewing.id === id ? { ...viewing, ...updates } : viewing
          ),
        })),
      deleteViewing: (id) =>
        set((state) => ({
          viewings: state.viewings.filter((viewing) => viewing.id !== id),
        })),
      getViewing: (id) => get().viewings.find((viewing) => viewing.id === id),
      getViewingByListingId: (listingId) =>
        get().viewings.find((viewing) => viewing.listing_id === listingId),
    }),
    {
      name: "viewing-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
