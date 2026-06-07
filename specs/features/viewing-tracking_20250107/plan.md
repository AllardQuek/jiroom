# Implementation Plan: Viewing Tracking

## Phase 1: Type Updates
- [ ] Task: Update Viewing type definition
    - [ ] Update status field in types/listing.ts to 5 types
    - [ ] Make scheduled_date optional
    - [ ] Add created_at field
    - [ ] Verify TypeScript compilation
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Viewing Store
- [ ] Task: Create viewing store
    - [ ] Create store/viewingStore.ts
    - [ ] Define ViewingState interface
    - [ ] Implement CRUD operations (add, update, delete, get)
    - [ ] Add localStorage persistence
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Zod Validation Schemas
- [ ] Task: Create viewing validation schema
    - [ ] Create lib/schemas/viewingSchema.ts
    - [ ] Define validation for scheduled_date
    - [ ] Define validation for status
    - [ ] Define validation for notes
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Viewing Section Component
- [ ] Task: Create ViewingSection component
    - [ ] Create components/viewing/ViewingSection.tsx
    - [ ] Display viewing status prominently
    - [ ] Display scheduled date/time when available
    - [ ] Display viewing notes
    - [ ] Add collapsible functionality
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Schedule Viewing Form
- [ ] Task: Create ScheduleViewingForm component
    - [ ] Create components/viewing/ScheduleViewingForm.tsx
    - [ ] Implement date/time picker
    - [ ] Integrate with React Hook Form
    - [ ] Add Zod validation
    - [ ] Add save/cancel actions
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Status Management
- [ ] Task: Create ViewingStatusButtons component
    - [ ] Create components/viewing/ViewingStatusButtons.tsx
    - [ ] Implement 5 status buttons
    - [ ] Add color coding for each status
    - [ ] Add optimistic UI updates
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Notes Component
- [ ] Task: Create ViewingNotes component
    - [ ] Create components/viewing/ViewingNotes.tsx
    - [ ] Implement text input for notes
    - [ ] Add edit/save functionality
    - [ ] Integrate with viewing store
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Page Integration
- [ ] Task: Integrate viewing into listing detail
    - [ ] Update app/listings/[id]/page.tsx
    - [ ] Add ViewingSection component
    - [ ] Fetch viewing data from store
    - [ ] Handle viewing not found state
- [ ] Task: User Manual Verification 'Phase 8'

## Phase 9: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test schedule viewing flow
    - [ ] Test status changes
    - [ ] Test viewing notes
    - [ ] Test localStorage persistence
    - [ ] Test viewing section display
- [ ] Task: Verify mobile responsiveness
    - [ ] Test date picker on mobile
    - [ ] Test status buttons on mobile
    - [ ] Test notes input on mobile
- [ ] Task: User Manual Verification 'Phase 9'
