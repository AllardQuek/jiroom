import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TenantProfile } from "@/types/tenantProfile";

interface TenantProfileState {
  profile: TenantProfile;
  updateProfile: (profile: Partial<TenantProfile>) => void;
  getProfile: () => TenantProfile;
}

export const useTenantProfileStore = create<TenantProfileState>()(
  persist(
    (set, get) => ({
      profile: {},
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      getProfile: () => get().profile,
    }),
    {
      name: "tenant-profile-storage",
    }
  )
);
