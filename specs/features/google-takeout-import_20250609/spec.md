# Google Takeout Import — M2 (Archived)

## Status: Archived

**Date**: 2025-06-09

**Reason**: Google Takeout requires the user to request a full data export from Google, wait for it to be generated, download it, then upload it here — poor UX for what is ultimately a batch import feature. There is no public API to access a user's Google Maps Saved Places or "Want to go" lists programmatically. Scraping/crawling would violate Google's ToS.

**Alternative**: The native map-first creation flow (M1 Phase 8) already provides the intended workflow: search for a location on the map using Places Autocomplete, then create a listing from it. This is faster and more intuitive than a batch import.

**If needed in future**: A browser extension or bookmarklet could extract saved places from Google Maps and POST them here, but that's out of scope for this client-only app.
