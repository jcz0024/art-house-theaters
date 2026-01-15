# CLAUDE.md - AI Assistant Guide for Art House Theaters

This file provides guidance for AI assistants working with the Art House Theaters codebase.

## Project Overview

Art House Theaters is a Next.js web application serving as a searchable directory of independent cinemas and art house theaters across the United States. Users can discover theaters by location, name, or state.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 16.0.10 |
| Runtime | React | 19.2.0 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.1.9 |
| UI Components | shadcn/ui + Radix UI | - |
| Database | Supabase (PostgreSQL) | 2.90.1 |
| Deployment | Vercel | - |
| Package Manager | npm | - |

## Project Structure

```
art-house-theaters/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page - theater listing + city grid
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles + Tailwind imports
│   ├── api/debug/         # Debug endpoint for Supabase connection
│   ├── search/            # Search results page
│   ├── city/[slug]/       # City landing pages
│   ├── theater/[slug]/    # Theater detail pages
│   └── coming-soon/       # Under construction page
├── components/            # React components
│   ├── hero-section.tsx   # Search hero with city carousel
│   ├── theater-card.tsx   # Theater card component
│   ├── city-card.tsx      # City card component
│   ├── footer.tsx         # Site footer
│   └── ui/                # shadcn/ui components (57 files)
├── lib/                   # Utilities
│   ├── supabase.ts        # Supabase client initialization
│   └── utils.ts           # cn() class name utility
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts      # Mobile breakpoint detection
│   └── use-toast.ts       # Toast notifications
├── public/                # Static assets
├── proxy.ts               # Under construction middleware logic
├── next.config.mjs        # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Environment Variables

### Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

### Optional

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_LIVE` | Site live toggle (`true`/`false`) | Redirects to /coming-soon if not `true` |

## Database Schema

### theaters table

```typescript
interface Theater {
  slug: string              // URL-friendly identifier (primary)
  name: string              // Theater name
  city: string              // City name
  state: string             // Full state name (e.g., "California")
  year_established?: number // Year founded
  screens?: number          // Number of screens
  is_nonprofit?: boolean    // Nonprofit status
  website?: string          // Theater website URL
  description?: string      // Theater description
}
```

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with all theaters and city browsing |
| `/search?q=<term>` | Search results (searches name, city, state) |
| `/city/[slug]` | City landing page (e.g., `/city/los-angeles`) |
| `/theater/[slug]` | Theater detail page |
| `/coming-soon` | Under construction page |
| `/api/debug` | Debug endpoint for Supabase diagnostics |

## Code Conventions

### File Naming
- Components: `kebab-case.tsx` (e.g., `hero-section.tsx`)
- Pages: `page.tsx` in folder structure
- Utilities: `kebab-case.ts`

### Component Patterns
- Use TypeScript interfaces for props
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Server components by default; add `'use client'` when needed
- Use `export const dynamic = 'force-dynamic'` for pages requiring fresh data

### Styling
- Tailwind CSS for all styling
- OKLCH color system with gold (#D4AF37) as primary brand color
- Dark theme by default
- Responsive design using Tailwind breakpoints

### Data Fetching
- Server-side Supabase queries in page components
- Use `.ilike()` for case-insensitive searches
- Handle state abbreviations (CA, NY) and full names (California, New York)

## Common Tasks

### Adding a New Page
1. Create folder in `app/` with `page.tsx`
2. Add metadata export for SEO
3. Use `dynamic = 'force-dynamic'` if fetching Supabase data
4. Import `supabase` from `@/lib/supabase`

### Adding a UI Component
1. Use `npx shadcn-ui@latest add <component-name>`
2. Component will be added to `components/ui/`
3. Import from `@/components/ui/<component>`

### Querying Theaters
```typescript
import { supabase } from '@/lib/supabase'

// Get all theaters
const { data } = await supabase.from('theaters').select('*')

// Search theaters
const { data } = await supabase
  .from('theaters')
  .select('*')
  .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)

// Get theater by slug
const { data } = await supabase
  .from('theaters')
  .select('*')
  .eq('slug', slug)
  .single()
```

## Important Notes

### Current Configuration
- TypeScript build errors are ignored (`ignoreBuildErrors: true`)
- Image optimization is disabled (`unoptimized: true`)
- All routes use `force-dynamic` rendering

### Site Live Toggle
The `proxy.ts` middleware redirects to `/coming-soon` when `NEXT_PUBLIC_SITE_LIVE !== "true"`. API routes and static files are excluded from redirection.

### State Name Handling
Search functionality handles both state abbreviations and full names. The mapping is in `app/search/page.tsx` with 50+ state entries.

### Debug Instrumentation
Some files contain debug logging to a local telemetry endpoint. These are wrapped in `// #region agent log` comments and can be safely ignored or removed in production.

## Testing

No formal test suite is currently configured. When adding tests:
- Use Jest or Vitest for unit tests
- Use React Testing Library for component tests
- Use Playwright or Cypress for E2E tests

## Deployment

Deployed on Vercel with automatic deployments on git push. Environment variables must be configured in Vercel project settings.

## Path Aliases

The `@/` alias maps to the project root. Use it for imports:
```typescript
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```
