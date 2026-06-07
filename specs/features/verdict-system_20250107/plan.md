# Implementation Plan: Verdict System

## Phase 1: Type Updates
- [x] Task: Update Verdict type definition [c0f9dba]
    - [x] Update status field in types/verdict.ts to 4 types
    - [x] Add reasoning field
    - [x] Add score field
    - [x] Add created_at field
    - [x] Verify TypeScript compilation
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Score Calculation
- [x] Task: Create score calculation utility [b53933f]
    - [x] Create lib/utils/calculateScore.ts
    - [x] Implement weighted sum algorithm
    - [x] Handle different input types (rating, checkbox, number)
    - [x] Normalize to 0-100 scale
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Verdict Section Component
- [x] Task: Create VerdictSection component [1dc951c]
    - [x] Create components/verdict/VerdictSection.tsx
    - [x] Display verdict status prominently
    - [x] Display score when available
    - [x] Display reasoning when available
    - [x] Add collapsible functionality
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Status Management
- [x] Task: Create VerdictStatusButtons component [952cdfe]
    - [x] Create components/verdict/VerdictStatusButtons.tsx
    - [x] Implement 4 status buttons
    - [x] Add color coding for each status
    - [x] Add optimistic UI updates
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Score Display
- [~] Task: Create ScoreDisplay component
    - [x] Create components/verdict/ScoreDisplay.tsx
    - [x] Calculate score from evaluation
    - [x] Display score prominently
    - [x] Update score when evaluation changes
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Reasoning Component
- [ ] Task: Create VerdictReasoning component
    - [ ] Create components/verdict/VerdictReasoning.tsx
    - [ ] Implement text input for reasoning
    - [ ] Add edit/save functionality
    - [ ] Integrate with verdict store
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Page Integration
- [ ] Task: Integrate verdict into listing detail
    - [ ] Update app/listings/[id]/page.tsx
    - [ ] Add VerdictSection component
    - [ ] Fetch verdict data from store
    - [ ] Handle verdict not found state
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test status changes
    - [ ] Test verdict reasoning
    - [ ] Test score calculation
    - [ ] Test localStorage persistence
    - [ ] Test verdict section display
- [ ] Task: Verify mobile responsiveness
    - [ ] Test status buttons on mobile
    - [ ] Test reasoning input on mobile
    - [ ] Test score display on mobile
- [ ] Task: User Manual Verification 'Phase 8'
