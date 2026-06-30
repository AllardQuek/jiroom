/**
 * localStorage utilities for quota management and safe operations
 */

/**
 * Get the approximate size of localStorage in bytes
 */
export function getLocalStorageSize(): number {
  if (typeof window === "undefined") return 0;
  
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      total += (key.length + (value?.length || 0)) * 2; // UTF-16 uses 2 bytes per char
    }
  }
  return total;
}

/**
 * Get the approximate localStorage quota (typically 5-10MB depending on browser)
 */
export function getLocalStorageQuota(): number {
  // Most browsers have 5-10MB localStorage quota
  // We use a conservative estimate of 5MB
  return 5 * 1024 * 1024; // 5MB in bytes
}

/**
 * Check if localStorage is near quota limit
 * @param threshold - Percentage of quota to consider as "near limit" (default: 0.8 = 80%)
 */
export function isLocalStorageNearLimit(threshold: number = 0.8): boolean {
  const size = getLocalStorageSize();
  const quota = getLocalStorageQuota();
  return size >= quota * threshold;
}

/**
 * Safely set an item in localStorage with quota checking
 * @returns true if successful, false if quota exceeded
 */
export function safeLocalStorageSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    // Check if we're near the limit before writing
    if (isLocalStorageNearLimit(0.9)) {
      console.warn("localStorage is near quota limit, write may fail");
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set localStorage item "${key}":`, error);
    // If quota exceeded, try to clean up old data
    if (isQuotaExceededError(error)) {
      cleanupOldLocalStorageData();
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error(`Retry failed for localStorage item "${key}":`, retryError);
      }
    }
    return false;
  }
}

/**
 * Check if error is a quota exceeded error
 */
function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22 ||
      error.code === 1014)
  );
}

/**
 * Clean up old or potentially corrupted localStorage data
 */
export function cleanupOldLocalStorageData(): void {
  if (typeof window === "undefined") return;
  
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    // Remove items that are likely corrupted or too old
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        keysToRemove.push(key);
        continue;
      }
      
      // Try to parse JSON - if it fails, it might be corrupted
      if (key.endsWith("-storage")) {
        try {
          JSON.parse(value);
        } catch {
          keysToRemove.push(key);
        }
      }
    } catch {
      keysToRemove.push(key);
    }
  }
  
  // Remove identified keys
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
    }
  });
  
  if (keysToRemove.length > 0) {
    console.log(`Cleaned up ${keysToRemove.length} localStorage items`);
  }
}

/**
 * Get all localStorage keys ending with "-storage" (i.e. Zustand persisted stores)
 */
export function getStoreKeys(): string[] {
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

/**
 * Get localStorage usage statistics
 */
export function getLocalStorageStats(): {
  size: number;
  quota: number;
  usagePercentage: number;
  itemCount: number;
  isNearLimit: boolean;
} {
  const size = getLocalStorageSize();
  const quota = getLocalStorageQuota();
  const itemCount = localStorage.length;
  
  return {
    size,
    quota,
    usagePercentage: (size / quota) * 100,
    itemCount,
    isNearLimit: isLocalStorageNearLimit(0.8),
  };
}
