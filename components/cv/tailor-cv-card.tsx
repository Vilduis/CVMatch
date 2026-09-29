"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  createTailoredCv,
  type TailorState,
} from "@/app/(app)/dashboard/resultado/[id]/actions"

export default function TailorCvCard({
  analysisId,
  hasTailored,
  credits,
}: {
  analysisId: string
  hasTailored: boolean
  credits: number
}) {
  const [state, formAction, pending] = useActionState<TailorState>(
    () => createTailoredCv(analysisId),
    null
  )

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileText className="size-4" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">
            Adapta tu CV a esta oferta
          </h2>
          <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
            Reescribimos tus bullets con los términos del puesto, sin inventar
            nada. Revisas cada cambio y descargas el PDF en formato Harvard.
          </p>
          {state?.error && (
            <p className="mt-2 text-[12.5px] text-destructive">{state.error}</p>
          )}
        </div>
      </div>

      {hasTailored ? (
        <Button asChild size="sm" className="shrink-0 gap-1.5">
          <Link href={`/dashboard/resultado/${analysisId}/cv`}>
            Ver mi CV adaptado
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      ) : credits > 0 ? (
        <form action={formAction} className="shrink-0">
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            className="w-full gap-1.5"
          >
            {pending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Adaptando tu CV…
              </>
            ) : (
              <>
                <Wand2 className="size-3.5" />
                Adaptar CV · 1 crédito
              </>
            )}
          </Button>
        </form>
      ) : (
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link href="/dashboard/creditos">Comprar créditos</Link>
        </Button>
      )}
    </section>
  )
}
