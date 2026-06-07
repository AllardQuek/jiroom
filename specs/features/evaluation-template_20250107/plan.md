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
- [ ] Task: Create CriteriaForm component
    - [ ] Create components/template/CriteriaForm.tsx
    - [ ] Implement form with React Hook Form
    - [ ] Add fields: name, description, type, category, weight
    - [ ] Add conditional options field for select type
    - [ ] Integrate Zod validation
- [ ] Task: Create CriteriaItem component
    - [ ] Create components/template/CriteriaItem.tsx
    - [ ] Display individual criteria
    - [ ] Show type, weight, category indicators
    - [ ] Add edit/delete actions
    - [ ] Add up/down buttons for reordering
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Page Integration
- [ ] Task: Update template page
    - [ ] Update app/template/page.tsx
    - [ ] Integrate TemplateList component
    - [ ] Add CreateTemplateForm dialog
    - [ ] Add TemplateEditor dialog
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Criteria Operations
- [ ] Task: Implement add criteria
    - [ ] Add criteria to template
    - [ ] Generate unique ID
    - [ ] Set default values
- [ ] Task: Implement edit criteria
    - [ ] Update criteria in template
    - [ ] Handle type changes
- [ ] Task: Implement delete criteria
    - [ ] Add confirmation dialog
    - [ ] Remove from template
- [ ] Task: Implement reorder criteria
    - [ ] Move criteria up/down in array
    - [ ] Update template in store
- [ ] Task: User Manual Verification 'Phase 8'

## Phase 9: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
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
