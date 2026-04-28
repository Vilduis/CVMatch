"use client"

import { useState, useTransition } from "react"
import {
  CheckCircle2,
  XCircle,
  FileEdit,
  MessageSquare,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { deleteAnalysis } from "./actions"
import type { Analysis } from "@/db/schema"

function parseField(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [value]
  } catch {
    return [value]
  }
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "shrink-0 text-sm font-bold tabular-nums px-3 py-1 rounded-full",
        score >= 70
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
          : score >= 50
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
      )}
    >
      {score}%
    </span>
  )
}

export function AnalisisCard({ analysis }: { analysis: Analysis }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const strengths = parseField(analysis.strengths)
  const gaps = parseField(analysis.gaps)
  const cvSuggestions = parseField(analysis.cvSuggestions)
  const interviewQuestions = analysis.interviewQuestions
    ? parseField(analysis.interviewQuestions)
    : null

  function handleDelete() {
    startTransition(() => deleteAnalysis(analysis.id))
  }

  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <CardHeader className="p-4">
        {/* Row 1: score + text */}
        <div className="flex items-start gap-3">
          <ScoreBadge score={analysis.matchScore} />
          <p className="min-w-0 flex-1 text-sm font-medium leading-snug line-clamp-2">
            {analysis.jobDescription.slice(0, 120)}
            {analysis.jobDescription.length > 120 ? "…" : ""}
          </p>
        </div>

        {/* Row 2: date + actions */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {new Date(analysis.createdAt).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="flex items-center gap-1 shrink-0">
            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                  disabled={pending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este análisis?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El análisis y todos sus
                    datos se eliminarán permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Eye toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Ocultar detalles" : "Ver detalles"}
            >
              {open ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Tabs detail */}
      {open && (
        <CardContent className="border-t border-border/50 px-4 py-4">
          <Tabs defaultValue="fortalezas">
            <TabsList className="mb-4 grid w-full h-auto gap-1 bg-muted/60 p-1"
              style={{ gridTemplateColumns: interviewQuestions ? "repeat(4,1fr)" : "repeat(3,1fr)" }}
            >
              <TabsTrigger value="fortalezas" className="flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Fortal.
              </TabsTrigger>
              <TabsTrigger value="brechas" className="flex items-center gap-1.5 text-xs">
                <XCircle className="h-3.5 w-3.5" />
                Brechas
              </TabsTrigger>
              <TabsTrigger value="cv" className="flex items-center gap-1.5 text-xs">
                <FileEdit className="h-3.5 w-3.5" />
                Tu CV
              </TabsTrigger>
              {interviewQuestions && (
                <TabsTrigger value="entrevista" className="flex items-center gap-1.5 text-xs">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Entrev.
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="fortalezas">
              <ul className="space-y-2">
                {strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="brechas">
              <ul className="space-y-2">
                {gaps.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="cv">
              <ul className="space-y-2">
                {cvSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            {interviewQuestions && (
              <TabsContent value="entrevista">
                <ol className="space-y-2">
                  {interviewQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="shrink-0 font-medium text-foreground/60">{i + 1}.</span>
                      {q.replace(/^\d+[\.\-\)]\s*/, "")}
                    </li>
                  ))}
                </ol>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
