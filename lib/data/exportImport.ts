const STORE_KEYS = [
  "listing-storage",
  "viewing-storage",
  "evaluation-storage",
  "verdict-storage",
  "template-storage",
  "comparison-storage",
] as const;

export interface ExportData {
  version: number;
  exported_at: string;
  data: Record<string, unknown>;
}

export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};

  for (const key of STORE_KEYS) {
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
  a.download = `rental-room-rater-backup-${new Date().toISOString().split("T")[0]}.json`;
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

  let count = 0;
  for (const key of STORE_KEYS) {
    if (key in json.data) {
      localStorage.setItem(key, JSON.stringify(json.data[key]));
      count++;
    }
  }

  return {
    success: true,
    message: `Imported ${count} of ${STORE_KEYS.length} stores`,
    storesImported: count,
  };
}
