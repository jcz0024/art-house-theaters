import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left: Site name and tagline */}
          <div>
            <h3 className="font-serif text-xl font-medium text-[#f5f1e8]">Art House Movie Theaters</h3>
            <p className="mt-1 text-sm text-neutral-400">Celebrating independent cinema</p>
          </div>

          {/* Right: Links with proper touch targets */}
          <nav className="flex flex-wrap gap-2 sm:gap-4" aria-label="Footer navigation">
            <Link
              href="/about"
              className="rounded-md px-2 py-2 text-sm text-neutral-300 motion-safe:transition-colors hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-md px-2 py-2 text-sm text-neutral-300 motion-safe:transition-colors hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              Contact
            </Link>
            <Link
              href="/submit"
              className="rounded-md px-2 py-2 text-sm text-neutral-300 motion-safe:transition-colors hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              Submit a Theater
            </Link>
            <Link
              href="/privacy"
              className="rounded-md px-2 py-2 text-sm text-neutral-300 motion-safe:transition-colors hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              Privacy
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-neutral-800 pt-8">
          <p className="text-sm text-neutral-500">© 2025 Art House Movie Theaters</p>
        </div>
      </div>
    </footer>
  )
}
