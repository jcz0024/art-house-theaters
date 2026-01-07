import { HeroSection } from "@/components/hero-section"
import { TheaterCard } from "@/components/theater-card"
import { CityCard } from "@/components/city-card"
import { Footer } from "@/components/footer"

const theaters = [
  {
    name: "The Cinephile Palace",
    city: "Brooklyn",
    state: "NY",
    description: "Historic single-screen cinema since 1927, preserving the golden age of moviegoing.",
    tags: ["35mm", "Repertory", "Bar"],
    slug: "cinephile-palace",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
  },
  {
    name: "Criterion House",
    city: "Portland",
    state: "OR",
    description: "Nonprofit screening rare 35mm prints and international classics weekly.",
    tags: ["35mm", "Foreign Films", "Nonprofit"],
    slug: "criterion-house",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
  },
  {
    name: "Arthouse Cinema",
    city: "Austin",
    state: "TX",
    description: "Independent theater championing emerging filmmakers and forgotten masterpieces.",
    tags: ["Indie", "Late Night", "Q&A"],
    slug: "arthouse-cinema",
    imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80",
  },
  {
    name: "The Velvet Screen",
    city: "Chicago",
    state: "IL",
    description: "Intimate venue showcasing experimental films and silent cinema with live scores.",
    tags: ["Experimental", "Live Music", "Bar"],
    slug: "velvet-screen",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
  },
  {
    name: "Noir Film Society",
    city: "San Francisco",
    state: "CA",
    description: "Curated double features celebrating film noir and classic Hollywood.",
    tags: ["Double Features", "Classics", "Members Only"],
    slug: "noir-film-society",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
  },
  {
    name: "The Roxy Revival",
    city: "Seattle",
    state: "WA",
    description: "Restored 1940s theater presenting retrospectives and midnight cult screenings.",
    tags: ["Midnight Movies", "Repertory", "70mm"],
    slug: "roxy-revival",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
  },
]

const cities = [
  { city: "Los Angeles", state: "California", slug: "los-angeles" },
  { city: "New York", state: "New York", slug: "new-york" },
  { city: "Chicago", state: "Illinois", slug: "chicago" },
  { city: "Austin", state: "Texas", slug: "austin" },
  { city: "Seattle", state: "Washington", slug: "seattle" },
  { city: "Portland", state: "Oregon", slug: "portland" },
  { city: "San Francisco", state: "California", slug: "san-francisco" },
  { city: "Boston", state: "Massachusetts", slug: "boston" },
  { city: "Philadelphia", state: "Pennsylvania", slug: "philadelphia" },
  { city: "Denver", state: "Colorado", slug: "denver" },
  { city: "Minneapolis", state: "Minnesota", slug: "minneapolis" },
  { city: "Atlanta", state: "Georgia", slug: "atlanta" },
]

export default function Home() {
  return (
    <div className="dark min-h-screen bg-[#0a0a0a]">
      <HeroSection />

      {/* Theater Grid */}
      <div className="bg-[#0a0a0a] mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {theaters.map((theater) => (
            <TheaterCard key={theater.slug} {...theater} />
          ))}
        </div>
      </div>

      {/* Browse by City section */}
      <div className="bg-[#0a0a0a] mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-medium text-amber-50 md:text-5xl">Browse by City</h2>
          <p className="mt-3 text-base text-neutral-400 md:text-lg">Discover art house theaters across America</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard key={city.slug} {...city} />
          ))}
        </div>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  )
}
