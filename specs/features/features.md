# Features

This file tracks all features in the Rental Viewing Evaluator project. Each feature spec includes a **User Stories & Rationale** section explaining *why* the feature exists and the decisions behind it.

## Core Application Setup (Infrastructure)

- [x] **Feature: Project Initialization**
  *Link: [./project-initialization_20250107/](./project-initialization_20250107/)*
- [x] **Feature: UI Framework Setup**
  *Link: [./ui-framework-setup_20250107/](./ui-framework-setup_20250107/)*
- [x] **Feature: State Management**
  *Link: [./state-management_20250107/](./state-management_20250107/)*
- [x] **Feature: Routing Structure**
  *Link: [./routing-structure_20250107/](./routing-structure_20250107/)*

## MVP Features (User-Facing Functionality)

- [x] **Feature: Listing Management**
  *Link: [./listing-management_20250107/](./listing-management_20250107/)* | [User Stories](#)
  *Why: Quickly capture listings from property portals with minimal friction.*
- [x] **Feature: Evaluation Template**
  *Link: [./evaluation-template_20250107/](./evaluation-template_20250107/)*
  *Why: Consistent, repeatable evaluation across all listings with customizable criteria.*
- [x] **Feature: Viewing Tracking**
  *Link: [./viewing-tracking_20250107/](./viewing-tracking_20250107/)*
  *Why: Plan and track viewing appointments without a separate calendar tool.*
- [x] **Feature: Notes & Comments**
  *Link: [./notes-comments_20250107/](./notes-comments_20250107/)*
  *Why: Capture unstructured observations that structured evaluation fields can't cover.*
- [x] **Feature: Verdict System**
  *Link: [./verdict-system_20250107/](./verdict-system_20250107/)*
  *Why: Make clear Yes/No/Maybe decisions with reasoning attached.*
- [x] **Feature: Comparison View**
  *Link: [./comparison-view_20250107/](./comparison-view_20250107/)*
  *Why: Side-by-side comparison for the final decision between top candidates.*
- [x] **Feature: Scoring System**
  *Link: [./scoring-system_20250610/](./scoring-system_20250610/)*
  *Why: Simple +1/0/-1 scoring that users can intuitively understand and trust.*

## Map & Spatial Features

- [x] **Feature: Map View (M1)**
  *Link: [./map-view_20250609/](./map-view_20250609/)* | [User Stories](#)
  Status: **Shipped**. Map tab, Places Autocomplete, markers by status, filters, map-first creation.
  **M1a (shipped)**: Hover tooltips, area-based coloring, enhanced filters (area, score, criteria).
  *Why: Spatial reasoning — see where listings are relative to each other and to key places.*

- [x] **Feature: Anchors & POIs (M3)**
  *Link: [./anchors-poi_20250609/](./anchors-poi_20250609/)* | [User Stories](#)
  Status: **Shipped**. Diamond markers by type, create from map, list view, InfoWindow, labels at zoom≥14.
  *Why: Define reference points (office, school, MRT) for commute calculations.*

- [x] **Feature: Distances & Routes (M4)**
  *Link: [./distances-routes_20250609/](./distances-routes_20250609/)* | [User Stories](#)
  Status: **Shipped**. Click a listing → transit route lines to all anchors, commute times in InfoWindow, travel mode toggle, sort/filter by commute duration (cached routes).
  *Why: Answer "how long does it take to get from this apartment to my office?"*

## Archived

- [ ] **Feature: Google Takeout Import (M2)**
  *Link: [./google-takeout-import_20250609/](./google-takeout-import_20250609/)*
  Status: **Archived**. No public API for Saved Places; native map search + create is better UX.

---

### How to Read a Feature Spec

Each spec now has a **User Stories & Rationale** section at the top:
- **User Stories**: Concrete "As a... I want... so that..." scenarios the feature addresses
- **Design Rationale**: Why specific decisions were made, what alternatives were considered, what trade-offs were accepted

This context is meant to prevent future contributors from questioning decisions without understanding the original reasoning. If something seems wrong, update the rationale — don't delete it.
