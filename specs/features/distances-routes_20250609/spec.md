# Distances & Routes — M4 Routes

## Overview

When viewing a listing on the map, display public transport routes and durations from that listing to all anchors. This directly answers the core question: "How long does it take to get from this apartment to my office / the nearest MRT / school?"

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter with a 9-to-5 office job, I want to click a listing and see transit time to my office anchor, so that I can immediately know if the daily commute is feasible.
- **Family renter**: As a parent evaluating multiple listings, I want to filter my shortlist to only show listings within 30 minutes of my child's school, so that I don't waste time on options with impractical commutes.
- **All users**: As a renter comparing several options, I want to see route lines drawn on the map from a selected listing to all my anchors, so that I can visually understand the spatial relationship and route quality (not just duration).
- **All users**: As a renter, I want to switch between transit, driving, walking, and cycling, so that I can evaluate commute options for different modes of transport I might use.
- **All users**: As a renter looking at a list of 20+ listings, I want to sort by commute time to my office anchor, so that the closest options appear first and I can focus my attention efficiently.

### Design Rationale

Routes are computed on-demand (when a listing is clicked), not pre-fetched for all listings, because the Directions API costs $0.005/request. Computing routes for every listing × every anchor on page load would be expensive and wasteful — users typically only deeply evaluate a few listings per session. The sort-by-commute-time feature (FR6.3) was deferred because it would require N × M Directions API calls (every visible listing to the selected anchor) without the user explicitly requesting those routes, changing the cost model from "pay per click" to "pay per page load." In-memory caching with a 5-minute TTL prevents redundant calls when re-selecting the same listing.

## Use Cases

- Click a listing → see transit time to every anchor simultaneously
- Filter listings by max commute time to a specific anchor
- View route lines on the map for the selected listing
- Sort listings by commute time to a given anchor
- Compare commute times across listings in the comparison view

## Milestone Roadmap

| Milestone | Scope | Status |
|-----------|-------|--------|
| M4 — Routes | Directions API with transit mode, route lines on map, commute time labels | **Specified** |

---

## Functional Requirements

### FR1: Directions API Integration
- **FR1.1**: Route calculation SHALL use the Google Maps Directions API via `useMapsLibrary("routes")`
- **FR1.2**: The primary travel mode SHALL be `TRANSIT` (Singapore MRT/bus)
- **FR1.3**: The user MAY switch to `DRIVING`, `WALKING`, or `BICYCLING` modes
- **FR1.4**: The user MAY deselect all travel modes by clicking the active mode again, setting it to `null`. When `null`, no routes are calculated or displayed on the map.
- **FR1.5**: The departure time SHALL be set to "now" (`new Date()`) for real-time transit schedules

### FR2: Per-Listing Route Display
- **FR2.1**: Clicking a listing SHALL trigger Directions API calls from that listing to ALL anchors simultaneously
- **FR2.2**: Each anchor SHALL display a route line (polyline) on the map from the listing to that anchor
- **FR2.3**: Each route line SHALL be colored by the anchor's type color
- **FR2.4**: Each route line SHALL be labeled with the transit duration (e.g., "32 min")
- **FR2.5**: Route lines SHALL be removed when the listing is deselected

### FR3: Listing InfoWindow Integration
- **FR3.1**: The listing InfoWindow SHALL show a "Commute" section listing distances to EACH anchor:
  - Anchor name (with type color dot)
  - Transit duration (e.g., "32 min")
  - Travel mode icon
- **FR3.2**: Commute times SHALL be computed on click and displayed inline
- **FR3.3**: Loading state SHALL show per-anchor while Directions API responds

### FR4: Travel Mode Toggle
- **FR4.1**: A travel mode selector SHALL appear near the map controls as a pill button group
- **FR4.2**: Options: Transit, Driving, Walking, Cycling — all optional, none selected by default
- **FR4.3**: Clicking the active mode SHALL deselect it (set to `null`)
- **FR4.4**: Changing the travel mode SHALL re-fetch all routes for the currently selected listing
- **FR4.5**: When no mode is selected, no route lines or commute info SHALL appear on the map

### FR5: Map Route Polylines
- **FR5.1**: Each route SHALL render as a `Polyline` on the map using `@vis.gl/react-google-maps`
- **FR5.2**: The polyline SHALL follow the actual road/transit path (from Directions API), NOT a straight line
- **FR5.3**: Polylines SHALL use the anchor's type color with a two-layer rendering:
  - Background glow: `strokeWeight={9}` at 15% opacity
  - Main line: `strokeWeight={4}` at 85% opacity on top
  This creates a halo effect that distinguishes route lines from road network lines on the map.
- **FR5.4**: A label (duration) SHALL appear at the midpoint of each polyline

### FR6: Anchor-Centric Filtering
- **FR6.1**: The user MAY select a single anchor as a filter reference (in addition to viewing per-listing routes)
- **FR6.2**: Listings SHALL be filterable by max commute time to the selected anchor
- **FR6.3**: The listing list SHALL be sortable by commute time to the selected anchor

