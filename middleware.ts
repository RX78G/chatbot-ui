// middleware.ts  (追加分だけ抜粋)
/* ここを最上部に追記  ----------------------- */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ----- 静的ファイルと manifest は素通り -----
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  // ↓ここから先が元々あった認証チェックなど
  // ...
}
/* ------------------------------------------ */

/* matcher も API だけに限定すると安全 */
export const config = {
  matcher: ['/api/:path*'],
};







import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    const { supabase, response } = createClient(request)

    const session = await supabase.auth.getSession()

    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message)
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
