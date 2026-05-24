import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleSlash,
  FileEdit,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { db } from "@/db"
import { analyses } from "@/db/schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreRing } from "@/components/ui/score-ring"
import { StaggerList, StaggerListItem } from "@/components/stagger"

type Level = "excellent" | "moderate" | "low"

function getLevel(score: number): { level: Level; label: string; message: string; color: string } {
  if (score >= 70)
    return {
      level: "excellent",
      label: "Excelente match",
      message:
        "Tienes altas probabilidades de pasar el filtro inicial. Pule las brechas y postula con confianza.",
      color: "var(--success)",
    }
  if (score >= 50)
    return {
      level: "moderate",
      label: "Match moderado",
      message:
        "Hay aspectos clave a mejorar antes de aplicar. Trabaja primero las brechas más críticas.",
      color: "var(--warning)",
    }
  return {
    level: "low",
    label: "Match bajo",
    message:
      "Te faltan habilidades clave para este puesto. Considera otro rol o invierte tiempo en cerrar brechas.",
    color: "var(--danger)",
  }
}

function parseField(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [value]
  } catch {
    return [value]
  }
}

function summarizeJob(jd: string): string {
  const trimmed = jd.trim()
  if (trimmed.length <= 180) return trimmed
  return trimmed.slice(0, 180).replace(/\s+\S*$/, "") + "…"
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)
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
  const cfg = getLevel(score)
  const strengths = parseField(analysis.strengths)
  const gaps = parseField(analysis.gaps)
  const cvSuggestions = parseField(analysis.cvSuggestions)
  const interviewQuestions: string[] | null = analysis.interviewQuestions
    ? parseField(analysis.interviewQuestions)
    : null

  const jobSummary = summarizeJob(analysis.jobDescription)
  const createdAt = formatDate(new Date(analysis.createdAt))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/historial"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Volver al historial
        </Link>
        <span className="font-mono text-[11px] text-muted-foreground">
          {createdAt}
        </span>
      </div>

      {/* ── Score hero ── */}
      <section className="grid grid-cols-1 gap-6 rounded-xl border border-border/60 bg-card/40 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
        <div className="flex items-center justify-center sm:items-start">
          <ScoreRing score={score} size={160} strokeWidth={6} />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Match score
            </p>
            <h1
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </h1>
            <p className="mt-2 max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
              {cfg.message}
            </p>
          </div>

          {jobSummary && (
            <div className="rounded-lg border border-border/60 bg-card px-4 py-3">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Puesto analizado
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">
                {jobSummary}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/analizar">
              <Button size="sm" className="w-full gap-1.5 sm:w-auto">
                <Sparkles className="size-3.5" />
                Analizar otro puesto
                <ArrowRight className="size-3 opacity-70" />
              </Button>
            </Link>
            <Link href="/dashboard/historial">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Mi historial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <Tabs defaultValue="fortalezas">
        <TabsList className="w-full">
          <TabsTrigger value="fortalezas" className="gap-1.5">
            <CircleCheck className="size-3.5" />
            <span className="hidden sm:inline">Fortalezas</span>
            <span className="inline sm:hidden">Fort.</span>
            <CountBadge n={strengths.length} />
          </TabsTrigger>
          <TabsTrigger value="brechas" className="gap-1.5">
            <CircleSlash className="size-3.5" />
            Brechas
            <CountBadge n={gaps.length} />
          </TabsTrigger>
          <TabsTrigger value="cv" className="gap-1.5">
            <FileEdit className="size-3.5" />
            <span className="hidden sm:inline">Tu CV</span>
            <span className="inline sm:hidden">CV</span>
            <CountBadge n={cvSuggestions.length} />
          </TabsTrigger>
          {interviewQuestions && (
            <TabsTrigger value="entrevista" className="gap-1.5">
              <MessageSquare className="size-3.5" />
              <span className="hidden sm:inline">Entrevista</span>
              <span className="inline sm:hidden">Entr.</span>
              <CountBadge n={interviewQuestions.length} />
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="fortalezas">
          <SectionHeading
            eyebrow="Análisis"
            title="Tus fortalezas para este puesto"
            help="Coincidencias claras entre tu perfil y los requisitos. Refuérzalas en la entrevista."
          />
          <ResultList items={strengths} tone="success" />
        </TabsContent>

        <TabsContent value="brechas">
          <SectionHeading
            eyebrow="Análisis"
            title="Lo que te falta"
            help="Skills o experiencia que el puesto pide y no aparecen en tu CV. Prioriza las primeras."
          />
          <ResultList items={gaps} tone="warning" numbered />
        </TabsContent>

        <TabsContent value="cv">
          <SectionHeading
            eyebrow="Mejoras"
            title="Cómo adaptar tu CV"
            help="Cambios concretos que harán tu CV más relevante para este puesto específico."
          />
          <ResultList items={cvSuggestions} tone="muted" numbered />
        </TabsContent>

        {interviewQuestions && (
          <TabsContent value="entrevista">
            <SectionHeading
              eyebrow="Preparación"
              title="Preguntas probables en entrevista"
              help="Practica respuestas usando el método STAR — Situación, Tarea, Acción, Resultado."
            />
            <StarGuide />
            <Accordion type="single" collapsible className="mt-6">
              {interviewQuestions.map((q, i) => (
                <AccordionItem key={i} value={`q-${i}`}>
                  <AccordionTrigger>
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[13.5px] font-medium text-foreground">
                        {q.replace(/^\d+[.\-)]\s*/, "")}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pl-8 text-[13px] text-muted-foreground">
                      Estructura tu respuesta con un ejemplo concreto de tu
                      experiencia siguiendo el método STAR. Cuantifica el
                      impacto cuando sea posible (porcentaje, tiempo, dinero).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */

function CountBadge({ n }: { n: number }) {
  return (
    <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground tabular-nums">
      {n}
    </span>
  )
}

function SectionHeading({
  eyebrow,
  title,
  help,
}: {
  eyebrow: string
  title: string
  help: string
}) {
  return (
    <div className="mt-6 flex flex-col gap-1.5">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="max-w-prose text-[13px] leading-relaxed text-muted-foreground">
        {help}
      </p>
    </div>
  )
}

function ResultList({
  items,
  tone,
  numbered = false,
}: {
  items: string[]
  tone: "success" | "warning" | "muted"
  numbered?: boolean
}) {
  if (items.length === 0) {
    return (
      <p className="mt-6 text-[13px] text-muted-foreground">
        Sin elementos para esta sección.
      </p>
    )
  }
  return (
    <StaggerList className="mt-6 flex flex-col">
      {items.map((item, i) => (
        <ResultItem key={i} index={i} tone={tone} numbered={numbered}>
          {item}
        </ResultItem>
      ))}
    </StaggerList>
  )
}

function ResultItem({
  index,
  tone,
  numbered,
  children,
}: {
  index: number
  tone: "success" | "warning" | "muted"
  numbered: boolean
  children: React.ReactNode
}) {
  const dot =
    tone === "success"
      ? "bg-[var(--success)]"
      : tone === "warning"
        ? "bg-[var(--warning)]"
        : "bg-muted-foreground/50"

  return (
    <StaggerListItem className="group flex items-start gap-4 border-t border-border/40 py-3.5 first:border-t-0 sm:py-4">
      {numbered ? (
        <span className="mt-0.5 inline-flex w-6 shrink-0 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : (
        <span
          aria-hidden
          className={`mt-2 size-1.5 shrink-0 rounded-full ${dot}`}
        />
      )}
      <p className="text-[13.5px] leading-relaxed text-foreground/85">
        {children}
      </p>
    </StaggerListItem>
  )
}

function StarGuide() {
  const items = [
    { letter: "S", label: "Situación", desc: "El contexto en el que ocurrió." },
    { letter: "T", label: "Tarea", desc: "Tu responsabilidad específica." },
    { letter: "A", label: "Acción", desc: "Qué hiciste tú, no el equipo." },
    { letter: "R", label: "Resultado", desc: "Impacto medible cuando sea posible." },
  ]
  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-5">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Método STAR
      </p>
      <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border/40 sm:grid-cols-4">
        {items.map(({ letter, label, desc }) => (
          <div key={letter} className="flex flex-col gap-1 bg-card p-4">
            <span className="font-mono text-2xl font-semibold leading-none text-primary">
              {letter}
            </span>
            <span className="mt-1 text-[12px] font-medium">{label}</span>
            <span className="text-[11.5px] leading-relaxed text-muted-foreground">
              {desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
