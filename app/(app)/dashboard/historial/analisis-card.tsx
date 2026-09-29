"use client"

import { useTransition } from "react"
import Link from "next/link"
import { ArrowRight, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteAnalysis } from "./actions"

type Level = "excellent" | "moderate" | "low"

function getLevel(score: number): Level {
  if (score >= 70) return "excellent"
  if (score >= 50) return "moderate"
  return "low"
}

const levelStyles: Record<Level, { color: string; label: string }> = {
  excellent: { color: "var(--success)", label: "Excelente" },
  moderate: { color: "var(--warning)", label: "Moderado" },
  low: { color: "var(--danger)", label: "Bajo" },
}

function summarize(jd: string) {
  const trimmed = jd.trim()
  if (trimmed.length <= 110) return trimmed
  return trimmed.slice(0, 110).replace(/\s+\S*$/, "") + "…"
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
  }).format(d)
}

function formatYear(d: Date) {
  return d.getFullYear()
}

type AnalisisRowData = {
  id: string
  matchScore: number
  jobSummary: string
  createdAt: Date
}

export function AnalisisRow({ analysis }: { analysis: AnalisisRowData }) {
  const [pending, startTransition] = useTransition()
  const level = getLevel(analysis.matchScore)
  const { color, label } = levelStyles[level]
  const created = new Date(analysis.createdAt)
  const now = new Date()
  const sameYear = created.getFullYear() === now.getFullYear()

  function handleDelete() {
    startTransition(() => deleteAnalysis(analysis.id))
  }

  return (
    <li className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-border/60 px-4 py-3.5 transition-colors first:border-t-0 hover:bg-card/40 sm:grid-cols-[64px_1fr_auto_88px] sm:gap-4 sm:px-5 sm:py-4">
      <div className="flex flex-col items-start gap-0.5 sm:items-center">
        <span
          className="font-mono text-2xl leading-none font-semibold tabular-nums"
          style={{ color }}
        >
          {analysis.matchScore}
        </span>
        <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:tracking-[0.1em]">
          {label}
        </span>
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-[13.5px] leading-snug text-foreground/90 sm:line-clamp-1">
          {summarize(analysis.jobSummary)}
        </p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground sm:hidden">
          {formatDate(created)}
          {!sameYear && ` ${formatYear(created)}`}
        </p>
      </div>

      <p className="hidden text-right font-mono text-[11.5px] text-muted-foreground tabular-nums sm:block">
        {formatDate(created)}
        {!sameYear && ` ${formatYear(created)}`}
      </p>

      <div className="flex items-center justify-end gap-1 sm:w-[88px]">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pending}
              aria-label="Eliminar análisis"
              className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive data-[state=open]:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este análisis?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El análisis se eliminará
                permanentemente de tu historial.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-7 gap-1 px-2 text-[12px] text-muted-foreground hover:text-foreground"
        >
          <Link href={`/dashboard/resultado/${analysis.id}`}>
            Ver
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
    </li>
  )
}
