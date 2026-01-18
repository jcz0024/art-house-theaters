# Art House Movie Theaters

Directory of independent and art house cinemas across the US.
Live: arthousemovietheaters.com | Deploys via Vercel from main branch

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
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

## Environment Variables
Required in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
