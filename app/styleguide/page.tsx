import type { ReactNode } from "react"
import { CheckCircle2, XCircle, MessageSquare, Loader2, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { ScoreRing } from "@/components/ui/score-ring"

export const metadata = {
  title: "Styleguide · CVMatch AI (internal)",
  robots: { index: false, follow: false },
}

const surfaces: { token: string; varName: string }[] = [
  { token: "background", varName: "--background" },
  { token: "card", varName: "--card" },
  { token: "muted", varName: "--muted" },
  { token: "border", varName: "--border" },
  { token: "input", varName: "--input" },
]

const brand: { token: string; varName: string }[] = [
  { token: "primary", varName: "--primary" },
  { token: "ring", varName: "--ring" },
]

const semantic: { token: string; varName: string }[] = [
  { token: "success", varName: "--success" },
  { token: "warning", varName: "--warning" },
  { token: "destructive", varName: "--destructive" },
]

const typeScale = [
  { name: "text-7xl", className: "text-7xl", sample: "Aa 72" },
  { name: "text-6xl", className: "text-6xl", sample: "Aa 60" },
  { name: "text-5xl", className: "text-5xl", sample: "Aa 48" },
  { name: "text-4xl", className: "text-4xl", sample: "Aa 36" },
  { name: "text-3xl", className: "text-3xl", sample: "Aa 30" },
  { name: "text-2xl", className: "text-2xl", sample: "Aa 24" },
  { name: "text-xl", className: "text-xl", sample: "Aa 20" },
  { name: "text-lg", className: "text-lg", sample: "Aa 18" },
  { name: "text-base", className: "text-base", sample: "Aa 16" },
  { name: "text-sm", className: "text-sm", sample: "Aa 14" },
  { name: "text-xs", className: "text-xs", sample: "Aa 12" },
]

const radii = [
  { name: "xs · 4", className: "rounded-xs" },
  { name: "sm · 6", className: "rounded-sm" },
  { name: "md · 10", className: "rounded-md" },
  { name: "lg · 14", className: "rounded-lg" },
  { name: "xl · 20", className: "rounded-xl" },
  { name: "full", className: "rounded-full" },
]

const shadows = [
  { name: "shadow-sm", className: "shadow-sm" },
  { name: "shadow-md", className: "shadow-md" },
  { name: "shadow-lg", className: "shadow-lg" },
]

const buttonVariants = [
  { label: "default", variant: "default" as const },
  { label: "secondary", variant: "secondary" as const },
  { label: "outline", variant: "outline" as const },
  { label: "ghost", variant: "ghost" as const },
  { label: "destructive", variant: "destructive" as const },
  { label: "link", variant: "link" as const },
]

const badgeVariants = [
  { label: "Default", variant: "default" as const },
  { label: "Secondary", variant: "secondary" as const },
  { label: "Outline", variant: "outline" as const },
  { label: "Success", variant: "success" as const },
  { label: "Warning", variant: "warning" as const },
  { label: "Destructive", variant: "destructive" as const },
  { label: "Ghost", variant: "ghost" as const },
]

function Section({ id, title, kicker, children }: { id?: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-6 py-14 first:pt-0">
      <header className="flex flex-col gap-2">
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </header>
      {children}
    </section>
  )
}

function Swatch({ token, varName }: { token: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="aspect-[5/3] w-full rounded-md border border-border/60"
        style={{ background: `var(${varName})` }}
      />
      <div className="flex flex-col">
        <span className="font-mono text-xs font-medium">{token}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{varName}</span>
      </div>
    </div>
  )
}

export default function StyleguidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-6 py-16">

        <header className="flex flex-col gap-3 border-b border-border/60 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Internal · Phases 1 & 2
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            CVMatch Design System
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Tokens, tipografía y primitivas personalizadas. Esta página no está enlazada —
            es la referencia visual viva de <code className="font-mono text-sm text-foreground">design-tokens.md</code>.
          </p>
        </header>

        {/* ── Colors ── */}
        <Section kicker="01" title="Color tokens">
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Surface</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {surfaces.map((s) => <Swatch key={s.token} {...s} />)}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Brand · single accent</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {brand.map((s) => <Swatch key={s.token} {...s} />)}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Semantic feedback (desaturado)</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {semantic.map((s) => <Swatch key={s.token} {...s} />)}
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* ── Typography ── */}
        <Section kicker="02" title="Typography · Geist">
          <div className="flex flex-col gap-3">
            {typeScale.map(({ name, className, sample }) => (
              <div key={name} className="flex items-baseline gap-6 border-b border-border/40 pb-3">
                <span className={`${className} font-semibold tracking-tight`}>{sample}</span>
                <span className="font-mono text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Body · sans</CardTitle>
                <CardDescription>Geist Sans · text-base · leading-relaxed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-foreground">
                  Sube tu CV, pega la descripción del puesto y la IA te dice exactamente qué
                  tan buen match eres — y cómo mejorar tus chances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Numbers · mono</CardTitle>
                <CardDescription>Geist Mono · tabular-nums</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-semibold tabular-nums text-foreground">87</span>
                  <span className="text-sm text-muted-foreground">/ 100 match</span>
                </div>
                <p className="mt-3 font-mono text-sm tabular-nums text-muted-foreground">
                  S/ 34.90 · 30 análisis
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Separator />

        {/* ── Buttons ── */}
        <Section kicker="03" title="Buttons">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              {buttonVariants.map(({ label, variant }) => (
                <Button key={label} variant={variant}>
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon-sm"><Search /></Button>
              <Button size="icon"><Settings /></Button>
              <Button size="icon-lg" variant="outline"><Settings /></Button>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">States</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Loader2 className="animate-spin" />
                Loading…
              </Button>
              <Button variant="outline">
                <CheckCircle2 />
                Con icono
              </Button>
            </div>
          </div>
        </Section>

        <Separator />

        {/* ── Form primitives ── */}
        <Section kicker="04" title="Form primitives">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:max-w-2xl">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Correo</span>
              <Input type="email" placeholder="alguien@empresa.com" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Disabled</span>
              <Input disabled placeholder="No editable" />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium">Descripción</span>
              <Textarea placeholder="Pega aquí la descripción del puesto…" rows={4} />
            </label>
          </div>
        </Section>

        <Separator />

        {/* ── Badges ── */}
        <Section kicker="05" title="Badges">
          <div className="flex flex-wrap gap-2">
            {badgeVariants.map(({ label, variant }) => (
              <Badge key={label} variant={variant}>{label}</Badge>
            ))}
          </div>
        </Section>

        <Separator />

        {/* ── Cards ── */}
        <Section kicker="06" title="Cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Default card</CardTitle>
                <CardDescription>Border + bg-card, sin sombra.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contenido del card. Padding consistente, jerarquía clara.
                </p>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Compact card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Variant <code className="font-mono text-xs">size=&quot;sm&quot;</code> — menos padding.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Con footer</CardTitle>
                <CardDescription>Footer separado por border-t.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Cuerpo principal.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="ml-auto">Acción</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Separator />

        {/* ── Tabs ── */}
        <Section kicker="07" title="Tabs · underline (Linear/Vercel)">
          <Tabs defaultValue="fortalezas">
            <TabsList>
              <TabsTrigger value="fortalezas">
                <CheckCircle2 />
                Fortalezas
              </TabsTrigger>
              <TabsTrigger value="brechas">
                <XCircle />
                Brechas
              </TabsTrigger>
              <TabsTrigger value="entrevista">
                <MessageSquare />
                Entrevista
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fortalezas">
              <p className="text-sm text-muted-foreground">Contenido de fortalezas.</p>
            </TabsContent>
            <TabsContent value="brechas">
              <p className="text-sm text-muted-foreground">Contenido de brechas.</p>
            </TabsContent>
            <TabsContent value="entrevista">
              <p className="text-sm text-muted-foreground">Contenido de entrevista.</p>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Pill variant</p>
            <Tabs defaultValue="dia">
              <TabsList variant="pill">
                <TabsTrigger value="dia">Día</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
                <TabsTrigger value="mes">Mes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Section>

        <Separator />

        {/* ── Progress ── */}
        <Section kicker="08" title="Progress">
          <div className="flex flex-col gap-3 sm:max-w-md">
            <Progress value={25} />
            <Progress value={68} />
            <Progress value={92} />
          </div>
        </Section>

        <Separator />

        {/* ── ScoreRing ── */}
        <Section kicker="09" title="ScoreRing">
          <div className="flex flex-wrap items-center gap-10">
            <ScoreRing score={92} />
            <ScoreRing score={64} />
            <ScoreRing score={38} />
            <ScoreRing score={78} size={100} strokeWidth={5} />
          </div>
          <p className="text-sm text-muted-foreground">
            Anillo fino, número en Geist Mono. Color por rango (success ≥ 70 · warning 50-69 · danger &lt; 50).
            Animación con ease-out 800ms.
          </p>
        </Section>

        <Separator />

        {/* ── Accordion ── */}
        <Section kicker="10" title="Accordion">
          <Accordion type="single" collapsible className="sm:max-w-2xl">
            <AccordionItem value="a">
              <AccordionTrigger>¿Qué formatos de CV acepta la plataforma?</AccordionTrigger>
              <AccordionContent>
                Aceptamos PDF y Word (.docx). Procesamos el texto en el servidor sin guardar
                el archivo original.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>¿Cómo funcionan los créditos?</AccordionTrigger>
              <AccordionContent>
                Cada análisis consume 1 crédito. Los nuevos usuarios reciben 5 análisis
                gratuitos al registrarse.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>¿Mis datos están seguros?</AccordionTrigger>
              <AccordionContent>
                Sí. Tu CV se convierte a texto en el servidor y nunca compartimos tu
                información con terceros.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Separator />

        {/* ── Skeleton ── */}
        <Section kicker="11" title="Skeleton">
          <div className="flex flex-col gap-3 sm:max-w-md">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Section>

        <Separator />

        {/* ── Radii & Shadows ── */}
        <Section kicker="12" title="Radii & elevation">
          <div>
            <p className="mb-4 text-sm font-medium text-muted-foreground">Radii</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
              {radii.map(({ name, className }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className={`flex h-16 w-16 items-center justify-center bg-muted ${className} border border-border/60`} />
                  <span className="font-mono text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-medium text-muted-foreground">Shadows</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {shadows.map(({ name, className }) => (
                <div key={name} className="flex flex-col items-center gap-3">
                  <div className={`h-20 w-full rounded-lg bg-card ${className} border border-border/60`} />
                  <span className="font-mono text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <footer className="mt-16 border-t border-border/60 pt-6">
          <p className="font-mono text-xs text-muted-foreground">
            Phase 2 · Components · dark-only · Geist · graphite + indigo
          </p>
        </footer>
      </div>
    </main>
  )
}
