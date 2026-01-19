import { TheaterCard } from "@/components/theater-card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Search } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = q || ""

  return {
    title: query ? `Search: ${query} | Art House Theaters` : "Search | Art House Theaters",
    description: query
      ? `Search results for "${query}" - Find art house and independent theaters.`
      : "Search for art house and independent theaters across America.",
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

// Map full state names to abbreviations
const stateNameToAbbr: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
  "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
  "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
  "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
  "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
  "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
  "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", "ohio": "OH", "oklahoma": "OK",
  "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
  "vermont": "VT", "virginia": "VA", "washington": "WA", "west virginia": "WV",
  "wisconsin": "WI", "wyoming": "WY", "district of columbia": "DC",
}

// Get state abbreviation if query matches a full state name
function getStateAbbr(query: string): string | null {
  const normalized = query.toLowerCase().trim()
  return stateNameToAbbr[normalized] || null
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ""

  let theaters: Theater[] = []

  if (query) {
    // Check if query is a full state name and get its abbreviation
    const stateAbbr = getStateAbbr(query)

    // Build search terms - include both original query and state abbreviation if found
    const searchTerms = [query]
    if (stateAbbr) {
      searchTerms.push(stateAbbr)
    }

    // Build OR conditions for all search terms
    const orConditions = searchTerms.flatMap(term => [
      `name.ilike.%${term}%`,
      `city.ilike.%${term}%`,
      `state.ilike.%${term}%`
    ]).join(',')

    const { data, error } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
      .or(orConditions)
      .order('name')

    if (error) {
      console.error('Error searching theaters:', error)
    } else {
      theaters = data || []
    }
  }

  return (
    <div className="dark min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
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
            <span className="text-foreground" aria-current="page">Search</span>
          </nav>

          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {query ? `Results for "${query}"` : "Search Theaters"}
            </h1>
          </div>

          {query && (
            <p className="mt-4 text-muted-foreground">
              <span className="font-variant-numeric tabular-nums">{theaters.length}</span> {theaters.length === 1 ? "theater" : "theaters"} found
            </p>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!query ? (
          <div className="rounded-lg border border-border/40 bg-card/30 p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
              Enter a search term
            </h2>
            <p className="text-muted-foreground">
              Search by theater name, city, or state to find art house cinemas.
            </p>
          </div>
        ) : theaters.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {theaters.map((theater) => (
              <TheaterCard key={theater.slug} {...theater} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border/40 bg-card/30 p-12 text-center">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
              No theaters found for "{query}"
            </h2>
            <p className="mb-6 text-muted-foreground">
              Try a different search term or browse by city.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-medium text-black motion-safe:transition-colors hover:bg-[#E5C158] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Browse All Theaters
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
