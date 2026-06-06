---
id: ER-Core-001
title: "Core Application Setup and Infrastructure"
domain: Core Application
priority: P0
status: Draft
source_requirements:
  - product.md
created: 2025-01-07
updated: 2025-01-07
---

# Core Application Setup and Infrastructure

## Summary

This requirement establishes the foundational infrastructure for the Rental Viewing Evaluator MVP, including project initialization, technology stack setup, and core data model implementation. This serves as the technical foundation upon which all features will be built.

### Business Objectives

- **Rapid MVP Development**: Establish a working development environment with all necessary dependencies and tooling
- **Type Safety**: Implement TypeScript throughout the codebase to catch errors early and improve maintainability
- **Modern UI Framework**: Set up shadcn/ui component library for consistent, accessible, and professional UI components
- **Efficient State Management**: Configure Zustand with localStorage persistence for seamless data management
- **Mobile-First Foundation**: Establish responsive design patterns optimized for mobile usage

### Key Results

- Next.js project initialized with TypeScript and all core dependencies
- Zustand stores configured for listings, evaluations, templates, and verdicts
- shadcn/ui components integrated and styled with Tailwind CSS
- Basic routing structure in place for all major screens
- Mobile-first responsive layout foundation established
- Development tooling (ESLint, Prettier) configured

## Acceptance Criteria

- [ ] AC1: Next.js 15.x project initialized with TypeScript 5.x
- [ ] AC2: All core dependencies installed (Zustand, React Hook Form, Zod, shadcn/ui, Lucide React)
- [ ] AC3: Tailwind CSS configured with custom color palette per product guidelines
- [ ] AC4: Zustand stores created for:
  - Listings (with localStorage middleware)
  - Evaluations (with localStorage middleware)
  - Templates (with localStorage middleware)
  - Verdicts (with localStorage middleware)
- [ ] AC5: shadcn/ui CLI initialized and at least 5 base components added (Button, Card, Form, Input, Dialog)
- [ ] AC6: Next.js App Router configured with routes:
  - `/` - Listings list page
  - `/listings/[id]` - Listing detail page
  - `/compare` - Comparison view
  - `/template` - Template editor
- [ ] AC7: TypeScript types defined for core data models (Listing, Viewing, Evaluation, Template, Verdict)
- [ ] AC8: ESLint and Prettier configured with Next.js presets
- [ ] AC9: Development server runs without errors (`pnpm dev`)
- [ ] AC10: Production build succeeds (`pnpm build`)

## Dependencies

- Architecture document: `specs/architecture/HLD-Application-001.md`
- Product specification: `specs/product.md`
- Technology stack: `specs/tech-stack.md`
- Product guidelines: `specs/product-guidelines.md`

## Out of Scope

- Backend server or API routes
- User authentication
- Database setup (using localStorage only)
- Automated testing infrastructure
- CI/CD pipeline configuration
- Deployment configuration

## Technical Notes

### Package Manager
Use pnpm as specified in tech-stack.md for faster installs and efficient disk usage.

### State Management Pattern
Each Zustand store should follow this pattern:
- TypeScript interfaces for state shape
- Actions for state mutations
- localStorage middleware for persistence
- Selectors for computed values if needed

### Component Structure
Organize components in `components/` directory:
- `components/ui/` - shadcn/ui components
- `components/listings/` - Listing-related components
- `components/evaluations/` - Evaluation-related components
- `components/comparison/` - Comparison view components

### Data Model Types
Define TypeScript interfaces in `types/` directory:
- `types/listing.ts` - Listing and Viewing types
- `types/evaluation.ts` - Evaluation and Template types
- `types/verdict.ts` - Verdict types

### Routing Strategy
Use Next.js App Router with:
- File-based routing in `app/` directory
- Layout components for shared UI (header, navigation)
- Dynamic routes for listing detail pages

### Mobile-First Approach
- Use Tailwind's mobile-first responsive prefixes (`md:`, `lg:`)
- Design for mobile viewport first (375px width)
- Test responsive breakpoints at 768px (tablet) and 1024px (desktop)

### Color Palette
Implement colors from product-guidelines.md:
- Primary: Neutral grays
- Accent: Blue or teal for primary actions
- Success: Green for positive states
- Warning: Yellow/orange for attention states
- Error: Red for negative states
