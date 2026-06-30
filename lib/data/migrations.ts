import { getStoreKeys } from "@/lib/utils/localStorage";

const MIGRATION_FLAG = "migration-v1-strip-singapore";

function stripSingapore(text: string): string {
  return text.replace(/,\s*Singapore\s*$/i, "").replace(/\s+Singapore\s*$/i, "").trim();
}

export function runMigrations(): void {
  if (typeof window === "undefined") return;
  
  // Check migration flag first to avoid unnecessary localStorage iteration
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  try {
    const storeKeys = getStoreKeys();
    let hasChanges = false;

    for (const storeKey of storeKeys) {
      const raw = localStorage.getItem(storeKey);
      if (!raw) continue;
      
      try {
        const data = JSON.parse(raw);
        const listings = data.state?.listings;
        
        if (listings && Array.isArray(listings)) {
          let storeChanged = false;
          for (const listing of listings) {
            if (listing.title) {
              const cleaned = stripSingapore(listing.title);
              if (cleaned !== listing.title) {
                listing.title = cleaned;
                storeChanged = true;
                hasChanges = true;
              }
            }
          }
          
          // Only write back if changes were made
          if (storeChanged) {
            localStorage.setItem(storeKey, JSON.stringify(data));
          }
        }
      } catch (parseError) {
        // Skip unparseable stores - log in development
        if (process.env.NODE_ENV === "development") {
          console.warn(`Failed to parse store ${storeKey} during migration:`, parseError);
        }
      }
    }

    // Only set flag if migration completed successfully
    if (hasChanges || storeKeys.length > 0) {
      localStorage.setItem(MIGRATION_FLAG, "true");
    }
  } catch (error) {
    // If migration fails, log error but don't crash the app
    console.error("Migration failed:", error);
  }
}

export function cleanTitle(title: string): string {
  return stripSingapore(title);
}
