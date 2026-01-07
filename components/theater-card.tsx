import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowRight } from "lucide-react"

interface TheaterCardProps {
  name: string
  city: string
  state: string
  description: string
  tags: string[]
  slug: string
  imageUrl?: string
}

export function TheaterCard({ name, city, state, description, tags, slug, imageUrl }: TheaterCardProps) {
  return (
    <Card className="group relative overflow-hidden border-zinc-800/60 bg-[#1a1a1a] backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-[#D4AF37]/10">
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`${name} theater`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Dark overlay for moody aesthetic */}
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <>
            {/* Fallback gradient if no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40" />
          </>
        )}

        {/* Gradient overlay from bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/20" />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="p-6">
        {/* Theater Name */}
        <h3 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-[#f5f1e8] transition-colors group-hover:text-[#D4AF37]">
          {name}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {city}, {state}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-zinc-400">{description}</p>

        {/* Tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border border-zinc-700/50 bg-zinc-800/40 text-xs font-normal text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/60"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* View Theater Link */}
        <Link
          href={`/theater/${slug}`}
          className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-[#D4AF37] transition-all hover:gap-2 hover:text-[#E5C158]"
        >
          View Theater
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  )
}