### FR7: Performance & Caching
- **FR7.1**: Directions API responses SHALL be cached in memory for the current session (keyed by origin+destination+mode)
- **FR7.2**: Cache entries SHALL expire after 5 minutes (transit schedules change)
- **FR7.3**: Maximum 10 concurrent Directions API calls (to avoid rate limiting)

## Non-Functional Requirements

### NFR1: API Cost Awareness
- **NFR1.1**: Directions API costs $0.005 per request (beyond $200/mo free credit)
- **NFR1.2**: Each listing click with 5 anchors = $0.025 (5 API calls)
- **NFR1.3**: In-memory caching SHALL prevent redundant calls
- **NFR1.4**: 100 listing clicks/month with 5 anchors = ~$0.50 — negligible for a single user

### NFR2: UX
- **NFR2.1**: Route lines SHALL be smooth and animated (not jumpy)
- **NFR2.2**: A loading indicator SHALL show per-anchor while individual routes load
- **NFR2.3**: Failed route requests (e.g., no transit available) SHALL show "No route" gracefully
- **NFR2.4**: Route lines SHALL NOT overlap or hide listing markers

## Acceptance Criteria

- [x] AC1: Clicking a listing shows transit route lines to all anchors on the map
- [x] AC2: Each route line is colored by the anchor's type
- [x] AC3: Each anchor shows transit duration in the listing InfoWindow
- [x] AC4: Changing travel mode re-fetches routes for the selected listing
- [x] AC5: Selecting a different listing replaces the route lines
- [x] AC6: Deselecting a listing removes all route lines
- [x] AC7: Anchor-centric filter shows only listings within N minutes (cached routes)
- [ ] AC8: Sort-by-commute-time works in the listing list
- [x] AC9: Cached routes don't re-fetch within 5 minutes
- [x] AC10: Error state for un-routable anchors shows gracefully

## Data Model Changes

No new persistent types. Route data is ephemeral (in-memory, per-session).

### New utility: `lib/utils/routeCache.ts`
```typescript
interface CacheEntry {
  result: google.maps.DirectionsResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 minutes

function cacheKey(origin: string, dest: string, mode: string): string {
  return `${origin}|${dest}|${mode}`;
}

export function getCachedRoute(key: string): CacheEntry | null { ... }
export function setCachedRoute(key: string, result: google.maps.DirectionsResult) { ... }
```

### New store: `store/routePrefsStore.ts`
```typescript
export const useRoutePrefsStore = create(
  persist(
    (set) => ({
      travelMode: "TRANSIT" as google.maps.TravelMode,
      filterAnchorId: null as string | null,
      maxCommuteMinutes: null as number | null,
      setTravelMode: (mode: google.maps.TravelMode) => set({ travelMode: mode }),
      setFilterAnchor: (id: string | null) => set({ filterAnchorId: id }),
      setMaxCommute: (minutes: number | null) => set({ maxCommuteMinutes: minutes }),
    }),
    { name: "route-prefs" }
  )
);
```

## Component Structure

```
components/
  map/
    MapView.tsx                 # Updated: route lines, commute display, travel mode toggle
    RoutePolyline.tsx           # Single route polyline with duration label
    TravelModeToggle.tsx        # Transit/Driving/Walking/Cycling selector
  distance/
    CommuteInfo.tsx             # Per-anchor commute time display (in InfoWindow)
    CommuteFilter.tsx           # Filter by max commute minutes
    RouteCache.ts               # In-memory cache utility
```

## Dependencies

No new external packages. Uses existing `useMapsLibrary("routes")` for the Directions Service.

## Technical Notes

### Directions API Usage
```typescript
const routesLib = useMapsLibrary("routes");

const request = {
  origin: { lat: listing.lat, lng: listing.lng },
  destination: { lat: anchor.lat, lng: anchor.lng },
  travelMode: google.maps.TravelMode.TRANSIT,
  transitOptions: { departureTime: new Date() },
};

const result = await directionsService.route(request);
```

### Polyline Rendering
Use `@vis.gl/react-google-maps` `Polyline` component:
```tsx
import { Polyline } from "@vis.gl/react-google-maps";

<Polyline
  path={result.routes[0].overview_path}
  options={{
    strokeColor: anchorColor,
    strokeOpacity: 0.6,
    strokeWeight: 3,
  }}
/>
```

### Duration Label
Extract duration from `result.routes[0].legs[0].duration.text` (returns "32 mins", "1 hour 5 mins").
Place a custom marker or InfoWindow at the midpoint of the polyline.

### Travel Mode Values
```typescript
type TravelMode = "TRANSIT" | "DRIVING" | "WALKING" | "BICYCLING";
```
Available from `google.maps.TravelMode`.

### API Request Strategy
When a listing is clicked, fire all Directions requests in parallel (up to concurrent limit). As each response arrives, render that route. This gives progressive feedback rather than waiting for all routes to complete.
