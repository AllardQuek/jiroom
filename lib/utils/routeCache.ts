export interface RouteResultData {
  path: google.maps.LatLngAltitude[];
  durationText: string;
}

interface CacheEntry {
  result: RouteResultData;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000;

function makeKey(origin: string, destination: string, mode: string): string {
  return `${origin}|${destination}|${mode}`;
}

export function getCachedRoute(
  origin: string,
  destination: string,
  mode: string
): RouteResultData | null {
  const key = makeKey(origin, destination, mode);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedRoute(
  origin: string,
  destination: string,
  mode: string,
  result: RouteResultData
): void {
  const key = makeKey(origin, destination, mode);
  cache.set(key, { result, timestamp: Date.now() });
}

export function clearRouteCache(): void {
  cache.clear();
}
