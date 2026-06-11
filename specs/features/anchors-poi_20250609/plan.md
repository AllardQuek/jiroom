# Implementation Plan: Anchors & POIs — M3

## Phase 1: Data Model & Store
- [ ] Task: Create `types/anchor.ts` (Anchor interface + AnchorType)
- [ ] Task: Create `lib/schemas/anchorSchema.ts` (Zod schema)
- [ ] Task: Create `lib/constants/ANCHOR_COLORS.ts` (type → color map)
- [ ] Task: Create `store/anchorStore.ts` (Zustand + localStorage persist)
- [ ] Task: Update `features.md`

## Phase 2: Create Anchor Form
- [ ] Task: Create `components/anchors/CreateAnchorForm.tsx`
  - [ ] Fields: title, type (radio/pill selector), address, color picker (optional)
  - [ ] Location via Places Autocomplete (reuse existing PlaceAutocomplete)
  - [ ] Zod validation
  - [ ] Props: `defaultValues?`, `onSuccess`, `onCancel`
- [ ] Task: Verify form creates anchor in store

## Phase 3: Anchor Markers on Map
- [ ] Task: Create `components/map/AnchorMarker.tsx` (diamond shape, type-colored)
- [ ] Task: Update `components/map/MapView.tsx`
  - [ ] Import `useAnchorStore`
  - [ ] Render `AnchorMarker` for each anchor below listing markers
  - [ ] Add `showAnchors` local state toggle (default true)
  - [ ] Anchor click → InfoWindow with title, type badge, address, edit/delete
- [ ] Task: Create `components/map/AnchorInfoWindow.tsx` (inline or separate)
- [ ] Task: Extend `MapFilters.tsx` with anchor toggle
- [ ] Task: Verify anchors render with correct colors and are clickable

## Phase 4: Map-First Anchor Creation
- [ ] Task: Extend `LocationSearch` result actions
  - [ ] Show both "Create listing here" AND "Create anchor here" buttons
  - [ ] "Create anchor here" → opens CreateAnchorForm dialog
  - [ ] Pre-fill title, address, lat, lng from search result
- [ ] Task: Verify map-first anchor creation end-to-end

## Phase 5: Edit & Delete Anchors
- [ ] Task: Implement edit (reuse CreateAnchorForm with defaultValues)
- [ ] Task: Implement delete with confirmation dialog
- [ ] Task: Wire edit/delete into InfoWindow buttons

## Phase 6: Anchor List View
- [ ] Task: Create `components/anchors/AnchorList.tsx`
  - [ ] Scrollable list of AnchorCards
  - [ ] Sort by title or type
  - [ ] Tappable → switch to Map tab centered on anchor
- [ ] Task: Create `components/anchors/AnchorCard.tsx` (title, type badge, address, actions)
- [ ] Task: Create `app/anchors/page.tsx` route
- [ ] Task: Update `components/Navigation.tsx` (add Anchors tab or map button)

## Phase 7: Anchor Labels & Clarity
- [ ] Task: Create `components/map/AnchorLabel.tsx`
  - [ ] Renders type icon + anchor name below the diamond marker
  - [ ] Semi-transparent background with backdrop blur
  - [ ] Max width 120px with ellipsis
- [ ] Task: Update MapView to render labels below anchor markers
- [ ] Task: Implement zoom-dependent visibility (show at zoom ≥ 14)
- [ ] Task: Add label toggle in MapFilters alongside anchor toggle
- [ ] Task: Wire label hover → InfoWindow

## Phase 8: Verification
- [ ] Task: Verify TypeScript compilation
- [ ] Task: Verify lint
- [ ] Task: Verify build
- [ ] Task: Test create anchor from map search
- [ ] Task: Test create anchor from form
- [ ] Task: Test edit anchor
- [ ] Task: Test delete anchor (with confirmation)
- [ ] Task: Test anchor markers on map (colors, shape)
- [ ] Task: Test anchor InfoWindow
- [ ] Task: Test anchor toggle show/hide
- [ ] Task: Test anchor list view
- [ ] Task: Test persistence across reload
- [ ] Task: Test mobile responsiveness
