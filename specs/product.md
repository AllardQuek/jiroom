# Initial Concept

A mobile-first tool that helps renters manage shortlisted room listings, apply a consistent evaluation template during or after viewings, capture notes, and track statuses such as to-view, viewed, and final verdict.

---

# Product Guide

## Product Overview

**Working Name:** Rental Viewing Evaluator

**Product Definition:**
A responsive web application designed for renters to manage shortlisted room listings discovered on external property portals. The app provides a structured workspace for evaluating rooms using customizable templates, capturing notes during viewings, and making final decisions through visual comparison tools.

**Core Problem:**
Renters often discover listings on external portals (PropertyGuru, 99.co, etc.), but once they shortlist multiple rooms, the process becomes fragmented across property links, chat threads, calendars, and messy notes. This product solves that downstream workflow problem by providing a centralized evaluation workspace, not by competing with listing portals on discovery inventory.

**Product Positioning:**
The product sits after discovery and before commitment. Property portals remain the place where users discover and inspect full listing details, while this product becomes the user's own workspace for evaluation, notes, statuses, and decisions.

## Target Users

**Primary User Persona:**
The product is designed to support multiple renter personas:
- Young professionals (22-30 years old, first-time renters, tech-savvy)
- Students (university/college, budget-conscious, mobile-heavy)
- Expats/relocation (new to country, needs quick decision-making)
- Family renters (renting with spouse/partner, more complex criteria)

**User Characteristics:**
- Actively shortlisting rooms from property portals
- Scheduling multiple viewings
- Needs a cleaner way to compare options
- Wants to make final decisions using a common set of criteria
- Values consistency and structure in evaluation

## Product Goals

**Primary Goals:**
- Standardize how users evaluate each room through reusable templates
- Reduce reliance on messy freeform notes
- Make status and progress visible across shortlisted options
- Support faster, more confident final decisions

**Success Metrics for MVP:**
- At least one full evaluation completed per saved listing
- Majority of viewed listings have notes attached
- Users can compare multiple listings without reopening every source link
- Users can assign a clear final verdict for shortlisted options

## Core Value Proposition

The product differentiates itself through three key features:

1. **Standardized Evaluation Template:** Users can reuse customizable templates, set or customize factors/considerations important to them, and weight them accordingly. This ensures consistent comparison across options.

2. **Mobile-Optimized Data Entry:** The interface is designed for quick data entry during or immediately after viewings, with easy note-taking and checkbox interactions.

3. **Visual Comparison View:** A side-by-side comparison view helps users make final verdicts or decisions by displaying key criteria, scores, and notes across all shortlisted options.

## Scope

### In Scope (MVP)

- Saving listings by URL with minimal identifying metadata
- Lightweight listing cards for scanability
- Optional viewing scheduling
- A reusable evaluation template applied to listings
- Freeform notes and comments
- Final verdict states (Yes / Maybe / No / Undecided)
- A comparison view across shortlisted options
- Template customization (add/remove criteria, reorder, change field types)
- Local storage for data persistence (no authentication required)

### Out of Scope (MVP)

- Full automated crawling or search across property sites
- Rebuilding detailed property pages inside the app
- Heavy AI ranking or opaque recommendation systems
- Collaboration, sharing, or multi-user decision workflows
- Deep map/commute automation
- Complex workflow automation or notification systems
- User authentication or cloud sync

## Geographic Market

**Primary Market:** Singapore (PropertyGuru, 99.co, etc.)

**Scalability Consideration:**
While the MVP focuses on Singapore, the architecture is designed to be easily extensible to other regions. The core evaluation criteria (cost, connectivity, room quality, bathroom, household rules, access/location, amenities, lease/risk) are universal across rental markets globally. Future expansion would primarily involve:
- Property portal URL integration for different regions
- Currency formatting adjustments
- Localized criteria additions

## Platform Strategy

**Primary Platform:** Mobile web (responsive web application)

The product is a single web application that adapts its layout for both mobile and desktop browsers. This approach:
- Provides immediate accessibility without app store approval
- Works across devices with a single codebase
- Optimizes for mobile use during viewings while supporting desktop use for detailed comparison
- Keeps the MVP simple and focused on core functionality

## Data Strategy

**Authentication:** None required

The MVP uses local storage for data persistence, making it suitable for personal/individual use without the complexity of user accounts, authentication, or cloud synchronization. This approach:
- Reduces development complexity for MVP
- Provides immediate value without signup friction
- Keeps user data private and local
- Allows for future cloud sync as an enhancement

## Core User Journey

1. User finds a room on PropertyGuru, 99.co, or another source
2. User pastes the URL into the app
3. User adds minimal metadata so the listing is recognizable at a glance
4. User marks the listing as To View or Viewed
5. User fills the evaluation template during or after the viewing
6. User adds notes and comments
7. User sets a final verdict: Yes / Maybe / No / Undecided
8. User compares all shortlisted options side by side

## Key Features

### 1. Listing Management
- Create listings from URLs
- Edit basic listing metadata (title, price, area, platform)
- Open original source links
- Track listing status (New, To View, Viewed, Archived, Shortlisted)

### 2. Viewing Tracking
- Schedule optional viewing date/time

### 3. Evaluation Template
- Default template with common rental criteria
- Customizable criteria (add, remove, reorder)
- Multiple input types (checkbox, rating 1-5, number, text, select)
- Criteria grouping by category
- Optional weighting of criteria

### 4. Notes & Comments
- Freeform notes at listing level
- Bullet-style input support
- Editable and timestamped
- Visible alongside template responses

### 5. Verdict System
- Final decision states: Yes, Maybe, No, Undecided
- User-controlled (not auto-generated)
- Optional lightweight scoring for decision support
- Explainable scoring (shows contributing criteria)

### 6. Comparison View
- Side-by-side comparison of shortlisted listings
- Key criteria responses displayed
- Verdict status
- Optional fit score
- Notes snippets

## Success Criteria

The MVP is successful if a renter can:
- Save 5-10 shortlisted listings
- Open each listing's original source quickly
- Record a consistent evaluation for each viewed room
- Add notes without friction
- Track which rooms are viewed versus to-view
- Mark Yes / Maybe / No decisions
- Compare all shortlisted options in one place
- Reach a final shortlist without relying on external notes
