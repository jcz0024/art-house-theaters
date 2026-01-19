# Art House Movie Theaters

A directory of independent and art house cinemas across the United States.

**Live site:** [arthousemovietheaters.com](https://arthousemovietheaters.com)

## About

This directory helps cinephiles discover theaters showing foreign films, classic cinema, independent features, and repertory programming. Currently featuring **488 theaters** across all 50 US states.

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [Supabase](https://supabase.com/) - PostgreSQL database
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
