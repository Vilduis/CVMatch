import Link from "next/link"
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Target,
    title: "Puntaje de match",
    description:
      "Un score del 0 al 100 que refleja qué tan bien encajas con el puesto. Preciso, instantáneo.",
  },
  {
    icon: TrendingUp,
    title: "Fortalezas y brechas",
    description:
      "Detecta exactamente qué tienes a tu favor y qué habilidades te faltan para el rol.",
  },
  {
    icon: FileText,
    title: "Mejoras para tu CV",
    description:
      "Sugerencias concretas para adaptar tu CV a este puesto específico y destacar.",
  },
  {
    icon: MessageSquare,
    title: "Preguntas de entrevista",
    description:
      "Si tu match es ≥ 70%, recibes las preguntas que probablemente te harán con guía STAR.",
  },
]

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Sube tu CV",
    description: "PDF o Word, como prefieras. Lo procesamos en segundos.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Pega la oferta",
    description: "Copia la descripción completa del puesto al que quieres aplicar.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Obtén tu análisis",
    description: "La IA analiza tu perfil y entrega un informe detallado al instante.",
  },
]

const stats = [
  { value: "1,200+", label: "candidatos analizados" },
  { value: "92%", label: "tasa de satisfacción" },
  { value: "< 30s", label: "por análisis" },
]

export default function Page() {
  return (
    <main className="overflow-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
        <div className="dot-grid-bg absolute inset-0 opacity-50" />
        <div className="container relative mx-auto max-w-4xl px-4 text-center">

          <div
            data-aos="fade-up"
            className="badge-chip mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Preguntas de entrevista generadas con IA
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="80"
            className="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl"
          >
            ¿Eres el candidato ideal
            <br />
            para ese <span className="text-primary">trabajo</span>?
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="160"
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Sube tu CV, pega la descripción del puesto y la IA te dice exactamente
            qué tan buen match eres — y cómo mejorar tus chances.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="240"
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link href="/analizar">
              <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:w-auto">
                Analizar mi CV gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/precios">
              <Button size="lg" variant="ghost" className="w-full text-muted-foreground hover:text-foreground sm:w-auto">
                Ver planes →
              </Button>
            </Link>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="320"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span>✦ Sin registro necesario</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>✦ 5 análisis gratuitos</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>✦ Resultado en segundos</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-muted/30 py-10 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/60">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-6">
                <span className="text-3xl font-black tabular-nums text-foreground sm:text-4xl">
                  {value}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div data-aos="fade-up" className="mb-14 text-center">
            <div className="badge-chip mb-4 inline-flex">
              <Zap className="h-3.5 w-3.5" />
              Cómo funciona
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Tres pasos, segundos de espera
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            {/* Connector line visible on desktop */}
            <div className="absolute left-[calc(33.3%+16px)] right-[calc(33.3%+16px)] top-8 hidden h-px bg-border md:block" />

            {steps.map(({ number, icon: Icon, title, description }, i) => (
              <div
                key={number}
                data-aos="fade-up"
                data-aos-delay={String(i * 100)}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-background">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div data-aos="fade-up" className="mb-14 text-center">
            <div className="badge-chip mb-4 inline-flex">
              <Target className="h-3.5 w-3.5" />
              Resultados
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Todo lo que necesitas para prepararte
            </h2>
            <p className="mt-3 text-muted-foreground">
              Más que un puntaje — un plan de acción completo para cada aplicación.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                data-aos="fade-up"
                data-aos-delay={String(i * 80)}
                className="card-elevated group p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 data-aos="fade-up" className="mb-4 text-2xl font-bold text-primary-foreground sm:text-3xl">
            Empieza ahora, es gratis
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="mb-8 text-primary-foreground/75"
          >
            Sin registro necesario para tu primer análisis.
            Solo sube tu CV y pega la oferta de trabajo.
          </p>
          <Link data-aos="fade-up" data-aos-delay="160" href="/analizar">
            <Button
              size="lg"
              className="gap-2 bg-white text-primary shadow-md hover:bg-white/90"
            >
              Analizar mi CV ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p
            data-aos="fade-up"
            data-aos-delay="240"
            className="mt-5 text-xs text-primary-foreground/50"
          >
            5 análisis gratuitos sin registro · Créditos sin fecha de vencimiento
          </p>
        </div>
      </section>

    </main>
  )
}
