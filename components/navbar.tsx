import Link from "next/link"
import { History, CreditCard, LogOut } from "lucide-react"
import { auth } from "@/auth"
import { signInWithGoogle, signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MobileMenu from "./mobile-menu"

export default async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
            CV
          </div>
          <span className="text-lg font-bold tracking-tight">
            CVMatch <span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav — oculto en móvil */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link href="/analizar">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Analizar CV
            </Button>
          </Link>
          <Link href="/precios">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Precios
            </Button>
          </Link>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ml-2 h-8 w-8 cursor-pointer ring-2 ring-primary/20 transition-all hover:ring-primary/50">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback className="bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/historial" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Mi historial
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/precios" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Comprar créditos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 text-left text-sm text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <form action={signInWithGoogle} className="ml-2">
              <Button
                type="submit"
                size="sm"
                className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700"
              >
                Iniciar sesión
              </Button>
            </form>
          )}
        </nav>

        {/* Menú hamburguesa-movil */}
        <MobileMenu session={session} />
      </div>
    </header>
  )
}
