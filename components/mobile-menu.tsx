"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signInWithGoogle, signOutAction } from "@/app/actions"
import type { Session } from "next-auth"

interface MobileMenuProps {
  session: Session | null
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="h-9 w-9"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-16 z-50 border-b border-border/60 bg-background/95 px-4 py-4 backdrop-blur-md">
            <nav className="flex flex-col gap-1">
              <Link href="/analizar" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Analizar CV
                </Button>
              </Link>
              <Link href="/precios" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Precios
                </Button>
              </Link>
              {session?.user && (
                <Link href="/historial" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    Mi historial
                  </Button>
                </Link>
              )}
            </nav>

            <Separator className="my-3" />

            {session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-1">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                    <AvatarFallback className="bg-linear-to-br from-indigo-500 to-violet-500 text-white text-xs font-semibold">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                </div>
                <form action={signOutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    Cerrar sesión
                  </Button>
                </form>
              </div>
            ) : (
              <form action={signInWithGoogle}>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
                >
                  Iniciar sesión con Google
                </Button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  )
}
