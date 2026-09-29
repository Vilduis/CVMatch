import { getCurrentUser } from "@/lib/current-user"
import AnalizarForm from "./form"

export default async function AnalizarPage() {
  const { credits } = await getCurrentUser()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Espacio de trabajo
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Nuevo análisis
        </h1>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Sube tu CV y pega la descripción del puesto. Recibirás el match,
          fortalezas, brechas y mejoras concretas en menos de 30 segundos.
        </p>
      </header>

      <AnalizarForm credits={credits} />
    </div>
  )
}
