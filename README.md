# Rental Room Rater

A mobile-first web application that helps renters manage shortlisted room listings, apply consistent evaluation templates during viewings, capture notes, track viewing statuses, and make final decisions through visual comparison tools.

**Current Version: v1.0.0** - [View Release Notes](https://github.com/AllardQuek/rental-room-rater/releases/tag/v1.0.0)

## Features

- **Listing Management**: Save, edit, and track room listings from property portals
- **Evaluation System**: Customizable evaluation templates with multiple criteria types (text, rating, checkbox, select, number)
- **Viewing Tracking**: Schedule viewings with date/time selection and track status
- **Verdict System**: Final decision states (Yes, Maybe, No) with visual categorization
- **Map Integration**: Interactive Google Maps integration for visual property location display
- **Distance Calculation**: Calculate commute times and distances from custom anchor points
- **Anchors/POI**: Define custom anchor points (home, work, gym, etc.) for distance calculations
- **Comparison View**: Side-by-side comparison of up to 3 listings with key metrics
- **Drag & Drop**: Intuitive drag-and-drop interface for moving listings between categories
- **Mobile Responsive**: Fully responsive design optimized for mobile and desktop usage

## Tech Stack

- **Framework**: Next.js 16.2.7 with React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand 5.0.14 with localStorage persistence
- **Forms**: React Hook Form 7.77.0 with Zod 4.4.3 validation
- **Icons**: Lucide React 1.17.0

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
│   ├── listings/          # Listing pages
│   ├── template/          # Template pages
│   └── compare/           # Comparison page
├── components/            # React components
│   ├── comparison/       # Comparison feature components
│   ├── listings/         # Listing feature components
│   ├── notes/            # Notes feature components
│   ├── template/         # Template feature components
│   ├── ui/               # shadcn/ui components
│   ├── verdict/          # Verdict feature components
│   └── viewing/          # Viewing feature components
├── lib/                  # Utility functions
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Helper functions
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── specs/                # Feature specifications
```

## Data Persistence

All data is stored locally in the browser using localStorage via Zustand middleware. This architecture is designed for personal/single-user use without the complexity of user accounts, authentication, or cloud synchronization. Data can be cleared if localStorage is cleared by the user.

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
