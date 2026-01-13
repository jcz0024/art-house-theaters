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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ""

  let theaters: Theater[] = []

  if (query) {
    const { data, error } = await supabase
      .from('theaters')
      .select('slug, name, city, state, year_established, screens, is_nonprofit, website')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
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
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Search</span>
          </div>

          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-[#D4AF37]" />
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {query ? `Results for "${query}"` : "Search Theaters"}
            </h1>
          </div>

          {query && (
            <p className="mt-4 text-muted-foreground">
              {theaters.length} {theaters.length === 1 ? "theater" : "theaters"} found
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!query ? (
          <div className="rounded-lg border border-border/40 bg-card/30 p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-medium text-black transition-colors hover:bg-[#E5C158]"
            >
              Browse All Theaters
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
