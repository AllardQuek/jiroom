# Implementation Plan: Map View — M1 Core Map

## Phase 1: Foundation & Configuration
- [ ] Task: Create Google Cloud Project & enable APIs
  - [ ] Enable Maps JavaScript API
  - [ ] Enable Places API
  - [ ] Create API key with HTTP referrer restriction (localhost + deployment domain)
- [ ] Task: Create `.env.local` with API key
  - [ ] Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Task: Install dependencies
  - [ ] `npm install @vis.gl/react-google-maps`
  - [ ] `npm install -D @types/google.maps`
- [ ] Task: Verify TypeScript compilation
  - [ ] `npx tsc --noEmit`

## Phase 2: Data Model Updates
- [ ] Task: Add location fields to `types/listing.ts`
  - [ ] Add optional `lat: number`
  - [ ] Add optional `lng: number`
  - [ ] Add optional `googlePlaceId: string`
- [ ] Task: Update `lib/schemas/listingSchema.ts`
  - [ ] Add optional lat/lng/googlePlaceId fields to Zod schema
- [ ] Task: Verify TypeScript compilation
  - [ ] `npx tsc --noEmit`

## Phase 3: Navigation & Routing
- [ ] Task: Create `app/map/page.tsx` (Map page route)
- [ ] Task: Update `components/Navigation.tsx` with Map tab (5th tab between Schedule and Templates)
  - [ ] Icon: `Map` from lucide-react
- [ ] Task: Verify navigation renders correctly on mobile and desktop

## Phase 4: Places Autocomplete Component
- [ ] Task: Create `components/map/PlaceAutocomplete.tsx`
  - [ ] Wraps Google Maps Places Autocomplete via `useMapsLibrary('places')`
  - [ ] Props: `onPlaceSelect(place: { title, area, lat, lng, googlePlaceId })`, optional `initialValue`
  - [ ] Loading state while Places library loads
- [ ] Task: Integrate into `components/listings/CreateListingForm.tsx`
  - [ ] Replace free-text area with PlaceAutocomplete
  - [ ] On select: set title, area, lat, lng, googlePlaceId
  - [ ] UX: if user edits title/area manually, clear lat/lng/googlePlaceId
- [ ] Task: Integrate into `components/listings/EditListingForm.tsx`
  - [ ] Same as create, but pre-populated
- [ ] Task: Verify Autocomplete flow end-to-end

## Phase 5: Map View Core
- [ ] Task: Create `components/map/MapViewContent.tsx`
  - [ ] Wrapped in `APIProvider` with API key
  - [ ] Renders `Map` with `defaultCenter` (Singapore: 1.3521, 103.8198), `defaultZoom` 12
  - [ ] Iterates over listings with coords, renders `AdvancedMarker` per listing
  - [ ] Marker `content` is a colored circle div derived from `listing.status`
- [ ] Task: Create `components/map/MapView.tsx`
  - [ ] Client component wrapper around MapViewContent (for Suspense)
- [ ] Task: Render MapView in `app/map/page.tsx`
- [ ] Task: Verify map renders with seed listing markers

## Phase 6: Marker InfoWindow
- [ ] Task: Create `components/map/ListingPreviewCard.tsx`
  - [ ] Shows: title, price (formatted), score (if available), status badge, area
  - [ ] Buttons: "View Details" + "Open in Google Maps"
- [ ] Task: Implement InfoWindow on marker click
  - [ ] Use Google Maps InfoWindow or the `@vis.gl/react-google-maps` equivalent
  - [ ] Close on clicking elsewhere
- [ ] Task: "View Details" opens listing detail modal (reuse existing ListingDetailModal)
- [ ] Task: "Open in Google Maps" link: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
- [ ] Task: Verify InfoWindow interactions work on mobile and desktop

## Phase 7: Map Filters
- [ ] Task: Create `components/map/MapFilters.tsx`
  - [ ] Filter by status: multi-select checkboxes (New, To View, Viewed, Shortlisted, Archived)
  - [ ] Filter by price range: min/max numeric inputs
- [ ] Task: Implement client-side filtering
  - [ ] Compute visible listings from store + filter state
  - [ ] Pass filtered listings to map component
  - [ ] Auto-fit map bounds to visible markers
- [ ] Task: Collapsible filter bar on mobile
- [ ] Task: Verify filters render and interact correctly

## Phase 8: Map-First Creation
- [ ] Task: Create `components/map/LocationSearch.tsx`
  - [ ] Places Autocomplete search box at top of map
  - [ ] On select: center map, drop temporary marker
  - [ ] Show "Create listing here" floating card
- [ ] Task: On "Create listing here":
  - [ ] Open create listing dialog (reuse `CreateListingForm`)
  - [ ] Pre-fill lat/lng/area/title from search result
  - [ ] On success: marker moves from temporary to permanent
- [ ] Task: Verify map-first creation flow end-to-end

## Phase 9: Verification
- [ ] Task: Verify TypeScript compilation (`npx tsc --noEmit`)
- [ ] Task: Verify lint (`npm run lint`)
- [ ] Task: Verify build (`npm run build`)
- [ ] Task: Test create listing with Places Autocomplete
- [ ] Task: Test edit listing location
- [ ] Task: Test map tab renders markers
- [ ] Task: Test marker InfoWindow on click
- [ ] Task: Test "Open in Google Maps" link
- [ ] Task: Test "View Details" opens listing modal
- [ ] Task: Test status filter
- [ ] Task: Test price range filter
- [ ] Task: Test map-first creation flow
- [ ] Task: Test listing without coordinates (should not appear)
- [ ] Task: Test mobile responsiveness
- [ ] Task: User Manual Verification 'Phase 9'
