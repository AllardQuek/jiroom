# Notes & Comments

## Overview

Enable freeform note-taking at listing and viewing level with bullet-style formatting support. This feature allows users to capture thoughts, observations, and details during their rental evaluation process, with notes displayed both inline in relevant sections and in a dedicated overview section.

## Functional Requirements

### FR1: Listing-Level Notes
- Add notes field to Listing type
- Edit listing notes at any time
- Notes persist with listing
- Support bullet-style formatting (lines starting with "-")
- Timestamp notes (created_at, updated_at)

### FR2: Viewing-Level Notes
- Enhance existing Viewing notes with bullet formatting support
- Edit viewing notes at any time
- Notes persist with viewing
- Support bullet-style formatting
- Timestamp notes (created_at, updated_at)

### FR3: Bullet Formatting
- Simple markdown-style: lines starting with "-" are rendered as bullets
- Mixed content: support both bullets and freeform text
- Auto-detect: parse "-" at start of line as bullet
- Display: render bullets as visual bullet points
- Mobile-friendly: easy to type "-" on mobile keyboard

### FR4: Notes Display - Inline
- Display listing notes inline in listing detail section
- Display viewing notes inline in viewing section
- Display evaluation notes inline in evaluation section (future)
- Notes visible alongside relevant content
- Collapsible inline notes (optional for space)

### FR5: Notes Display - Dedicated Section
- Dedicated Notes section at bottom of listing detail view
- Show all notes from listing, viewing, and evaluation
- Group notes by source (Listing, Viewing, Evaluation)
- Show timestamps for each note
- Edit notes directly from dedicated section

### FR6: Notes Editing
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
- [ ] AC2: User can add viewing notes with bullet formatting
- [ ] AC3: Notes display inline in relevant sections
- [ ] AC4: Notes display in dedicated section
- [ ] AC5: Notes persist via localStorage
- [ ] AC6: Notes have timestamps
- [ ] AC7: Bullet formatting renders correctly
- [ ] AC8: TypeScript compilation succeeds
- [ ] AC9: Mobile layout is responsive and usable

## Out of Scope

- Rich text formatting (bold, italic, links, etc.)
- Note sharing or export
- Note search or filtering
- Note collaboration or comments
- Note attachments or images
- Advanced markdown parsing

## Dependencies

- Listing Management (listing detail view must exist)
- Viewing Tracking (viewing section must exist)
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

Update Viewing type to add timestamps (already has notes field):
```typescript
export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string;
  status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled";
  notes?: string;
  notes_updated_at?: string; // NEW: track when notes were last updated
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
Viewing notes already handled by viewingStore (to be created in Viewing Tracking feature).

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
