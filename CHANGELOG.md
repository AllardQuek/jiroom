# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-07-05

### Added
- **Anchor Color Customization**: Custom anchor types with color picker support
- **Predefined Color Palette**: Standard colors for home, work, school, station anchor types
- **Color Synchronization**: Custom type button color syncs with anchor marker colors
- **SG Rental Guide Page**: Comprehensive rental guide with interactive journey map
- **Multi-Note Support**: Enhanced viewing section with notes array for multiple notes
- **convertExportToSeed Utility**: Data conversion tool for switching from mock to real exported data

### Changed
- **Seed Data**: Switched from mock seed data to real exported data
- **Platforms Table**: Updated with verified descriptions and improved formatting
- **Viewing Checklist**: Improved bullet detection and removed redundant items
- **Floating Actions**: Differentiated button styles for better visual hierarchy

### Fixed
- **Anchor Info Window**: Text contrast issues in dark mode resolved
- **Theme Toggle**: Fixed theme toggle not working in certain contexts
- **Type Badge**: Text contrast improved using mix-blend-mode
- **Custom Type Field**: Fixed bug where field would close unexpectedly
- **Layout Issues**: Various UI spacing and alignment improvements

[3.1.0]: https://github.com/AllardQuek/jiroom/releases/tag/v3.1.0

## [3.0.0] - 2025-06-30

### Added
- **Internationalization Support**: Full i18n implementation using next-intl library
- **Simplified Chinese Language**: Complete translation of UI to Simplified Chinese (zh-CN)
- **Language Switcher**: Component to toggle between English and Chinese
- **Locale-aware Routing**: Middleware for automatic locale detection and routing
- **Translation Files**: 362 translation keys across all UI components
- **Translated Components**: Language support for 15+ components including Listings, Map, Compare, Settings, and all dialogs
- **Native Date Picker**: Replaced custom DatePicker with native HTML date input for better UX
- **Rebranding**: Updated app name to JIRoom

### Changed
- **URL Structure**: All URLs now include locale prefix (e.g., `/en/listings`, `/zh-CN/listings`)
- **Navigation Architecture**: Separated navigation module for i18n-aware routing
- **Component Hierarchy**: Moved Navigation and FloatingActions inside Providers to fix dark mode toggle
- **Date Formatting**: Dates now display in user's selected locale (en or zh-CN)
- **Export/Import**: Profile field labels in copy function now use translated labels

### Fixed
- **Dark Mode Toggle**: Fixed theme toggle not working by moving components inside Providers
- **Compare Page Contrast**: Improved highlight contrast for "best" listing in both light and dark modes
- **Script Tag Warning**: Resolved React 19 script tag warning in theme provider
- **i18n Routing**: Fixed redirects and navigation to preserve locale prefix
- **Translation Keys**: Added missing keys for MapView mobile menu and EvaluationSection
- **Code Duplication**: Extracted shared getStoreKeys utility to eliminate duplicate code
- **Date Locale**: Replaced hardcoded "en-US" with dynamic locale in 6 components
- **Migration Lifecycle**: Moved runMigrations to useEffect for proper lifecycle management
- **Theme Flickering**: Removed mounted patterns and CSS transitions that caused flickering during theme toggles on listing cards and UI elements
- **Close Button Timing**: Synchronized FloatingActions transition timings to fix close button timing mismatch

### Architecture
- **Middleware**: Added Proxy.ts middleware for locale detection and routing
- **i18n Module**: Created dedicated i18n directory with routing, navigation, and message files
- **State Management**: Improved migration handling with proper React lifecycle

### Notes
- This release introduces locale-aware URLs; existing bookmarks may need to be updated
- Translation coverage is comprehensive but user-defined content (criteria names, notes) remains in input language
- Supported locales: English (en) and Simplified Chinese (zh-CN)

[3.0.0]: https://github.com/AllardQuek/jiroom/releases/tag/v3.0.0
[2.0.0]: https://github.com/AllardQuek/jiroom/releases/tag/v2.0.0

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
