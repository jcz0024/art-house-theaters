import { TheaterCard } from "@/components/theater-card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"
import { getMetroArea } from "@/lib/metro-areas"

export const dynamic = 'force-dynamic'

interface CityPageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper to convert slug to display name (uses metro area name if applicable)
function getDisplayName(slug: string): string {
  const metro = getMetroArea(slug)
  if (metro) return metro.displayName
  // Fallback: convert slug to title case
  return slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Helper to get state for display
function getState(slug: string): string {
  const metro = getMetroArea(slug)
  if (metro) return metro.state
  return ""
}

// Helper to get description for SEO
function getDescription(slug: string): string {
  const metro = getMetroArea(slug)
  if (metro) return metro.description
  const cityName = getDisplayName(slug)
  return `Find art house and independent theaters in ${cityName}. Discover repertory cinemas, indie film venues, and community theaters.`
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params
  const displayName = getDisplayName(slug)
  const description = getDescription(slug)

  return {
    title: `Art House Theaters in ${displayName} | Independent Cinemas`,
    description,
    openGraph: {
      title: `Art House Theaters in ${displayName}`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Art House Theaters in ${displayName}`,
      description,
    },
  }
}

interface Theater {
  slug: string
  name: string
  city: string
  state: string
  year_established: number | null
  screens: number | null
  is_nonprofit: boolean | null
  website: string | null
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  const displayName = getDisplayName(slug)
  const state = getState(slug)
  const metro = getMetroArea(slug)

  // Query Supabase for theaters
  let theaters: Theater[] | null = null
  let error: Error | null = null

  if (metro) {
    // Metro area: fetch all theaters where city matches any city in the metro
    const { data, error: queryError } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
      .in('city', metro.cities)
      .order('city')
      .order('name')
    theaters = data
    error = queryError
  } else {
    // Non-metro: exact city match (case-insensitive)
    const cityName = slug.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    const { data, error: queryError } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
      .ilike('city', cityName)
      .order('name')
    theaters = data
    error = queryError
  }

  if (error) {
    console.error('Error fetching theaters:', error)
  }

  const theaterList: Theater[] = theaters || []

  return (
    <div className="dark min-h-screen bg-linear-to-b from-[#0f0f0f] via-[#0a0a0a] to-[#050505]">
      {/* City Header */}
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link
              href="/"
              className="rounded-md px-1 py-0.5 motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Cities</span>
            <span aria-hidden="true">/</span>
            <span className="text-foreground" aria-current="page">{displayName}</span>
          </nav>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Art House Theaters in {displayName}
          </h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">
              {state && `${state} • `}<span className="tabular-nums">{theaterList.length}</span> {theaterList.length === 1 ? "theater" : "theaters"}
            </span>
          </div>
        </div>
      </div>

      {/* Theater Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {theaterList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {theaterList.map((theater) => (
              <TheaterCard key={theater.slug} {...theater} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border/40 bg-card/30 p-12 text-center">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
              No theaters found in {displayName}
            </h2>
            <p className="mb-6 text-muted-foreground">
              Know one? Submit it.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-medium text-black motion-safe:transition-colors hover:bg-[#E5C158] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Submit a Theater
            </Link>
          </div>
        )}
      </main>

      {/* Can't find your city? */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border/50 bg-card/30 p-6 motion-safe:transition-all motion-safe:duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <h3 className="font-serif text-xl font-medium text-amber-50 mb-3">Can't find your city?</h3>
          <p className="text-neutral-400 mb-4">We're always adding new theaters. Submit your favorite art house cinema.</p>
          <Link href="/submit" className="text-[#D4AF37] hover:text-[#E5C158] motion-safe:transition-colors">
            Submit a theater →
          </Link>
        </div>
      </div>
    </div>
  )
}
