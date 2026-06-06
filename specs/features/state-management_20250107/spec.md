# State Management

## Overview

Create Zustand stores with localStorage persistence for all data models (Listings, Evaluations, Templates, Verdicts). Define TypeScript types in a centralized `types/` directory. Implement separate stores for each data model following the architecture specification.

## Functional Requirements

### FR1: TypeScript Type Definitions
- Create `types/listing.ts` with Listing and Viewing interfaces
- Create `types/evaluation.ts` with Evaluation and Template interfaces
- Create `types/verdict.ts` with Verdict interface
- Define all types with proper TypeScript strict mode compliance

### FR2: Listing Store
- Create `store/listingStore.ts` with Zustand
- Implement CRUD actions (add, update, delete, get)
- Configure localStorage middleware for persistence
- Type-safe state and actions

### FR3: Evaluation Store
- Create `store/evaluationStore.ts` with Zustand
- Implement CRUD actions for evaluations
- Configure localStorage middleware for persistence
- Type-safe state and actions

### FR4: Template Store
- Create `store/templateStore.ts` with Zustand
- Implement CRUD actions for templates
- Configure localStorage middleware for persistence
- Type-safe state and actions

### FR5: Verdict Store
- Create `store/verdictStore.ts` with Zustand
- Implement CRUD actions for verdicts
- Configure localStorage middleware for persistence
- Type-safe state and actions

## Non-Functional Requirements

### NFR1: Type Safety
- All stores must be fully typed with TypeScript
- No implicit any types allowed
- Proper type inference for all actions

### NFR2: Performance
- Zustand should minimize re-renders
- localStorage writes should be debounced if needed
- Store initialization should be fast

### NFR3: Data Integrity
- localStorage middleware should handle errors gracefully
- Stores should validate data on load

## Acceptance Criteria

- [ ] AC1: TypeScript types defined in `types/` directory
- [ ] AC2: ListingStore created with localStorage persistence
- [ ] AC3: EvaluationStore created with localStorage persistence
- [ ] AC4: TemplateStore created with localStorage persistence
- [ ] AC5: VerdictStore created with localStorage persistence
- [ ] AC6: All stores have CRUD actions
- [ ] AC7: All stores are type-safe
- [ ] AC8: localStorage persistence works correctly
- [ ] AC9: TypeScript compilation succeeds with no errors

## Out of Scope

- Default data initialization (stores start empty)
- Complex computed values or selectors
- Store composition or cross-store actions
- Data migration logic

## Dependencies

- Project Initialization (must be completed first)

## Technical Notes

### Data Model Structure
Based on HLD-Application-001.md:
- Listing: id, source_url, source_platform, title, price, area, status, created_at
- Viewing: id, listing_id, scheduled_date, status, notes
- Evaluation: id, listing_id, template_id, responses, created_at, updated_at
- Template: id, name, criteria, updated_at
- Verdict: id, listing_id, status, updated_at

### Zustand Pattern
Each store should follow:
```typescript
interface State {
  items: Item[]
  addItem: (item: Item) => void
  updateItem: (id: string, item: Partial<Item>) => void
  deleteItem: (id: string) => void
  getItem: (id: string) => Item | undefined
}
```

### localStorage Middleware
Use Zustand's built-in localStorage middleware:
```typescript
import { persist } from 'zustand/middleware'
```
