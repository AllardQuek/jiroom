import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Anchor } from "@/types/anchor";

interface AnchorState {
  anchors: Anchor[];
  addAnchor: (anchor: Anchor) => void;
  updateAnchor: (id: string, updates: Partial<Anchor>) => void;
  deleteAnchor: (id: string) => void;
  getAnchor: (id: string) => Anchor | undefined;
}

export const useAnchorStore = create<AnchorState>()(
  persist(
    (set, get) => ({
      anchors: [],
      addAnchor: (anchor) =>
        set((state) => ({ anchors: [...state.anchors, anchor] })),
      updateAnchor: (id, updates) =>
        set((state) => ({
          anchors: state.anchors.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteAnchor: (id) =>
        set((state) => ({
          anchors: state.anchors.filter((a) => a.id !== id),
        })),
      getAnchor: (id) => get().anchors.find((a) => a.id === id),
    }),
    {
      name: "anchor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
