# Summary: Listing Management

## Overview

The Listing Management feature is the foundational data entry and management system for the Rental Viewing Evaluator. It enables users to create, edit, delete, and track room listings discovered on external property portals. Listings are displayed in a kanban-style board with drag-and-drop for pipeline management. This feature was implemented as a client-side only application using localStorage for persistence, following the MVP's no-auth architecture.

## Technical Architecture

### Component Structure

The feature is built around a clean component hierarchy:

- **ListingList** (`components/listings/ListingList.tsx`): Kanban board with drag-and-drop, group headers ("To View" / "Viewed"), and scheduled/unscheduled filter toggle
- **ListingCard** (`components/listings/ListingCard.tsx`): Individual listing card used across kanban, archived, and detail views
- **CreateListingForm** (`components/listings/CreateListingForm.tsx`): Dialog form for creating new listings
- **EditListingForm** (`components/listings/EditListingForm.tsx`): Dialog form for editing existing listings
- **ListingDetailModal** (`components/listings/ListingDetailModal.tsx`): Modal for full listing details and verdict/evaluation/notes
- **ListingDetailContent** (`components/listings/ListingDetailContent.tsx`): Inner content of the detail modal
- **DeleteConfirmationDialog** (`components/listings/DeleteConfirmationDialog.tsx`): Confirmation dialog for deletions

### State Management

We used Zustand with localStorage middleware for state persistence. The store (`store/listingStore.ts`) provides:
- `listings`: Array of listing objects
- `addListing`: Add a new listing
- `updateListing`: Update an existing listing
- `deleteListing`: Remove a listing
- `getListing`: Retrieve a specific listing by ID

The kanban also reads from:
- `useVerdictStore` — verdicts for Yes/Maybe/No column filtering
- `useViewingStore` — viewings for scheduled/unscheduled filter

### Form Validation

Forms use React Hook Form with Zod schema validation (`lib/schemas/listingSchema.ts`). This provides:
- Type-safe form handling
- Client-side validation before submission
- Clear error messages
- Integration with shadcn/ui form components

### Routing

The feature uses Next.js 16 dynamic routing:
- `/listings` — Kanban board page with toolbar (create, export, import, seed data)
- Detail is handled via a modal overlay (not a separate route), with URL-driven deep linking via `?detail=<id>` query param

### Type System

```typescript
export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "new" | "to_view" | "viewed" | "archived";
  notes?: string;
  lat?: number;
  lng?: number;
  googlePlaceId?: string;
  created_at: string;
}
```

This status progression supports the rental viewing workflow: discover (new) → schedule (to_view) → visit (viewed) → archive (archived). Verdicts (yes/maybe/no) are tracked separately via the verdict store and layered on top of the "viewed" status — a viewed listing with a "yes" verdict has been shortlisted, one with "no" has been rejected.

**Why 4 statuses?** The original design included `"shortlisted"` as a 5th status. It was removed because it duplicated the verdict system's job — a "yes" verdict effectively shortlists a listing, and a separate status would create ambiguity between "viewed (no verdict)" and "viewed + shortlisted."

## Key Technical Decisions

### Why Zustand for State Management?

Zustand was chosen over Redux or Context API for several reasons:
- **Simplicity**: Minimal boilerplate compared to Redux
- **Performance**: No unnecessary re-renders (selective subscriptions)
- **Built-in persistence**: localStorage middleware out of the box
- **TypeScript-first**: Excellent TypeScript support
- **Perfect for MVP**: Scales well but doesn't overcomplicate simple use cases

### Why React Hook Form + Zod?

This combination provides the best form handling experience:
- **React Hook Form**: Minimizes re-renders, excellent performance
- **Zod**: TypeScript-first validation, type inference from schemas
- **Integration**: Seamless integration with shadcn/ui components
- **Developer Experience**: Clear error messages, easy to debug

### Why Manual Data Entry?

The spec explicitly excluded automated URL parsing. This decision was intentional:
- **MVP scope**: Keeps the feature simple and focused
- **Flexibility**: Users can enter data from any source (not just major portals)
- **Reliability**: No dependency on external portal APIs or scraping
- **Privacy**: No data sent to third-party services

### Why Drag-and-Drop Kanban?

The kanban board was chosen over a flat list or table for several reasons:
- **Pipeline visibility**: Users can see at a glance which stage each listing is in
- **Direct manipulation**: Dragging between columns feels more intuitive than dropdown status selectors
- **Spatial memory**: Users build muscle memory for where listings live
- **Mobile fallback**: On mobile, the grid collapses to a single-column stack with titles inside each section

