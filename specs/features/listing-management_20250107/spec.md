# Listing Management

## Overview

Enable users to create, edit, and manage room listings from property portal URLs. This feature provides the foundational data entry and management capabilities for the Rental Viewing Evaluator, allowing users to track shortlisted rooms discovered on external property portals.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter browsing PropertyGuru, I find a listing I like and want to save it, so that I can track it alongside other options without keeping browser tabs open or copying details to a spreadsheet.
- **All users**: As a renter, I want to paste a URL and add minimal metadata (price, area), so that I can quickly capture a listing in seconds during a browsing session.
- **All users**: As a renter managing 10+ listings, I want to see them in a clean card-based list with price and status at a glance, so that I can scan and triage my options efficiently.
- **All users**: As a renter, I want to click through to the original source URL from the app, so that I can revisit the full listing details on the property portal without searching for it again.
- **All users**: As a renter who made a mistake or found a better option, I want to edit or delete listings, so that my shortlist stays accurate and reflects my current options.

### Design Rationale

Listings use manual data entry (paste URL, type price, etc.) rather than auto-extraction from property portal URLs because each portal has different HTML structure, making scraping fragile and costly to maintain. The manual approach is a deliberate trade-off: it takes 10-15 seconds per listing but works reliably for any source. The card-based list view was chosen over a table/grid because it's more mobile-friendly and allows richer per-item information (status badge, area, notes preview) without requiring horizontal scroll. Status (New / To View / Viewed / Shortlisted / Archived) provides a lightweight pipeline that maps to the typical renter workflow from initial discovery through final decision.

## Functional Requirements

### FR1: Listing List View
- Display all listings in a card-based layout
- Each card shows: Title, Price, Status, Source URL
- Cards should be mobile-friendly with responsive layout
- Clicking a card navigates to the listing detail view

### FR2: Listing Detail View
- Display full listing information: Title, Price, Area, Source Platform, Source URL, Status, Created Date
- Include a dedicated "Open Source" button to open the source URL in a new tab
- Provide options to edit or delete the listing
- Display status prominently with visual indicator

### FR3: Create Listing Form
- Form fields: Source URL (required), Title (required), Price (required), Area (optional), Source Platform (optional), Status (default: New)
- Manual data entry only - no URL parsing or auto-extraction
- Form validation using Zod schemas
- Success message after creation
- Redirect to listing detail view after creation

### FR4: Edit Listing Form
- Pre-populate with existing listing data
- All fields editable except ID and Created Date
- Form validation using Zod schemas
- Success message after update
- Stay on detail view after update

### FR5: Delete Listing
- Delete confirmation dialog
- Remove listing from store and localStorage
- Redirect to listings list view after deletion
- Show success message

### FR6: Status Management
- Quick status change buttons on listing cards
- Status options: New, To View, Viewed, Archived, Shortlisted
- Visual color coding for different statuses
- Status changes persist immediately

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Cards should be thumb-friendly on mobile
- Forms should be easy to complete on mobile keyboards
- Buttons should have adequate touch targets (min 44px)

### NFR2: Performance
- List view should render smoothly with 50+ listings
- Form submissions should complete within 500ms
- No unnecessary re-renders

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can create a listing with manual data entry
- [ ] AC2: User can view all listings in a card-based list
- [ ] AC3: User can view full details of a listing
- [ ] AC4: User can edit listing metadata
- [ ] AC5: User can delete a listing with confirmation
- [ ] AC6: User can change listing status via quick buttons
- [ ] AC7: User can open source URL via dedicated button
- [ ] AC8: All data persists via localStorage
- [ ] AC9: TypeScript compilation succeeds
- [ ] AC10: Mobile layout is responsive and usable

## Out of Scope

- Automated URL parsing or metadata extraction
- Property portal integration
- Image uploading or attachment
- Advanced filtering or search
- Bulk operations on listings
- Listing sharing or export

## Dependencies

- State Management (Zustand stores must be available)
- Routing Structure (routes must be configured)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Type Updates Required
The existing `types/listing.ts` status type must be updated from:
```typescript
status: "saved" | "viewed" | "rejected" | "shortlisted"
```
to:
```typescript
status: "new" | "to_view" | "viewed" | "archived" | "shortlisted"
```

### Component Structure
- `components/listings/ListingCard.tsx` - Individual listing card
- `components/listings/ListingList.tsx` - List of cards
- `components/listings/CreateListingForm.tsx` - Create form
- `components/listings/EditListingForm.tsx` - Edit form
- `components/listings/ListingDetail.tsx` - Detail view

### Form Validation
Use React Hook Form with Zod schemas:
- Source URL: URL validation
- Price: Positive number validation
- Title: Required, min length
- Area: Optional string
- Source Platform: Optional string
- Status: Enum validation

### Status Color Coding
- New: Gray/neutral
- To View: Blue/accent
- Viewed: Green
- Archived: Gray/dimmed
- Shortlisted: Gold/yellow
