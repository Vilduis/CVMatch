import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/auth"
import BackgroundGrid from "@/components/background-grid"

export default async function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  if (session?.user) redirect("/dashboard/analizar")

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <BackgroundGrid origin="center" className="h-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[420px] w-[min(900px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <header className="px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Inicio
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  )
}
