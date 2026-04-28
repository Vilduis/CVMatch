import Link from "next/link"
import { FileText, MessageSquare, Target, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Target,
    title: "Puntaje de match",
    description: "Un score del 0 al 100 que refleja qué tan bien encajas con el puesto.",
  },
  {
    icon: TrendingUp,
    title: "Fortalezas y brechas",
    description: "Lo que ya tienes a tu favor y lo que te falta para el rol.",
  },
  {
    icon: FileText,
    title: "Mejoras para tu CV",
    description: "Sugerencias concretas para adaptar tu CV a este puesto específico.",
  },
  {
    icon: MessageSquare,
    title: "Preguntas de entrevista",
    description: "Si tu match es ≥ 70%, recibes las preguntas que probablemente te harán.",
  },
]

const steps = [
  { number: "01", title: "Sube tu CV", description: "PDF o Word, como prefieras." },
  { number: "02", title: "Pega el trabajo", description: "Copia la descripción del puesto." },
  { number: "03", title: "Obtén tu análisis", description: "La IA lo analiza en segundos." },
]

export default function Page() {
  return (
    <main className="overflow-hidden">

      {/* Hero */}
      <section className="hero-gradient relative py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <Badge
            data-aos="fade-up"
            className="mb-6 border border-white/20 bg-white/10 text-white backdrop-blur-sm"
          >
            <Zap className="mr-1 h-3 w-3" />
            Potenciado por Gemini AI
          </Badge>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            ¿Eres el candidato ideal
            <br />
            para ese trabajo?
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl"
          >
            Sube tu CV, pega la descripción del puesto y la IA te dice exactamente
            qué tan buen match eres — y cómo mejorar tus chances.
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link href="/analizar">
              <Button size="lg" className="w-full bg-white text-indigo-700 shadow-lg hover:bg-white/90 sm:w-auto">
                Analizar mi CV gratis
              </Button>
            </Link>
            <Link href="/precios">
              <Button size="lg" variant="ghost" className="w-full border border-white/30 text-white hover:bg-white/10 sm:w-auto">
                Ver planes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div data-aos="fade-up" className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Cómo funciona
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Tres pasos, segundos de espera</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                data-aos="fade-up"
                data-aos-delay={String(i * 100)}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-12 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div data-aos="fade-up" className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Resultados
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Todo lo que necesitas para prepararte</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Card
                key={title}
                data-aos="fade-up"
                data-aos-delay={String(i * 100)}
                className="card-hover border-border/60 bg-card shadow-sm"
              >
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-14 sm:py-24">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 data-aos="fade-up" className="mb-4 text-2xl font-bold sm:text-3xl">
            Empieza ahora, es gratis
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="mb-8 text-muted-foreground">
            Sin registro necesario para tu primer análisis.
            Solo sube tu CV y pega la oferta de trabajo.
          </p>
          <Link data-aos="fade-up" data-aos-delay="200" href="/analizar">
            <Button size="lg" className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-700 hover:to-violet-700">
              Analizar mi CV ahora
            </Button>
          </Link>
        </div>
      </section>

    </main>
  )
}
