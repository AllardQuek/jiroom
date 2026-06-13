const MIGRATION_FLAG = "migration-v1-strip-singapore";

function getStoreKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.endsWith("-storage")) {
      keys.push(key);
    }
  }
  return keys.sort();
}

function stripSingapore(text: string): string {
  return text.replace(/,\s*Singapore\s*$/i, "").replace(/\s+Singapore\s*$/i, "").trim();
}

export function runMigrations(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  for (const storeKey of getStoreKeys()) {
    const raw = localStorage.getItem(storeKey);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const listings = data.state?.listings;
      if (listings && Array.isArray(listings)) {
        let changed = false;
        for (const listing of listings) {
          if (listing.title) {
            const cleaned = stripSingapore(listing.title);
            if (cleaned !== listing.title) {
              listing.title = cleaned;
              changed = true;
            }
          }
        }
        if (changed) {
          localStorage.setItem(storeKey, JSON.stringify(data));
        }
      }
    } catch {
      // skip unparseable stores
    }
  }

  localStorage.setItem(MIGRATION_FLAG, "true");
}

export function cleanTitle(title: string): string {
  return stripSingapore(title);
}
