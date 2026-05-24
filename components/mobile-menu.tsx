"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ArrowUpRight, LogOut } from "lucide-react"
import type { Session } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signInWithGoogle, signOutAction } from "@/app/actions"

const navLinks = [
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Precios", href: "/#precios" },
  { label: "FAQ", href: "/#faq" },
]

interface MobileMenuProps {
  session: Session | null
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Abrir menú">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="text-sm font-medium text-muted-foreground">
            Navegación
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-2">
          {navLinks.map(({ label, href }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            </SheetClose>
          ))}
          {session?.user && (
            <SheetClose asChild>
              <Link
                href="/dashboard/analizar"
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
              >
                Dashboard
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            </SheetClose>
          )}
        </nav>

        <div className="mt-auto border-t border-border/60 p-4">
          {session?.user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback className="bg-muted text-[11px] font-semibold">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="size-3.5" />
                  Cerrar sesión
                </Button>
              </form>
            </div>
          ) : (
            <form action={signInWithGoogle} className="flex flex-col gap-2">
              <Button type="submit" size="sm" className="w-full">
                Empezar gratis
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                5 análisis gratis al crear cuenta
              </p>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
