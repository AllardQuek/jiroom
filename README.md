# JIRoom

Stop forgetting which rental you visited yesterday. Your rental hunting brain - now digital.

A mobile-first web application that helps renters manage shortlisted room listings, apply consistent evaluation templates during viewings, capture notes, track viewing statuses, and make final decisions through visual comparison tools.

Built from personal frustration with rental hunting chaos - trying to remember details from multiple viewings and make objective decisions.

## Quick Start

1. 📋 **Add a listing**: Click "Add listing" on Listings page, paste URL from property portals like PropertyGuru, 99.co, or others
2. 📝 **Evaluate**: Click listing card, fill evaluation criteria, see score calculate automatically
3. ✅ **Decide**: Set verdict (Yes/Maybe/No) to move to decision columns

💡 **Tip**: Use the sample data (flask icon 🧪) to explore features before adding your own listings.

## Why JIRoom?

Rental hunting is chaotic. You're juggle multiple listings, struggle to remember details, and can't make objective decisions. JIRoom organizes the chaos:

| Frustration | Solution |
|------------|----------|
| "Wait, did I already see this place?" | 📋 **Kanban board** tracks your viewing status |
| "I've seen 8 places today and they all blur together" | 📝 **Rich notes** capture details that matter |
| "How am I supposed to remember details from last week?" | 📋 **Evaluation templates** ensure consistency |
| "I can't objectively compare options with different trade-offs" | ⚖️ **Side-by-side comparison** with smart scoring |
| "I hope I didn't double-book myself" | 📅 **Integrated schedule** shows all viewings |
| "My calendar shows when but not what" | Full context: listings, notes, evaluations |
| "What's the total cost including utilities?" | 🤝 **Agent question templates** capture all costs |

## Features

- 📋 **Kanban Board**: Drag-and-drop workflow (To View, Yes, Maybe, No)
- 📝 **Rich Notes**: Capture space, ambience, renovations, and other details
- 📋 **Evaluation Templates**: Customizable criteria with automatic scoring
- ⚖️ **Side-by-Side Comparison**: Compare up to 3 listings with smart scoring
- 📅 **Integrated Schedule**: Timeline of upcoming and past viewings
- 🤝 **Agent Question Templates**: Consistent information gathering from agents
- 🗺️ **Map with Commute**: Check commute times to your key locations

### Additional Features

- **Filtering & Sorting**: By area, price, score, verdict, and more
- **View Modes**: Compact and detailed card layouts
- **Data Management**: Local storage with export/import backup
- **Mobile First**: Fully responsive design
- **No Account Required**: All data stored in browser

## How It Works

1. **Add** listings from property portals
2. **Evaluate** during viewings with customizable criteria
3. **Schedule** appointments and track viewings
4. **Compare** top candidates side-by-side
5. **Decide** with confidence using smart scoring

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
git clone https://github.com/AllardQuek/jiroom.git
cd jiroom
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is ready for a standard Next.js deployment on Vercel.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Create a new project in Vercel and import this repository.
3. Keep the default settings Vercel detects:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: leave empty
4. Deploy the project.

## Documentation

- **CHANGELOG**: See [CHANGELOG.md](https://github.com/AllardQuek/jiroom/blob/main/CHANGELOG.md) for detailed release notes
- **Scoring System**: Automatic score calculation (+1/0/-1 per criterion) for quick ranking
- **Data Persistence**: All data stored locally in browser via localStorage

## Community

This is a personal project, but feel free to:
- 🍴 Fork and modify for your own use
- 🐛 [Report issues](https://github.com/AllardQuek/jiroom/issues) or suggest features
- 🤝 Submit pull requests for improvements

## License

MIT
