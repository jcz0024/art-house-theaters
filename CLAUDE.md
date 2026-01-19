# Art House Movie Theaters

Directory of independent and art house cinemas across the US.
Live: arthousemovietheaters.com | Deploys via Vercel from main branch

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Supabase (PostgreSQL)
- Vercel hosting

## Commands
```bash
npm run dev          # local dev server (localhost:3000)
npm run build        # production build - run before deploying
npm run lint         # eslint check
```

## Project Structure
```
app/
├── page.tsx              # Homepage - lists all theaters
├── city/[slug]/page.tsx  # City pages (e.g., /city/los-angeles)
├── theater/[slug]/page.tsx # Individual theater pages
├── search/               # Search functionality
├── layout.tsx            # Root layout with metadata
└── globals.css           # Global styles

components/
├── hero-section.tsx      # Homepage hero with search
├── theater-card.tsx      # Theater display card
├── city-card.tsx         # City navigation card
├── footer.tsx            # Site footer
└── ui/                   # Base UI components (shadcn)

lib/
├── supabase.ts           # Supabase client
└── utils.ts              # Utility functions

types/
└── index.ts              # Shared TypeScript interfaces
```

## Database
- Supabase project: ovadwsnbmvrarouzwmam.supabase.co
- Main table: `theaters` with columns: slug, name, city, state, year_established, screens, is_nonprofit, website, description
- **488 theaters** across all 50 states (as of Jan 2026)
- Data completeness: 47% have descriptions, 99% have websites

## Scripts
- `scripts/download-theater-photos.ts` - Fetch photos from Google Places API
- `scripts/photo-review-server.ts` - Interactive tool for selecting best photos (port 3457)
- `scripts/check-db.ts` - Database stats checker

## Environment Variables
Required in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For scripts (local only):
- `GOOGLE_PLACES_API_KEY` - For downloading theater photos
