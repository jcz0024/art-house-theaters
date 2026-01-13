import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === "true"

  if (!isLive) {
    const { pathname } = request.nextUrl

    // Allow /coming-soon to avoid infinite redirect loop
    if (pathname === '/coming-soon') {
      return NextResponse.next()
    }

    // Allow static files and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') // files with extensions (favicon.ico, etc.)
    ) {
      return NextResponse.next()
    }

    // Redirect all other requests to /coming-soon
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
