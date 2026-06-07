# Comparison View

## Overview

Enable side-by-side comparison of multiple listings. This feature allows users to select up to 3 listings and compare their key metrics, evaluation scores, and verdict status in a unified view to support final decision-making.

## Functional Requirements

### FR1: Listing Selection
- Select listings to compare from listings page via checkboxes
- Add individual listing to compare from listing detail view
- Remove listings from comparison
- Maximum of 3 listings can be compared at once
- Clear indication of selected listings
- "Compare" button when 2+ listings selected

### FR2: Comparison Metrics Display
Display the following metrics for each listing:
- **Basic Metrics**: Title, price, area, source platform
- **Evaluation Score**: Calculated score from evaluation (if available)
- **Verdict Status**: Yes/Maybe/No/Undecided (if available)
- **Viewing Status**: To View/Upcoming/Viewed/Skipped/Cancelled (if available)

### FR3: Comparison Layout
- Side-by-side column layout for desktop
- Horizontal scroll for mobile
- Each listing in its own column
- Metric rows aligned across columns
- Highlight best values (e.g., lowest price, highest score)
- Empty state when no listings selected

### FR4: Comparison Navigation
- Navigate to listing detail from comparison view
- Remove listing from comparison
- Clear all selections
- Add more listings (if under max limit)

### FR5: Comparison Persistence
- Selected listings persist via localStorage
- Comparison state persists across sessions
- Auto-clear comparison after 7 days (optional)

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Horizontal scroll should be smooth on mobile
- Columns should have minimum width for readability
- Touch targets for actions should be adequate
- Layout should adapt to screen size

### NFR2: Performance
- Comparison operations should complete within 200ms
- Score calculation should be instant
- No unnecessary re-renders when adding/removing listings

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can select listings from listings page
- [ ] AC2: User can add listing to compare from detail view
- [ ] AC3: User can remove listings from comparison
- [ ] AC4: Comparison displays metrics for all selected listings
- [ ] AC5: Comparison limits to 3 listings max
- [ ] AC6: Comparison persists via localStorage
- [ ] AC7: TypeScript compilation succeeds
- [ ] AC8: Mobile layout is responsive and usable

## Out of Scope

- Detailed evaluation response comparison
- Custom comparison criteria selection
- Comparison export or sharing
- Comparison history
- Advanced filtering or sorting in comparison

## Dependencies

- Listing Management (listings page and detail view must exist)
- Evaluation Template (evaluation scores must exist)
- Verdict System (verdict status must exist)
- Viewing Tracking (viewing status must exist)
- State Management (Zustand stores must be available)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Comparison Store Required
Create a new Zustand store for Comparison management:
- `store/comparisonStore.ts` with selected listing IDs and localStorage persistence

### Component Structure
- `components/comparison/ComparisonTable.tsx` - Main comparison table
- `components/comparison/ComparisonColumn.tsx` - Individual listing column
- `components/comparison/ComparisonRow.tsx` - Metric row across columns
- `components/comparison/ListingSelector.tsx` - Checkbox selector for listings page
- `components/comparison/AddToCompareButton.tsx` - Add button for detail view

### Comparison Data Structure
```typescript
interface ComparisonState {
  selectedListingIds: string[];
  addToListing: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isSelected: (id: string) => boolean;
  canAddMore: () => boolean;
}
```

### Metric Highlighting Logic
- Price: Highlight lowest
- Score: Highlight highest
- Verdict: Highlight "Yes" status
- Viewing: Highlight "Viewed" status

### Layout Strategy
- Desktop: 3 columns side-by-side
- Tablet: 2 columns with horizontal scroll
- Mobile: 1 column with horizontal scroll
- Use CSS Grid or Flexbox for layout
- Minimum column width: 280px

### Selection Indicators
- Checkboxes on listings page
- "Add to Compare" button on detail view
- Badge showing count of selected listings
- Visual highlight for selected listings in list view
