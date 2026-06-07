# Implementation Plan: Listing Management

## Phase 1: Type Updates [checkpoint: 5a87110]
- [x] Task: Update Listing type definition [e42d0b7]
    - [x] Update status type in types/listing.ts
    - [x] Verify TypeScript compilation
- [x] Task: User Manual Verification 'Phase 1'

## Phase 2: Component Structure Setup
- [x] Task: Create components directory [22276af]
    - [x] Create components/listings/ directory
- [ ] Task: Create ListingCard component
    - [ ] Create components/listings/ListingCard.tsx
    - [ ] Implement card layout with Title, Price, Status, Source URL
    - [ ] Add click handler for navigation to detail view
    - [ ] Add status color coding
- [ ] Task: Create ListingList component
    - [ ] Create components/listings/ListingList.tsx
    - [ ] Implement grid/card layout for multiple listings
    - [ ] Integrate with useListingStore
    - [ ] Add empty state message
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Form Components
- [ ] Task: Create Zod validation schema
    - [ ] Create lib/schemas/listingSchema.ts
    - [ ] Define validation rules for all fields
    - [ ] Test schema validation
- [ ] Task: Create CreateListingForm component
    - [ ] Create components/listings/CreateListingForm.tsx
    - [ ] Implement form with React Hook Form
    - [ ] Add form fields: Source URL, Title, Price, Area, Source Platform, Status
    - [ ] Integrate Zod validation
    - [ ] Add success/error handling
- [ ] Task: Create EditListingForm component
    - [ ] Create components/listings/EditListingForm.tsx
    - [ ] Implement form with React Hook Form
    - [ ] Pre-populate with existing data
    - [ ] Integrate Zod validation
    - [ ] Add success/error handling
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Detail View Component
- [ ] Task: Create ListingDetail component
    - [ ] Create components/listings/ListingDetail.tsx
    - [ ] Display all listing fields
    - [ ] Add "Open Source" button
    - [ ] Add Edit and Delete buttons
    - [ ] Add status management UI
- [ ] Task: Create DeleteConfirmation dialog
    - [ ] Use shadcn/ui Dialog component
    - [ ] Implement confirmation logic
    - [ ] Add cancel/confirm actions
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Page Integration
- [ ] Task: Update listings list page
    - [ ] Update app/listings/page.tsx
    - [ ] Integrate ListingList component
    - [ ] Add "Add Listing" button
    - [ ] Add CreateListingForm dialog
- [ ] Task: Update listing detail page
    - [ ] Update app/listings/[id]/page.tsx
    - [ ] Integrate ListingDetail component
    - [ ] Fetch listing data from store
    - [ ] Handle not-found state
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Status Management
- [ ] Task: Implement quick status change
    - [ ] Add status dropdown/buttons to ListingCard
    - [ ] Implement optimistic UI updates
    - [ ] Add status change confirmation (optional)
- [ ] Task: Add status color coding
    - [ ] Define status color palette
    - [ ] Apply colors to status indicators
    - [ ] Ensure accessibility (contrast)
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test create listing flow
    - [ ] Test edit listing flow
    - [ ] Test delete listing flow
    - [ ] Test status changes
    - [ ] Test source URL button
    - [ ] Test localStorage persistence
- [ ] Task: Verify mobile responsiveness
    - [ ] Test on mobile viewport
    - [ ] Verify touch targets
    - [ ] Test form on mobile
- [ ] Task: User Manual Verification 'Phase 7'
