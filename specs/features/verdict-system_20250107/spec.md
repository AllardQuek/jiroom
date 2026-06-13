# Verdict System

## Overview

Provide a final decision system for listings after viewing. This feature enables users to make a verdict (Yes, Maybe, No) on listings after evaluation, with optional reasoning and the scoring system's calculated score to support decision-making.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter evaluating 5+ listings, I want to mark a clear Yes/No/Maybe verdict on each one, so that I can quickly filter to my top candidates when it's time to make a decision.
- **All users**: As a renter who viewed a listing weeks ago, I want to see my saved verdict and reasoning, so that I can recall why I decided the way I did without re-reading all my notes and evaluation responses.
- **Family renter**: As a couple making a decision together, I want to see the evaluation score alongside the verdict, so that we can have an informed discussion about whether the data supports our gut feeling.

### Design Rationale

The verdict system uses 3 discrete states (Yes, Maybe, No) rather than a continuous scale because final rental decisions are inherently categorical — you either commit, reject, or remain uncertain.

**Why 3 states instead of 4?** The original design included "Undecided" as a fourth state to distinguish "haven't thought about it yet" from "thought about it and can't decide." In practice, this distinction was not actionable — both states resulted in the same user behavior (no decision made) and the same kanban placement (the "Maybe" column already catches "thought about it and can't decide"). Removing "Undecided" simplified the type system, UI, and state management without losing expressive power — "no verdict set" implicitly means undecided.

The optional reasoning field captures the *why* behind a decision, which is critical for recall weeks later when comparing multiple options. The score display is drawn from the evaluation system's calculated score (see scoring-system spec) using the +1/0/-1 system — not a separate verdict score — to keep a single source of truth for quantitative assessment.

## Functional Requirements

### FR1: Verdict Status
- Track verdict status with 3 states:
  - **Yes**: User wants to proceed with this listing
  - **Maybe**: User is still considering
  - **No**: User has rejected this listing
- No verdict = implicit undecided (no record in verdict store)
- Quick status change buttons
- Status changes persist immediately
- Visual color coding for different statuses

### FR2: Score Display
- Display score from evaluation system (+1/0/-1 scoring)
- Display net score prominently in verdict section
- Score updates when evaluation responses change
- Score is for decision support, not automatic verdict
- Display positive/negative/neutral breakdown counts

### FR3: Verdict Reasoning
- Optional text field for verdict reasoning
- Edit reasoning at any time
- Reasoning persists with verdict
- Display reasoning in verdict section

### FR4: Verdict UI Integration
- Dedicated verdict section in listing detail view (ListingDetailModal)
- Clear separation from other sections
- Mobile-friendly layout
- Collapsible section (default: expanded)

### FR5: Verdict History
- Show when verdict was last updated
- Show verdict status as a badge with color coding
- Show score alongside verdict
- Show reasoning when available

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Status buttons should have adequate touch targets
- Reasoning input should be easy on mobile keyboard
- Section should be scrollable if content is long
- Score display should be prominent on mobile

### NFR2: Performance
- Verdict operations should complete within 200ms
- Score calculation should be instant
- No unnecessary re-renders when updating verdict

### NFR3: Type Safety
- All components must use TypeScript
- Type-safe store operations

## Acceptance Criteria

- [x] AC1: User can set verdict status via quick buttons
- [x] AC2: User can add verdict reasoning
- [x] AC3: Score displays correctly from evaluation
- [x] AC4: Verdict section displays in listing detail view
- [x] AC5: Verdict status persists via localStorage
- [x] AC6: Verdict reasoning persists via localStorage
- [x] AC7: TypeScript compilation succeeds
- [x] AC8: Mobile layout is responsive and usable

## Out of Scope

- Detailed score breakdown with contributing criteria
- Automatic verdict based on score
- Verdict comparison across listings
- Verdict sharing or export
- Verdict history timeline

## Dependencies

- Evaluation Template (evaluation responses must exist)
- Scoring System (score calculation from evaluation)
- Listing Management (listing detail view must exist)
- State Management (Zustand stores must be available)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Current Type Definition

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

**Why "undecided" was removed:** The fourth state created ambiguity. In the kanban board, listings without a verdict already fall into the "Maybe" column (the filter is `!v || v.status === "maybe"`). Adding "undecided" would require either a fourth column or special handling, neither of which added value. A listing without a verdict record is implicitly undecided.

### Score Calculation

Score uses the +1/0/-1 system from the scoring system (see `specs/features/scoring-system_20250610/spec.md`), not a weighted 0-100 scale:
- Each scorable criterion contributes +1, 0, or -1
- Net score = sum of points
- Also tracks: positives count, negatives count, neutrals count, total answered
- Score is `null` when no scorable responses exist

### Component Structure
- `components/verdict/VerdictSection.tsx` — Main verdict section in listing detail modal
- `components/verdict/VerdictStatusButtons.tsx` — Quick status change buttons (Yes/Maybe/No)
- `components/verdict/VerdictReasoning.tsx` — Reasoning input and display
- `components/verdict/ScoreDisplay.tsx` — Score calculation and display from evaluation

### Status Color Coding
- Yes: Green (emerald)
- Maybe: Yellow/amber
- No: Red

### Kanban Integration
Verdict status drives the kanban column placement:
- `verdict === "yes"` → "Yes" column
- `verdict === "maybe"` or no verdict → "Maybe" column
- `verdict === "no"` → "No" column

Drag-and-drop from "To View" to a verdict column creates a verdict record if none exists.
