import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, FileEdit, MessageSquare, ArrowLeft, PlusCircle } from "lucide-react"
import { db } from "@/db"
import { analyses } from "@/db/schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreRing } from "@/components/ui/score-ring"

function getScoreConfig(score: number) {
  if (score >= 70)
    return {
      label: "Excelente match",
      message: "Tienes altas probabilidades de pasar el filtro inicial.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800",
      progress: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
    }
  if (score >= 50)
    return {
      label: "Match moderado",
      message: "Hay aspectos clave a mejorar antes de aplicar.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-800",
      progress: "[&_[data-slot=progress-indicator]]:bg-amber-500",
    }
  return {
    label: "Match bajo",
    message: "Te faltan habilidades clave para este puesto.",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-800",
    progress: "[&_[data-slot=progress-indicator]]:bg-rose-500",
  }
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const analysis = await db.query.analyses.findFirst({
    where: eq(analyses.id, id),
  })
  if (!analysis) notFound()

  const score = analysis.matchScore
  const cfg = getScoreConfig(score)

  function parseField(value: string): string[] {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [value]
    } catch {
      return [value]
    }
  }

  const strengths = parseField(analysis.strengths)
  const gaps = parseField(analysis.gaps)
  const cvSuggestions = parseField(analysis.cvSuggestions)
  const interviewQuestions: string[] | null = analysis.interviewQuestions
    ? parseField(analysis.interviewQuestions)
    : null

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">

      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/analizar"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Nuevo análisis
        </Link>
        <Link href="/historial">
          <Button variant="outline" size="sm" className="text-xs">
            Ver historial
          </Button>
        </Link>
      </div>

      {/* Score card */}
      <Card className="mb-8 border-border/60 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">

            {/* Score ring */}
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={score} size={160} />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Match Score
              </p>
            </div>

            {/* Score details */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <p className={`text-2xl font-bold ${cfg.color}`}>{cfg.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{cfg.message}</p>
              </div>
              <Progress value={score} className={`h-2.5 ${cfg.progress}`} />
              <div className="flex flex-wrap justify-center gap-3 pt-1 sm:justify-start">
                <Link href="/analizar">
                  <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Analizar otro puesto
                  </Button>
                </Link>
                <Link href="/historial">
                  <Button size="sm" variant="outline">
                    Mi historial
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="fortalezas">
        <TabsList className="mb-6 grid w-full h-auto gap-1 bg-muted/60 p-1" style={{ gridTemplateColumns: interviewQuestions ? "repeat(4, 1fr)" : "repeat(3, 1fr)" }}>
          <TabsTrigger value="fortalezas" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Fortalezas</span>
            <span className="sm:hidden">Fortalezas</span>
          </TabsTrigger>
          <TabsTrigger value="brechas" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            Brechas
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <FileEdit className="h-3.5 w-3.5 shrink-0" />
            Tu CV
          </TabsTrigger>
          {interviewQuestions && (
            <TabsTrigger value="entrevista" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              Entrevista
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="fortalezas">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Tus fortalezas para este puesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brechas">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/40">
                  <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                Lo que te falta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {gaps.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cv">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileEdit className="h-4 w-4 text-primary" />
                </div>
                Cómo mejorar tu CV para este puesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {cvSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {interviewQuestions && (
          <TabsContent value="entrevista">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  Preguntas probables de entrevista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-xs text-muted-foreground">
                  Prepara respuestas usando el método <span className="font-semibold text-foreground">STAR</span> (Situación → Tarea → Acción → Resultado).
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {interviewQuestions.map((question, i) => (
                    <AccordionItem key={i} value={`q-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                        <span className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          {question.replace(/^\d+[\.\-\)]\s*/, "")}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-sm text-muted-foreground">
                        Estructura tu respuesta con un ejemplo concreto de tu experiencia:
                        <ul className="mt-2 space-y-1">
                          {["Situación: describe el contexto", "Tarea: explica tu responsabilidad", "Acción: detalla lo que hiciste", "Resultado: muestra el impacto con datos"].map((s) => (
                            <li key={s} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

    </main>
  )
}
