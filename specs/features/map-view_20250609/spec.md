# Map View — M1 Core Map

## Overview

Enable users to visualize their shortlisted listings on a map, add listings with location-aware input, and build spatial awareness of how listings relate to each other and to key places of interest. The map is a complementary surface to the existing kanban — not a replacement — supporting spatial reasoning (where are my options? how far apart?) that the list view cannot provide.

## Use Cases

- Visualize all saved listings on a map
- Categorize pins by status, area, or other grouping
- Filter map by status, price, area, or evaluation criteria
- Hover over a pin to see quick info: price, score, notes
- Add a listing from a location search on the map
- Import an existing Google Maps saved list
- Set places of interest (work, MRT, parks) and see relative distances
- View straight-line distance or public transport route time to points of interest

## Milestone Roadmap

| Milestone | Scope | Status |
|-----------|-------|--------|
| M1 — Core Map | Map tab, Places Autocomplete on add/edit, markers by status, filters, tooltip | **Shipped** |
| M1a — Map UX | Area-based coloring, hover tooltips, enhanced filters (area, score, criteria) | **Specified** |
| M3 — Anchors | User-defined places of interest shown alongside listings | **Shipped** |
| M4 — Routes | Transit/driving/walking routes from listing to anchors | **Specified** |

---

## M1 — Core Map (Shipped)

See `plan.md` for implementation details. The following sections document M1a enhancements added post-v1.

---

## M1a — Map UX Enhancements

### FR6: Hover Tooltips
- **FR6.1**: Hovering over a listing marker SHALL display a lightweight tooltip (not InfoWindow) showing:
  - Listing title (truncated)
  - Price (formatted)
  - Score (if evaluated)
  - Notes preview (first 80 characters, if present)
- **FR6.2**: The tooltip SHALL appear above the marker within 300ms of hover start
- **FR6.3**: The tooltip SHALL disappear on mouse leave
- **FR6.4**: On mobile (touch devices), tooltips SHALL NOT interfere with tap-to-select — the InfoWindow on click takes precedence
- **FR6.5**: Tooltips SHALL be implemented as a single shared floating overlay (not per-marker DOM nodes) to minimize re-renders

### FR7: Area-Based Marker Coloring
- **FR7.1**: The map SHALL support two coloring modes, toggled via a button in the filter panel:
  - **By Status** (default): markers colored by listing status (existing M1 behavior)
  - **By Area**: markers colored by geographic area (e.g. Tampines, Simei, Clementi)
- **FR7.2**: In "By Area" mode, areas SHALL be auto-detected from the `area` field on each listing
- **FR7.3**: Each unique area SHALL receive a distinct color from a predefined palette
- **FR7.4**: Listings without an `area` value SHALL default to a neutral "Unknown" gray
- **FR7.5**: A legend SHALL appear in the filter panel showing the area → color mapping

### FR8: Enhanced Filters
- **FR8.1**: The filter panel SHALL include an **Area** filter showing all unique areas as checkable chips
- **FR8.2**: The filter panel SHALL include a **Score** range filter (min/max, 0–10)
- **FR8.3**: The filter panel SHALL include a **Criteria** filter allowing the user to select specific evaluation criteria and set a minimum rating (e.g. "Rent must be ≥ 7")
- **FR8.4**: All filters SHALL compose logically (AND within each category, AND across categories)

### Acceptance Criteria (M1a)

- [ ] AC11: Hovering a marker shows a tooltip with price, score, and notes within 300ms
- [ ] AC12: Toggling "By Area" coloring re-colors markers by their `area` field
- [ ] AC13: Area filter chips show/hide listings by selected areas
- [ ] AC14: Score range filter shows/hides listings by evaluation score
- [ ] AC15: Criteria filter with minimum rating shows/hides listings accordingly
- [ ] AC16: All filters compose correctly with each other and with existing status/price filters

### Out of Scope (M1a)

- Marker clustering (separate feature if needed)
- Saved map view state (zoom, center)
- Cloud-based map styling or custom map IDs
- Batch geocoding existing listings without coordinates
- Google Takeout import (archived)

### Data Model Changes

No new fields. The existing `area` string field and evaluation store scores are sufficient.

### Component Structure (M1a Additions)

```
components/
  map/
    MapTooltip.tsx            # Shared hover tooltip overlay
    MarkerColorToggle.tsx     # "By Status" / "By Area" toggle
    AreaLegend.tsx            # Color legend for area mode
    MapFilters.tsx            # Updated: area chips, score range, criteria filter
```

### Technical Notes

#### Tooltip Implementation
Use a single shared `<div>` positioned absolutely on the map, driven by a hover state:
```tsx
const [hoveredMarker, setHoveredMarker] = useState<{ listing: Listing; x: number; y: number } | null>(null);
```
On `onMouseEnter` of an AdvancedMarker, calculate screen position using `map.getProjection()` and show the tooltip. On `onMouseLeave`, hide it.

#### Color Palette for Areas
Predefined palette of 12 colors for areas, cycling when exceeded:
```
#3B82F6 (blue), #EF4444 (red), #10B981 (green), #F59E0B (amber),
#8B5CF6 (violet), #EC4899 (pink), #06B6D4 (cyan), #F97316 (orange),
#84CC16 (lime), #6366F1 (indigo), #14B8A6 (teal), #A855F7 (purple)
```

#### Criteria Filter Implementation
Criteria data comes from the evaluation store (`useEvaluationStore`). Each evaluation has `responses` keyed by criterion ID. The filter picks a criterion + minimum score + any matching listing's evaluation must have that criterion ≥ min.

```tsx
const matchesCriteria = (listingId: string) => {
  const evaluation = evaluations.find(e => e.listingId === listingId);
  if (!evaluation || !selectedCriterion || minScore === null) return true;
  return (evaluation.responses[selectedCriterion]?.score ?? 0) >= minScore;
};
```
