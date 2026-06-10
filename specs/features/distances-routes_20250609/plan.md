# Implementation Plan: Distances & Routes — M4

## Phase 1: Route Utility & Cache
- [x] Task: Create `lib/utils/routeCache.ts` (TTL-based in-memory cache)
- [x] Task: Create `store/routePrefsStore.ts` (travel mode, filter anchor, max minutes)

## Phase 2: Directions Integration
- [x] Task: Implement Directions API via `useMapsLibrary("routes")` with batch route fetching
- [x] Task: Parse route result → extract duration + polyline path
- [x] Task: Cache integration with 5-min TTL

## Phase 3: Route Lines on Map
- [x] Task: Create `components/map/RoutePolyline.tsx`
  - [x] Renders Polyline from Directions API result
  - [x] Anchor-type-colored stroke
  - [x] Duration label at midpoint
- [x] Task: Update `components/map/MapView.tsx`
  - [x] On listing click: fetch routes to all visible anchors
  - [x] Show loading state per anchor
  - [x] Render RoutePolyline for each completed response
  - [x] Remove polylines on deselect
- [x] Task: Create `components/map/TravelModeToggle.tsx`
  - [x] Pill selector: Transit / Driving / Walking / Cycling
  - [x] Re-fetches routes on mode change

## Phase 4: Commute Info in InfoWindow
- [x] Task: Create `components/distance/CommuteInfo.tsx`
  - [x] Displays per-anchor commute time in listing InfoWindow
  - [x] Anchor name + type dot + duration + loading/error states
- [x] Task: Update listing InfoWindow with CommuteInfo section
- [x] Task: Create `components/distance/CommuteBadge.tsx` for list view
  - [x] Shows commute time to selected filter anchor on each listing card (cached routes only)
- [ ] Task: Sort listing list by commute time to filter anchor

## Phase 5: Anchor-Centric Commute Filter
- [x] Task: Create anchor picker + max-minutes input (`CommuteFilter.tsx`)
- [x] Task: Integrate CommuteFilter into MapFilters panel
- [x] Task: Filter map listings by commute time (cached routes)
- [ ] Task: Batch route compute for filtered listings (optional)

## Phase 6: Verification
- [x] Task: Verify TypeScript compilation
- [x] Task: Verify lint
- [x] Task: Verify build
