import { TheaterCard } from "@/components/theater-card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

interface CityPageProps {
  params: Promise<{
    slug: string
  }>
}

// City mapping: slug → display name
const cityMapping: Record<string, string> = {
  "los-angeles": "Los Angeles",
  "new-york": "New York",
  "brooklyn": "Brooklyn",
  "chicago": "Chicago",
  "austin": "Austin",
  "seattle": "Seattle",
  "portland": "Portland",
  "san-francisco": "San Francisco",
  "denver": "Denver",
}

// State mapping for display
const cityStateMapping: Record<string, string> = {
  "los-angeles": "CA",
  "new-york": "NY",
  "brooklyn": "NY",
  "chicago": "IL",
  "austin": "TX",
  "seattle": "WA",
  "portland": "OR",
  "san-francisco": "CA",
  "denver": "CO",
}

// City descriptions for SEO
const cityDescriptions: Record<string, string> = {
  "los-angeles": "Discover independent and art house cinemas in Los Angeles. From historic single-screen theaters to modern screening rooms, find the best repertory and indie film venues in LA.",
  "new-york": "Explore New York City's legendary art house theater scene. From Manhattan's Film Forum to Brooklyn's indie havens, find independent cinemas showing classic and contemporary films.",
  "brooklyn": "Find art house theaters in Brooklyn, NY. Discover indie cinemas, repertory houses, and community-focused film venues in one of America's most vibrant neighborhoods.",
  "chicago": "Discover Chicago's independent cinema landscape. Find art house theaters, repertory houses, and community cinemas throughout the Windy City.",
  "austin": "Explore Austin's vibrant art house theater scene. From the Alamo Drafthouse to historic venues, find indie cinemas in Texas's film-loving capital.",
  "seattle": "Find art house theaters in Seattle. Discover independent cinemas, repertory houses, and film festivals in the Pacific Northwest's cultural hub.",
  "portland": "Explore Portland's unique art house theater scene. Find indie cinemas, brewpub theaters, and repertory houses in Oregon's creative capital.",
  "san-francisco": "Discover art house cinemas in San Francisco. From historic theaters to modern screening rooms, find independent film venues in the Bay Area.",
  "denver": "Find art house theaters in Denver. Explore independent cinemas and repertory houses in Colorado's Mile High City.",
}

// Helper to convert slug to city name
function slugToCityName(slug: string): string {
  return cityMapping[slug] || slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params
  const cityName = slugToCityName(slug)
  const description = cityDescriptions[slug] || `Find art house and independent theaters in ${cityName}. Discover repertory cinemas, indie film venues, and community theaters.`

  return {
    title: `Art House Theaters in ${cityName} | Independent Cinemas`,
    description,
    openGraph: {
      title: `Art House Theaters in ${cityName}`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Art House Theaters in ${cityName}`,
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
    { name: "San Francisco", slug: "san-francisco" },
    { name: "San Diego", slug: "san-diego" },
    { name: "Portland", slug: "portland" },
    { name: "Seattle", slug: "seattle" },
  ],
  "new-york": [
    { name: "Brooklyn", slug: "brooklyn" },
    { name: "Boston", slug: "boston" },
    { name: "Philadelphia", slug: "philadelphia" },
    { name: "Chicago", slug: "chicago" },
  ],
  "brooklyn": [
    { name: "New York", slug: "new-york" },
    { name: "Boston", slug: "boston" },
    { name: "Philadelphia", slug: "philadelphia" },
    { name: "Chicago", slug: "chicago" },
  ],
  "chicago": [
    { name: "Detroit", slug: "detroit" },
    { name: "Minneapolis", slug: "minneapolis" },
    { name: "Denver", slug: "denver" },
    { name: "New York", slug: "new-york" },
  ],
  "austin": [
    { name: "Houston", slug: "houston" },
    { name: "Dallas", slug: "dallas" },
    { name: "Denver", slug: "denver" },
    { name: "Los Angeles", slug: "los-angeles" },
  ],
  "seattle": [
    { name: "Portland", slug: "portland" },
    { name: "San Francisco", slug: "san-francisco" },
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "Denver", slug: "denver" },
  ],
  "portland": [
    { name: "Seattle", slug: "seattle" },
    { name: "San Francisco", slug: "san-francisco" },
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "Denver", slug: "denver" },
  ],
  "san-francisco": [
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "Portland", slug: "portland" },
    { name: "Seattle", slug: "seattle" },
    { name: "Denver", slug: "denver" },
  ],
  "denver": [
    { name: "Austin", slug: "austin" },
    { name: "Chicago", slug: "chicago" },
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "Seattle", slug: "seattle" },
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
  const cityName = slugToCityName(slug)
  const state = cityStateMapping[slug] || ""
  const nearbyCities = nearbyCitiesMap[slug] || defaultNearbyCities.filter(c => c.slug !== slug)

  // Query Supabase for theaters in this city
  const { data: theaters, error } = await supabase
    .from('theaters')
    .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
    .ilike('city', cityName)
    .order('name')

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
            <span className="text-foreground">{cityName}</span>
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Art House Theaters in {cityName}
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
                  No theaters found in {cityName}
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
