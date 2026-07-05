# Viewing Tracking

## Overview

Allow users to schedule viewing appointments for listings. This feature enables users to manage their viewing workflow by scheduling viewings with optional date/time directly within the listing detail view.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter coordinating viewings after work, I want to schedule a date/time for each listing, so that I can plan my viewing route efficiently without double-booking myself.
- **All users**: As a renter who scheduled viewings across multiple days, I want to see an overview of upcoming viewings, so that I know what's on my calendar and can prepare accordingly.

### Design Rationale

Viewing tracking is a lightweight layer on top of listings rather than a separate calendar system. Users can optionally schedule a date/time for viewing appointments to help plan their viewing route efficiently.

## Functional Requirements

### FR1: Viewing Scheduling
- Schedule optional viewing date/time for a listing
- Date/time picker for scheduling
- Time zone awareness (local time)
- Clear indication of scheduled viewing
- Option to remove scheduled viewing

### FR2: Viewing UI Integration
- Dedicated viewing section in listing detail view
- Clear separation from listing metadata
- Mobile-friendly layout
- Collapsible section (optional for space)

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Date/time picker should be mobile-friendly
- Section should be scrollable if content is long

### NFR2: Performance
- Viewing operations should complete within 200ms
- Instant UI updates for date/time changes

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can schedule a viewing with date/time
- [ ] AC2: Viewing section displays in listing detail view
- [ ] AC3: Viewing date/time persists via localStorage
- [ ] AC4: TypeScript compilation succeeds
- [ ] AC5: Mobile layout is responsive and usable

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
The existing `types/listing.ts` Viewing type is:
```typescript
export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string;
  created_at: string;
}
```

### Viewing Store Required
Create a new Zustand store for Viewing management since one doesn't exist:
- `store/viewingStore.ts` with CRUD operations and localStorage persistence

### Component Structure
- `components/viewing/ViewingSection.tsx` - Main viewing section in listing detail
- `components/viewing/ScheduleViewingForm.tsx` - Date/time picker form

### Form Validation
Use React Hook Form with Zod schemas:
- Scheduled date: Date validation, optional

### Date/Time Picker
Use shadcn/ui components or a mobile-friendly date picker:
- Consider using native date input for mobile
- Format display as "Jan 15, 2025 at 2:00 PM"
- Handle time zone display (local time)
