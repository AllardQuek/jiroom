# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-18

### Added
- **Listing Management**: Add, edit, and manage rental property listings with URLs, prices, and details
- **Evaluation System**: Customizable evaluation templates with multiple criteria types (text, rating, checkbox, select, number)
- **Verdict System**: Track decisions on listings (Yes, Maybe, No) with visual categorization
- **Schedule Viewing**: Schedule and manage property viewings with date/time selection
- **Map Integration**: Interactive Google Maps integration for visual property location display
- **Comparison View**: Side-by-side comparison of up to 3 listings with key metrics
- **Distance/Route Calculation**: Calculate commute times and distances from custom anchor points
- **Anchors/POI**: Define custom anchor points (home, work, gym, etc.) for distance calculations
- **Drag & Drop**: Intuitive drag-and-drop interface for moving listings between categories
- **Mobile Responsive**: Fully responsive design optimized for mobile and desktop usage

### Improved
- **Date Selection**: Replaced dropdown selectors with native HTML date picker for better UX
- **Tenant Profile Notes**: Enhanced textarea fields with resizable design and better mobile heights
- **Form UX**: Improved sticky footer positioning and visual separation in CreateListingForm
- **Mobile Layout**: Fixed excessive whitespace in listing view columns on mobile
- **Button Styling**: Enhanced button variants with better visual hierarchy and accessibility

### Architecture
- **Personal-Use Design**: Built as a personal rental room hunting tool using localStorage for data persistence
- **No Backend Required**: Client-side only architecture suitable for single-user use without authentication complexity
- **Data Storage**: Zustand state management with localStorage persistence for offline-capable personal use
- **Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui components

### Notes
- This release is designed for personal/single-user use with localStorage persistence
- Data is stored locally in the browser and can be cleared if localStorage is cleared
- Multi-user collaboration and cloud sync are planned for future iterations
- Suitable for personal rental property hunting and comparison workflows

[1.0.0]: https://github.com/AllardQuek/rental-room-rater/releases/tag/v1.0.0
