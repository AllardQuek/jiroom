# Listing Management

## Overview

Enable users to create, edit, and manage room listings from property portal URLs. This feature provides the foundational data entry and management capabilities for the Rental Viewing Evaluator, allowing users to track shortlisted rooms discovered on external property portals. Listings are displayed in a kanban-style board with drag-and-drop for pipeline management.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter browsing PropertyGuru, I find a listing I like and want to save it, so that I can track it alongside other options without keeping browser tabs open or copying details to a spreadsheet.
- **All users**: As a renter, I want to paste a URL and add minimal metadata (price, area), so that I can quickly capture a listing in seconds during a browsing session.
- **All users**: As a renter managing 10+ listings, I want to see them in a clean card-based list with price and status at a glance, so that I can scan and triage my options efficiently.
- **All users**: As a renter, I want to click through to the original source URL from the app, so that I can revisit the full listing details on the property portal without searching for it again.
- **All users**: As a renter who made a mistake or found a better option, I want to edit or delete listings, so that my shortlist stays accurate and reflects my current options.

### Design Rationale

Listings use manual data entry (paste URL, type price, etc.) rather than auto-extraction from property portal URLs because each portal has different HTML structure, making scraping fragile and costly to maintain. The manual approach is a deliberate trade-off: it takes 10-15 seconds per listing but works reliably for any source.

The card-based kanban view was chosen over a table/grid because it's more mobile-friendly and allows richer per-item information (status badge, area, notes preview) without requiring horizontal scroll.

**Status pipeline**: The original design included a `"shortlisted"` status alongside `"new"`, `"to_view"`, `"viewed"`, and `"archived"`. Shortlisted was removed because it duplicated the function of the verdict system — a verdict of "yes" effectively shortlists a listing, making a separate status redundant. The `"archived"` status was later removed because it duplicated the "No" verdict — a listing with a "No" verdict is effectively rejected, and the archive section below the kanban added unnecessary complexity. This simplified the status model from 5 states to 3: `new → to_view → viewed`. Listings are removed from the active workflow via the "No" verdict column. A localStorage migration (version 0 → 1) converts any existing `archived` listings to `viewed` on hydration.

**Kanban layout evolution**: The initial layout was a flat 4-column grid treating all columns equally. It was later restructured with group headers ("To View" / "Viewed") to communicate the lifecycle distinction and a scheduled/unscheduled filter toggle in the To View column. See `specs/kanban-layout-decisions.md` for the full exploration and rationale.

## Functional Requirements

### FR1: Kanban Board View
- Display all listings in a 4-column kanban grid
- Columns: To View, Yes, Maybe, No
- Group headers: "To View" (col 1) and "Viewed" (cols 2-4) with center-aligned labels and hairline separator
- Scheduled/Unscheduled toggle in the To View column header (All, Unscheduled, Scheduled)
- Drag-and-drop between columns using `@dnd-kit/core`
- Drag overlay for visual feedback during drag
- Mobile: single-column stack with titles inside each section
- Each card shows: Title, Price, Status, Source URL
- Empty column placeholder: "Drop listings here"

### FR2: Verdict-Based Pipeline (replaces archived section)
- The "No" verdict column serves as the rejection zone — listings with a "No" verdict remain in the kanban's "Viewed" group under the "No" column
- No separate archive section exists below the kanban
- Removing a listing from the active workflow is done by dragging it to the "No" column (or via the "No" verdict in the listing detail)

### FR3: Listing Detail View (Modal)
- Display full listing information: Title, Price, Area, Source Platform, Source URL, Status, Created Date
- Include a dedicated "Open Source" button to open the source URL in a new tab
- Provide options to edit or delete the listing
- Display status prominently with visual indicator
- Opened via clicking a listing card in the kanban
- Handles URL-driven deep linking (`?detail=<id>` param)

### FR4: Create Listing Form
- Form fields: Source URL (required), Title (required), Price (required), Area (optional), Source Platform (optional), Status (default: New)
- Manual data entry only - no URL parsing or auto-extraction
- Form validation using Zod schemas
- Success message after creation
- Dialog-based (modal) rather than separate page

### FR5: Edit Listing Form
- Pre-populate with existing listing data
- All fields editable except ID and Created Date
- Form validation using Zod schemas
- Success message after update
- Accessible from the listing detail modal

### FR6: Delete Listing
- Delete confirmation dialog
- Remove listing from store and localStorage
- Renders confirmation dialog before deletion
- Show success message

