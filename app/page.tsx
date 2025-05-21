"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const r = useRouter()
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
      r.replace(
        `/${process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "default"}/chat`
      )
    }
  }, [r])
  return <p>Loading…</p>
}
