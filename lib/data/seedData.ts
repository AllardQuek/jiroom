import type { Listing, Viewing } from "@/types/listing";
import type { Evaluation, Template } from "@/types/evaluation";
import type { Verdict } from "@/types/verdict";

const now = new Date("2026-06-08T10:00:00+08:00").toISOString();
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 86400000).toISOString();
const yearsAgo = (n: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString();
};
const yearsFromNow = (n: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + n);
  return d.toISOString();
};

const ids = {
  l1: "seed-listing-1",
  l2: "seed-listing-2",
  l3: "seed-listing-3",
  l4: "seed-listing-4",
  l5: "seed-listing-5",
  l6: "seed-listing-6",
  l7: "seed-listing-7",
  l8: "seed-listing-8",
  v1: "seed-viewing-1",
  v2: "seed-viewing-2",
  v3: "seed-viewing-3",
  v4: "seed-viewing-4",
  v5: "seed-viewing-5",
  v6: "seed-viewing-6",
  v7: "seed-viewing-7",
  e1: "seed-eval-1",
  e2: "seed-eval-2",
  vd1: "seed-verdict-1",
  vd2: "seed-verdict-2",
};

export const seedListings: Listing[] = [
  {
    id: ids.l1,
    source_url: "https://www.propertyguru.com.sg/listing/123",
    source_platform: "PropertyGuru",
    title: "Spacious Master Bedroom @ Novena MRT",
    price: 1800,
    area: "Novena / Toa Payoh",
    status: "to_view",
    notes: "Near MRT, aircon included, owner staying in",
    created_at: daysAgo(5),
  },
  {
    id: ids.l2,
    source_url: "https://www.propertyguru.com.sg/listing/456",
    source_platform: "PropertyGuru",
    title: "Common Room in HDB @ Tampines",
    price: 900,
    area: "Tampines",
    status: "new",
    notes: "",
    created_at: daysAgo(2),
  },
  {
    id: ids.l3,
    source_url: "https://www.99.co/singapore/rent/789",
    source_platform: "99.co",
    title: "Studio @ Robertson Quay",
    price: 2800,
    area: "Robertson Quay / River Valley",
    status: "viewed",
    notes: "Beautiful river view, great amenities, but noisy at night",
    created_at: daysAgo(14),
  },
  {
    id: ids.l4,
    source_url: "https://www.propertyguru.com.sg/listing/101",
    source_platform: "PropertyGuru",
    title: "Master Room @ Holland Village",
    price: 2200,
    area: "Holland Village / Buona Vista",
    status: "shortlisted",
    notes: "Top choice — near work, great neighborhood, good layout",
    created_at: daysAgo(10),
  },
  {
    id: ids.l5,
    source_url: "https://www.carousell.sg/p/rental-room-999",
    source_platform: "Carousell",
    title: "Common Room @ Clementi",
    price: 750,
    area: "Clementi / West Coast",
    status: "archived",
    notes: "Too far from MRT, decided not to pursue",
    created_at: daysAgo(20),
  },
  {
    id: ids.l6,
    source_url: "https://www.propertyguru.com.sg/listing/202",
    source_platform: "PropertyGuru",
    title: "Master Bedroom @ Bugis",
    price: 2500,
    area: "Bugis / Rochor",
    status: "new",
    notes: "",
    created_at: daysAgo(1),
  },
  {
    id: ids.l7,
    source_url: "https://www.99.co/singapore/rent/303",
    source_platform: "99.co",
    title: "Common Room @ Katong",
    price: 1100,
    area: "Katong / Joo Chiat",
    status: "to_view",
    notes: "Great food area, older unit but well maintained",
    created_at: daysAgo(1),
  },
  {
    id: ids.l8,
    source_url: "https://www.propertyguru.com.sg/listing/404",
    source_platform: "PropertyGuru",
    title: "HDB Common Room @ Bedok",
    price: 800,
    area: "Bedok / Upper East Coast",
    status: "viewed",
    notes: "",
    created_at: daysAgo(3),
  },
];

export const seedViewings: Viewing[] = [
  {
    id: ids.v1,
    listing_id: ids.l1,
    scheduled_date: daysFromNow(1) + "T18:00:00.000Z",
    created_at: daysAgo(3),
  },
  {
    id: ids.v2,
    listing_id: ids.l3,
    scheduled_date: daysAgo(10) + "T17:30:00.000Z",
    created_at: daysAgo(12),
  },
  {
    id: ids.v3,
    listing_id: ids.l4,
    scheduled_date: daysAgo(8) + "T19:00:00.000Z",
    created_at: daysAgo(10),
  },
  {
    id: ids.v4,
    listing_id: ids.l5,
    scheduled_date: yearsAgo(100),
    created_at: yearsAgo(100),
  },
  {
    id: ids.v5,
    listing_id: ids.l6,
    scheduled_date: daysAgo(3) + "T14:00:00.000Z",
    created_at: daysAgo(5),
  },
  {
    id: ids.v6,
    listing_id: ids.l7,
    scheduled_date: daysFromNow(3) + "T10:30:00.000Z",
    created_at: daysAgo(1),
  },
  {
    id: ids.v7,
    listing_id: ids.l8,
    scheduled_date: yearsFromNow(100),
    created_at: daysAgo(3),
  },
];

