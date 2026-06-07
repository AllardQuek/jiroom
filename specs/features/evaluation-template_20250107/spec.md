# Evaluation Template

## Overview

Provide a customizable evaluation template system for consistent room assessment. This feature enables users to define reusable evaluation criteria with multiple input types, grouping by category, and optional weighting to personalize their room evaluation process.

## Functional Requirements

### FR1: Default Template
- Pre-populate with common rental criteria organized by category:
  - Cost: Monthly rent, deposit, utilities included
  - Connectivity: Commute time, public transport access
  - Room Quality: Size, natural light, ventilation, cleanliness
  - Bathroom: Ensuite vs shared, cleanliness, water pressure
  - Household Rules: Guests allowed, cooking allowed, quiet hours
  - Access/Location: Neighborhood safety, proximity to amenities
  - Amenities: WiFi, AC, furnished, laundry
  - Lease/Risk: Lease duration, landlord responsiveness, contract terms
- Each criterion has appropriate input type (rating, checkbox, number, text, select)
- Default weight of 2 (Medium) for all criteria
- Users can delete or modify default template

### FR2: Template Management
- Create new blank templates
- Edit existing templates
- Delete templates with confirmation
- Template list view showing all templates
- Set default template for new evaluations

### FR3: Criteria Management
- Add new criteria to templates
- Edit existing criteria (name, description, type, category, weight)
- Delete criteria from templates
- Reorder criteria within template
- Duplicate criteria for quick setup

### FR4: Input Types
Support 5 input types for criteria:
- **Checkbox**: Yes/No boolean (e.g., "WiFi included")
- **Rating 1-5**: Subjective score (e.g., "Room cleanliness")
- **Number**: Quantitative value (e.g., "Commute time in minutes")
- **Text**: Freeform notes (e.g., "Additional comments")
- **Select**: Predefined options (e.g., "Lease duration: 6mo/12mo/24mo")

### FR5: Criteria Grouping
- Organize criteria by category
- Display criteria grouped by category in template editor
- Categories can be created/edited/deleted
- Default categories match the 8 groups in default template

### FR6: Criteria Weighting
- 1-3 scale for weight (1=Low, 2=Medium, 3=High importance)
- Weight selector in criteria editor
- Default weight of 2 for new criteria
- Weight displayed in template view

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Template editor should be usable on mobile
- Drag-and-drop reordering should have mobile alternative (up/down buttons)
- Criteria forms should be easy to complete on mobile

### NFR2: Performance
- Template loading should be instant
- Criteria operations (add/edit/delete) should complete within 200ms
- No unnecessary re-renders when editing criteria

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for form validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: Default template is pre-populated with 8 categories and common criteria
- [ ] AC2: User can create a new blank template
- [ ] AC3: User can edit template name and criteria
- [ ] AC4: User can add criteria with all 5 input types
- [ ] AC5: User can set criteria category
- [ ] AC6: User can set criteria weight (1-3 scale)
- [ ] AC7: User can reorder criteria
- [ ] AC8: User can delete criteria and templates
- [ ] AC9: All data persists via localStorage
- [ ] AC10: TypeScript compilation succeeds

## Out of Scope

- AI-powered criteria suggestions
- Template sharing or import/export
- Advanced scoring algorithms (beyond simple weighted sum)
- Template versioning or history
- Multi-user collaboration on templates

## Dependencies

- State Management (Zustand stores must be available)
- Routing Structure (template route must be configured)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Type Updates Required
The existing `types/evaluation.ts` Criterion type must be updated from:
```typescript
export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  type: "score" | "boolean" | "text";
}
```
to:
```typescript
export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-3 scale
  type: "checkbox" | "rating" | "number" | "text" | "select";
  category: string;
  options?: string[]; // for select type
}
```

### Component Structure
- `components/template/TemplateList.tsx` - List of all templates
- `components/template/TemplateEditor.tsx` - Main template editor
- `components/template/CriteriaForm.tsx` - Add/edit criteria form
- `components/template/CriteriaItem.tsx` - Individual criteria display
- `components/template/CategorySection.tsx` - Grouped criteria display

### Default Template Data
Default template should be seeded on first app load if no templates exist:
```typescript
const defaultTemplate: Template = {
  id: "default",
  name: "Default Rental Evaluation",
  criteria: [
    // Cost category
    { id: "c1", name: "Monthly rent", type: "number", category: "Cost", weight: 2, description: "Monthly rent in SGD" },
    // ... other criteria
  ],
  updated_at: new Date().toISOString()
}
```

### Form Validation
Use React Hook Form with Zod schemas:
- Template name: Required, min length
- Criteria name: Required, min length
- Criteria type: Required, enum validation
- Criteria weight: Number, min 1, max 3
- Criteria category: Required string
- Criteria options: Required for select type, array of strings

### Reordering Implementation
- Use array index for order
- Provide up/down buttons for mobile
- Drag-and-drop for desktop (optional enhancement)
