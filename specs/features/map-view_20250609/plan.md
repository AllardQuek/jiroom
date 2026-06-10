# Implementation Plan: Map View — M1 Core Map

## Phase 1: Foundation & Configuration
- [x] Task: Create Google Cloud Project & enable APIs
- [x] Task: Create `.env.local` with API key
- [x] Task: Install dependencies (`@vis.gl/react-google-maps`, `@types/google.maps`)
- [x] Task: Verify TypeScript compilation

## Phase 2: Data Model Updates
- [x] Task: Add location fields (`lat`, `lng`, `googlePlaceId`) to `types/listing.ts`
- [x] Task: Update `lib/schemas/listingSchema.ts` with optional lat/lng/googlePlaceId
- [x] Task: Verify TypeScript compilation

## Phase 3: Navigation & Routing
- [x] Task: Create `app/map/page.tsx` (Map page route)
- [x] Task: Update `components/Navigation.tsx` with Map tab (5th tab between Schedule and Templates)
- [x] Task: Verify navigation renders correctly on mobile and desktop

## Phase 4: Places Autocomplete Component
- [x] Task: Create `components/map/PlaceAutocomplete.tsx`
  - Uses `PlaceAutocompleteElement` from Places API (New) via `useMapsLibrary('places')`
  - Falls back to plain text input when Google widget unavailable
  - Props: `onPlaceSelect`, `initialValue`, `className`
- [x] Task: Integrate into `components/listings/CreateListingForm.tsx`
- [x] Task: Integrate into `components/listings/EditListingForm.tsx`
- [x] Task: Verify Autocomplete flow end-to-end

## Phase 5: Map View Core
- [x] Task: Create `APIProvider` in root layout (`app/layout.tsx`) wrapping app
- [x] Task: Create `components/map/MapView.tsx` with Map, AdvancedMarker, InfoWindow
- [x] Task: Marker color-coded by status (gray/blue/amber/green/dimmed)
- [x] Task: Verify map renders with seed listing markers

## Phase 6: Marker InfoWindow
- [x] Task: Implement `ListingPreviewCard` inline in MapView (title, price, score, status, area)
- [x] Task: Actions: "View Details" (modal), "Open in Google Maps" (directions), "Open source"
- [x] Task: InfoWindow dismissible via close button or click elsewhere
- [x] Task: Verify InfoWindow interactions on mobile and desktop

## Phase 7: Map Filters
- [x] Task: Create `components/map/MapFilters.tsx` (status multi-select + price range)
- [x] Task: Client-side filtering of markers
- [x] Task: Collapsible filter bar on mobile
- [x] Task: Verify filters render and interact correctly

## Phase 8: Map-First Creation
- [x] Task: Create `components/map/LocationSearch.tsx`
  - Programmatic Places API (`AutocompleteSuggestion.fetchAutocompleteSuggestions`)
  - Custom predictions dropdown (no Shadow DOM styling conflicts)
- [x] Task: On select: center map, drop temporary indigo marker, show "Create listing here" button
- [x] Task: Opens create listing dialog with pre-filled fields
- [x] Task: Verify map-first creation flow end-to-end

## Phase 9: Verification
- [x] Task: Verify TypeScript compilation (`npx tsc --noEmit`)
- [x] Task: Verify lint (`npm run lint`)
- [x] Task: Verify build (`npm run build`)
- [x] Task: Test create listing with Places Autocomplete
- [x] Task: Test edit listing location
- [x] Task: Test map tab renders markers
- [x] Task: Test marker InfoWindow on click
- [x] Task: Test "Open in Google Maps" link
- [x] Task: Test "View Details" opens listing modal
- [x] Task: Test status filter
- [x] Task: Test price range filter
- [x] Task: Test map-first creation flow
- [x] Task: Test listing without coordinates (should not appear)
- [x] Task: Test mobile responsiveness
- [x] Task: Fallback input works when Places API unavailable

## M1a — Map UX Enhancements (Post-v1)

### Phase 10: Hover Tooltips
- [ ] Task: Create `components/map/MapTooltip.tsx`
  - [ ] Shared floating overlay, positioned via `map.getProjection()` + marker screen coords
  - [ ] Shows: title, price, score, notes preview
  - [ ] 300ms hover delay
  - [ ] Disabled on touch devices
- [ ] Task: Update `MapView.tsx` with hover state management (`hoveredMarker`)
- [ ] Task: Add `onMouseEnter` / `onMouseLeave` handlers to listing `AdvancedMarker`
- [ ] Task: Verify tooltip shows/hides on hover

### Phase 11: Area-Based Marker Coloring
- [ ] Task: Create `components/map/MarkerColorToggle.tsx` (toggle button)
- [ ] Task: Create `components/map/AreaLegend.tsx` (color → area legend)
- [ ] Task: Compute area → color map from unique `area` values in listings
- [ ] Task: Apply area-based color to AdvancedMarker Pin when mode is active
- [ ] Task: Verify colors update when switching modes

### Phase 12: Enhanced Filters
- [ ] Task: Update `components/map/MapFilters.tsx`
  - [ ] Add area chips (auto-extracted from listings)
  - [ ] Add score range filter (min/max inputs)
  - [ ] Add criteria picker + min rating input
  - [ ] Compose all filters with existing status/price filters
- [ ] Task: Filter listings by area selection
- [ ] Task: Filter listings by score range (from evaluation store)
- [ ] Task: Filter listings by criteria rating (from evaluation store)
- [ ] Task: Verify filters compose correctly

### Phase 13: Verification (M1a)
- [ ] Task: Verify TypeScript compilation
- [ ] Task: Verify lint
- [ ] Task: Verify build
- [ ] Task: Test hover tooltip on desktop
- [ ] Task: Test no hover interference on mobile touch
- [ ] Task: Test area color mode toggle
- [ ] Task: Test area legend matches marker colors
- [ ] Task: Test area filter chips
- [ ] Task: Test score range filter
- [ ] Task: Test criteria rating filter
- [ ] Task: Test all filters combined

## Deviations from Original Plan
