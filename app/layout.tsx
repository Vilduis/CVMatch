import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AosInit } from "@/components/aos-init"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "CVMatch AI — Analiza tu CV con IA",
  description:
    "Sube tu CV, pega la descripción del trabajo y descubre qué tan buen candidato eres para ese puesto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", geist.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>
          <AosInit />
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
