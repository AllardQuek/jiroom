# Summary: Verdict System

## Overview

The Verdict System enables users to make final decisions on listings after viewing and evaluation. This feature provides a structured way to assign verdicts (Yes, Maybe, No) with optional reasoning and displays a calculated score from the evaluation to support decision-making.

## Technical Architecture

### Component Structure

The feature is built around a modular component structure:

- **VerdictSection** (`components/verdict/VerdictSection.tsx`): Main verdict section in listing detail modal
- **VerdictStatusButtons** (`components/verdict/VerdictStatusButtons.tsx`): Quick status change buttons (Yes/Maybe/No) with color coding
- **ScoreDisplay** (`components/verdict/ScoreDisplay.tsx`): Score calculation and display from evaluation (+1/0/-1 system)
- **VerdictReasoning** (`components/verdict/VerdictReasoning.tsx`): Text input and display for verdict reasoning

### Type System

```typescript
export interface Verdict {
  id: string;
  listing_id: string;
  status: "yes" | "maybe" | "no";
  reasoning?: string;
  score?: number; // calculated from evaluation
  updated_at: string;
  created_at: string;
}
```

Note: "undecided" was removed from the original 4-state design. It's now implicit — no verdict record means undecided.

### Score Calculation

Score uses the +1/0/-1 system (see scoring-system spec), not a weighted 0-100 scale:
- Each scorable criterion contributes +1, 0, or -1
- Net score is shown prominently with color coding (green/red/orange)
- Breakdown: positives count (↑), negatives count (↓), neutrals (—), total answered
- `text`-type and `"na"` responses are excluded
- Score is `null` when no scorable responses exist

### Verdict Status

Three verdict states with color coding:
- **Yes**: Green (emerald) — User wants to proceed
- **Maybe**: Yellow/amber — User is still considering
- **No**: Red — User has rejected

No verdict set = implicit undecided (shown as "Not set yet" in UI).

## Key Technical Decisions

### Why 3 States Instead of 4?

The original design included "Undecided" as a fourth state. It was removed because:
- **No actionable difference**: Both "undecided" and "no verdict" result in the same user behavior
- **Kanban simplification**: Without "undecided", the kanban only needs 3 verdict columns instead of 4
- **Less state to manage**: Fewer states means less code, fewer edge cases, less confusion

The "Maybe" column catches both "still considering" and "no verdict yet" (`filter: !v || v.status === "maybe"`).

### Why Score from Evaluation (Not Separate)?

The score is calculated from evaluation responses rather than being a separate verdict score:
- **Single source of truth**: Score always reflects the latest evaluation data
- **No duplication**: Users don't need to maintain a separate score
- **Automatic updates**: Score updates when evaluation responses change
- **Consistency**: Same score appears in the verdict section, listing cards, and map tooltips

### Why Color-Coded Status Buttons?

Visual status indicators:
- **Instant recognition**: Users can see status at a glance
- **Emotional connection**: Colors convey meaning (green=good, red=bad)
- **Mobile-friendly**: Easy to tap on mobile
- **Consistent**: Matches UI patterns users expect

## Best Practices Applied

### Mobile-First Design

All components were designed with mobile as the primary consideration:
- Touch-friendly buttons (minimum 44px touch targets)
- Textarea optimized for mobile keyboards
- Collapsible sections for space management
- Prominent score display on mobile

### Type Safety

Every component and function is fully typed:
- TypeScript interfaces for all data structures
- Type-safe store operations
- No `any` types used anywhere
- Explicit type annotations for callbacks

### Instant UI Updates

Verdict changes use optimistic UI updates:
- Immediate visual feedback on status change
- No loading states for simple updates
- Smooth user experience
- Store updates happen in background

## Performance Considerations

The implementation is optimized for performance:
- Score calculation is O(n) where n is number of criteria
- Zustand's selective subscriptions prevent unnecessary re-renders
- Components use stable keys for efficient rendering
- localStorage persistence is fast and doesn't block the UI

## Potential Pitfalls and How to Avoid Them

### 1. Score Calculation Edge Cases

**Risk**: Missing responses or empty templates could cause errors.

**Mitigation**: Handle undefined responses gracefully and return null when no data is available.

### 2. Verdict Store Consistency

**Risk**: Multiple verdicts for the same listing could exist.

**Mitigation**: Use `getVerdictByListingId` to fetch the correct verdict and ensure only one verdict per listing.

### 3. Score Update Timing

**Risk**: Score might not update when evaluation changes.

**Mitigation**: Use `useMemo` to recalculate score when evaluation or template data changes.

## Lessons Learned

### Component Modularity

Breaking down the verdict UI into small, focused components (VerdictSection, VerdictStatusButtons, ScoreDisplay, VerdictReasoning) made the codebase easier to test, debug, and maintain. Each component has a single responsibility.

### Removing "Undecided" Simplified Everything

The original 4-state design seemed more expressive, but in practice the "undecided" state created:
- An extra state to manage in the verdict store
- Ambiguity with "no verdict" at the UI level
- An extra column in the kanban that would always be empty or redundant

Removing it simplified the type, store, components, and kanban without losing any real user-facing capability.

### Store Helper Methods

Adding `getVerdictByListingId` and `getEvaluationByListingId` helper methods to stores:
- Simplified component code
- Reduced data fetching logic
- Made components more reusable
- Centralized data access patterns

## What Was Built

The Verdict System feature successfully delivers:
- ✅ Three verdict status options (Yes, Maybe, No)
- ✅ Implicit "undecided" (no verdict record = undecided)
- ✅ Quick status change buttons with color coding
- ✅ Score calculation from evaluation responses (+1/0/-1)
- ✅ Prominent score display with color coding
- ✅ Optional verdict reasoning with edit functionality
- ✅ Verdict section in listing detail modal
- ✅ Collapsible functionality for space management
- ✅ localStorage persistence across sessions
- ✅ Full TypeScript type safety
- ✅ Mobile-responsive design
- ✅ Kanban integration (drag-to-column creates verdict)
