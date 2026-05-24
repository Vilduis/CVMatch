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
import { StaggerListItem } from "@/components/stagger"
import { deleteAnalysis } from "./actions"
import type { Analysis } from "@/db/schema"

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

export function AnalisisRow({ analysis }: { analysis: Analysis }) {
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
    <StaggerListItem className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-border/60 px-4 py-3.5 transition-colors first:border-t-0 hover:bg-card/40 sm:grid-cols-[64px_1fr_auto_88px] sm:gap-4 sm:px-5 sm:py-4">
      {/* Score */}
      <div className="flex flex-col items-start gap-0.5 sm:items-center">
        <span
          className="font-mono text-2xl font-semibold leading-none tabular-nums"
          style={{ color }}
        >
          {analysis.matchScore}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:tracking-[0.1em]">
          {label}
        </span>
      </div>

      {/* Job description summary */}
      <div className="min-w-0">
        <p className="line-clamp-2 text-[13.5px] leading-snug text-foreground/90 sm:line-clamp-1">
          {summarize(analysis.jobDescription)}
        </p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground sm:hidden">
          {formatDate(created)}
          {!sameYear && ` ${formatYear(created)}`}
        </p>
      </div>

      {/* Date (desktop) */}
      <p className="hidden text-right font-mono text-[11.5px] text-muted-foreground tabular-nums sm:block">
        {formatDate(created)}
        {!sameYear && ` ${formatYear(created)}`}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 sm:w-[88px]">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pending}
              aria-label="Eliminar análisis"
              className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 data-[state=open]:opacity-100"
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

        <Link href={`/dashboard/resultado/${analysis.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-[12px] text-muted-foreground hover:text-foreground"
          >
            Ver
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </div>
    </StaggerListItem>
  )
}
