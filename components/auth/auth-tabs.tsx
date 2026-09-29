"use client"

import Image from "next/image"
import Link from "next/link"
import { CircleAlert, CircleCheck } from "lucide-react"
import { loginWithGoogle, registerWithGoogle } from "@/app/actions"
import LogoMark from "@/components/logo-mark"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GoogleButton from "./google-button"

export type AuthTab = "login" | "registro"

// El trigger activo usa bg-card por defecto, que no contrasta dentro de un Card
const activeTab =
  "data-[state=active]:bg-foreground/10 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border"

const panel =
  "col-start-1 row-start-1 flex flex-col gap-4 transition-opacity duration-200 data-[state=inactive]:invisible data-[state=inactive]:opacity-0"

const perks = ["5 análisis gratis", "Sin tarjeta", "Resultados en < 30s"]

interface AuthTabsProps {
  defaultTab: AuthTab
  error: { tab: AuthTab; message: string } | null
}

export default function AuthTabs({ defaultTab, error }: AuthTabsProps) {
  function handleTabChange(value: string) {
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)
    url.searchParams.delete("error")
    window.history.replaceState(null, "", url)
  }

  return (
    <Card className="w-full max-w-[400px] p-0 md:max-w-5xl">
      <CardContent className="grid p-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex flex-col gap-6 p-6 md:p-10">
          <div className="flex flex-col items-center gap-1 text-center">
            <Link
              href="/"
              aria-label="Volver al inicio"
              className="mb-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogoMark className="h-8" />
            </Link>
            <h1 className="text-xl tracking-tight">Bienvenido a CVMatch</h1>
            <p className="text-[13px] text-muted-foreground">
              Analiza tu CV con IA en segundos.
            </p>
          </div>

          <Tabs
            defaultValue={defaultTab}
            onValueChange={handleTabChange}
            className="gap-5"
          >
            <TabsList variant="pill" className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className={activeTab}>
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger value="registro" className={activeTab}>
                Registrarse
              </TabsTrigger>
            </TabsList>

            {/* Paneles apilados en la misma celda para que el card no cambie de altura */}
            <div className="grid">
              <TabsContent value="login" forceMount className={panel}>
                <p className="text-center text-[13px] text-muted-foreground">
                  Entra con la cuenta de Google con la que te registraste.
                </p>
                {error?.tab === "login" && (
                  <ErrorAlert message={error.message} />
                )}
                <form action={loginWithGoogle}>
                  <GoogleButton>Continuar con Google</GoogleButton>
                </form>
              </TabsContent>

              <TabsContent value="registro" forceMount className={panel}>
                <p className="text-center text-[13px] text-muted-foreground">
                  Crea tu cuenta en un clic con Google.
                </p>
                {error?.tab === "registro" && (
                  <ErrorAlert message={error.message} />
                )}
                <form action={registerWithGoogle}>
                  <GoogleButton>Registrarme con Google</GoogleButton>
                </form>
                <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                  {perks.map((perk) => (
                    <li key={perk} className="inline-flex items-center gap-1.5">
                      <CircleCheck className="size-3.5 text-[var(--success)]" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </div>
          </Tabs>

          <p className="mt-auto text-center text-[11px] text-muted-foreground">
            No almacenamos el archivo original de tu CV.
          </p>
        </div>

        <div className="relative hidden bg-[#010c1d] md:block">
          <Image
            src="/authlg.png"
            alt="Un CV analizado por CVMatch con puntaje de compatibilidad, fortalezas, brechas y recomendación de entrevista"
            fill
            priority
            sizes="(min-width: 768px) 600px, 0px"
            quality={95}
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-[13px] text-foreground"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
      <p>{message}</p>
    </div>
  )
}
