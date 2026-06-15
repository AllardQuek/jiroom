import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TravelMode = "TRANSIT" | "DRIVING" | "WALKING" | "BICYCLING";

interface RoutePrefsState {
  travelMode: TravelMode | null;
  filterAnchorId: string | null;
  maxCommuteMinutes: number | null;
  setTravelMode: (mode: TravelMode | null) => void;
  setFilterAnchor: (id: string | null) => void;
  setMaxCommute: (minutes: number | null) => void;
}

export const useRoutePrefsStore = create<RoutePrefsState>()(
  persist(
    (set) => ({
      travelMode: null,
      filterAnchorId: null,
      maxCommuteMinutes: null,
      setTravelMode: (mode) => set({ travelMode: mode }),
      setFilterAnchor: (id) => set({ filterAnchorId: id }),
      setMaxCommute: (minutes) => set({ maxCommuteMinutes: minutes }),
    }),
    {
      name: "route-prefs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
