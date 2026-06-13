# Kanban Layout: Design Decisions & Rationale

## Context

The listing kanban board serves as the primary workflow tool — users move listings through a pipeline from discovery through decision. The initial layout was a flat 4-column grid that treated all columns equally, which created ambiguity about the relationship between columns.

## Original State

```
┌────────────┬──────────┬───────────┬──────────┐
│ To View    │ Yes      │ Maybe     │ No       │
│────────────│──────────│───────────│──────────│
│ new/to_view│ viewed + │ viewed +  │ viewed + │
│            │ yes      │ maybe     │ no       │
└────────────┴──────────┴───────────┴──────────┘
```

All columns at the same visual level, even though the right three share a "viewed" lifecycle state.

## Design Exploration

### Problem: Flat layout lacks hierarchy

The right three columns (Yes/Maybe/No) are conceptually grouped — they represent a post-viewing decision. The left column (To View) is a pre-viewing state. The flat grid didn't communicate this distinction.

### Option A — Inline badge on verdict columns

Add a small `VIEWED` chip next to each verdict column's count badge. Minimal code change, subtle signal.

```
┌────────────┬───────────┬─────────────┬──────────┐
│ To View    │ Yes       │ Maybe       │ No       │
│ 2          │ 1  VIEWED │ 3  VIEWED   │ 0  VIEWED│
└────────────┴───────────┴─────────────┴──────────┘
```

**Pros**: Zero layout changes, titles stay aligned
**Cons**: Weak visual grouping, label repeats per column

### Option B — Nested grid sections

A 1+3 split layout with "To View" in a left section and "VIEWED" wrapping the right three columns.

```
┌──────────────┬──────────────────────────────────┐
│              │            VIEWED                │
│──────────────│──────────────────────────────────│
│ To View      │  Yes       │  Maybe    │  No     │
│──────────────│──────────────────────────────────│
│  cards       │  cards     │  cards    │  cards  │
└──────────────┴──────────────────────────────────┘
```

**Pros**: Strong visual grouping, clear hierarchy
**Cons**: Complex nested grid, column titles misaligned unless carefully handled

### Option C — Shared header row (selected)

Group headers on row 1, column subtitles on row 2, cards on row 3.

```
┌──────────────┬──────────────────────────────────┐
│  TO VIEW     │           VIEWED                 │
│──── ─────────│──────────── ─────── ─────────────│
│ [All]        │  Yes        │  Maybe   │  No     │
│ [Unscheduled]│  (1)        │  (3)      │  (0)   │
│ [Scheduled]  │             │          │         │
│      (3)     │             │          │         │
│──────────────│—————————————│——————————│—————————│
│  cards       │  cards      │  cards   │  cards  │
└──────────────┴─────────────┴──────────┴─────────┘
```

**Pros**: Titles align, clear grouping, no repetition
**Cons**: Additional row adds visual weight

### Sub-discussion: To View subtitles

Two sub-questions arose during implementation:

#### 1. Subtitle text (removed)

The verdict columns had subtitle text:
- Yes: "Confirmed choices"
- Maybe: "On the fence or awaiting review"
- No: "Not pursuing"

**Decision**: Removed. The column titles are self-evident. Subtext added visual noise without information value once users understand the kanban pattern.

#### 2. Scheduled/Unscheduled filter (added)

A toggle filter was added to the "To View" column so users can distinguish listings that have a scheduled viewing from those that don't.

**Rationale**: The core use case is knowing which listings still need scheduling attention. Without this filter, users had to mentally track which listings had viewings. The toggle is purely local state — no data model changes.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Group header visibility | `text-muted-foreground/70` | Bold enough to read, subtle enough to not compete with column titles |
| Group header alignment | Centered | Emphasizes the grouped-columns concept; centered over the column group feels intentional |
| Hairline separator | `border-b border-border/30` | Provides a clean break between group headers and content without adding another grid row |
| Column title size | `text-xs font-semibold` | Compact enough to sit alongside toggle pills without overpowering them |
| Toggle pill styling | `text-xs font-medium`, rounded bg | Interactive affordance distinct from static column titles; active state uses `bg-primary/10 text-primary` |
| Mobile titles | Inside droppable sections | On mobile (single-column), titles render inside each card section so context is preserved; desktop uses shared header row |

## Final Layout

### Desktop (lg+): 4-column grid

```
         TO VIEW                       VIEWED
       ─────────────      ──────────────────────────────
[All] [Unscheduled] [Sched]   Yes          Maybe        No
         (3)                   (1)          (3)          (0)
┌──────────────┐     ┌─────────────┐  ┌──────────┐  ┌───────┐
│ cards        │     │ cards       │  │ cards    │  │       │
└──────────────┘     └─────────────┘  └──────────┘  └───────┘
```

Grid structure:
- Row 1: Group headers (TO VIEW col 1, VIEWED cols 2-4) — `hidden lg:flex`
- Row 2: Sub-headers (toggle pills col 1, verdict titles cols 2-4) — `hidden lg:block`
- Row 3: Droppable card areas — all 4 columns

### Mobile (<lg): Single-column stack

Each column becomes its own section. Titles render inside each droppable area.

```
┌─────────────────────────┐
│ [All] [Unscheduled]     │
│ [Scheduled]        (3)  │
│ ┌───────────────────┐   │
│ │ cards              │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ Yes               (1)   │
│ ┌───────────────────┐   │
│ │ cards              │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ Maybe             (3)   │
│ ...                     │
└─────────────────────────┘
```

Group headers (TO VIEW / VIEWED) and the hairline are hidden on mobile — they'd add clutter without value in a single-column layout.

## Component Architecture

The kanban lives in `components/listings/ListingList.tsx`. Key structural elements:

- **`ListingList`** — Main component, owns grid layout, drag-and-drop context, filter state
- **`DroppableColumn`** — Wrapper for card areas (no title rendering since titles moved to grid rows)
- **`DraggableListing`** — Individual card wrapper with drag behavior

### State

- `toViewFilter`: `"all" | "unscheduled" | "scheduled"` — local `useState`, purely client-side
- Listings from `useListingStore`
- Verdicts from `useVerdictStore`
- Viewings from `useViewingStore` (to determine scheduled/unscheduled)

### Filter logic

A listing is "scheduled" if a `Viewing` record exists (checked via `viewings.some(v => v.listing_id === listing.id)`). The filter is applied on top of the existing column status filter, not replacing it.

## Future Considerations

- **Collapsible columns**: If users manage many listings, allowing columns to be collapsed would save screen space — especially "No" or "Not Scheduled" when empty
- **Drag across group boundaries**: Currently listsings can be dragged from any column to any column. If the `not_viewed/viewed` distinction becomes more rigid (e.g., a listing must be marked viewed before receiving a verdict), this could be enforced in the `handleDragEnd` handler
- **Persistent filter state**: Currently the toggle defaults to "All" on page load. If users frequently use the "Unscheduled" view, the preference could be persisted
