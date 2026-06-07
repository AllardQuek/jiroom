# Implementation Plan: Comparison View

## Phase 1: Comparison Store
- [x] Task: Create comparison store [ceff1cf]
    - [x] Create store/comparisonStore.ts
    - [x] Define ComparisonState interface
    - [x] Implement add/remove/clear actions
    - [x] Add localStorage persistence
    - [x] Add max limit validation (3 listings)
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Listing Selector
- [~] Task: Create ListingSelector component
    - [x] Create components/comparison/ListingSelector.tsx
    - [x] Implement checkbox for each listing
    - [x] Integrate with comparison store
    - [x] Add visual highlight for selected listings
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Add to Compare Button
- [x] Task: Create AddToCompareButton component [cfc923c]
    - [x] Create components/comparison/AddToCompareButton.tsx
    - [x] Implement add/remove toggle
    - [x] Add disabled state when max limit reached
    - [x] Integrate with comparison store
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Comparison Table
- [x] Task: Create ComparisonTable component [26a7719]
    - [x] Create components/comparison/ComparisonTable.tsx
    - [x] Implement column layout (responsive)
    - [x] Add horizontal scroll for mobile
    - [x] Add empty state
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Comparison Column
- [ ] Task: Create ComparisonColumn component
    - [ ] Create components/comparison/ComparisonColumn.tsx
    - [ ] Display listing basic info
    - [ ] Display evaluation score
    - [ ] Display verdict status
    - [ ] Display viewing status
    - [ ] Add remove button
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Comparison Row
- [ ] Task: Create ComparisonRow component
    - [ ] Create components/comparison/ComparisonRow.tsx
    - [ ] Display metric label
    - [ ] Display values across columns
    - [ ] Implement metric highlighting logic
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Page Integration
- [ ] Task: Update listings page
    - [ ] Update app/listings/page.tsx
    - [ ] Add ListingSelector to listing cards
    - [ ] Add "Compare" button when 2+ selected
- [ ] Task: Update listing detail page
    - [ ] Update app/listings/[id]/page.tsx
    - [ ] Add AddToCompareButton
- [ ] Task: Update compare page
    - [ ] Update app/compare/page.tsx
    - [ ] Integrate ComparisonTable
    - [ ] Fetch comparison data from store
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test listing selection from list view
    - [ ] Test add to compare from detail view
    - [ ] Test comparison table display
    - [ ] Test remove from comparison
    - [ ] Test localStorage persistence
    - [ ] Test max limit (3 listings)
- [ ] Task: Verify mobile responsiveness
    - [ ] Test horizontal scroll on mobile
    - [ ] Test column layout on different screen sizes
    - [ ] Test touch targets on mobile
- [ ] Task: User Manual Verification 'Phase 8'
