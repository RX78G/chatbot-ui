import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

/** 静的ファイルと manifest は無条件で素通りさせる */
function shouldBypass(request: NextRequest) {
  return (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname === "/manifest.json"
  )
}

export async function middleware(request: NextRequest) {
  /* 1. 静的ファイル / manifest.json は即通過 */
  if (shouldBypass(request)) {
    return NextResponse.next()
  }

  /* 2. i18n ルーティング */
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  /* 3. 認証チェック（不要なら try{} 全体を削除しても可） */
  try {
    const { supabase, response } = createClient(request)
    const { data: sessionData } = await supabase.auth.getSession()

    const isHome = sessionData && request.nextUrl.pathname === "/"

    if (isHome) {
      const { data: homeWorkspace } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", sessionData.session?.user.id)
        .eq("is_home", true)
        .single()

      if (homeWorkspace) {
        return NextResponse.redirect(
          new URL(`/${homeWorkspace.id}/chat`, request.url)
        )
      }
    }
    return response
  } catch {
    /* 認証まわりで失敗してもページは描画させる */
    return NextResponse.next({
      request: { headers: request.headers }
    })
  }
}

/** API だけを対象にする（静的アセット／manifest は除外） */
export const config = {
  matcher: ["/api/:path*"]
}
