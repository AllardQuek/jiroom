# Summary: Map View — M1 Core Map

## Overview
Added a Map tab to the bottom navigation with a full-viewport Google Map. Listings with coordinates appear as color-coded markers by status. Users can filter, click for details, search locations on the map to create new listings, and edit listing locations via Places Autocomplete.

## Technical Architecture
- **Google Maps**: `@vis.gl/react-google-maps` for Map, AdvancedMarker, InfoWindow, Pin
- **Places API**: Places API (New) — `PlaceAutocompleteElement` for forms, programmatic `AutocompleteSuggestion.fetchAutocompleteSuggestions` for map search
- **State**: `lat`, `lng`, `googlePlaceId` on existing `Listing` type (optional)
- **Navigation**: 5th tab between Schedule and Templates
- **APIProvider**: Wraps entire app in root layout

## Key Technical Decisions
1. **Places API (New) over legacy** — Legacy `Autocomplete` errored ("not enabled for your project"). Switched to `PlaceAutocompleteElement` widget for forms.
2. **Programmatic API over widget for map search** — `PlaceAutocompleteElement` uses Shadow DOM with dark theme styling inherited from map. Switched to `AutocompleteSuggestion.fetchAutocompleteSuggestions` for full control over input styling and predictions dropdown.
3. **Absolute positioning over MapControl** — `MapControl` inside `<Map>` caused clickability issues. Rendered search bar outside Map as `absolute` overlay.
4. **`@hookform/resolvers` v5** — Zod v4 uses `e.issues` not `e.errors`. Upgraded from v3 to v5 for Standard Schema spec compatibility.
5. **`APIProvider` in root layout** — Not scoped to MapView, so any page can use `useMapsLibrary` hooks.

## Bugs Encountered and Fixes
1. **Places API (New) widget unclickable** — Container ref div blocked pointer events. Fixed with `pointer-events-none` default, toggled to `auto` on widget load.
2. **Pin at (0,0) on every keystroke** — Fallback input's `onChange` called `onPlaceSelect` with `lat: 0, lng: 0`. Fixed by removing the call; pin only drops on confirmed selection.
3. **`PlaceAutocompleteElement` dark background** — Shadow DOM input inherited dark map theme. Fixed by switching to programmatic API.
4. **`@hookform/resolvers` v3 with Zod v4** — v3 checked `e.errors` which doesn't exist in Zod v4 (uses `e.issues`). Upgraded to v5 which uses Standard Schema spec.

## What Was Built
- `components/map/MapView.tsx` — Map, markers, InfoWindow, search overlay, create dialog
- `components/map/PlaceAutocomplete.tsx` — Places Autocomplete (widget + fallback) for forms
- `components/map/LocationSearch.tsx` — Map search (programmatic API + custom dropdown)
- `components/map/MapFilters.tsx` — Status + price range filter panel
- `app/map/page.tsx` — Map route with listing detail modal
- `components/Navigation.tsx` — Updated with Map tab
- `components/Providers.tsx` — APIProvider in root layout
