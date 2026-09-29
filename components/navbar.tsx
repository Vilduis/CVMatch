"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, LogOut } from "lucide-react"
import { signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClientSession } from "@/hooks/use-client-session"
import { cn } from "@/lib/utils"
import LogoMark from "./logo-mark"
import MobileMenu from "./mobile-menu"

const navLinks = [{ label: "Precios", href: "/precios" }]

export default function Navbar() {
  const { session, loading } = useClientSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-border/60 bg-background/70 supports-backdrop-filter:backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">
            CVMatch
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}

          <div className="ml-3 h-4 w-px bg-border/60" aria-hidden />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-2 flex items-center gap-2 rounded-md py-1 pr-2.5 pl-1 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="size-7">
                    <AvatarImage
                      src={session.user.image ?? ""}
                      alt={session.user.name ?? ""}
                    />
                    <AvatarFallback className="bg-muted text-[11px] font-semibold">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-[13px] font-medium md:inline">
                    {session.user.name?.split(" ")[0] ?? "Cuenta"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-medium">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/analizar">
                    <ArrowUpRight className="size-3.5" />
                    Ir al dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild variant="destructive">
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2"
                    >
                      <LogOut className="size-3.5" />
                      Cerrar sesión
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div
              aria-hidden={loading}
              className={cn(
                "ml-2 flex items-center gap-1.5",
                loading && "invisible"
              )}
            >
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-[13px]"
              >
                <Link href="/auth?tab=login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm" className="h-8 px-3 text-[13px]">
                <Link href="/auth?tab=registro">Empezar gratis</Link>
              </Button>
            </div>
          )}
        </nav>

        <div className="flex items-center sm:hidden">
          <MobileMenu session={session} loading={loading} />
        </div>
      </div>
    </header>
  )
}
