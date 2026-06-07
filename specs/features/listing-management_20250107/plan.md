# Implementation Plan: Listing Management

## Phase 1: Type Updates [checkpoint: 5a87110]
- [x] Task: Update Listing type definition [e42d0b7]
    - [x] Update status type in types/listing.ts
    - [x] Verify TypeScript compilation
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Component Structure Setup [checkpoint: ecfee9c]
- [x] Task: Create components directory [22276af]
    - [x] Create components/listings/ directory
- [x] Task: Create ListingCard component [cfca322]
    - [x] Create components/listings/ListingCard.tsx
    - [x] Implement card layout with Title, Price, Status, Source URL
    - [x] Add click handler for navigation to detail view
    - [x] Add status color coding
- [x] Task: Create ListingList component [3410845]
    - [x] Create components/listings/ListingList.tsx
    - [x] Implement grid/card layout for multiple listings
    - [x] Integrate with useListingStore
    - [x] Add empty state message
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Form Components [checkpoint: 349e811]
- [x] Task: Create Zod validation schema [685912b]
    - [x] Create lib/schemas/listingSchema.ts
    - [x] Define validation rules for all fields
    - [x] Test schema validation
- [x] Task: Install @radix-ui/react-select dependency [3eb714a]
    - [x] Added to package.json
    - [x] User must run: npm install
- [x] Task: Create CreateListingForm component [83118e9]
    - [x] Create components/listings/CreateListingForm.tsx
    - [x] Implement form with React Hook Form
    - [x] Add form fields: Source URL, Title, Price, Area, Source Platform, Status
    - [x] Integrate Zod validation
    - [x] Add success/error handling
- [x] Task: Create EditListingForm component [63457fd]
    - [x] Create components/listings/EditListingForm.tsx
    - [x] Implement form with React Hook Form
    - [x] Pre-populate with existing data
    - [x] Integrate Zod validation
    - [x] Add success/error handling
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Detail View Component [checkpoint: a3809c3]
- [x] Task: Create ListingDetail component [a41196f]
    - [x] Create components/listings/ListingDetail.tsx
    - [x] Display all listing fields
    - [x] Add "Open Source" button
    - [x] Add Edit and Delete buttons
    - [x] Add status management UI
- [x] Task: Create DeleteConfirmation dialog [934e1fa]
    - [x] Use shadcn/ui Dialog component
    - [x] Implement confirmation logic
    - [x] Add cancel/confirm actions
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Page Integration [checkpoint: f96b802]
- [x] Task: Update listings list page [2477c10]
    - [x] Update app/listings/page.tsx
    - [x] Integrate ListingList component
    - [x] Add "Add Listing" button
    - [x] Add CreateListingForm dialog
- [x] Task: Update listing detail page [4fe2ebb]
    - [x] Update app/listings/[id]/page.tsx
    - [x] Integrate ListingDetail component
    - [x] Fetch listing data from store
    - [x] Handle not-found state
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Status Management [checkpoint: 4a9e3ab]
- [x] Task: Implement quick status change [f7759b9]
    - [x] Add status dropdown/buttons to ListingCard
    - [x] Implement optimistic UI updates
    - [x] Add status change confirmation (optional)
- [x] Task: Add status color coding [a41196f]
    - [x] Define status color palette
    - [x] Apply colors to status indicators
    - [x] Ensure accessibility (contrast)
- [x] Task: Install missing dependencies [ae2a0cd]
    - [x] Add @hookform/resolvers to package.json
    - [x] User must run: npm install
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit (requires npm install)
    - [ ] Verify no type errors (requires npm install)
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
