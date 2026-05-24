"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Sparkles } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  analizar: "Analizar",
  historial: "Historial",
  resultado: "Resultado",
  creditos: "Créditos",
  perfil: "Perfil",
}

interface TopbarProps {
  credits: number
}

export function DashboardTopbar({ credits }: TopbarProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-3 supports-backdrop-filter:backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:text-foreground" />

      <div className="mx-1 h-4 w-px bg-border/60" aria-hidden />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-[12.5px]">
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1
            // Hide dynamic ids (e.g. resultado/[uuid]) — show "Resultado" label only
            const isDynamicId = i > 0 && segments[i - 1] === "resultado"
            if (isDynamicId) return null

            const label =
              segmentLabels[seg] ??
              seg.charAt(0).toUpperCase() + seg.slice(1)
            const href = "/" + segments.slice(0, i + 1).join("/")

            return (
              <span key={href} className="contents">
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1.5">
        <CreditsBadge credits={credits} />
        <Link href="/dashboard/analizar" className="hidden sm:block">
          <Button size="sm" className="h-7 gap-1 px-2.5 text-[12px]">
            <Sparkles className="size-3" />
            Nuevo análisis
          </Button>
        </Link>
      </div>
    </header>
  )
}

function CreditsBadge({ credits }: { credits: number }) {
  const low = credits <= 2
  return (
    <Link
      href="/dashboard/creditos"
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11.5px] font-medium text-foreground/85 transition-colors hover:border-border hover:text-foreground"
    >
      <CreditCard className="size-3 text-muted-foreground" />
      <span className="font-mono tabular-nums">
        {credits}
      </span>
      <span className="text-muted-foreground">
        {low ? "créditos" : "análisis"}
      </span>
    </Link>
  )
}
