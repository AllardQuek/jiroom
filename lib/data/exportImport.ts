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

export interface ExportData {
  version: number;
  exported_at: string;
  data: Record<string, unknown>;
}

export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};

  for (const key of getStoreKeys()) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }

  return {
    version: 1,
    exported_at: new Date().toISOString(),
    data,
  };
}

export function downloadData(exportData: ExportData): void {
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  a.download = `jiroom-backup-${year}-${month}-${day}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importData(json: ExportData): {
  success: boolean;
  message: string;
  storesImported: number;
} {
  if (!json.data || typeof json.data !== "object") {
    return {
      success: false,
      message: "Invalid backup file: missing data object",
      storesImported: 0,
    };
  }

  const storeKeys = getStoreKeys();
  const backupKeys = Object.keys(json.data).filter(
    (k) => k.endsWith("-storage") || storeKeys.includes(k),
  );

  let count = 0;
  for (const key of backupKeys) {
    if (key in json.data) {
      localStorage.setItem(key, JSON.stringify(json.data[key]));
      count++;
    }
  }

  return {
    success: true,
    message: `Imported ${count} store(s)`,
    storesImported: count,
  };
}
