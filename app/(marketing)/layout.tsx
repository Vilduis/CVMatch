import type { ReactNode } from "react"
import Link from "next/link"
import LogoMark from "@/components/logo-mark"
import Navbar from "@/components/navbar"

const footerLinks = [
  { label: "Precios", href: "/precios" },
  { label: "Iniciar sesión", href: "/auth?tab=login" },
  { label: "Crear cuenta", href: "/auth?tab=registro" },
]

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="border-t border-border/60">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex w-fit items-center gap-2">
                <LogoMark />
                <span className="text-[15px] font-semibold tracking-tight">
                  CVMatch
                </span>
              </Link>
              <p className="text-[13px] text-muted-foreground">
                Descubre tu match antes de postular.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footerLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-1 border-t border-border/60 py-6 text-[12px] text-muted-foreground sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} CVMatch</span>
            <span>Hecho en Latinoamérica</span>
          </div>
        </div>
      </footer>
    </>
  )
}
