# Rental Room Rater

A mobile-first web application that helps renters manage shortlisted room listings, apply consistent evaluation templates during viewings, capture notes, track viewing statuses, and make final decisions through visual comparison tools.

**Current Version: v1.0.0** - [View Release Notes](https://github.com/AllardQuek/rental-room-rater/releases/tag/v1.0.0)

## Quick Start

1. **Add a listing**: Click "Add listing" on Listings page, paste URL from PropertyGuru/99.co
2. **Evaluate**: Click listing card, fill evaluation criteria, see score calculate automatically
3. **Decide**: Set verdict (Yes/Maybe/No) to move to decision columns

💡 **Tip**: Use the sample data (flask icon 🧪) to explore features before adding your own listings.

## How It Works

```
Discovery → Evaluation → Decision
     ↓            ↓           ↓
  Add Listing  Fill Criteria  Set Verdict
     ↓            ↓           ↓
  Schedule     Auto Score   Compare
     ↓            ↓           ↓
  View         Sort/Filter  Choose
```

**Your Rental Search Workflow:**

1. **Discover** → Find rooms on PropertyGuru/99.co, paste URLs into Room Rater
2. **Evaluate** → Fill evaluation criteria during/after viewings, scores calculate automatically
3. **Schedule** → Set viewing dates, track upcoming appointments
4. **Compare** → Side-by-side comparison of top candidates
5. **Decide** → Set final verdict (Yes/Maybe/No), make your choice

## Features

### Core Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Listing Management** | Save, edit, track listings from property portals | Centralized workspace, no more tabs |
| **Kanban Board** | Drag cards between To View, Yes, Maybe, No columns | Visual workflow tracking |
| **Evaluation System** | Customizable criteria (checkbox, rating, number, select, text) | Consistent comparison across options |
| **Scoring** | Automatic score calculation (+1/0/-1 per criterion) | Quick ranking of listings |
| **Map Integration** | Interactive Google Maps with commute times | Location-based decision making |
| **Anchors** | Define key locations (home, work, MRT) | Evaluate commute for all listings |
| **Comparison View** | Side-by-side comparison of up to 3 listings | Spot the best option easily |
| **Schedule** | Timeline of upcoming and past viewings | Never miss a viewing |
| **Agent Questions** | Question templates for property agents | Consistent information gathering |
| **Tenant Profile** | Store your details to share with agents | Quick profile sharing |

### Data Management

| Feature | Description |
|---------|-------------|
| **Local Storage** | All data in browser, no server, no sign-up |
| **Export** | Download backup as JSON file |
| **Import** | Restore from backup or transfer between devices |
| **Sample Data** | Load demo listings to explore features |

### Additional Features

- **Filter System**: Filter by area, price, score, verdict, hide taken listings
- **Sort System**: Sort by price, score, name, date, area
- **Compact/Detailed View**: Toggle between card display modes
- **Drag & Drop**: Intuitive drag-and-drop interface for moving listings
- **Mobile Responsive**: Fully responsive design optimized for mobile and desktop

## Tech Stack

- **Framework**: Next.js 16.2.7 with React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand 5.0.14 with localStorage persistence
- **Forms**: React Hook Form 7.77.0 with Zod 4.4.3 validation
- **Icons**: Lucide React 1.17.0

## Pages Overview

| Page | Purpose | Key Features |
|------|---------|--------------|
| **Listings** | Main workspace | Kanban board, filter/sort, compare mode |
| **Map** | Location view | Commute times, add from map, anchor markers |
| **Compare** | Side-by-side view | 3 listings max, score comparison |
| **Schedule** | Viewing timeline | Grouped by day, upcoming/past |

## Scoring System

Each scorable criterion contributes +1 (good), 0 (neutral), or -1 (bad). The net score is the difference between good and bad points.

| Score Range | Color | Meaning |
|-------------|-------|---------|
| ≥ +4 | Emerald | Great - Excellent fit |
| +1 to +3 | Green | Good - Strong contender |
| 0 | Gray | Neutral - Mixed pros/cons |
| -1 to -2 | Orange | Below average - Major concerns |
| ≤ -3 | Red | Poor - Deal-breakers |

**Example**: If you answer 8 criteria with 5 good (+5) and 2 bad (-2), your score is +3 (Good).

**Criterion Types:**
- **Checkbox**: +1 if checked, -1 if unchecked
- **Rating 1-5**: 1-2 = -1, 3 = 0, 4-5 = +1
- **Number**: Custom thresholds (e.g., price < $1000 = +1)
- **Select**: Custom scores per option
- **Text**: Not scored (notes only)
- **Derived**: Auto-calculated from other fields (e.g., total cost)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Toggle help dialog |

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AllardQuek/rental-room-rater.git
cd rental-room-rater
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Deploying To Vercel

This app is ready for a standard Next.js deployment on Vercel.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Create a new project in Vercel and import this repository.
3. Keep the default settings Vercel detects:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: leave empty
4. Add any environment variables if you introduce them later. The current app does not require any.
5. Deploy the project.

For local verification before you push, run:

```bash
npm run build
```

If you want to mirror Vercel more closely in a local preview, use:

```bash
npm run build && npm start
```

## Project Structure

```
room-rater/
├── app/                    # Next.js App Router pages
│   ├── listings/          # Listing pages (main workspace)
│   ├── map/               # Map view with commute times
│   ├── compare/           # Side-by-side comparison
│   ├── schedule/          # Viewing timeline
│   ├── anchors/           # Redirects to map
│   ├── settings/          # Redirects to listings
│   └── template/          # Redirects to settings
├── components/            # React components
│   ├── comparison/       # Comparison feature
│   ├── listings/         # Listing feature (kanban, cards, filters)
│   ├── map/               # Map feature (markers, commute, anchors)
│   ├── evaluation/        # Evaluation templates and scoring
│   ├── viewing/           # Viewing scheduling
│   ├── verdict/           # Verdict system
│   ├── agentQuestions/    # Agent question templates
│   ├── tenantProfile/     # Tenant profile management
│   ├── settings/          # Settings dialog
│   ├── notes/             # Notes component
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── constants/         # Color constants
│   ├── data/              # Default templates and seed data
│   ├── hooks/             # Custom React hooks
│   ├── schemas/           # Zod validation schemas
│   └── utils/             # Helper functions (scoring, routes)
├── store/                # Zustand state management
│   ├── listingStore.ts    # Listings state
│   ├── evaluationStore.ts # Evaluation responses
│   ├── templateStore.ts   # Evaluation templates
│   ├── verdictStore.ts    # Verdict decisions
│   ├── viewingStore.ts    # Viewing schedules
│   ├── anchorStore.ts     # Anchor locations
│   ├── agentQuestionStore.ts # Agent question templates
│   ├── tenantProfileStore.ts # Tenant profile
│   ├── comparisonStore.ts # Comparison selection
│   └── routePrefsStore.ts # Map route preferences
├── types/                # TypeScript type definitions
└── specs/                # Feature specifications
```

## Data Persistence

All data is stored locally in your browser using localStorage via Zustand middleware. This architecture is designed for personal/single-user use without the complexity of user accounts, authentication, or cloud synchronization.

**Backup & Transfer:**
- **Export**: Click download button on Listings page to save all data as JSON
- **Import**: Click upload button to restore from backup or transfer between devices
- **Sample Data**: Click flask icon (🧪) to load demo listings and explore features

**Note**: Data can be cleared if localStorage is cleared by the browser.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Releases

See [CHANGELOG.md](https://github.com/AllardQuek/rental-room-rater/blob/main/CHANGELOG.md) for detailed release notes and change history.

## License

MIT

## Contributing

This is a personal project. Feel free to fork and modify for your own use.
