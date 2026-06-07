# Verdict System

## Overview

Provide a final decision system for shortlisted listings. This feature enables users to make a final verdict (Yes, Maybe, No, Undecided) on listings after evaluation, with optional simple scoring display to support decision-making.

## Functional Requirements

### FR1: Verdict Status
- Track verdict status with 4 states:
  - **Yes**: User wants to proceed with this listing
  - **Maybe**: User is still considering
  - **No**: User has rejected this listing
  - **Undecided**: User hasn't made a decision yet
- Quick status change buttons
- Status changes persist immediately
- Visual color coding for different statuses

### FR2: Simple Scoring Display
- Calculate weighted score from evaluation responses
- Display score prominently in verdict section
- Score range: 0-100 (normalized)
- Score updates when evaluation responses change
- Score is for decision support, not automatic verdict

### FR3: Verdict Reasoning
- Optional text field for verdict reasoning
- Edit reasoning at any time
- Reasoning persists with verdict
- Display reasoning in verdict section

### FR4: Verdict UI Integration
- Dedicated verdict section in listing detail view
- Clear separation from other sections
- Mobile-friendly layout
- Collapsible section (optional for space)

### FR5: Verdict History
- Show when verdict was last updated
- Show verdict status prominently
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
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can set verdict status via quick buttons
- [ ] AC2: User can add verdict reasoning
- [ ] AC3: Score displays correctly from evaluation
- [ ] AC4: Verdict section displays in listing detail view
- [ ] AC5: Verdict status persists via localStorage
- [ ] AC6: Verdict reasoning persists via localStorage
- [ ] AC7: TypeScript compilation succeeds
- [ ] AC8: Mobile layout is responsive and usable

## Out of Scope

- Detailed score breakdown with contributing criteria
- Automatic verdict based on score
- Verdict history or timeline
- Verdict comparison across listings
- Verdict sharing or export

## Dependencies

- Evaluation Template (evaluation responses must exist)
- Listing Management (listing detail view must exist)
- State Management (Zustand stores must be available)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Type Updates Required
The existing `types/verdict.ts` Verdict type must be updated from:
```typescript
export interface Verdict {
  id: string;
  listing_id: string;
  status: "pass" | "fail" | "maybe";
  updated_at: string;
}
```
to:
```typescript
export interface Verdict {
  id: string;
  listing_id: string;
  status: "yes" | "maybe" | "no" | "undecided";
  reasoning?: string;
  score?: number; // calculated from evaluation
  updated_at: string;
  created_at: string;
}
```

### Score Calculation Logic
Simple weighted sum algorithm:
- Fetch evaluation responses for listing
- Fetch template with criteria weights
- For each criterion: response_value * weight
- Sum all weighted values
- Normalize to 0-100 scale
- Handle different input types:
  - Rating 1-5: value * weight
  - Checkbox: 1 or 0 * weight
  - Number: normalized value * weight
  - Text/Select: no score contribution

### Component Structure
- `components/verdict/VerdictSection.tsx` - Main verdict section in listing detail
- `components/verdict/VerdictStatusButtons.tsx` - Quick status change buttons
- `components/verdict/VerdictReasoning.tsx` - Reasoning input and display
- `components/verdict/ScoreDisplay.tsx` - Score calculation and display

### Status Color Coding
- Yes: Green
- Maybe: Yellow/orange
- No: Red
- Undecided: Gray/neutral

### Form Validation
Use React Hook Form with Zod schemas:
- Status: Enum validation
- Reasoning: Optional string, max length validation
