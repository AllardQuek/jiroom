# Map View

## Overview

Enable users to visualize their shortlisted listings on a map, add listings with location-aware input, and build spatial awareness of how listings relate to each other and to key places of interest. The map is a complementary surface to the existing kanban — not a replacement — supporting spatial reasoning (where are my options? how far apart?) that the list view cannot provide.

## Use Cases

- Visualize all saved listings on a map
- Categorize pins by status, price band, or area
- Filter map by status, price, area, or evaluation criteria
- Add a listing from a location search on the map
- Import an existing Google Maps saved list
- Set places of interest (work, MRT, parks) and see relative distances
- View straight-line distance or public transport route time to points of interest

## Milestone Roadmap

| Milestone | Scope | Status |
|-----------|-------|--------|
| M1 — Core Map | Map tab, Places Autocomplete on add/edit, markers by status, filters, tooltip | **Specified** |
| M2 — Import | Google Takeout CSV/GeoJSON/KML import → listing records | Future |
| M3 — Anchors | User-defined places of interest shown alongside listings | Future |
| M4 — Distances | Straight-line distances, later public transport routes | Future |

This spec covers **M1 only**. Subsequent milestones will be specified after M1 ships.

---

## M1 — Core Map

### Functional Requirements

#### FR1: Location-Aware Listing Input
- **FR1.1**: The create listing form SHALL include a "Location" field with Google Places Autocomplete
- **FR1.2**: Selecting an autocomplete result SHALL populate:
  - `title` with the place name
  - `area` with the locality / administrative area level 1 / sublocality (first available)
  - `lat` and `lng` with the place coordinates
  - `googlePlaceId` with the Google Place ID
- **FR1.3**: All fields after autocomplete SHALL remain editable by the user
- **FR1.4**: The edit listing form SHALL include the same Autocomplete field, pre-populated with the current location if available
- **FR1.5**: Creating or editing a listing without using Autocomplete SHALL leave `lat`, `lng`, and `googlePlaceId` unset (the listing will not appear on the map)

#### FR2: Map Tab
- **FR2.1**: The bottom navigation SHALL include a 5th tab "Map" between Schedule and Templates
- **FR2.2**: The Map tab SHALL render a full-viewport Google Map
- **FR2.3**: The map SHALL display a marker for every listing that has `lat` and `lng` set
- **FR2.4**: Markers SHALL be color-coded by listing status:
  - New: gray
  - To View: blue
  - Viewed: amber
  - Shortlisted: green
  - Archived: muted/dimmed
- **FR2.5**: Markers SHALL use Google's Advanced Markers with custom SVG icons for status colors

#### FR3: Marker Interaction
- **FR3.1**: Clicking a marker SHALL open an InfoWindow with:
  - Listing title
  - Price (formatted)
  - Score (if evaluated)
  - Status badge
  - Area
  - Buttons: "View Details" (opens listing detail modal), "Open in Google Maps" (opens google.com/maps/dir/?api=1&destination=lat,lng)
- **FR3.2**: The InfoWindow SHALL be dismissible by clicking the close button or clicking elsewhere on the map

#### FR4: Map Filters
- **FR4.1**: A filter bar SHALL appear at the top of the map view
- **FR4.2**: Filters SHALL include:
  - Status: multi-select checkboxes (New, To View, Viewed, Shortlisted, Archived)
  - Price range: min/max numeric inputs
- **FR4.3**: Applying a filter SHALL immediately show/hide markers on the map (no API call, client-side filter of store data)
- **FR4.4**: The map SHALL auto-fit bounds to show all visible markers after filtering

#### FR5: Map-First Listing Creation
- **FR5.1**: A search box SHALL appear at the top of the map view (same Places Autocomplete as the form)
- **FR5.2**: Selecting a search result SHALL:
  - Center the map on the selected location
  - Drop a temporary marker
  - Show a "Create listing here" button/card
- **FR5.3**: Tapping "Create listing here" SHALL open the create listing dialog with location fields pre-filled from the search result

### Non-Functional Requirements

#### NFR1: Google Maps API Integration
- **NFR1.1**: The Google Maps JavaScript API SHALL be loaded via `@vis.gl/react-google-maps` (APIProvider, Map, AdvancedMarker, useMapsLibrary hooks)
- **NFR1.2**: The API key SHALL be stored in a `.env.local` file as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **NFR1.3**: Required APIs to enable in Google Cloud Console: Maps JavaScript API, Places API
- **NFR1.4**: The map SHALL work without a map ID (default styling, no cloud customization required)

