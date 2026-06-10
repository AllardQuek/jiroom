# Google Takeout Import — M2 (Archived)

## Status: Archived

**Date**: 2026-06-09

**Reason**: Google Takeout requires the user to request a full data export from Google, wait for it to be generated, download it, then upload it here — poor UX for what is ultimately a batch import feature. There is no public API to access a user's Google Maps Saved Places or "Want to go" lists programmatically. Scraping/crawling would violate Google's ToS.

**Alternative**: The native map-first creation flow (M1 Phase 8) already provides the intended workflow: search for a location on the map using Places Autocomplete, then create a listing from it. This is faster and more intuitive than a batch import.

**If needed in future**: A browser extension or bookmarklet could extract saved places from Google Maps and POST them here, but that's out of scope for this client-only app.

## User Stories & Rationale

### User Stories (why it was considered)

- **Young professional**: As a renter who has been saving places on Google Maps for months, I want to import all my saved rental listings from Google Maps Saved Places into this app in one go, so that I don't have to manually re-enter each one from scratch.
- **Power user**: As someone with 50+ saved places across multiple Google Maps lists, I want a batch import, so that I can set up my shortlist in minutes rather than hours of manual entry.

### Design Rationale (why it was archived)

The initial assumption was that Google Maps Saved Places would be accessible through some API, making batch import straightforward. Investigation revealed:

1. **No public API exists** — Google Maps Saved Places ("Want to go," starred places, lists) has no programmatic read access. The only way to get this data is through Google Takeout, which produces a JSON export.
2. **Takeout UX is terrible** — Request an export, wait minutes/hours for generation, download a ZIP, extract the file, find the right JSON, upload it here. For a mobile-first renter tool, this is a non-starter.
3. **Low value-per-effort** — Most renters don't have extensive "Want to go" lists for rentals. Importing 50 places just to delete 45 irrelevant ones is worse than searching and saving 5 relevant ones.

The map-first creation flow (search on map → tap → create listing) solves the same problem with less friction: users find places one at a time through Places Autocomplete, which is faster than a batch import for the typical scale of 5-15 listings. If a future user genuinely has 50+ listings to import, a browser extension or bookmarklet would be the right solution, but that's out of scope for a client-only app.
