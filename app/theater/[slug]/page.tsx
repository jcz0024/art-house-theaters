import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, ExternalLink, Navigation, Film, Calendar, Monitor, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

interface TheaterPageProps {
  params: Promise<{
    slug: string
  }>
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
  description: string | null
}

// Helper to create city slug
function createCitySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-')
}

export async function generateMetadata({ params }: TheaterPageProps): Promise<Metadata> {
  const { slug } = await params

  const { data: theater } = await supabase
    .from('theaters')
    .select('name, city, state, description')
    .eq('slug', slug)
    .single<{ name: string; city: string; state: string; description: string | null }>()

  if (!theater) {
    return { title: 'Theater Not Found' }
  }

  const desc = theater.description || `${theater.name} is an independent cinema in ${theater.city}, ${theater.state}.`

  return {
    title: `${theater.name} | Art House Theaters`,
    description: desc,
    openGraph: {
      title: theater.name,
      description: desc,
      type: 'website',
    },
  }
}

export default async function TheaterPage({ params }: TheaterPageProps) {
  const { slug } = await params

  const { data: theater, error } = await supabase
    .from('theaters')
    .select('slug, name, city, state, year_established, screens, is_nonprofit, website, description')
    .eq('slug', slug)
    .single<Theater>()

  if (error || !theater) {
    notFound()
  }

  const citySlug = createCitySlug(theater.city)

  return (
    <div className="dark min-h-screen bg-linear-to-b from-[#0f0f0f] via-[#0a0a0a] to-[#050505]">
      {/* Hero Section */}
      <div className="relative bg-transparent">
        <div className="relative h-50 overflow-hidden bg-transparent sm:h-70">

          {/* Breadcrumb */}
          <nav className="absolute bottom-0 left-0 right-0" aria-label="Breadcrumb">
            <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href="/"
                  className="rounded-md px-1 py-0.5 motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/city/${citySlug}`}
                  className="rounded-md px-1 py-0.5 motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {theater.city}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground" aria-current="page">{theater.name}</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Theater Title & Location */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {theater.name}
          </h1>

          <div className="mb-6 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-base">
              {theater.city}, {theater.state}
            </span>
          </div>

          {/* Description */}
          {theater.description && (
            <p className="mb-8 max-w-3xl text-pretty text-lg leading-relaxed text-neutral-300">
              {theater.description}
            </p>
          )}

          {/* Theater Details */}
          <div className="mb-8 flex flex-wrap gap-3">
            {theater.year_established && theater.year_established > 0 && (
              <Badge variant="secondary" className="bg-secondary/50 text-sm font-normal">
                <Calendar className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">Est. {theater.year_established}</span>
              </Badge>
            )}
            {theater.screens && theater.screens > 0 && (
              <Badge variant="secondary" className="bg-secondary/50 text-sm font-normal">
                <Monitor className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">{theater.screens}</span> {theater.screens === 1 ? 'Screen' : 'Screens'}
              </Badge>
            )}
            {theater.is_nonprofit && (
              <Badge variant="secondary" className="bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-normal">
                <Heart className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Nonprofit
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {theater.website && (
              <Button
                asChild
                size="lg"
                className="bg-[#D4AF37] text-black motion-safe:transition-colors hover:bg-[#E5C158] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <a
                  href={theater.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${theater.name} website (opens in new tab)`}
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Visit Website
                </a>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/60 bg-transparent motion-safe:transition-colors hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${theater.name}, ${theater.city}, ${theater.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${theater.name} on Google Maps (opens in new tab)`}
              >
                <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* What's Playing Section */}
        <section className="rounded-lg border border-border/40 bg-card/30 p-8 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-[#D4AF37]/10 p-2" aria-hidden="true">
              <Film className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground">What's Playing</h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Visit their website for current showtimes and programming. Many art house theaters update their schedules
            weekly with special events, director Q&As, and thematic series.
          </p>
          {theater.website && (
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                className="border-border/60 bg-transparent motion-safe:transition-colors hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <a
                  href={theater.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View current schedule at ${theater.name} (opens in new tab)`}
                >
                  View Current Schedule
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          )}
        </section>

        {/* Back to City Link */}
        <div className="mt-12 border-t border-border/40 pt-8">
          <Link
            href={`/city/${citySlug}`}
            className="inline-flex min-h-11 items-center rounded-md px-1 py-2 text-sm text-muted-foreground motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-6"
          >
            ← Back to all theaters in {theater.city}
          </Link>
        </div>
      </main>
    </div>
  )
}
