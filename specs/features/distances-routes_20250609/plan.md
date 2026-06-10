# Implementation Plan: Distances & Routes — M4

## Phase 1: Route Utility & Cache
- [ ] Task: Create `lib/utils/routeCache.ts` (TTL-based in-memory cache)
- [ ] Task: Create `store/routePrefsStore.ts` (travel mode, filter anchor, max minutes)

## Phase 2: Directions Integration
- [ ] Task: Test Directions API via `useMapsLibrary("routes")` with a single origin+destination
- [ ] Task: Implement batch route fetching (parallel requests, concurrent limit)
- [ ] Task: Parse route result → extract duration + polyline path

## Phase 3: Route Lines on Map
- [ ] Task: Create `components/map/RoutePolyline.tsx`
  - [ ] Renders Polyline from Directions API result
  - [ ] Anchor-type-colored stroke
  - [ ] Duration label at midpoint
- [ ] Task: Update `components/map/MapView.tsx`
  - [ ] On listing click: fetch routes to all visible anchors
  - [ ] Show loading state per anchor
  - [ ] Render RoutePolyline for each completed response
  - [ ] Remove polylines on deselect
- [ ] Task: Create `components/map/TravelModeToggle.tsx`
  - [ ] Pill selector: Transit / Driving / Walking / Cycling
  - [ ] Re-fetches routes on mode change

## Phase 4: Commute Info in InfoWindow & List
- [ ] Task: Create `components/distance/CommuteInfo.tsx`
  - [ ] Displays per-anchor commute time in listing InfoWindow
  - [ ] Anchor name + type dot + duration + mode icon
- [ ] Task: Update listing InfoWindow with CommuteInfo section
- [ ] Task: Create `components/distance/CommuteBadge.tsx` for list view
  - [ ] Shows commute time to selected filter anchor on each listing card
- [ ] Task: Sort listing list by commute time to filter anchor

## Phase 5: Anchor-Centric Commute Filter
- [ ] Task: Create anchor picker in listing list + map filter
- [ ] Task: Implement max-commute-minutes filter
- [ ] Task: Filter listings on map and in list

## Phase 6: Verification
- [ ] Task: Verify TypeScript compilation
- [ ] Task: Verify lint
- [ ] Task: Verify build
- [ ] Task: Test listing click → routes to all anchors
- [ ] Task: Test travel mode toggle
- [ ] Task: Test route caching (same origin+dest within 5 min)
- [ ] Task: Test error handling (no route available)
- [ ] Task: Test deselect clears routes
- [ ] Task: Test commute time in InfoWindow
- [ ] Task: Test anchor-centric filter in list view
- [ ] Task: Test sort-by-commute-time
- [ ] Task: Test mobile responsiveness (route lines + labels)
