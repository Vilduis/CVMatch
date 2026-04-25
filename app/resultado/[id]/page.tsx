import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, FileEdit, MessageSquare, ArrowLeft } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function getScoreConfig(score: number) {
  if (score >= 70)
    return {
      label: "Excelente match",
      message: "Tienes altas probabilidades de pasar el filtro inicial.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      progress: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
    }
  if (score >= 50)
    return {
      label: "Match moderado",
      message: "Hay aspectos clave a mejorar antes de aplicar.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      progress: "[&_[data-slot=progress-indicator]]:bg-amber-500",
    }
  return {
    label: "Match bajo",
    message: "Te faltan habilidades clave para este puesto.",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
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

      {/* Back */}
      <Link href="/analizar" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Nuevo análisis
      </Link>

      {/* Score card */}
      <Card className={`mb-8 border ${cfg.border} ${cfg.bg} shadow-sm`}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Match con el puesto
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tabular-nums ${cfg.color}`}>
                  {score}
                </span>
                <span className={`text-2xl font-bold ${cfg.color}`}>%</span>
              </div>
              <p className={`mt-1 text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
            </div>
            <div className="flex-1 sm:max-w-xs">
              <Progress value={score} className={`h-3 ${cfg.progress}`} />
              <p className="mt-2 text-sm text-muted-foreground">{cfg.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="fortalezas">
        <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 bg-muted/60 p-1">
          <TabsTrigger value="fortalezas" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Fortalezas
          </TabsTrigger>
          <TabsTrigger value="brechas" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <XCircle className="h-3.5 w-3.5" />
            Brechas
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <FileEdit className="h-3.5 w-3.5" />
            Tu CV
          </TabsTrigger>
          {interviewQuestions && (
            <TabsTrigger value="entrevista" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5" />
              Entrevista
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="fortalezas">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Tus fortalezas para este puesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brechas">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle className="h-5 w-5 text-rose-500" />
                Lo que te falta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {gaps.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cv">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileEdit className="h-5 w-5 text-primary" />
                Cómo mejorar tu CV para este puesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cvSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {interviewQuestions && (
          <TabsContent value="entrevista">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Preguntas probables de entrevista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {interviewQuestions.map((question, i) => (
                    <AccordionItem key={i} value={`q-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                        {question.replace(/^\d+[\.\-\)]\s*/, "")}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Prepara una respuesta con ejemplos concretos de tu experiencia usando el método STAR (Situación, Tarea, Acción, Resultado).
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/analizar">
          <Button className="bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700">
            Analizar otro puesto
          </Button>
        </Link>
        <Link href="/historial">
          <Button variant="outline">Ver mi historial</Button>
        </Link>
      </div>

    </main>
  )
}