export const seedEvaluations: Evaluation[] = [
  {
    id: ids.e1,
    listing_id: ids.l3,
    template_id: "default",
    responses: {
      c1: 2800,
      c2: 5600,
      c3: 0,
      c4: 200,
      c5: 1,
      c6: 3,
      c7: "Spacious, big windows",
      c8: "Good water pressure, new heater",
      c9: 0,
      c10: 1,
      c11: "No",
      c12: "Friendly",
      c13: 2,
      c14: 1,
      c15: "On the main road, some noise",
      c16: 15,
      c17: "Mall and supermarket 5min walk",
      c18: "Gym, pool",
      c19: "Laundry, AC servicing",
      c20: "6 months, reasonable",
      c21: 1,
      c22: "Fully furnished",
      c23: "WiFi included, 1Gbps",
      c24: "Owner stays in separate room",
      c25: "1 year",
      c26: 7,
    },
    created_at: daysAgo(9),
    updated_at: daysAgo(9),
  },
  {
    id: ids.e2,
    listing_id: ids.l4,
    template_id: "default",
    responses: {
      c1: 2200,
      c2: 4400,
      c3: 1,
      c4: 150,
      c5: 1,
      c6: 5,
      c7: "Very spacious, newly renovated",
      c8: "Rain shower, excellent pressure",
      c9: 0,
      c10: 1,
      c11: "No",
      c12: "Very friendly, young couple",
      c13: 3,
      c14: 2,
      c15: "Quiet street, good sleep quality",
      c16: 5,
      c17: "Holland Village 3min walk",
      c18: "Rooftop garden, BBQ pit",
      c19: "Weekly cleaning included",
      c20: "Flexible",
      c21: 1,
      c22: "Fully furnished, good quality",
      c23: "WiFi included, fastest plan",
      c24: "Owner stays overseas",
      c25: "1 year",
      c26: 9,
    },
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
];

export const seedVerdicts: Verdict[] = [
  {
    id: ids.vd1,
    listing_id: ids.l3,
    status: "no",
    reasoning: "Too noisy at night, rent is high for what it is",
    score: 58,
    updated_at: daysAgo(8),
    created_at: daysAgo(8),
  },
  {
    id: ids.vd2,
    listing_id: ids.l4,
    status: "yes",
    reasoning:
      "Best option so far — great location, reasonable price, nice room",
    score: 85,
    updated_at: daysAgo(4),
    created_at: daysAgo(4),
  },
];

export const seedComparisonIds: string[] = [ids.l3, ids.l4];

const BACKUP_KEY = "user-data-backup";
const SEED_FLAG = "seed-mode-active";
const STORE_KEYS = [
  "listing-storage",
  "viewing-storage",
  "evaluation-storage",
  "verdict-storage",
  "template-storage",
  "comparison-storage",
];

export function isSeedModeActive(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SEED_FLAG) === "true";
}

export function isAnyStoreEmpty(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem("listing-storage");
  if (!raw) return true;
  try {
    const parsed = JSON.parse(raw);
    return !parsed?.state?.listings?.length;
  } catch {
    return true;
  }
}

export function backupUserData(): boolean {
  const backup: Record<string, unknown> = {};
  for (const key of STORE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        backup[key] = JSON.parse(raw);
      } catch {
        backup[key] = raw;
      }
    }
  }
  if (Object.keys(backup).length === 0) return false;
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  return true;
}

export function restoreUserData(): boolean {
  const raw = localStorage.getItem(BACKUP_KEY);
  if (!raw) return false;
  try {
    const backup = JSON.parse(raw) as Record<string, unknown>;
    for (const key of STORE_KEYS) {
      if (key in backup) {
        localStorage.setItem(key, JSON.stringify(backup[key]));
      }
    }
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(SEED_FLAG);
    return true;
  } catch {
    return false;
  }
}

export function loadSeedData(): void {
  const payload: Record<string, { state: unknown; version: number }> = {
    "listing-storage": { state: { listings: seedListings }, version: 0 },
    "viewing-storage": { state: { viewings: seedViewings }, version: 0 },
    "evaluation-storage": {
      state: { evaluations: seedEvaluations },
      version: 0,
    },
    "verdict-storage": { state: { verdicts: seedVerdicts }, version: 0 },
    "comparison-storage": {
      state: { selectedListingIds: seedComparisonIds },
      version: 0,
    },
  };

  for (const [key, value] of Object.entries(payload)) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  localStorage.setItem(SEED_FLAG, "true");
}

export function toggleSeedMode(): "seed" | "user" | null {
  if (isSeedModeActive()) {
    const ok = restoreUserData();
    return ok ? "user" : null;
  } else {
    backupUserData();
    loadSeedData();
    return "seed";
  }
}
