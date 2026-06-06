# Project Initialization

## Overview

Initialize a Next.js 15.x project with TypeScript, Tailwind CSS, and ESLint pre-configured. Install all core dependencies (Zustand, React Hook Form, Zod, Lucide React) and configure Prettier for code formatting. This establishes the foundational development environment for the Rental Viewing Evaluator MVP.

## Functional Requirements

### FR1: Next.js Project Creation
- Create Next.js 15.x project using App Router
- Enable TypeScript configuration
- Enable Tailwind CSS configuration
- Enable ESLint configuration
- Use pnpm as package manager

### FR2: Core Dependencies Installation
- Install Zustand ^5.x for state management
- Install React Hook Form ^7.x for form handling
- Install Zod ^3.x for validation
- Install Lucide React for icons
- Install all dependencies in single command for efficiency

### FR3: Code Quality Tools
- Configure Prettier with Next.js defaults
- Ensure ESLint and Prettier are compatible
- Verify dev server runs without errors
- Verify production build succeeds

## Non-Functional Requirements

### NFR1: Development Experience
- Project should initialize within 2 minutes on typical hardware
- Dev server should start within 5 seconds
- Hot reload should work for all file types

### NFR2: Type Safety
- TypeScript should be strictly configured (no implicit any)
- All installed packages should have type definitions

## Acceptance Criteria

- [ ] AC1: Next.js project created with App Router, TypeScript, Tailwind CSS, ESLint
- [ ] AC2: All core dependencies installed (Zustand, React Hook Form, Zod, Lucide React)
- [ ] AC3: Prettier configured and integrated with ESLint
- [ ] AC4: `pnpm dev` runs successfully without errors
- [ ] AC5: `pnpm build` completes successfully
- [ ] AC6: TypeScript compilation succeeds with no errors

## Out of Scope

- shadcn/ui component library initialization (handled in UI Framework Setup)
- Zustand store creation (handled in State Management)
- Route creation (handled in Routing Structure)
- Custom Tailwind theme configuration (handled in UI Framework Setup)

## Dependencies

- None (this is the foundational feature)

## Technical Notes

### Initialization Command
Use: `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`

### Package Manager
Use pnpm for all package operations as specified in tech-stack.md

### Dependency Versions
Follow version constraints from tech-stack.md:
- next: ^15.x
- react: ^19.x
- react-dom: ^19.x
- typescript: ^5.x
- zustand: ^5.x
- react-hook-form: ^7.x
- zod: ^3.x
- lucide-react: latest
