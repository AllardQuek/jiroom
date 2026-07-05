import fs from 'fs';
import type { Listing, Viewing } from "@/types/listing";
import type { Evaluation, Template } from "@/types/evaluation";
import type { Verdict } from "@/types/verdict";
import type { Anchor } from "@/types/anchor";
import type { ExportData } from "./exportImport";

interface ConvertedSeedData {
  seedListings: Listing[];
  seedViewings: Viewing[];
  seedEvaluations: Evaluation[];
  seedVerdicts: Verdict[];
  seedComparisonIds: string[];
  seedAnchors: Anchor[];
}

export function convertExportToSeed(jsonPath: string): ConvertedSeedData {
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const exportData: ExportData = JSON.parse(jsonContent);
  
  const data = exportData.data;
  
  // Extract listings
  const listingStorage = data['listing-storage'] as { state: { listings: Listing[] } };
  const seedListings = listingStorage?.state?.listings || [];
  
  // Extract viewings (filter to only include fields in Viewing type)
  const viewingStorage = data['viewing-storage'] as { state: { viewings: any[] } };
  const rawViewings = viewingStorage?.state?.viewings || [];
  const seedViewings: Viewing[] = rawViewings.map((v: any) => ({
    id: v.id,
    listing_id: v.listing_id,
    scheduled_date: v.scheduled_date,
    created_at: v.created_at,
  }));
  
  // Extract evaluations
  const evaluationStorage = data['evaluation-storage'] as { state: { evaluations: Evaluation[] } };
  const seedEvaluations = evaluationStorage?.state?.evaluations || [];
  
  // Extract verdicts
  const verdictStorage = data['verdict-storage'] as { state: { verdicts: Verdict[] } };
  const seedVerdicts = verdictStorage?.state?.verdicts || [];
  
  // Extract comparison IDs
  const comparisonStorage = data['comparison-storage'] as { state: { selectedListingIds: string[] } };
  const seedComparisonIds = comparisonStorage?.state?.selectedListingIds || [];
  
  // Extract anchors
  const anchorStorage = data['anchor-storage'] as { state: { anchors: Anchor[] } };
  const seedAnchors = anchorStorage?.state?.anchors || [];
  
  return {
    seedListings,
    seedViewings,
    seedEvaluations,
    seedVerdicts,
    seedComparisonIds,
    seedAnchors,
  };
}

export function generateSeedFile(convertedData: ConvertedSeedData): string {
  const { seedListings, seedViewings, seedEvaluations, seedVerdicts, seedComparisonIds, seedAnchors } = convertedData;
  
  let output = `import { getStoreKeys } from "@/lib/utils/localStorage";
import type { Listing, Viewing } from "@/types/listing";
import type { Evaluation, Template } from "@/types/evaluation";
import type { Verdict } from "@/types/verdict";
import type { Anchor } from "@/types/anchor";

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

`;
  
  // Generate seedListings
  output += `export const seedListings: Listing[] = ${JSON.stringify(seedListings, null, 2)};\n\n`;
  
  // Generate seedViewings
  output += `export const seedViewings: Viewing[] = ${JSON.stringify(seedViewings, null, 2)};\n\n`;
  
  // Generate seedAnchors
  output += `export const seedAnchors: Anchor[] = ${JSON.stringify(seedAnchors, null, 2)};\n\n`;
  
  // Generate seedEvaluations
  output += `export const seedEvaluations: Evaluation[] = ${JSON.stringify(seedEvaluations, null, 2)};\n\n`;
  
  // Generate seedVerdicts
  output += `export const seedVerdicts: Verdict[] = ${JSON.stringify(seedVerdicts, null, 2)};\n\n`;
  
  // Generate seedComparisonIds
  output += `export const seedComparisonIds: string[] = ${JSON.stringify(seedComparisonIds, null, 2)};\n\n`;
  
  // Add the utility functions from the original seedData
  output += `const BACKUP_KEY = "user-data-backup";
const SEED_FLAG = "seed-mode-active";

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
  for (const key of getStoreKeys()) {
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
    const backupKeys = new Set(
      Object.keys(backup).filter((k) => k.endsWith("-storage"))
    );
    for (const key of backupKeys) {
      localStorage.setItem(key, JSON.stringify(backup[key]));
    }
    for (const key of getStoreKeys()) {
      if (!backupKeys.has(key)) {
        localStorage.removeItem(key);
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
    "anchor-storage": { state: { anchors: seedAnchors }, version: 0 },
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
`;
  
  return output;
}

// Main function to run the conversion
if (require.main === module) {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Please provide the path to the exported JSON file');
    process.exit(1);
  }
  
  const outputPath = process.argv[3] || 'lib/data/seedData.ts';
  
  try {
    const convertedData = convertExportToSeed(jsonPath);
    const seedFileContent = generateSeedFile(convertedData);
    fs.writeFileSync(outputPath, seedFileContent);
    console.log(`Successfully generated seed file at ${outputPath}`);
    console.log(`Converted ${convertedData.seedListings.length} listings`);
    console.log(`Converted ${convertedData.seedViewings.length} viewings`);
    console.log(`Converted ${convertedData.seedEvaluations.length} evaluations`);
    console.log(`Converted ${convertedData.seedVerdicts.length} verdicts`);
    console.log(`Converted ${convertedData.seedAnchors.length} anchors`);
  } catch (error) {
    console.error('Error converting export to seed:', error);
    process.exit(1);
  }
}
