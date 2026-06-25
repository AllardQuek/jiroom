# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-06-25

### Added
- **HelpDialog Getting Started**: 3-step quick start guide for first-time users
- **HelpDialog Settings Section**: Comprehensive Settings Dialog documentation covering Evaluation Templates, Agent Questions, and Tenant Profile
- **HelpDialog Pages Overview**: Table comparing all 4 pages with purposes and key features
- **HelpDialog Scoring System**: Detailed scoring explanation with score range table and criterion types
- **HelpDialog Keyboard Shortcuts**: Table showing `?` to toggle help dialog
- **HelpDialog Data Management**: Export/import and sample data documentation
- **README Quick Start**: Immediate value 3-step guide for new users
- **README How It Works**: ASCII diagram showing rental search workflow
- **README Feature Tables**: Restructured features with Core Features, Data Management, and Additional Features tables
- **README Pages Overview**: Table comparing all 4 pages
- **README Scoring System**: Score range table with meanings and criterion types explanation
- **README Keyboard Shortcuts**: Table of available shortcuts
- **Listings Keyboard Shortcut Tip**: Added "Press ? for help" tip on Listings page

### Changed
- **HelpDialog**: Complete rewrite with verified, accurate information and UX improvements
  - Fixed inaccurate Settings/Template Editor references
  - Corrected Anchors section (removed non-existent anchor list view)
  - Applied visual hierarchy with bolding, bullet points, spacing
  - Added concrete examples throughout
  - Used action-oriented language
- **README**: Comprehensive enhancement for better documentation
  - Enhanced with tables for scannability
  - Added diagrams for workflow visualization
  - Better organization with clear hierarchy
  - Removed outdated screenshots section
- **Listings Branding**: Updated description to "JIRA for rental search" - concise and clear
- **Add Listing Button**: Changed color to #7e5be9 (custom purple)
- **Button Icon**: Removed redundant mr-2 (gap-2 handles spacing)

### Fixed
- **HelpDialog**: Corrected all feature descriptions to match actual app behavior
- **HelpDialog**: Fixed inaccurate navigation references (Settings/Template pages redirect)
- **E2E Test**: Updated to match new branding text

### Removed
- **README Version**: Removed version mention from README to reduce maintenance burden

[2.0.0]: https://github.com/AllardQuek/jiroom/releases/tag/v2.0.0
[1.0.0]: https://github.com/AllardQuek/jiroom/releases/tag/v1.0.0

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

[1.0.0]: https://github.com/AllardQuek/jiroom/releases/tag/v1.0.0
