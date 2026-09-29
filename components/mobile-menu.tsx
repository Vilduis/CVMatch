"use client"

import { useState } from "react"
import Link from "next/link"
import type { Session } from "next-auth"
import { ChevronRight, LogOut, Menu, X } from "lucide-react"
import { signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import LogoMark from "./logo-mark"

const navLinks = [{ label: "Precios", href: "/precios" }]

export default function MobileMenu({
  session,
  loading,
}: {
  session: Session | null
  loading: boolean
}) {
  const [open, setOpen] = useState(false)
  const user = session?.user

  return (
    <div className="flex items-center gap-1.5">
      {!user && (
        <Button
          asChild
          size="sm"
          className={cn("h-8 px-3 text-[13px]", loading && "invisible")}
        >
          <Link href="/auth?tab=registro">Empezar gratis</Link>
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="top"
          showCloseButton={false}
          className="gap-0 rounded-b-2xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">
            Navegación principal de CVMatch
          </SheetDescription>

          <div className="flex h-14 items-center justify-between px-4">
            <SheetClose asChild>
              <Link href="/" className="flex items-center gap-2">
                <LogoMark />
                <span className="text-[15px] font-semibold tracking-tight">
                  CVMatch
                </span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Cerrar menú">
                <X className="size-5" />
              </Button>
            </SheetClose>
          </div>

          <nav className="flex flex-col px-2 pt-2">
            {navLinks.map(({ label, href }) => (
              <MenuLink key={href} href={href} label={label} />
            ))}
            {user && <MenuLink href="/dashboard/analizar" label="Dashboard" />}
          </nav>

          <div className="mx-4 mt-3 border-t border-border/60 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                    <AvatarFallback className="bg-muted text-[12px] font-semibold">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/dashboard/analizar">Ir al dashboard</Link>
                  </Button>
                </SheetClose>
                <form action={signOutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="lg"
                    className="w-full gap-2 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/auth?tab=registro">Empezar gratis</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Link href="/auth?tab=login">Iniciar sesión</Link>
                  </Button>
                </SheetClose>
                <p className="mt-1 text-center text-[12px] text-muted-foreground">
                  5 análisis gratis al crear tu cuenta · Sin tarjeta
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-muted active:bg-muted"
      >
        {label}
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </SheetClose>
  )
}