### Why Group Headers ("To View" / "Viewed")?

The flat 4-column layout didn't communicate that Yes/Maybe/No are all post-viewing decisions. Adding the "Viewed" group header over the right three columns makes the lifecycle explicit. The group headers also provide a natural place for total counts. See `specs/kanban-layout-decisions.md` for the full design exploration.

## Bugs Encountered and Fixes

### Next.js 16 Async Params Bug

**Problem**: Clicking on a listing card resulted in a 404 error on the detail page.

**Root Cause**: Next.js 16 changed dynamic route params from synchronous objects to async Promises. The original implementation treated `params` as a synchronous object, causing the ID lookup to fail immediately.

**Fix**: Detail is now handled via a modal overlay using query params (`?detail=<id>`) instead of a dynamic route, sidestepping the issue entirely.

**Lesson**: For modals/overlays, query params are simpler and more reliable than dynamic routes.

## Best Practices Applied

### Mobile-First Design

All components were designed with mobile as the primary consideration:
- Touch-friendly card layouts (minimum 44px touch targets)
- Responsive grid layouts that adapt to screen size (kanban collapses to single column)
- Forms optimized for mobile keyboards
- Column titles render inside droppable sections on mobile (not in shared header)

### Type Safety

Every component and function is fully typed:
- TypeScript interfaces for all data structures
- Zod schemas for form validation with type inference
- Type-safe store operations
- No `any` types used anywhere

### Accessibility

Status indicators use color coding with accessible contrast ratios:
- Gray for neutral states (new, archived)
- Blue for action states (to_view)
- Green for completion (viewed)

### Error Handling

Forms include comprehensive error handling:
- Inline validation with clear error messages
- Loading states during submission
- Graceful fallbacks for missing data
- Confirmation dialogs for destructive actions

## Performance Considerations

The implementation is optimized for performance:
- Zustand's selective subscriptions prevent unnecessary re-renders
- React Hook Form minimizes form re-renders
- Listing cards use stable keys for efficient list rendering
- localStorage persistence is fast and doesn't block the UI
- Drag-and-drop uses `@dnd-kit/core` with pointer sensor (8px activation distance to prevent accidental drags)

## Potential Pitfalls and How to Avoid Them

### 1. localStorage Quota Exceeded

**Risk**: localStorage has a 5-10MB limit. With many listings, this could be exceeded.

**Mitigation**: For MVP, this is acceptable. Future versions could implement:
- Data compression
- Old listing archival
- IndexedDB for larger storage

### 2. Drag-and-Drop Consistency

**Risk**: Dragging a listing between columns updates both listing status and verdict, but the stores are independent. A race condition could leave them out of sync.

**Mitigation**: Updates happen synchronously in the same `handleDragEnd` handler. The listing status update and verdict update are both atomic operations in their respective Zustand stores.

### 3. URL Validation False Positives

**Risk**: Zod's URL validation might reject valid but unusual URLs.

**Mitigation**: The validation is lenient enough for most use cases. Users can still save if needed.

## Lessons Learned

### Framework Breaking Changes

This feature taught us the importance of staying current with framework changes. The Next.js 16 async params change was a breaking change that could have been caught earlier by reviewing migration guides.

### Component Composition

Breaking down the UI into small, focused components (ListingCard, ListingList, etc.) made the codebase easier to test, debug, and maintain. Each component has a single responsibility.

### Kanban vs Flat List

Moving from a flat list to a kanban board was a significant UX improvement, but it required careful handling of mobile responsiveness. The solution (titles inside droppable sections on mobile, shared header on desktop) was more complex than expected but necessary for a good mobile experience.

## What Was Built

The Listing Management feature successfully delivers:
- ✅ Create listings with manual data entry (dialog)
- ✅ View all listings in a kanban board with drag-and-drop
- ✅ Group headers ("To View" / "Viewed") with hairline separator
- ✅ Scheduled/Unscheduled filter toggle in To View column
- ✅ View full listing details in a modal overlay
- ✅ Edit listing metadata
- ✅ Delete listings with confirmation
- ✅ Open source URL via dedicated button
- ✅ Archived section below kanban with horizontal scroll
- ✅ Drag-and-drop updates listing status and verdict simultaneously
- ✅ Mobile-responsive layout (single column stack on mobile)
- ✅ localStorage persistence across sessions
- ✅ Full TypeScript type safety
- ✅ Export/import data functionality
- ✅ Seed data for demo/testing
