import { Card } from "@/components/ui/card"

export function FeaturedTheaterSkeleton() {
  return (
    <Card className="relative overflow-hidden border-zinc-800/60 bg-[#1a1a1a]">
      {/* Image area skeleton with fixed aspect ratio */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 animate-pulse bg-zinc-800" />
      </div>

      <div className="p-6">
        {/* Title skeleton */}
        <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-zinc-800" />

        {/* Location skeleton */}
        <div className="mb-3 h-4 w-1/3 animate-pulse rounded bg-zinc-800" />

        {/* Description skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-800" />
        </div>

        {/* Tags skeleton */}
        <div className="mb-5 flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
          <div className="h-5 w-20 animate-pulse rounded bg-zinc-800" />
        </div>

        {/* Links skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    </Card>
  )
}
