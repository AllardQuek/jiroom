# Anchors & Points of Interest — M3 Anchors

## Overview

Anchors are user-defined places of interest (home, work, school, MRT stations, grocery stores) that appear alongside listings on the map. They provide the spatial reference points needed for distance calculations (M4). Unlike listings, anchors have no price, status, or evaluation — they are simple location markers with a type and color.

## Use Cases

- Mark your home or office location
- Mark MRT stations near listings for commute planning
- Mark grocery stores, parks, or other amenities
- See all anchors on the map alongside listings (visually distinct)
- Edit or delete anchors
- Create anchors from the same Places search used for listings

## Milestone Roadmap

| Milestone | Scope | Status |
|-----------|-------|--------|
| M3 — Anchors | Data model, store, CRUD, map markers, anchor list | **Specified** |

---

## Functional Requirements

### FR1: Data Model
- **FR1.1**: An anchor SHALL have the following fields:
  - `id: string` — UUID
  - `title: string` — Display name
  - `type: AnchorType` — One of: `"home"`, `"work"`, `"school"`, `"station"`, `"other"`
  - `lat: number` — Latitude (required, unlike listings)
  - `lng: number` — Longitude (required)
  - `googlePlaceId?: string` — Google Place ID for enrichment
  - `address?: string` — Formatted address from Places API
  - `color?: string` — Optional custom color override (defaults to type-based color)
  - `createdAt: string` — ISO timestamp
- **FR1.2**: `lat` and `lng` SHALL be required (an anchor without coordinates is meaningless)
- **FR1.3**: The `type` field SHALL determine the default marker color:
  - `home`: `"#8B5CF6"` (violet)
  - `work`: `"#F59E0B"` (amber)
  - `school`: `"#10B981"` (emerald)
  - `station`: `"#3B82F6"` (blue)
  - `other`: `"#6B7280"` (gray)

### FR2: Anchor Store
- **FR2.1**: A Zustand store (`useAnchorStore`) SHALL manage anchors with localStorage persistence
- **FR2.2**: The store SHALL provide: `addAnchor`, `updateAnchor`, `deleteAnchor`, `getAnchor`, `anchors` array
- **FR2.3**: Store key: `"anchor-storage"`

### FR3: Anchor CRUD
- **FR3.1**: **Create**: User SHALL be able to create an anchor from:
  - The map view (search a location → "Create anchor here" button)
  - An anchor list page (form with Places Autocomplete)
- **FR3.2**: **Read**: Anchors SHALL appear as markers on the map (visually distinct from listing markers)
- **FR3.3**: **Update**: User SHALL be able to edit the title, type, and location of an anchor
- **FR3.4**: **Delete**: User SHALL be able to delete an anchor with confirmation

### FR4: Map Integration
- **FR4.1**: Anchor markers SHALL use a diamond/square shape to visually distinguish from listing pins
- **FR4.2**: Anchor markers SHALL be colored by type per FR1.3
- **FR4.3**: Clicking an anchor marker SHALL show an InfoWindow with:
  - Title
  - Type badge
  - Address (if available)
  - "Edit" and "Delete" buttons
- **FR4.4**: Anchor markers SHALL respect map filters (toggle anchors on/off)
- **FR4.5**: A toggle SHALL appear on the map (or in MapFilters) to show/hide anchors

### FR5: Map-First Anchor Creation
- **FR5.1**: The existing LocationSearch component SHALL be extended (or a new variant created) to support both "Create listing here" and "Create anchor here"
- **FR5.2**: Selecting a search result SHALL show two buttons: "Create listing here" and "Create anchor here"
- **FR5.3**: Tapping "Create anchor here" SHALL open a dialog with:
  - Title pre-filled from search result
  - Address pre-filled
  - Lat/lng pre-filled
  - Type selector (home, work, school, station, other)
  - Optional color picker
- **FR5.4**: On save, the anchor SHALL appear on the map immediately

### FR6: Anchor List View
- **FR6.1**: An anchor list view SHALL be accessible from the navigation
- **FR6.2**: The list SHALL show all anchors with: title, type badge, address, actions (edit, delete)
- **FR6.3**: Tapping an anchor in the list SHALL center the map on it (switch to Map tab)
- **FR6.4**: The list SHALL be sortable by title or type

### FR7: Navigation
- **FR7.1**: A new tab "Anchors" SHALL be added to the bottom navigation (between Map and Schedule), OR anchors SHALL be accessible from the Map view via a button
- **FR7.2**: Decision: Add "Anchors" as a 6th tab if the nav can accommodate it, otherwise add a button on the Map view