### FR7: Status & Verdict Management (via drag-and-drop)
- Drop into "To View" → sets listing status to `to_view`, no verdict
- Drop into "Yes" → sets listing status to `viewed`, verdict to `yes`
- Drop into "Maybe" → sets listing status to `viewed`, verdict to `maybe`
- Drop into "No" → sets listing status to `viewed`, verdict to `no`
- Verdict record created if none exists, updated otherwise

### FR8: Scheduled/Unscheduled Filter
- Toggle pills: All (default), Unscheduled, Scheduled
- Filter applies only to the To View column
- "Scheduled" = listing has a `Viewing` record in the viewing store
- Purely local state, no persistence
- Count badge updates to reflect filtered count

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Cards should be thumb-friendly on mobile
- Forms should be easy to complete on mobile keyboards
- Buttons should have adequate touch targets (min 44px)
- On mobile, column titles render inside each droppable section (not in a shared header row)

### NFR2: Performance
- List view should render smoothly with 50+ listings
- Form submissions should complete within 500ms
- No unnecessary re-renders
- Drag-and-drop should feel instant (no async operations)

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [x] AC1: User can create a listing with manual data entry
- [x] AC2: User can view all listings in a kanban board
- [x] AC3: User can view full details of a listing in a modal
- [x] AC4: User can edit listing metadata
- [x] AC5: User can delete a listing with confirmation
- [x] AC6: User can drag listings between kanban columns
- [x] AC7: User can filter To View column by Unscheduled
- [x] AC8: User can open source URL via dedicated button
- [x] AC9: All data persists via localStorage
- [x] AC10: TypeScript compilation succeeds
- [x] AC11: Mobile layout is responsive and usable
- [x] AC12: "No" verdict column serves as the rejection zone (archived section removed)

## Out of Scope

- Automated URL parsing or metadata extraction
- Property portal integration
- Image uploading or attachment
- Advanced filtering or search (beyond scheduled/unscheduled toggle)
- Bulk operations on listings
- Listing sharing or export
- Drag from archived back into kanban

## Dependencies

- State Management (Zustand stores must be available)
- Routing Structure (routes must be configured)
- UI Framework Setup (shadcn/ui components must be available)
- Viewing Tracking (viewing store for scheduled/unscheduled filter)
- Verdict System (verdict store for Yes/Maybe/No columns)
- `@dnd-kit/core` for drag-and-drop

## Technical Notes

### Current Type Definition

```typescript
export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
   status: "new" | "to_view" | "viewed";
  notes?: string;
  lat?: number;
  lng?: number;
  googlePlaceId?: string;
  created_at: string;
}
```

**Why 4 statuses (not 5)?** "shortlisted" was removed because it duplicated the verdict system. A listing with a "yes" verdict is effectively shortlisted. Keeping it as a separate status would create ambiguity between "viewed (no verdict)" and "shortlisted" — they're the same pipeline stage but with different decision outcomes.

### Component Structure

- `components/listings/ListingList.tsx` — Kanban board with drag-and-drop, group headers, filter toggle
- `components/listings/ListingCard.tsx` — Individual listing card (used in kanban, archived, and detail)
- `components/listings/CreateListingForm.tsx` — Create form (dialog)
- `components/listings/EditListingForm.tsx` — Edit form (dialog)
- `components/listings/ListingDetailModal.tsx` — Detail view (dialog/modal)
- `components/listings/ListingDetailContent.tsx` — Detail view inner content
- `components/listings/DeleteConfirmationDialog.tsx` — Delete confirmation
- `app/listings/ListingsPageInner.tsx` — Page wrapper with toolbar (create, export, import, seed data)

### Kanban Column Structure

```typescript
interface Column {
  id: string;
  title: string;
  group: "not_viewed" | "viewed";
  filter: (listing: Listing, verdict?: Verdict) => boolean;
  dropData: { dropStatus: ListingStatus; dropVerdict?: "yes" | "maybe" | "no" };
}
```

Columns defined:
| id | title | group | filter |
|----|-------|-------|--------|
| `to_view` | To View | `not_viewed` | `status === "new" \|\| status === "to_view"` |
| `yes` | Yes | `viewed` | `status === "viewed" && verdict === "yes"` |
| `maybe` | Maybe | `viewed` | `status === "viewed" && (no verdict \|\| verdict === "maybe")` |
| `no` | No | `viewed` | `status === "viewed" && verdict === "no"` |

### Form Validation
Use React Hook Form with Zod schemas:
- Source URL: URL validation
- Price: Positive number validation
- Title: Required, min length
- Area: Optional string
- Source Platform: Optional string
- Status: Enum validation (new, to_view, viewed, archived)

### Status Color Coding
- New: Gray/neutral
- To View: Blue/accent
- Viewed: Green
- Archived: Gray/dimmed
