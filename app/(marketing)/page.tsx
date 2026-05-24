import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  FileText,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react"
import { auth } from "@/auth"
import { signInWithGoogle } from "@/app/actions"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScoreRing } from "@/components/ui/score-ring"
import { Reveal } from "@/components/reveal"
import { plansList } from "@/lib/plans"

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
    span: "sm:col-span-2",
  },
  {
    icon: TrendingUp,
    title: "Fortalezas y brechas",
    desc: "Qué tienes a tu favor y qué te falta cerrar.",
    span: "",
  },
  {
    icon: FileText,
    title: "Sugerencias accionables",
    desc: "Bullets concretos para reescribir tu CV.",
    span: "",
  },
  {
    icon: MessageSquare,
    title: "Preguntas de entrevista",
    desc: "Si tu match es ≥ 70%, obtienes las preguntas más probables con guía STAR.",
    span: "sm:col-span-2",
  },
]

const testimonials = [
  {
    name: "Valeria Quispe",
    role: "Diseñadora UX · Lima",
    initials: "VQ",
    text: "Apliqué a 8 puestos en dos semanas y conseguí 4 entrevistas. Entendí qué palabras clave le faltaban a mi CV para cada oferta.",
  },
  {
    name: "Sebastián Morales",
    role: "Backend · Bogotá",
    initials: "SM",
    text: "Las preguntas de entrevista son sorprendentemente precisas. Me preparé con ellas y el reclutador me hizo casi las mismas.",
  },
  {
    name: "Camila Herrera",
    role: "Data Analyst · Santiago",
    initials: "CH",
    text: "Tenía un CV genérico. Con las sugerencias lo personalicé por puesto y la diferencia fue inmediata.",
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
      {/* Decorative grid */}
      <BackgroundGrid />

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              IA · Análisis instantáneo
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 text-center text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[72px]">
              El match entre tu CV
              <br />
              <span className="text-muted-foreground">y el puesto, en segundos.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Sube tu CV, pega la descripción del puesto y recibe un análisis con
              puntaje, fortalezas, brechas y mejoras concretas — listo para postular.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              {ctaHref ? (
                <Link href={ctaHref}>
                  <Button size="lg" className="w-full gap-1.5 sm:w-auto">
                    Analizar mi CV
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              ) : (
                <form action={signInWithGoogle}>
                  <Button type="submit" size="lg" className="w-full gap-1.5 sm:w-auto">
                    Empezar gratis
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              )}
              <Link href="#preview">
                <Button size="lg" variant="ghost" className="w-full gap-1 text-muted-foreground hover:text-foreground sm:w-auto">
                  Ver una demo
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[var(--success)]" />
                5 análisis gratis
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

        {/* Hero visual */}
        <div className="container mx-auto mt-16 max-w-5xl px-4 sm:mt-20 sm:px-6">
          <Reveal delay={0.1}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Flujo"
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
                  <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento ── */}
      <section className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Capacidades"
              title="Más que un puntaje. Un plan."
              subtitle="Cada análisis te entrega los siguientes pasos, no solo un número."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, span }, i) => (
              <Reveal key={title} delay={i * 0.05} className={span}>
                <div className="group relative h-full overflow-hidden rounded-xl border border-border/60 bg-card/40 p-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-md">
                  <Icon className="size-4 text-primary" strokeWidth={1.75} />
                  <h3 className="mt-5 text-[15px] font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preview del resultado ── */}
      <section
        id="preview"
        className="relative border-t border-border/60 py-20 sm:py-28"
      >
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
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

      {/* ── Testimonios ── */}
      <section className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Testimonios"
              title="Funciona para perfiles muy distintos."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {testimonials.map(({ name, role, initials, text }, i) => (
              <Reveal key={name} delay={i * 0.05}>
                <figure className="group flex h-full flex-col rounded-xl border border-border/60 bg-card/40 p-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-md">
                  <div className="flex items-center gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-3 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-foreground/85">
                    “{text}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {role}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precios ── */}
      <section id="precios" className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Precios"
              title="Paga una vez. Sin suscripciones."
              subtitle="Los créditos no vencen — úsalos a tu ritmo."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
            {plansList.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.05}>
                <PlanCard plan={plan} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-[12px] text-muted-foreground">
              ¿Quieres ver todos los detalles?{" "}
              <Link
                href="/precios"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ver planes completos →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Preguntas frecuentes"
              align="left"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <Accordion type="single" collapsible className="mt-10">
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

      {/* ── CTA final ── */}
      <section className="relative border-t border-border/60 py-20 sm:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Postula con confianza.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Crea tu cuenta gratis y analiza tu primer CV en menos de 30 segundos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              {isLoggedIn ? (
                <Link href="/dashboard/analizar">
                  <Button size="lg" className="w-full gap-1.5 sm:w-auto">
                    Ir al dashboard
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              ) : (
                <form action={signInWithGoogle}>
                  <Button type="submit" size="lg" className="w-full gap-1.5 sm:w-auto">
                    Crear cuenta gratis
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              )}
              <Link href="/precios">
                <Button size="lg" variant="ghost" className="w-full text-muted-foreground hover:text-foreground sm:w-auto">
                  Ver planes
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────── */

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
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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

function PlanCard({
  plan,
}: {
  plan: (typeof plansList)[number]
}) {
  const { id, nombre, precio, credits, popular, descripcion } = plan
  const perUnit = (parseFloat(precio) / credits).toFixed(2)

  return (
    <div
      className={
        "group relative flex h-full flex-col rounded-xl border bg-card/40 p-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md " +
        (popular
          ? "border-primary/40 bg-primary/[0.04]"
          : "border-border/60 hover:border-border")
      }
    >
      {popular && (
        <span className="absolute -top-2 left-6 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background px-2 py-0.5 text-[10px] font-medium text-primary">
          <Sparkles className="size-2.5" />
          Más popular
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px] font-semibold tracking-tight">{nombre}</h3>
        <span className="text-[11px] text-muted-foreground">{credits} créditos</span>
      </div>
      <p className="mt-1 text-[12.5px] text-muted-foreground">{descripcion}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-mono text-[11px] font-medium text-muted-foreground">
          S/
        </span>
        <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums">
          {precio}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        S/ {perUnit} por análisis
      </p>

      <ul className="mt-6 space-y-2 text-[12.5px] text-foreground/80">
        {["Análisis completo con IA", "Sugerencias para tu CV", "Preguntas de entrevista", "Historial guardado"].map((b) => (
          <li key={b} className="flex items-center gap-2">
            <Check className="size-3.5 shrink-0 text-[var(--success)]" strokeWidth={2.25} />
            {b}
          </li>
        ))}
      </ul>

      <Link href="/precios" className="mt-7">
        <Button
          variant={popular ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          Comprar {nombre}
        </Button>
      </Link>

      <span className="sr-only">Plan {id}</span>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* Glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-40 max-w-2xl rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-lg">
        {/* Window chrome */}
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
            <p className="text-[12px] font-medium text-foreground/90">
              Buen match
            </p>
            <p className="text-center text-[11px] text-muted-foreground">
              Desarrollador Full Stack
              <br />
              Startup Fintech · LATAM
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-card/60 p-6 sm:p-8">
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
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
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
              items={[
                "Kubernetes",
                "Certificación AWS",
                "Metodologías ágiles",
              ]}
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
  tone: "success" | "warning" | "muted"
}) {
  const dot =
    tone === "success"
      ? "bg-[var(--success)]"
      : tone === "warning"
        ? "bg-[var(--warning)]"
        : "bg-muted-foreground/50"
  return (
    <div>
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
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

function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.270 0.006 270 / 60%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.270 0.006 270 / 60%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
    </div>
  )
}