#### NFR2: Mobile-First UX
- **NFR2.1**: The map SHALL fill the viewport between the top bar and bottom nav
- **NFR2.2**: Filter bar SHALL be collapsible on mobile to maximize map real estate
- **NFR2.3**: InfoWindows SHALL be readable on small screens (max-width constrained)
- **NFR2.4**: Touch targets for markers and buttons SHALL be minimum 44px

#### NFR3: Performance
- **NFR3.1**: No Google Maps API calls on listings without coordinates (no wasted geocoding)
- **NFR3.2**: Marker rendering SHALL handle up to 100 markers without noticeable lag
- **NFR3.3**: Filter changes SHALL re-render within 100ms

### Acceptance Criteria

- [ ] AC1: User can search a location in the create listing form and have lat/lng/area/title pre-filled
- [ ] AC2: User can edit an existing listing's location using the same autocomplete
- [ ] AC3: A 5th "Map" tab appears in the bottom navigation
- [ ] AC4: Listings with coordinates render as color-coded markers on the map
- [ ] AC5: Clicking a marker shows an InfoWindow with listing details and action links
- [ ] AC6: The "Open in Google Maps" link opens correct directions in a new tab
- [ ] AC7: Status and price range filters correctly show/hide markers
- [ ] AC8: The map auto-fits bounds to visible markers
- [ ] AC9: User can search on the map and create a listing from the result
- [ ] AC10: Listings without coordinates are silently excluded from the map

### Out of Scope (M1)

- Google Takeout import (M2)
- Anchor/POI creation (M3)
- Distance calculation or route overlays (M4)
- Marker clustering
- Saved map view state (zoom, center)
- Cloud-based map styling or custom map IDs
- Batch geocoding existing listings without coordinates
- Verdict-based marker coloring (status only for M1)

### Data Model Changes

Add to `types/listing.ts`:

```typescript
export interface Listing {
  // ... existing fields ...
  lat?: number;           // Latitude from Places Autocomplete
  lng?: number;           // Longitude from Places Autocomplete
  googlePlaceId?: string; // Google Place ID for future enrichment
}
```

These fields are optional. Listings without them simply don't render on the map.

### Component Structure

```
components/
  map/
    MapView.tsx            # Main map page component
    MapViewContent.tsx     # Internal map wrapper (needs Suspense)
    MapFilters.tsx         # Filter bar (status, price range)
    ListingPreviewCard.tsx # InfoWindow content / bottom sheet content
    LocationSearch.tsx     # Places Autocomplete for map-first creation
    MapMarker.tsx          # Single marker wrapper (status-colored)
app/
  map/
    page.tsx               # Map page route
```

### Dependencies

- `@vis.gl/react-google-maps` — React components for Google Maps JS API
- `@types/google.maps` — TypeScript types for Google Maps (dev dependency)
- Google Cloud project with Maps JavaScript API + Places API enabled
- API key in `.env.local`

#### API Key Strategy

Use the [Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key) for development — no billing required, supports all M1 features (map rendering, markers, Places Autocomplete). Before regular personal use, upgrade the same key by adding billing (the $200/mo free credit covers a single-user tool indefinitely) or create a new billing-enabled key. Migration is a one-line env var change.

### Technical Notes

#### Script Loading
`@vis.gl/react-google-maps` handles script loading via `APIProvider`. No manual script tag or callback needed. The API key is passed as a prop:

```tsx
<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
  <Map ...>
    <AdvancedMarker ... />
  </Map>
</APIProvider>
```

#### Places Library Access
Use `useMapsLibrary('places')` hook to load the Places library for Autocomplete. This is loaded dynamically only when needed (lazy).

#### Autocomplete Integration
Both the create/edit form and the map search use the same `PlaceAutocomplete` wrapper component. On selection, both paths call the same callback to set `title`, `area`, `lat`, `lng`, `googlePlaceId`.

#### Marker Colors
Use `AdvancedMarker` with custom `content` (a `<div>` styled as a colored circle/pin) rather than the default red pin. The color is derived from `listing.status`.

#### InfoWindow
Use Google Maps `InfoWindow` (available via `useMapsLibrary`) or the `@vis.gl/react-google-maps` wrapper. Position it at the marker's coordinates.

#### No Geocoding
This spec explicitly does NOT include geocoding. Coordinates come only from Places Autocomplete selections. Existing listings without coordinates remain off the map until the user edits them and re-selects a location.

