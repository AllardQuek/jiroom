# Evaluation Template

## Overview

Provide a customizable evaluation template system for consistent room assessment. This feature enables users to define reusable evaluation criteria with multiple input types, grouping by category, and optional weighting to personalize their room evaluation process.

## Functional Requirements

### FR1: Default Template
- Pre-populate with rental criteria organized by category (see full listing in §Default Template Data)
- Users can delete or modify the default template
- The default template is seeded once on first app load if no templates exist

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
- Default categories match the 9 groups in default template

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

- [ ] AC1: Default template is pre-populated with 9 categories and 32 criteria matching the master list
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
Default template seeded on first app load. 32 criteria across 9 categories.

**Response format conventions:**
- `select` with `["Yes", "No", "Maybe"]` — tristate evaluation
- `select` with `["OK", "Not OK", "Unsure"]` — quality assessment
- `select` with `["Yes", "No"]` — binary with explicit selection (no unchecked ambiguity)
- `number` — quantitative input
- `text` — freeform notes
- `checkbox` — not used in default template (use `select ["Yes", "No"]` instead for clarity)

#### Cost (weight: high)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c1 | Utilities included | select | Yes, No, Partial | 3 |
| c2 | Monthly utility cost (SGD) | number | Expected/average amount | 2 |
| c3 | Additional costs (cleaning, aircon, etc.) | select | Yes, No | 2 |
| c4 | Additional costs amount (SGD/mth) | number | Only applicable if c3=Yes | 2 |

#### Connectivity (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c5 | WiFi included | select | Yes, No, Maybe | 3 |
| c6 | WiFi coverage / quality notes | text | Free text | 1 |
| c7 | Mobile data coverage in room | select | Yes, No, Maybe | 2 |

#### Room (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c8 | Room windows | select | Window, Indoor window, No window | 2 |
| c9 | Bed size | select | Single, Super single, Queen, King | 2 |
| c10 | Walls | select | Real wall, Partition | 2 |
| c11 | Furniture included | select | Yes, No, Maybe | 2 |
| c12 | Power point availability | select | OK, Not OK, Unsure | 2 |
| c13 | Move-in date notes | text | e.g. lease expiry, early move-in | 2 |

#### Bathroom (weight: high)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c14 | Bathroom/shower quality (pressure, size) | select | Yes, No, Maybe | 3 |
| c15 | People sharing bathroom | number | 1-2→OK, 3→Maybe, 4+→Not OK (UI calculates mapping) | 3 |

#### Amenities (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c16 | Washer available | select | Yes, No | 2 |
| c17 | Dryer available | select | Yes, No | 1 |
| c18 | Trash management notes | text | Free text | 1 |

#### Household (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c19 | Tenant profile notes | text | Free text | 2 |
| c20 | Comfortable with current tenants | select | Yes, No, Maybe | 2 |
| c21 | Visitors allowed | select | Yes, No, Maybe | 2 |
| c22 | Visitor rules notes | text | Free text | 1 |

#### Surroundings (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c23 | Noise disturbances | select | Yes, No, Maybe (ambulance, plane, construction, common areas) | 2 |
| c24 | Wet weather accessibility | select | Yes, No, Maybe (sheltered walkways, place to wait out rain) | 2 |

#### Nearby (weight: low)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c25 | Nearby food options | text | Free text | 2 |
| c26 | Nearby supermarket | text | Free text | 2 |
| c27 | Nearby parks / running routes | text | Free text | 1 |

#### Additional (weight: medium)
| ID | Name | Type | Options / Desc | W |
|----|------|------|---------------|---|
| c28 | Break / transfer clause | text | Free text | 3 |
| c29 | Renewal terms & rent increase | text | Free text | 3 |
| c30 | Damage coverage (what's covered) | text | Free text | 3 |
| c31 | Deposit return conditions & timeline | text | Free text | 3 |
| c32 | Condo gates / shortcut to MRT/bus | select | Yes, No, Maybe | 1 |

**Response mapping for c15 (People sharing bathroom):**
- 1-2 people → mapped to "OK" (adds positive score)
- 3 people → mapped to "Maybe" (neutral)
- 4+ people → mapped to "Not OK" (negative)
The mapping is computed by the evaluation form UI; the user only inputs the number.

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
