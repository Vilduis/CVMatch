import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react"
import { auth } from "@/auth"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScoreRing } from "@/components/ui/score-ring"
import BackgroundGrid from "@/components/background-grid"
import { Reveal } from "@/components/reveal"

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Sube tu CV",
    desc: "PDF o Word. Lo procesamos en segundos sin guardar el archivo original.",
  },
  {
    n: "02",
    icon: FileText,
    title: "Pega la oferta",
    desc: "Copia la descripción completa del puesto al que quieres aplicar.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Obtén el análisis",
    desc: "Recibes el match, fortalezas, brechas y mejoras concretas para tu CV.",
  },
]

const features = [
  {
    icon: Target,
    title: "Puntaje preciso",
    desc: "Un score 0–100 calculado contra los requisitos reales del puesto.",
  },
  {
    icon: TrendingUp,
    title: "Fortalezas y brechas",
    desc: "Qué tienes a tu favor y qué te falta cerrar.",
  },
  {
    icon: FileText,
    title: "Sugerencias accionables",
    desc: "Bullets concretos para reescribir tu CV.",
  },
  {
    icon: MessageSquare,
    title: "Preguntas de entrevista",
    desc: "Si tu match es ≥ 70%, obtienes las preguntas más probables con guía STAR.",
  },
]

