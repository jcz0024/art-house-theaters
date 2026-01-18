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

// Nearby cities for sidebar
const nearbyCitiesMap: Record<string, { name: string; slug: string }[]> = {
  "los-angeles": [
    { name: "San Francisco Bay Area", slug: "san-francisco" },
    { name: "San Diego", slug: "san-diego" },
    { name: "Portland Area", slug: "portland" },
    { name: "Seattle Area", slug: "seattle" },
  ],
  "new-york": [
    { name: "Boston Area", slug: "boston" },
    { name: "Philadelphia Area", slug: "philadelphia" },
    { name: "Washington DC Area", slug: "washington-dc" },
    { name: "Chicago Area", slug: "chicago" },
  ],
  "san-francisco": [
    { name: "Los Angeles Area", slug: "los-angeles" },
    { name: "Portland Area", slug: "portland" },
    { name: "Seattle Area", slug: "seattle" },
    { name: "Denver Area", slug: "denver" },
  ],
  "chicago": [
    { name: "Detroit Area", slug: "detroit" },
    { name: "Minneapolis-St. Paul", slug: "minneapolis" },
    { name: "Denver Area", slug: "denver" },
    { name: "New York Area", slug: "new-york" },
  ],
  "boston": [
    { name: "New York Area", slug: "new-york" },
    { name: "Philadelphia Area", slug: "philadelphia" },
    { name: "Washington DC Area", slug: "washington-dc" },
    { name: "Chicago Area", slug: "chicago" },
  ],
  "philadelphia": [
    { name: "New York Area", slug: "new-york" },
    { name: "Washington DC Area", slug: "washington-dc" },
    { name: "Boston Area", slug: "boston" },
    { name: "Baltimore", slug: "baltimore" },
  ],
  "washington-dc": [
    { name: "Philadelphia Area", slug: "philadelphia" },
    { name: "New York Area", slug: "new-york" },
    { name: "Baltimore", slug: "baltimore" },
    { name: "Atlanta Area", slug: "atlanta" },
  ],
  "seattle": [
    { name: "Portland Area", slug: "portland" },
    { name: "San Francisco Bay Area", slug: "san-francisco" },
    { name: "Los Angeles Area", slug: "los-angeles" },
    { name: "Denver Area", slug: "denver" },
  ],
  "portland": [
    { name: "Seattle Area", slug: "seattle" },
    { name: "San Francisco Bay Area", slug: "san-francisco" },
    { name: "Los Angeles Area", slug: "los-angeles" },
    { name: "Denver Area", slug: "denver" },
  ],
  "denver": [
    { name: "Austin Area", slug: "austin" },
    { name: "Chicago Area", slug: "chicago" },
    { name: "Los Angeles Area", slug: "los-angeles" },
    { name: "Seattle Area", slug: "seattle" },
  ],
  "austin": [
    { name: "Houston Area", slug: "houston" },
    { name: "Dallas-Fort Worth", slug: "dallas" },
    { name: "Denver Area", slug: "denver" },
    { name: "Los Angeles Area", slug: "los-angeles" },
  ],
  "dallas": [
    { name: "Houston Area", slug: "houston" },
    { name: "Austin Area", slug: "austin" },
    { name: "Denver Area", slug: "denver" },
    { name: "Atlanta Area", slug: "atlanta" },
  ],
  "houston": [
    { name: "Austin Area", slug: "austin" },
    { name: "Dallas-Fort Worth", slug: "dallas" },
    { name: "Miami Area", slug: "miami" },
    { name: "Atlanta Area", slug: "atlanta" },
  ],
  "miami": [
    { name: "Atlanta Area", slug: "atlanta" },
    { name: "Houston Area", slug: "houston" },
    { name: "Washington DC Area", slug: "washington-dc" },
    { name: "New York Area", slug: "new-york" },
  ],
  "atlanta": [
    { name: "Miami Area", slug: "miami" },
    { name: "Washington DC Area", slug: "washington-dc" },
    { name: "Dallas-Fort Worth", slug: "dallas" },
    { name: "Chicago Area", slug: "chicago" },
  ],
  "detroit": [
    { name: "Chicago Area", slug: "chicago" },
    { name: "Minneapolis-St. Paul", slug: "minneapolis" },
    { name: "Cleveland", slug: "cleveland" },
    { name: "Toronto", slug: "toronto" },
  ],
  "minneapolis": [
    { name: "Chicago Area", slug: "chicago" },
    { name: "Detroit Area", slug: "detroit" },
    { name: "Denver Area", slug: "denver" },
    { name: "Milwaukee", slug: "milwaukee" },
  ],
}

const defaultNearbyCities = [
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "New York", slug: "new-york" },
  { name: "Chicago", slug: "chicago" },
  { name: "Austin", slug: "austin" },
]

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  const displayName = getDisplayName(slug)
  const state = getState(slug)
  const nearbyCities = nearbyCitiesMap[slug] || defaultNearbyCities.filter(c => c.slug !== slug)
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
    <div className="dark min-h-screen bg-background">
      {/* City Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Cities</span>
            <span>/</span>
            <span className="text-foreground">{displayName}</span>
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Art House Theaters in {displayName}
          </h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {state && `${state} • `}{theaterList.length} {theaterList.length === 1 ? "theater" : "theaters"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          {/* Main Content */}
          <div>
            {/* Theater Grid or Empty State */}
            {theaterList.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-medium text-black transition-colors hover:bg-[#E5C158]"
                >
                  Submit a Theater
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Nearby Cities */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-8 rounded-lg border border-border/40 bg-card/30 p-6 backdrop-blur-sm">
              <h2 className="mb-6 font-serif text-xl font-semibold text-foreground">Nearby Cities</h2>
              <nav className="space-y-3">
                {nearbyCities.map((nearbyCity) => (
                  <Link
                    key={nearbyCity.slug}
                    href={`/city/${nearbyCity.slug}`}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {nearbyCity.name} →
                  </Link>
                ))}
              </nav>

              <div className="mt-8 border-t border-border/40 pt-6">
                <h3 className="mb-3 text-sm font-medium text-foreground">Can't find your city?</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  We're always adding new theaters. Submit your favorite art house cinema.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center text-sm font-medium text-[#D4AF37] transition-colors hover:text-[#E5C158]"
                >
                  Submit a theater →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
