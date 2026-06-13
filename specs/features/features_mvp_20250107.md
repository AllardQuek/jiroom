# Feature Tree: MVP Features
# Generated: 2025-01-07
# Source: specs/architecture/HLD-Application-001.md, specs/requirements/engineering/ER-Core-001.md, specs/product.md

MVP Features
├── Listing Management @serial
├── Evaluation Template @serial
├── Viewing Tracking @parallel(Notes & Comments)
├── Notes & Comments @parallel(Viewing Tracking)
├── Verdict System @serial
└── Comparison View @serial

## Feature Clarifications

### Sub-feature 1: Listing Management
- **Goal:** Enable users to create, edit, and manage room listings from property portal URLs
- **Scope:** Create listings from URLs, edit basic metadata (title, price, area, platform), track listing status (New, To View, Viewed, Archived) in a drag-and-drop kanban board, open original source links. Out of scope: automated crawling, detailed property page reconstruction.
- **Key Deliverables:** Listing creation form, listing list view, listing detail view, status management UI, source link integration

### Sub-feature 2: Evaluation Template
- **Goal:** Provide a customizable evaluation template system for consistent room assessment
- **Scope:** Default template with common rental criteria, customizable criteria (add, remove, reorder), multiple input types (checkbox, rating 1-5, number, text, select), criteria grouping by category, optional weighting of criteria. Out of scope: AI-powered criteria suggestions.
- **Key Deliverables:** Default template, template editor UI, criteria management, template persistence

### Sub-feature 3: Viewing Tracking
- **Goal:** Allow users to schedule and track viewing appointments for listings
- **Scope:** Schedule optional viewing date/time, track viewing status (To View, Upcoming, Viewed, Skipped, Cancelled), add viewing-specific notes. Out of scope: calendar integration, reminder notifications.
- **Key Deliverables:** Viewing scheduling UI, viewing status management, viewing notes input

### Sub-feature 4: Notes & Comments
- **Goal:** Enable freeform note-taking at listing and viewing level
- **Scope:** Freeform notes at listing and viewing level, bullet-style input support, editable and timestamped notes, visible alongside template responses. Out of scope: rich text formatting, note sharing.
- **Key Deliverables:** Notes input component, notes display, notes persistence, bullet-style formatting

### Sub-feature 5: Verdict System
- **Goal:** Provide a final decision system for shortlisted listings
- **Scope:** Final decision states (Yes, Maybe, No — "undecided" is implicit when no verdict is set), user-controlled (not auto-generated), optional scoring display from evaluation (+1/0/-1), explainable scoring (shows contributing criteria). Out of scope: AI recommendations, collaborative decision-making.
- **Key Deliverables:** Verdict selection UI, optional scoring display, verdict persistence

### Sub-feature 6: Comparison View
- **Goal:** Enable side-by-side comparison of shortlisted listings
- **Scope:** Side-by-side comparison of shortlisted listings, key criteria responses displayed, verdict and viewing status, optional fit score, notes snippets. Out of scope: advanced filtering, comparison export.
- **Key Deliverables:** Comparison view UI, responsive table/grid layout, criteria comparison display

## Dependencies
- Listing Management → Evaluation Template
- Evaluation Template → Viewing Tracking
- Evaluation Template → Notes & Comments
- Viewing Tracking ↔ Notes & Comments (parallel)
- Viewing Tracking → Verdict System
- Notes & Comments → Verdict System
- Verdict System → Comparison View

## Notes
- All features depend on completed infrastructure (Project Initialization, UI Framework Setup, State Management, Routing Structure)
- Mobile-first design should be prioritized for all features
- All data persists via localStorage through Zustand stores
- TypeScript strict mode must be maintained throughout
