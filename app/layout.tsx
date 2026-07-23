import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const dynamic = "force-dynamic"

export const metadata = {
  title: "CVMatch AI — Analiza tu CV con IA",
  description:
    "Sube tu CV, pega la descripción del trabajo y descubre qué tan buen candidato eres para ese puesto.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={cn("dark", geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
