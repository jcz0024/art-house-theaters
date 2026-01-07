import { TheaterCard } from "@/components/theater-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface CityPageProps {
  params: Promise<{
    slug: string
  }>
}

// Mock data - in production, this would come from a database
const cityData: Record<string, { name: string; state: string; description: string }> = {
  "los-angeles": {
    name: "Los Angeles",
    state: "CA",
    description:
      "Los Angeles has long been the epicenter of American cinema, and its art house scene reflects that rich history. From historic single-screen theaters in Echo Park to modernist screening rooms in West Hollywood, LA's independent cinemas offer everything from rare 35mm prints to experimental new media. The city's repertory houses and nonprofit cinemas serve as vital cultural anchors, preserving film history while championing emerging voices.",
  },
  "new-york": {
    name: "New York",
    state: "NY",
    description:
      "New York City's art house theater scene is unmatched in its diversity and vitality. From Manhattan's legendary Film Forum to Brooklyn's indie havens, the city offers cinephiles an embarrassment of riches. These theaters are more than screening rooms—they're gathering places for film lovers, educators, and artists who believe in cinema's power to challenge, inspire, and transform.",
  },
  chicago: {
    name: "Chicago",
    state: "IL",
    description:
      "Chicago's independent cinema landscape reflects the city's working-class roots and sophisticated cultural appetite. Historic neighborhood theaters have been lovingly restored, while new venues continue to open, all dedicated to presenting films that mainstream multiplexes won't touch. The city's art house theaters are community anchors, bringing people together around shared cinematic experiences.",
  },
}

const cityTheaters: Record<string, any[]> = {
  "los-angeles": [
    {
      name: "The New Beverly Cinema",
      city: "Los Angeles",
      state: "CA",
      description: "Quentin Tarantino's repertory theater showing double features on 35mm.",
      tags: ["35mm", "Repertory", "Double Features"],
      slug: "new-beverly-cinema",
    },
    {
      name: "Laemmle Royal",
      city: "Los Angeles",
      state: "CA",
      description: "West LA's premier art house cinema for foreign and independent films.",
      tags: ["Foreign Films", "Indie", "Bar"],
      slug: "laemmle-royal",
    },
    {
      name: "American Cinematheque",
      city: "Los Angeles",
      state: "CA",
      description: "Nonprofit preserving and presenting classic Hollywood and international cinema.",
      tags: ["Nonprofit", "Classics", "Q&A"],
      slug: "american-cinematheque",
    },
    {
      name: "The Vista Theatre",
      city: "Los Angeles",
      state: "CA",
      description: "Egyptian-themed single-screen palace showcasing indie and art films since 1923.",
      tags: ["Historic", "Single Screen", "Indie"],
      slug: "vista-theatre",
    },
    {
      name: "Vidiots",
      city: "Los Angeles",
      state: "CA",
      description: "Eagle Rock cinema and video store celebrating film culture and community.",
      tags: ["Video Store", "Bar/Food", "Events"],
      slug: "vidiots",
    },
    {
      name: "Alamo Drafthouse DTLA",
      city: "Los Angeles",
      state: "CA",
      description: "Full restaurant cinema with genre programming and midnight movies.",
      tags: ["Bar/Food", "Midnight Movies", "Events"],
      slug: "alamo-drafthouse-dtla",
    },
  ],
}

const nearbyCities = [
  { name: "San Francisco", slug: "san-francisco" },
  { name: "San Diego", slug: "san-diego" },
  { name: "Oakland", slug: "oakland" },
  { name: "Pasadena", slug: "pasadena" },
]

const filterOptions = ["All", "35mm", "Repertory", "Bar/Food", "Nonprofit"]

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  const city = cityData[slug] || cityData["los-angeles"]
  const theaters = cityTheaters[slug] || cityTheaters["los-angeles"]

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
            <span className="text-foreground">{city.name}</span>
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Art House Theaters in {city.name}
          </h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {city.state} • {theaters.length} {theaters.length === 1 ? "theater" : "theaters"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          {/* Main Content */}
          <div>
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-balance leading-relaxed text-muted-foreground">{city.description}</p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">Filter by</h2>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <Badge
                    key={filter}
                    variant={filter === "All" ? "default" : "outline"}
                    className={
                      filter === "All"
                        ? "cursor-pointer bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                        : "cursor-pointer border-border/60 bg-transparent text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    }
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Theater Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {theaters.map((theater) => (
                <TheaterCard key={theater.slug} {...theater} />
              ))}
            </div>
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
                  className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
