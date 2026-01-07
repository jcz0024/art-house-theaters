import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#0f0f0f]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left: Site name and tagline */}
          <div>
            <h3 className="font-serif text-xl font-medium text-[#f5f1e8]">Art House Movie Theaters</h3>
            <p className="mt-1 text-sm text-neutral-400">Celebrating independent cinema</p>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-wrap gap-6">
            <Link href="/about" className="text-sm text-neutral-300 transition-colors hover:text-[#D4AF37]">
              About
            </Link>
            <Link href="/contact" className="text-sm text-neutral-300 transition-colors hover:text-[#D4AF37]">
              Contact
            </Link>
            <Link href="/submit" className="text-sm text-neutral-300 transition-colors hover:text-[#D4AF37]">
              Submit a Theater
            </Link>
            <Link href="/privacy" className="text-sm text-neutral-300 transition-colors hover:text-[#D4AF37]">
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