const faqs = [
  {
    q: "¿Qué formatos de CV acepta la plataforma?",
    a: "PDF y Word (.docx). El archivo se procesa en el servidor y solo guardamos el texto extraído — nunca el archivo original.",
  },
  {
    q: "¿Cómo funcionan los créditos?",
    a: "Cada análisis consume 1 crédito. Los nuevos usuarios reciben 5 análisis gratuitos al registrarse. Puedes comprar más créditos cuando quieras; nunca vencen.",
  },
  {
    q: "¿Por qué solo aparecen preguntas de entrevista a veces?",
    a: "Se generan únicamente cuando tu match es ≥ 70%. Si es menor, la IA prioriza mostrarte las brechas y cómo cerrarlas.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Sí. El texto extraído se guarda asociado a tu cuenta. No compartimos información con terceros ni la usamos para entrenar modelos.",
  },
  {
    q: "¿Puedo cancelar o pedir reembolso?",
    a: "Los créditos son pago único y no hay suscripción que cancelar. Si tuviste un problema técnico con un análisis, escríbenos y lo revisamos.",
  },
]

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = Boolean(session?.user)
  const ctaHref = isLoggedIn ? "/dashboard/analizar" : undefined

  return (
    <main className="relative">
      <BackgroundGrid />

      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              IA · Análisis instantáneo
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 text-center text-[44px] leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[72px]">
              El match entre tu CV
              <br />
              <span className="text-muted-foreground">
                y el puesto, en segundos.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Sube tu CV, pega la descripción del puesto y recibe un análisis
              con puntaje, fortalezas, brechas y mejoras concretas — listo para
              postular.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              {ctaHref ? (
                <Button asChild size="lg" className="w-full gap-1.5 sm:w-auto">
                  <Link href={ctaHref}>
                    Analizar mi CV
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full gap-1.5 sm:w-auto">
                  <Link href="/auth?tab=registro">
                    Empezar gratis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full gap-1 text-muted-foreground hover:text-foreground sm:w-auto"
              >
                <Link href="#preview">
                  Ver una demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[var(--success)]" />5
                análisis gratis
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[var(--success)]" />
                Sin tarjeta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[var(--success)]" />
                Resultados en {"<"} 30s
              </span>
            </div>
          </Reveal>
        </div>

        <div className="container mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6">
          <Reveal delay={0.1}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <section
        id="como-funciona"
        className="relative border-t border-border/60 py-20 sm:py-28"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Cómo funciona"
              title="Tres pasos, sin fricción."
              subtitle="Pensado para que postules más rápido y con mejor preparación."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-3">
            {steps.map(({ n, icon: Icon, title, desc }, i) => (
              <Reveal key={n} delay={i * 0.06}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-medium text-muted-foreground">
                      {n}
                    </span>
                    <span className="h-px flex-1 bg-border/60" />
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#010c1d] shadow-lg">
              <Image
                src="/cvauth.png"
                alt="CVMatch analizando un CV: puntaje de compatibilidad 84/100, fortalezas, brechas y recomendación de entrevista"
                width={1448}
                height={1086}
                quality={95}
                sizes="(min-width: 1200px) 620px, (min-width: 1024px) 55vw, calc(100vw - 32px)"
                className="h-auto w-full"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionHeader
                eyebrow="Capacidades"
                title="Más que un puntaje. Un plan."
                subtitle="Cada análisis te entrega los siguientes pasos, no solo un número."
                align="left"
              />
            </Reveal>

            <div className="mt-10 flex flex-col gap-6">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.05}>
                  <div className="flex gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60">
                      <Icon
                        className="size-4 text-primary"
                        strokeWidth={1.75}
                      />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight">
                        {title}
                      </h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="preview"
        className="relative border-t border-border/60 py-20 sm:py-28"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Resultado"
              title="Un informe que puedes leer en 2 minutos."
              subtitle="Diseñado para que actúes ya. Sin secciones de relleno."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ResultPreview />
          </Reveal>
        </div>
      </section>

      <section
        id="faq"
        className="relative border-t border-border/60 py-20 sm:py-28"
      >
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <SectionHeader
                eyebrow="FAQ"
                title="Preguntas frecuentes"
                subtitle="Todo lo que necesitas saber antes de analizar tu primer CV."
                align="left"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Accordion type="single" collapsible>
              {faqs.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string
  title: string
  subtitle?: string
  align?: "center" | "left"
}) {
  const isCenter = align === "center"
  return (
    <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-40 max-w-2xl rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-background/60 px-3 py-2">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-3 font-mono text-[10px] text-muted-foreground">
            cvmatch.app/resultado
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center justify-center gap-3 bg-card/80 p-8">
            <ScoreRing score={84} size={140} strokeWidth={5} />
            <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--success)]">
              Buen match
            </span>
          </div>

          <div className="flex flex-col gap-6 bg-card/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-5">
              <div>
                <p className="text-[10.5px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Puesto analizado
                </p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight">
                  Desarrollador Full Stack · Startup Fintech
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                <MessageSquare className="size-3" />
                Entrevista desbloqueada
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <PreviewBlock
                label="Fortalezas"
                tone="success"
                items={[
                  "5+ años con React y Node.js",
                  "Experiencia con arquitecturas cloud",
                ]}
              />
              <PreviewBlock
                label="Brechas"
                tone="warning"
                items={[
                  "Sin experiencia con Kubernetes",
                  "Falta certificación en AWS",
                ]}
              />
              <PreviewBlock
                label="Sugerencias"
                tone="muted"
                items={[
                  "Cuantifica el impacto en cada bullet",
                  "Mueve experiencia fintech al inicio",
                ]}
              />
              <PreviewBlock
                label="Preguntas de entrevista"
                tone="primary"
                items={[
                  "¿Cómo escalarías una API con alto tráfico?",
                  "Cuéntame de un deploy que salió mal",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultPreview() {
  return (
    <div className="mt-14 overflow-hidden rounded-xl border border-border/60 bg-card/40">
      <div className="grid grid-cols-1 gap-px bg-border/40 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 bg-card/60 p-8 md:p-10">
          <ScoreRing score={84} size={150} strokeWidth={5} />
          <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--success)]">
            Buen match
          </span>
        </div>

        <div className="bg-card/40 p-6 sm:p-10">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Puesto analizado
          </p>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
            Desarrollador Full Stack · Startup Fintech
          </h3>
          <p className="mt-2 max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
            Tu perfil tiene una sólida base técnica. Hay áreas puntuales que
            puedes reforzar para destacar aún más frente a otros candidatos.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <PreviewBlock
              label="Fortalezas"
              tone="success"
              items={[
                "5+ años con React/Node",
                "Cloud architecture",
                "Inglés técnico",
              ]}
            />
            <PreviewBlock
              label="Brechas"
              tone="warning"
              items={["Kubernetes", "Certificación AWS", "Metodologías ágiles"]}
            />
            <PreviewBlock
              label="Entrevista"
              tone="muted"
              items={[
                "Escalado horizontal",
                "Deploy fallido (STAR)",
                "Principios SOLID",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewBlock({
  label,
  items,
  tone,
}: {
  label: string
  items: string[]
  tone: "success" | "warning" | "primary" | "muted"
}) {
  const dot =
    tone === "success"
      ? "bg-[var(--success)]"
      : tone === "warning"
        ? "bg-[var(--warning)]"
        : tone === "primary"
          ? "bg-primary"
          : "bg-muted-foreground/50"
  return (
    <div>
      <p className="text-[10.5px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/85"
          >
            <span
              className={`mt-1.5 size-1 shrink-0 rounded-full ${dot}`}
              aria-hidden
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
