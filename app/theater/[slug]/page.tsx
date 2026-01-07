import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, ExternalLink, Navigation, Film } from "lucide-react"

interface TheaterPageProps {
  params: Promise<{
    slug: string
  }>
}

// Mock data - in production, this would come from a database
const theaterData: Record<
  string,
  {
    name: string
    city: string
    state: string
    address: string
    zipCode: string
    website: string
    description: string[]
    tags: string[]
    citySlug: string
  }
> = {
  "new-beverly-cinema": {
    name: "The New Beverly Cinema",
    city: "Los Angeles",
    state: "CA",
    address: "7165 Beverly Blvd",
    zipCode: "90036",
    website: "https://thenewbev.com",
    description: [
      "The New Beverly Cinema has been a Los Angeles institution since 1978, and under the ownership of Quentin Tarantino since 2014, it has become a mecca for film purists and cinephiles. This single-screen revival house is dedicated exclusively to 35mm film projection—no digital, ever.",
      "Every week brings meticulously programmed double and triple features, from film noir and westerns to cult classics and foreign masterpieces. The New Bev's commitment to celluloid is unwavering, with Tarantino himself often selecting prints from his personal collection.",
      "The theater's intimate 275-seat auditorium retains its vintage charm, complete with red velvet curtains and a classic marquee. It's a place where midnight movies feel dangerous again, where you can experience cinema the way it was meant to be seen—projected from actual film, with all its grain, texture, and warmth intact.",
    ],
    tags: ["35mm", "Repertory", "Double Features", "Historic", "Cult Classics"],
    citySlug: "los-angeles",
  },
  "laemmle-royal": {
    name: "Laemmle Royal",
    city: "Los Angeles",
    state: "CA",
    address: "11523 Santa Monica Blvd",
    zipCode: "90025",
    website: "https://laemmle.com/royal",
    description: [
      "Since 1980, the Laemmle Royal has been West LA's premier destination for art house cinema, foreign films, and independent American features that challenge and inspire. Part of the historic Laemmle theater chain—a family business dating back to 1938—the Royal maintains the tradition of presenting films that matter.",
      "The theater's four screens offer an eclectic mix of international cinema, documentary films, and American indies that mainstream multiplexes won't touch. From Cannes winners to festival darlings, the Royal is where discerning filmgoers come to discover cinema from around the world.",
      "With its convenient West LA location and adjoining wine bar, the Royal has become more than a theater—it's a gathering place for a community of film lovers who believe in cinema's power to expand perspectives and cross cultural boundaries.",
    ],
    tags: ["Foreign Films", "Indie", "Bar", "Documentary", "Festival Films"],
    citySlug: "los-angeles",
  },
}

export default async function TheaterPage({ params }: TheaterPageProps) {
  const { slug } = await params
  const theater = theaterData[slug] || theaterData["new-beverly-cinema"]

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${theater.address}, ${theater.city}, ${theater.state} ${theater.zipCode}`,
  )}`

  return (
    <div className="dark min-h-screen bg-background">
      {/* Hero Section with Placeholder Image Area */}
      <div className="relative border-b border-border/40 bg-gradient-to-b from-card/40 to-background">
        {/* Placeholder image area */}
        <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-card/60 via-card/40 to-background sm:h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-[url('/vintage-movie-theater-marquee-at-night.jpg')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Floating content */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
                <span>/</span>
                <Link href={`/city/${theater.citySlug}`} className="transition-colors hover:text-foreground">
                  {theater.city}
                </Link>
                <span>/</span>
                <span className="text-foreground">{theater.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theater Title & Location */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {theater.name}
          </h1>

          <div className="mb-6 space-y-2 text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
              <div className="text-sm sm:text-base">
                <div>{theater.address}</div>
                <div>
                  {theater.city}, {theater.state} {theater.zipCode}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/60 hover:border-primary bg-transparent"
            >
              <a href={theater.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {theater.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/50 text-sm font-normal text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="mb-12 space-y-6">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">About {theater.name}</h2>
          {theater.description.map((paragraph, index) => (
            <p key={index} className="text-pretty leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        {/* What's Playing Section */}
        <div className="rounded-lg border border-border/40 bg-card/30 p-8 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Film className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground">What's Playing</h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Visit their website for current showtimes and programming. Many art house theaters update their schedules
            weekly with special events, director Q&As, and thematic series.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="border-border/60 hover:border-primary bg-transparent">
              <a href={theater.website} target="_blank" rel="noopener noreferrer">
                View Current Schedule
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Back to City Link */}
        <div className="mt-12 border-t border-border/40 pt-8">
          <Link
            href={`/city/${theater.citySlug}`}
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to all theaters in {theater.city}
          </Link>
        </div>
      </div>
    </div>
  )
}
