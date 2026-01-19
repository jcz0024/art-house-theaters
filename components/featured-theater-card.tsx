import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight, ExternalLink } from "lucide-react"

interface FeaturedTheaterCardProps {
  name: string
  city: string
  state: string
  slug: string
  year_established?: number | null
  screens?: number | null
  is_nonprofit?: boolean | null
  website?: string | null
  description?: string | null
}

export function FeaturedTheaterCard({
  name,
  city,
  state,
  slug,
  year_established,
  screens,
  is_nonprofit,
  website,
  description
}: FeaturedTheaterCardProps) {
  // Build tags from database fields
  const tags: string[] = []
  if (year_established) tags.push(`Est. ${year_established}`)
  if (screens) tags.push(`${screens} ${screens === 1 ? 'Screen' : 'Screens'}`)
  if (is_nonprofit) tags.push('Nonprofit')

  return (
    <Card className="group relative overflow-hidden border-zinc-800/60 bg-[#1a1a1a] backdrop-blur-sm motion-safe:transition-all motion-safe:duration-300 hover:border-[#D4AF37]/50 hover:bg-[#1c1c1c] hover:shadow-xl hover:shadow-[#D4AF37]/20 focus-within:border-[#D4AF37]/50 focus-within:shadow-xl focus-within:shadow-[#D4AF37]/20">
      {/* Image area with fixed aspect ratio to prevent CLS */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900" />

        {/* Film grain texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-50" />

        {/* Gradient overlay from bottom for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-black/30" />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

        {/* Featured badge */}
        <div className="absolute left-4 top-4">
          <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/20 text-[#D4AF37] backdrop-blur-sm">
            Featured
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Theater Name - larger for featured */}
        <h3 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-[#f5f1e8] motion-safe:transition-colors group-hover:text-[#D4AF37] group-focus-within:text-[#D4AF37] md:text-3xl">
          {name}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>
            {city}, {state}
          </span>
        </div>

        {/* Description - 2-3 lines with ellipsis */}
        {description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-neutral-300">
            {description}
          </p>
        )}

        {/* Tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border border-zinc-700/50 bg-zinc-800/40 text-xs font-normal text-zinc-300 motion-safe:transition-colors hover:border-zinc-600 hover:bg-zinc-800/60"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Links - minimum 44px touch targets on mobile */}
        <div className="flex items-center gap-4">
          <Link
            href={`/theater/${slug}`}
            className="group/link inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 py-2 text-sm font-medium text-[#D4AF37] motion-safe:transition-all hover:gap-2 hover:text-[#E5C158] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] sm:min-h-6"
          >
            View Theater
            <ArrowRight className="h-4 w-4 motion-safe:transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
          </Link>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name} website (opens in new tab)`}
              className="inline-flex min-h-11 items-center gap-1 rounded-md px-1 py-2 text-sm text-zinc-400 motion-safe:transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] sm:min-h-6"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Enhanced gold gradient overlay on hover/focus */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#D4AF37]/15 via-transparent to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

      {/* Subtle gold border glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[#D4AF37]/0 motion-safe:transition-all motion-safe:duration-300 group-hover:ring-[#D4AF37]/30 group-focus-within:ring-[#D4AF37]/30" />
    </Card>
  )
}
