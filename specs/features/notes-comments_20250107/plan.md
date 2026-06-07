# Implementation Plan: Notes & Comments

## Phase 1: Type Updates
- [x] Task: Update Listing type [2b60181]
    - [x] Add notes field to Listing interface in types/listing.ts
    - [x] Verify TypeScript compilation
- [x] Task: Update Viewing type [2b60181]
    - [x] Add notes_updated_at field to Viewing interface in types/listing.ts
    - [x] Verify TypeScript compilation
- [ ] Task: User Manual Verification 'Phase 1'

## Phase 2: Store Updates
- [x] Task: Update listing store [no-change-needed]
    - [x] Ensure updateListing action handles notes field
    - [x] Test notes persistence
- [ ] Task: User Manual Verification 'Phase 2'

## Phase 3: Bullet Parser
- [x] Task: Create BulletParser component [8d5a3af]
    - [x] Create components/notes/BulletParser.tsx
    - [x] Implement markdown-style bullet parsing
    - [x] Render bullets as visual bullet points
    - [x] Preserve original text for editing
- [ ] Task: User Manual Verification 'Phase 3'

## Phase 4: Notes Editor
- [x] Task: Create NotesEditor component [369eb52]
    - [x] Create components/notes/NotesEditor.tsx
    - [x] Implement textarea for notes input
    - [x] Add bullet formatting hint
    - [x] Add save/cancel actions
    - [x] Add timestamp display
- [ ] Task: User Manual Verification 'Phase 4'

## Phase 5: Inline Notes
- [x] Task: Create InlineNotes component [943d884]
    - [x] Create components/notes/InlineNotes.tsx
    - [x] Display notes with bullet parsing
    - [x] Add edit button
    - [x] Add collapsible functionality
- [ ] Task: User Manual Verification 'Phase 5'

## Phase 6: Dedicated Notes Section
- [x] Task: Create NotesSection component [21f2479]
    - [x] Create components/notes/NotesSection.tsx
    - [x] Display all notes grouped by source
    - [x] Show timestamps for each note
    - [x] Add edit functionality
    - [x] Add collapsible functionality
- [ ] Task: User Manual Verification 'Phase 6'

## Phase 7: Page Integration
- [x] Task: Integrate listing notes [32dad46]
    - [x] Update listing detail page
    - [x] Add inline notes to listing section
    - [x] Add NotesSection to page
- [x] Task: Integrate viewing notes [32dad46]
    - [x] Update viewing section
    - [x] Add inline notes to viewing section
    - [x] Ensure viewing notes use bullet parser
- [ ] Task: User Manual Verification 'Phase 7'

## Phase 8: Verification
- [ ] Task: Verify TypeScript compilation
    - [ ] Run npx tsc --noEmit
    - [ ] Verify no type errors
- [ ] Task: Verify functionality
    - [ ] Test listing notes with bullets
    - [ ] Test viewing notes with bullets
    - [ ] Test inline notes display
    - [ ] Test dedicated notes section
    - [ ] Test localStorage persistence
    - [ ] Test timestamp display
- [ ] Task: Verify mobile responsiveness
    - [ ] Test notes input on mobile
    - [ ] Test bullet typing on mobile
    - [ ] Test collapsible notes on mobile
- [ ] Task: User Manual Verification 'Phase 8'
