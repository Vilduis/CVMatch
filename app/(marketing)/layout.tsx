import type { ReactNode } from "react"
import Link from "next/link"
import { auth } from "@/auth"
import Navbar from "@/components/navbar"

const footerLinks: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Precios", href: "/#precios" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Iniciar sesión", href: "/dashboard/analizar" },
      { label: "Dashboard", href: "/dashboard/analizar" },
      { label: "Historial", href: "/dashboard/historial" },
    ],
  },
]

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  return (
    <>
      <Navbar session={session} />
      {children}
      <footer className="border-t border-border/60">
        <div className="container mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[1.5fr_repeat(2,1fr)]">
            <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary/90 to-primary/60 text-[11px] font-bold text-primary-foreground ring-1 ring-primary/40"
                >
                  CV
                </span>
                <span className="text-[15px] font-semibold tracking-tight">
                  CVMatch
                </span>
              </Link>
              <p className="max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
                Análisis de CV con IA. Descubre qué tan buen match eres para cada puesto en segundos.
              </p>
            </div>

            {footerLinks.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {title}
                </p>
                <ul className="flex flex-col gap-2">
                  {links.map(({ label, href }) => (
                    <li key={href + label}>
                      <Link
                        href={href}
                        className="text-[13px] text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col-reverse items-start gap-3 border-t border-border/60 pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} CVMatch. Hecho en Latinoamérica.
            </span>
            <span className="font-mono uppercase tracking-[0.18em]">
              v1.0
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
