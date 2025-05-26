import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * When NEXT_PUBLIC_AUTH_DISABLED === 'true',
 * send every request to /default/chat
 * (except _next, api, static assets, and the chat page itself).
 */
export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
    const { pathname } = req.nextUrl

    // allow framework assets / API / existing chat page
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".") ||
      pathname.startsWith("/default/chat")
    ) {
      return NextResponse.next()
    }

    const url = req.nextUrl.clone()
    url.pathname = "/default/chat"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // run on every route except _next/* and assets already filtered above
  matcher: ["/((?!_next|api|.*\\.).*)"]
}
