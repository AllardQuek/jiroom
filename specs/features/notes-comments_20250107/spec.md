# Notes & Comments

## Overview

Enable freeform note-taking at listing level with bullet-style formatting support. This feature allows users to capture thoughts, observations, and details during their rental evaluation process, with notes displayed both inline in relevant sections and in a dedicated overview section.

## User Stories & Rationale

### User Stories

- **Young professional**: As a renter attending back-to-back viewings, I want to quickly jot down observations during or immediately after each visit, so that I don't forget which listing had the noisy aircon or the friendly housemates.
- **Family renter**: As a couple evaluating a listing together, I want to capture freeform notes about things that don't fit in structured evaluation fields (e.g., "landlord seemed rigid on move-in date"), so that we have a complete picture when discussing later.
- **All users**: As a renter with a long shortlist, I want to see a note preview on the listing card without opening the detail view, so that I can quickly distinguish listings by my own comments rather than just price and status.

### Design Rationale

Notes are intentionally freeform rather than structured fields because rental evaluation has too many unpredictable dimensions to capture in a fixed schema. The bullet-style formatting (lines starting with "-") provides lightweight structure without requiring a full rich-text editor — users can use it for quick lists of pros/cons, observations, or action items. The 80-character note preview on listing cards balances information density with scanability: enough to distinguish listings by key insight, not so much that cards become cluttered.

## Functional Requirements

### FR1: Listing-Level Notes
- Add notes field to Listing type
- Edit listing notes at any time
- Notes persist with listing
- Support bullet-style formatting (lines starting with "-")
- Timestamp notes (created_at, updated_at)

### FR2: Bullet Formatting
- Simple markdown-style: lines starting with "-" are rendered as bullets
- Mixed content: support both bullets and freeform text
- Auto-detect: parse "-" at start of line as bullet
- Display: render bullets as visual bullet points
- Mobile-friendly: easy to type "-" on mobile keyboard

### FR3: Notes Display - Inline
- Display listing notes inline in listing detail section
- Display evaluation notes inline in evaluation section (future)
- Notes visible alongside relevant content
- Collapsible inline notes (optional for space)

### FR4: Notes Display - Dedicated Section
- Dedicated Notes section at bottom of listing detail view
- Show all notes from listing and evaluation
- Group notes by source (Listing, Evaluation)
- Show timestamps for each note
- Edit notes directly from dedicated section

### FR5: Notes Editing
- Edit notes in place or via dialog
- Real-time save or save on blur
- Show last updated timestamp
- Undo/redo support (optional enhancement)

## Non-Functional Requirements

### NFR1: Mobile-First UX
- Notes input should be easy on mobile keyboard
- Bullet formatting should be simple to type on mobile
- Inline notes should be collapsible on mobile
- Dedicated section should be scrollable

### NFR2: Performance
- Notes operations should complete within 200ms
- Bullet parsing should be instant
- No unnecessary re-renders when editing notes

### NFR3: Type Safety
- All components must use TypeScript
- Zod schemas for validation
- Type-safe store operations

## Acceptance Criteria

- [ ] AC1: User can add listing notes with bullet formatting
- [ ] AC2: Notes display inline in relevant sections
- [ ] AC3: Notes display in dedicated section
- [ ] AC4: Notes persist via localStorage
- [ ] AC5: Notes have timestamps
- [ ] AC6: Bullet formatting renders correctly
- [ ] AC7: TypeScript compilation succeeds
- [ ] AC8: Mobile layout is responsive and usable

## Out of Scope

- Rich text formatting (bold, italic, links, etc.)
- Note sharing or export
- Note search or filtering
- Note collaboration or comments
- Note attachments or images
- Advanced markdown parsing

## Dependencies

- Listing Management (listing detail view must exist)
- State Management (Zustand stores must be available)
- UI Framework Setup (shadcn/ui components must be available)

## Technical Notes

### Type Updates Required
Add notes field to Listing type in `types/listing.ts`:
```typescript
export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "saved" | "viewed" | "rejected" | "shortlisted";
  notes?: string; // NEW: listing-level notes
  created_at: string;
}
```

### Component Structure
- `components/notes/NotesSection.tsx` - Dedicated notes overview section
- `components/notes/InlineNotes.tsx` - Inline notes display with edit
- `components/notes/NotesEditor.tsx` - Notes input with bullet formatting
- `components/notes/BulletParser.tsx` - Parse and render bullets

### Bullet Parsing Logic
Simple markdown-style parsing:
- Split text by newlines
- Lines starting with "- " are bullets
- Other lines are plain text
- Render bullets as visual bullet points
- Preserve original text for editing

### Store Updates
Update listingStore to handle notes field in updateListing action.

### Notes Storage Format
Store notes as plain text with markdown-style bullets:
```
- Good natural light
- Quiet neighborhood
Near MRT station
- Landlord seems nice
```

### Timestamp Display
Format timestamps as "Updated Jan 15, 2025 at 2:00 PM"
Show "Just now" for recent updates (within 1 hour)
