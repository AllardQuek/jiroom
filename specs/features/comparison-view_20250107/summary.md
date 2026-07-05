# Summary: Comparison View

## Overview

The Comparison View feature enables users to compare up to 3 listings side-by-side. Users can select listings from the listings page or add them from the detail view, then view a unified comparison of key metrics including price, area, evaluation scores, and verdict status.

## Technical Architecture

### Component Structure

The feature is built around a modular component structure:

- **ComparisonTable** (`components/comparison/ComparisonTable.tsx`): Main comparison table with empty state and clear all functionality
- **ComparisonColumn** (`components/comparison/ComparisonColumn.tsx`): Individual listing column displaying all metrics
- **ListingSelector** (`components/comparison/ListingSelector.tsx`): Checkbox selector for listings page
- **AddToCompareButton** (`components/comparison/AddToCompareButton.tsx`): Toggle button for detail view

### State Management

A new Zustand store was created for comparison management:

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

The store includes:
- localStorage persistence for selected listings
- Max limit validation (3 listings)
- Helper methods for checking selection state

### Layout Strategy

The comparison uses a responsive column-based layout:
- Desktop: 3 columns side-by-side (280px minimum width each)
- Tablet: 2 columns with horizontal scroll
- Mobile: 1 column with horizontal scroll
- CSS Grid for dynamic column count based on selected listings

### Metrics Displayed

Each comparison column displays:
- **Basic Metrics**: Title, price, area, source platform
- **Evaluation Score**: Calculated score from evaluation (0-100)
- **Verdict Status**: Yes/Maybe/No/Undecided with color coding
- **Actions**: Remove button and View Details link

## Key Technical Decisions

### Why Column-Based Layout?

Using a column-based layout instead of row-based:
- **Better for mobile**: Each listing is self-contained, easier to scroll horizontally
- **Simpler implementation**: No need for complex row alignment logic
- **More flexible**: Easy to add/remove columns dynamically
- **Better UX**: Users can focus on one listing at a time while comparing

### Why Checkbox + Button?

Two selection mechanisms:
- **Checkbox on listings page**: Quick selection for bulk comparison
- **Button on detail view**: Clear action when viewing a single listing
- **Consistent UI**: Both mechanisms use the same store
- **Flexibility**: Users can select from either view

### Why 3 Listing Limit?

Limiting to 3 listings:
- **UX constraint**: More than 3 becomes difficult to compare on mobile
- **Performance**: Limits data fetching and rendering
- **Decision support**: Forces users to narrow down to top choices
- **MVP appropriate**: Can be increased later if needed

## Best Practices Applied

### Mobile-First Design

All components were designed with mobile as the primary consideration:
- Horizontal scroll for comparison table on mobile
- Minimum column width (280px) for readability
- Touch-friendly buttons and checkboxes
- Responsive grid layout

### Type Safety

Every component and function is fully typed:
- TypeScript interfaces for all data structures
- Type-safe store operations
- No `any` types used anywhere
- Explicit type annotations for callbacks

### Instant UI Updates

Comparison changes use optimistic UI updates:
- Immediate visual feedback on selection
- No loading states for simple updates
- Smooth user experience
- Store updates happen in background

## Performance Considerations

The implementation is optimized for performance:
- Score calculation is O(n) where n is number of criteria
- Zustand's selective subscriptions prevent unnecessary re-renders
- Components use stable keys for efficient rendering
- localStorage persistence is fast and doesn't block the UI
- Horizontal scroll uses native browser scrolling (GPU accelerated)

## Potential Pitfalls and How to Avoid Them

### 1. Comparison State Inconsistency

**Risk**: Selected listings might not exist in the listing store.

**Mitigation**: Filter selected listings against the listing store when displaying comparison.

### 2. Score Calculation Edge Cases

**Risk**: Missing evaluations or templates could cause errors.

**Mitigation**: Handle undefined evaluations gracefully and return N/A when no data is available.

### 3. Mobile Layout Overflow

**Risk**: Columns might overflow on small screens.

**Mitigation**: Use horizontal scroll with minimum column width and CSS Grid for dynamic layout.

## Lessons Learned

### Component Modularity

Breaking down the comparison UI into small, focused components (ComparisonTable, ComparisonColumn, ListingSelector, AddToCompareButton) made the codebase easier to test, debug, and maintain. Each component has a single responsibility.

### Store Helper Methods

Adding helper methods like `isSelected` and `canAddMore` to the comparison store:
- Simplified component code
- Reduced conditional logic in components
- Made components more reusable
- Centralized business logic

### Simplified Layout Strategy

Choosing a column-based layout over a row-based table:
- Faster to implement
- Better for mobile
- Easier to maintain
- More flexible for future enhancements
- Still provides clear comparison of metrics

## What Was Built

The Comparison View feature successfully delivers:
- ✅ Listing selection from listings page via checkboxes
- ✅ Add to compare from detail view via button
- ✅ Remove listings from comparison
- ✅ Maximum of 3 listings limit
- ✅ "Compare" button when 2+ listings selected
- ✅ Side-by-side column layout for desktop
- ✅ Horizontal scroll for mobile
- ✅ Display of basic metrics (title, price, area, source)
- ✅ Display of evaluation scores
- ✅ Display of verdict status with color coding
- ✅ Navigate to listing detail from comparison
- ✅ Clear all selections
- ✅ localStorage persistence across sessions
- ✅ Full TypeScript type safety
- ✅ Mobile-responsive design

All acceptance criteria from the specification were met, and the feature is ready for production use in the MVP.
