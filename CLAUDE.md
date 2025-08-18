# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language and Communication

**IMPORTANT**: All communication and documentation in this repository should be in Korean (한글). When working with this codebase:
- Provide all responses and explanations in Korean
- Create documentation files in Korean
- Use Korean for commit messages, comments, and code documentation
- Maintain Korean language consistency throughout all interactions

## Project Overview

This is a Jazz React starter application demonstrating local-first collaborative data structures with Passkey authentication. Jazz is a TypeScript framework for building apps with seamless sync, real-time collaboration, and offline-first capabilities.

## Development Commands

### Core Development
- `npm run dev` - Start Vite development server (http://localhost:5173)
- `npm run build` - Build production version with TypeScript compilation
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run format-and-lint` - Check code formatting and linting with Biome
- `npm run format-and-lint:fix` - Auto-fix formatting and linting issues

### Testing
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI mode

## Architecture

### Jazz Framework Integration
- **Main Provider**: `JazzReactProvider` in `src/Main.tsx` configures sync with Jazz Cloud (`wss://cloud.jazz.tools`)
- **Account System**: Uses passkey authentication with `JazzAccount` schema
- **Real-time Sync**: All data changes automatically sync across devices and users

### Schema Structure (`src/schema.ts`)
- **JazzProfile**: Public user profile data (firstName, etc.)
- **AccountRoot**: Private user data (dateOfBirth, etc.)
- **JazzAccount**: Main account type with profile and root, includes migration logic
- **Helper Functions**: `getUserAge()` for calculated values

### Component Architecture
- **App.tsx**: Main app component with authentication state and user data
- **Form.tsx**: Data binding example showing direct mutation of Jazz CoValues
- **AuthButton.tsx**: Passkey authentication UI
- **Main.tsx**: Root component with Jazz provider setup

### Key Jazz Patterns
- Direct data binding: `me.profile.firstName = e.target.value`
- Reactive data: Components automatically re-render when Jazz data changes
- Schema migrations: Account setup logic runs on creation and login
- Group permissions: Profile data is public (everyone: reader), root data is private

## Local Development

The app uses Jazz Cloud by default. To use a local sync server:
1. Run `npx jazz-run sync` to start local Jazz sync server
2. Update sync config in `src/Main.tsx` to `{ peer: "ws://localhost:4200" }`

## Schema Development

When modifying schemas in `src/schema.ts`:
- Follow Jazz CoValue patterns (co.map, co.list, etc.)
- Update migration logic for new fields
- Consider data privacy (profile vs root placement)
- Test data persistence across page refreshes

## Testing Strategy

E2E tests use Playwright with:
- Auto-start dev server on port 5173
- Clipboard permissions for copy/paste functionality
- CI-optimized retry and parallel execution settings

## Key Dependencies

- **jazz-tools**: Core Jazz framework with React hooks and CoValue types
- **React 19**: Latest React with concurrent features
- **Vite**: Build tool and dev server
- **TailwindCSS 4**: Utility-first CSS framework
- **Biome**: Fast formatter and linter
- **Playwright**: End-to-end testing framework