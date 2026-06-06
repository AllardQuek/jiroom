# Technology Stack

## Overview

This document defines the technology stack for the Rental Viewing Evaluator MVP. The stack prioritizes modern, performant, and developer-friendly tools that align with 2025 best practices while keeping the MVP simple and focused.

## Core Technologies

### Frontend Framework
**React + Next.js**

- **React**: Component-based UI library with largest ecosystem and community support
- **Next.js**: React framework providing routing, SSR/SSG capabilities, and optimal performance
- **Rationale**: Most popular choice in 2025 with excellent ecosystem support, easy to find resources/help, and future-proof for potential SSR needs

### Language
**TypeScript**

- Strongly typed superset of JavaScript
- Excellent IDE support and autocomplete
- Catches errors at compile time
- Better code maintainability for growing codebase
- **Rationale**: Industry standard for React applications in 2025, provides type safety without significant overhead

### Package Manager
**pnpm**

- Fast, disk-efficient package manager
- Drop-in replacement for npm (stays in Node.js ecosystem)
- Uses hard links for efficient disk usage
- Faster installs than npm and Yarn
- **Rationale**: Best balance of speed, stability, and ecosystem compatibility for MVP development

### Build Tool
**Turbopack (via Next.js)**

- Rust-based bundler integrated into Next.js
- Significantly faster than Webpack
- Zero-configuration experience
- **Rationale**: Next.js uses Turbopack by default, providing fast builds without additional setup

## Styling and UI

### CSS Framework
**Tailwind CSS**

- Utility-first CSS framework
- Rapid UI development without leaving HTML
- Highly customizable
- Excellent mobile-first responsive design support
- **Rationale**: Modern standard for styling, enables fast development and consistent design system

### Component Library
**shadcn/ui**

- Pre-built, customizable React components
- Built on top of Tailwind CSS and Radix UI
- Components are copied into codebase (fully customizable)
- Modern, accessible design system
- Includes: buttons, cards, forms, modals, dialogs, tables, etc.
- **Rationale**: Accelerates MVP development with professional, accessible components while maintaining full customization flexibility

### Icon Library
**Lucide React**

- Lightweight icon library
- Tree-shakeable (only includes used icons)
- Consistent design language
- Perfect companion to shadcn/ui
- **Rationale**: Modern, performant icon solution that integrates seamlessly with the stack

## State Management

### Global State
**Zustand**

- Lightweight state management library
- Simple API without boilerplate
- Built-in localStorage middleware
- Excellent performance (no unnecessary re-renders)
- TypeScript-first design
- **Rationale**: Perfect for MVP - simple setup, great performance, built-in persistence for local-only data

### Data Persistence
**localStorage**

- Browser-native storage API
- No backend required for MVP
- Automatic persistence across sessions
- **Rationale**: Aligns with no-auth MVP requirement, keeps data private and local

## Forms and Validation

### Form Library
**React Hook Form**

- Performant form library with minimal re-renders
- Excellent TypeScript support
- Easy integration with shadcn/ui components
- Built-in `useFieldArray` for dynamic forms
- **Rationale**: Modern standard for React forms, perfect for dynamic evaluation template

### Schema Validation
**Zod**

- TypeScript-first schema validation
- Type inference from schemas
- Excellent error messages
- Seamless integration with React Hook Form
- **Rationale**: Provides type-safe validation for complex form structures (checkboxes, ratings, numbers, text, selects)

## Development Tools

### Code Quality
**ESLint + Prettier**

- ESLint: JavaScript/TypeScript linting
- Prettier: Code formatting
- Pre-configured with Next.js
- **Rationale**: Ensures consistent code style and catches common errors

### Type Checking
**TypeScript Compiler (tsc)**

- Built-in type checking
- Integrated with Next.js build process
- **Rationale**: Leverages TypeScript's type system for catch errors early

## Testing (Future Enhancement)

### Unit Testing
**Vitest** (recommended for future)

- Fast unit test framework
- Compatible with Vite ecosystem
- TypeScript support out of the box

### Component Testing
**Playwright** or **Testing Library** (recommended for future)

- End-to-end testing with Playwright
- Component testing with React Testing Library
- **Rationale**: Not needed for MVP initial development, but important for future quality assurance

## Deployment

### Hosting
**Vercel** (recommended)

- Built by Next.js creators
- Zero-configuration deployment
- Automatic SSL
- Edge network
- **Rationale**: Natural choice for Next.js applications, free tier available for MVP

### Alternative Hosting Options
- Netlify
- Cloudflare Pages
- Self-hosted with Docker

## Technology Stack Summary

| Category | Technology | Version/Notes |
|----------|-----------|---------------|
| Frontend Framework | React + Next.js | Latest stable |
| Language | TypeScript | Latest stable |
| Package Manager | pnpm | Latest stable |
| Build Tool | Turbopack | Via Next.js |
| CSS Framework | Tailwind CSS | Latest stable |
| Component Library | shadcn/ui | Latest |
| Icons | Lucide React | Latest |
| State Management | Zustand | Latest stable |
| Form Library | React Hook Form | Latest stable |
| Validation | Zod | Latest stable |
| Code Quality | ESLint + Prettier | Via Next.js |
| Deployment | Vercel | Recommended |

## Architecture Notes

### Client-Side Only Architecture
The MVP is designed as a client-side only application:
- No backend server required
- All data stored in localStorage via Zustand
- No authentication needed
- No API calls to external services (except optional property portal links)

### Future Scalability
The chosen stack supports easy future enhancements:
- Next.js can add API routes for backend functionality
- Zustand can integrate with server state via middleware
- shadcn/ui components can be extended or replaced
- TypeScript ensures type safety as codebase grows
- pnpm workspace support for monorepo structure if needed

### Performance Considerations
- Next.js automatic code splitting
- Turbopack for fast builds
- Zustand for efficient state updates
- React Hook Form for minimal re-renders
- shadcn/ui components optimized for performance
- Tree-shakeable icons (Lucide)

## Dependencies

### Core Dependencies
```json
{
  "next": "^15.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "zustand": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "lucide-react": "^0.x"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20.x",
  "@types/react": "^19.x",
  "@types/react-dom": "^19.x",
  "eslint": "^9.x",
  "eslint-config-next": "^15.x",
  "prettier": "^3.x",
  "pnpm": "^10.x"
}
```

## Rationale Summary

This technology stack was chosen to:
1. **Accelerate MVP Development**: Modern tools with pre-built components (shadcn/ui)
2. **Ensure Performance**: Fast builds (Turbopack), efficient state (Zustand), minimal re-renders (React Hook Form)
3. **Maintain Type Safety**: TypeScript throughout with Zod validation
4. **Enable Future Growth**: Scalable stack that can add backend, auth, or cloud sync later
5. **Align with 2025 Best Practices**: Current industry standards with strong community support
6. **Keep It Simple**: No unnecessary complexity for MVP scope