### FR8: Anchor Label Clarity (Updated June 2025)
- **FR8.1**: Anchor markers SHALL display a permanent text label below the diamond showing the anchor **type icon + name** (e.g. "🏠 Home", "💼 Work", "🏫 School", "🚇 Jurong East")
- **FR8.2**: Labels SHALL be rendered as HTML overlay markers positioned below each anchor marker
- **FR8.3**: Labels SHALL use a subtle background (semi-transparent white with blur) to remain readable over the map
- **FR8.4**: Labels SHALL be clamped to a max width of 120px with ellipsis overflow
- **FR8.5**: Hovering over an anchor marker OR its label SHALL show an InfoWindow with full details (title, type, address, edit/delete)
- **FR8.6**: On zoom levels < 14 (zoomed out), labels SHALL be hidden to reduce clutter; they appear at zoom ≥ 14
- **FR8.7**: Users MAY toggle labels on/off via the anchors toggle in filters

## Non-Functional Requirements

### NFR1: Visual Distinction
- **NFR1.1**: Anchor markers SHALL be visually distinct from listing markers at a glance
- **NFR1.2**: Suggested: diamond icon via CSS rotation of a square, or a different Pin glyph

### NFR2: Performance
- **NFR2.1**: Support up to 50 anchors without noticeable lag
- **NFR2.2**: Anchor store SHALL persist to localStorage (same as listings)

### NFR3: Mobile-First
- **NFR3.1**: Anchor creation dialog SHALL be full-screen on mobile or use the existing Dialog component
- **NFR3.2**: Anchor list SHALL be scrollable and use the same card layout as listings

## Acceptance Criteria

- [ ] AC1: User can create an anchor from the map search (type, location, title)
- [ ] AC2: Anchor appears on the map with correct type color and diamond shape
- [ ] AC3: Clicking an anchor shows InfoWindow with title, type, address, edit/delete
- [ ] AC4: User can edit anchor title and type
- [ ] AC5: User can delete an anchor with confirmation
- [ ] AC6: Anchor toggle on map shows/hides anchor markers
- [ ] AC7: Anchor list view shows all anchors with sort
- [ ] AC8: Tapping anchor in list navigates to map centered on that anchor
- [ ] AC9: Anchors persist across page reloads (localStorage)
- [ ] AC10: Anchors are visually distinct from listing markers
- [ ] AC11: Anchor labels (type icon + name) appear below markers at zoom ≥ 14
- [ ] AC12: Anchor labels are readable over the map (semi-transparent background)
- [ ] AC13: Hovering the label or marker triggers InfoWindow
- [ ] AC14: Labels hide at zoom < 14 and on label toggle off

## Data Model Changes

### New type: `types/anchor.ts`
```typescript
export type AnchorType = "home" | "work" | "school" | "station" | "other";

export interface Anchor {
  id: string;
  title: string;
  type: AnchorType;
  lat: number;
  lng: number;
  googlePlaceId?: string;
  address?: string;
  color?: string;
  createdAt: string;
}
```

### New Zod schema: `lib/schemas/anchorSchema.ts`
```typescript
export const anchorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["home", "work", "school", "station", "other"]),
  lat: z.number(),
  lng: z.number(),
  googlePlaceId: z.string().optional(),
  address: z.string().optional(),
  color: z.string().optional(),
});

export type AnchorFormData = z.infer<typeof anchorSchema>;
```

## Component Structure

```
components/
  map/
    MapView.tsx                 # Updated: anchor markers, anchor toggle, creation UI
    AnchorMarker.tsx            # Diamond-shaped marker for anchors
    AnchorInfoWindow.tsx        # InfoWindow content for anchors
  anchors/
    AnchorList.tsx              # Anchor list view
    AnchorCard.tsx              # Single anchor card in list
    CreateAnchorForm.tsx        # Form for creating/editing anchors
    AnchorTypeIcon.tsx          # Icon per anchor type
types/
  anchor.ts                     # Anchor interface + AnchorType
store/
  anchorStore.ts                # Zustand store with localStorage
lib/
  schemas/
    anchorSchema.ts             # Zod schema for anchor form validation
    ANCHOR_COLORS.ts            # Type → color mapping constant
```

## Dependencies

No new external dependencies. Reuses existing Places Autocomplete, Zustand, Dialog, form components.

## Technical Notes

### Marker Shape
Use Google's `Pin` component from `@vis.gl/react-google-maps` with a different `glyph` (e.g., a star or custom SVG) to distinguish anchors from listings. Alternatively, use `AdvancedMarker` with a custom `content` div:

```tsx
<AdvancedMarker position={{ lat, lng }}>
  <div
    className="w-4 h-4 rotate-45 border-2 border-white"
    style={{ backgroundColor: color }}
  />
</AdvancedMarker>
```

### Map Integration
The `MapView` component SHALL be extended to:
1. Subscribe to `useAnchorStore` for anchor data
2. Render `AnchorMarker` for each anchor
3. Add a `showAnchors` toggle state (default: true)
4. Extend `LocationSearch` result flow to offer anchor creation alongside listing creation
