# Implementation Plan: Evaluation Template

## Phase 1: Type Updates
- [x] Task: Update Criterion type definition [34f6ef0]
    - [x] Update type field in types/evaluation.ts to 5 types
    - [x] Add category field to Criterion interface
    - [x] Add options field to Criterion interface (for select type)
    - [x] Verify TypeScript compilation
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Default Template Data
- [x] Task: Create default template data [7b955e4]
    - [x] Create lib/data/defaultTemplate.ts
    - [x] Define 8 categories with common criteria
    - [x] Set appropriate input types for each criterion
    - [x] Set default weight of 2 for all criteria
- [x] Task: Implement template seeding [7b955e4]
    - [x] Add seeding logic to template store initialization
    - [x] Check if templates exist on app load
    - [x] Create default template if none exist
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Zod Validation Schemas
- [x] Task: Create template validation schema [7a4024b]
    - [x] Create lib/schemas/templateSchema.ts
    - [x] Define validation for template fields
    - [x] Define validation for criteria fields
    - [x] Add enum validation for types and weights
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Template List Component
- [x] Task: Create TemplateList component [32f8c1a]
    - [x] Create components/template/TemplateList.tsx
    - [x] Display all templates from store
    - [x] Add "Create Template" button
    - [x] Add edit/delete actions for each template
    - [x] Add empty state message
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Template Editor Component
- [x] Task: Create TemplateEditor component [ac7371f]
    - [x] Create components/template/TemplateEditor.tsx
    - [x] Implement template name editing
    - [x] Integrate with useTemplateStore
    - [x] Add save/cancel actions
- [x] Task: Create CategorySection component [ac7371f]
    - [x] Create components/template/CategorySection.tsx
    - [x] Display criteria grouped by category
    - [x] Add category header
    - [x] Add "Add Criteria" button per category
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Criteria Form Component
- [x] Task: Create CriteriaForm component [42696bf]
    - [x] Create components/template/CriteriaForm.tsx
    - [x] Implement form with React Hook Form
    - [x] Add fields: name, description, type, category, weight
    - [x] Add conditional options field for select type
    - [x] Integrate Zod validation
- [x] Task: Create CriteriaItem component [42696bf]
    - [x] Create components/template/CriteriaItem.tsx
    - [x] Display individual criteria
    - [x] Show type, weight, category indicators
    - [x] Add edit/delete actions
    - [x] Add up/down buttons for reordering
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Page Integration
- [x] Task: Update template page [1fc17bf]
    - [x] Update app/template/page.tsx
    - [x] Integrate TemplateList component
    - [x] Add CreateTemplateForm dialog
    - [x] Add TemplateEditor dialog
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Criteria Operations
- [x] Task: Implement add criteria [1fc17bf]
    - [x] Add criteria to template
    - [x] Generate unique ID
    - [x] Set default values
- [x] Task: Implement edit criteria [1fc17bf]
    - [x] Update criteria in template
    - [x] Handle type changes
- [x] Task: Implement delete criteria [1fc17bf]
    - [x] Add confirmation dialog
    - [x] Remove from template
- [x] Task: Implement reorder criteria [1fc17bf]
    - [x] Move criteria up/down in array
    - [x] Update template in store
- [ ] Task: User Manual Verification 'Phase 8'

## Phase 9: Verification
- [x] Task: Verify TypeScript compilation [38b7761]
    - [x] Run npx tsc --noEmit
    - [x] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test default template seeding
    - [ ] Test create blank template
    - [ ] Test add/edit/delete criteria
    - [ ] Test criteria reordering
    - [ ] Test all 5 input types
    - [ ] Test category grouping
    - [ ] Test weight selection
    - [ ] Test localStorage persistence
- [ ] Task: Verify mobile responsiveness
    - [ ] Test template editor on mobile
    - [ ] Test criteria form on mobile
    - [ ] Verify up/down buttons work
- [ ] Task: User Manual Verification 'Phase 9'
