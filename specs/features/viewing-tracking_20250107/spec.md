# Viewing Tracking

## Overview

Allow users to schedule and track viewing appointments for listings. This feature enables users to manage their viewing workflow by scheduling viewings, tracking viewing status, and adding viewing-specific notes directly within the listing detail view.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter coordinating viewings after work, I want to schedule a date/time for each listing, so that I can plan my viewing route efficiently without double-booking myself.
- **All users**: As a renter who scheduled viewings across multiple days, I want to see an overview of upcoming viewings, so that I know what's on my calendar and can prepare accordingly.
- **All users**: As a renter attending a viewing, I want to capture notes specific to the visit (e.g., "landlord was late," "room smelled musty"), so that my viewing impressions are stored alongside the listing data and not lost in a separate notes app.
- **All users**: As a renter managing 10+ listings, I want to track viewing status (To View, Upcoming, Viewed, Skipped, Cancelled), so that I can see at a glance which listings I've actually seen in person versus still need to visit.

### Design Rationale

Viewing tracking is a lightweight layer on top of listings rather than a separate calendar system. The 5 statuses (To View / Upcoming / Viewed / Skipped / Cancelled) cover the full lifecycle of a viewing appointment from scheduling through outcome. "Skipped" and "Cancelled" are distinguished to capture intent: skipped means the user decided not to attend, while cancelled means the appointment was called off by either party — this distinction matters for future reference. Viewing-specific notes are stored separately from listing-level notes to preserve the context of when an observation was made (before, during, or after the visit).

## Functional Requirements

### FR1: Viewing Scheduling
- Schedule optional viewing date/time for a listing
- Date/time picker for scheduling
- Time zone awareness (local time)
- Clear indication of scheduled viewing
- Option to remove scheduled viewing

### FR2: Viewing Status Management
- Track viewing status with 5 states:
  - **To View**: User plans to view this listing
  - **Upcoming**: Viewing is scheduled in the future
  - **Viewed**: Viewing has been completed
  - **Skipped**: User decided not to view
  - **Cancelled**: Scheduled viewing was cancelled
- Quick status change buttons
- Status changes persist immediately
- Visual color coding for different statuses

### FR3: Viewing Notes
- Add viewing-specific notes (simple text field)
- Edit viewing notes at any time
- Notes persist with viewing record
- Notes display in viewing section

### FR4: Viewing History
- Display viewing history for each listing
- Show most recent viewing status prominently
- Show viewing date/time when scheduled
- Show viewing notes when available
- Support multiple viewings per listing (future enhancement, MVP: one viewing per listing)

### FR5: Viewing UI Integration
- Dedicated viewing section in listing detail view
- Clear separation from listing metadata
- Mobile-friendly layout
- Collapsible section (optional for space)

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Date/time picker should be mobile-friendly
- Status buttons should have adequate touch targets
- Notes input should be easy on mobile keyboard
- Section should be scrollable if content is long

### NFR2: Performance
- Viewing operations should complete within 200ms
- No unnecessary re-renders when updating viewing status
- Instant UI updates for status changes

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can schedule a viewing with date/time
- [ ] AC2: User can change viewing status via quick buttons
- [ ] AC3: User can add viewing notes
- [ ] AC4: Viewing section displays in listing detail view
- [ ] AC5: Viewing status persists via localStorage
- [ ] AC6: Viewing notes persist via localStorage
- [ ] AC7: TypeScript compilation succeeds
- [ ] AC8: Mobile layout is responsive and usable

## Out of Scope

- Calendar integration (Google Calendar, etc.)
- Reminder notifications
- Multiple viewings per listing (MVP: one viewing per listing)
- Viewing history across all listings
- Viewing analytics or insights

## Dependencies

- Listing Management (listing detail view must exist)
- State Management (Zustand stores must be available)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Type Updates Required
The existing `types/listing.ts` Viewing type must be updated from:
```typescript
export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}
```
to:
```typescript
export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string; // optional, only set when scheduled
  status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled";
  notes?: string;
  created_at: string;
}
```

### Viewing Store Required
Create a new Zustand store for Viewing management since one doesn't exist:
- `store/viewingStore.ts` with CRUD operations and localStorage persistence

### Component Structure
- `components/viewing/ViewingSection.tsx` - Main viewing section in listing detail
- `components/viewing/ScheduleViewingForm.tsx` - Date/time picker form
- `components/viewing/ViewingStatusButtons.tsx` - Quick status change buttons
- `components/viewing/ViewingNotes.tsx` - Notes input and display

### Form Validation
Use React Hook Form with Zod schemas:
- Scheduled date: Date validation, optional
- Status: Enum validation
- Notes: Optional string, max length validation

### Status Color Coding
- To View: Gray/neutral
- Upcoming: Blue/accent (scheduled)
- Viewed: Green (completed)
- Skipped: Yellow/orange
- Cancelled: Red

### Date/Time Picker
Use shadcn/ui components or a mobile-friendly date picker:
- Consider using native date input for mobile
- Format display as "Jan 15, 2025 at 2:00 PM"
- Handle time zone display (local time)
