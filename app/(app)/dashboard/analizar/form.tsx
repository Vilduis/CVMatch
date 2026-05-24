"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  CircleAlert,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AnalizarFormProps {
  credits: number | null
  freeRemaining: number
}

const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const MAX_MB = 10
const MAX_BYTES = MAX_MB * 1024 * 1024
const JD_RECOMMENDED = 200
const JD_MAX = 6000

export default function AnalizarForm({ credits, freeRemaining }: AnalizarFormProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isGuest = credits === null
  const canAnalyze = isGuest ? freeRemaining > 0 : credits > 0

  function handleFile(f: File | undefined | null) {
    if (!f) return
    const isValid =
      f.name.toLowerCase().endsWith(".pdf") ||
      f.name.toLowerCase().endsWith(".docx")
    if (!isValid) {
      toast.error("Solo se aceptan archivos PDF o Word (.docx)")
      return
    }
    if (f.size > MAX_BYTES) {
      toast.error(`El archivo supera ${MAX_MB} MB`)
      return
    }
    setFile(f)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return void toast.error("Sube tu CV en PDF o Word")
    if (!jobDescription.trim()) return void toast.error("Pega la descripción del puesto")

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("cv", file)
      formData.append("jobDescription", jobDescription)

      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al analizar")

      router.push(`/dashboard/resultado/${data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error inesperado")
      setLoading(false)
    }
  }

  if (!canAnalyze) {
    return <NoCreditsEmpty isGuest={isGuest} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <Dropzone
          file={file}
          isDragging={isDragging}
          loading={loading}
          inputRef={inputRef}
          onPickClick={() => inputRef.current?.click()}
          onFileChange={(f) => handleFile(f)}
          onClear={() => setFile(null)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
        <JobDescriptionField
          value={jobDescription}
          onChange={setJobDescription}
          disabled={loading}
        />
      </div>

      <SubmitRow
        loading={loading}
        disabled={!file || !jobDescription.trim()}
        creditsLine={
          isGuest
            ? `${freeRemaining} análisis gratis restante${freeRemaining !== 1 ? "s" : ""}`
            : `${credits} crédito${credits !== 1 ? "s" : ""} disponible${credits !== 1 ? "s" : ""}`
        }
      />
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────── */

function Dropzone({
  file,
  isDragging,
  loading,
  inputRef,
  onPickClick,
  onFileChange,
  onClear,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  file: File | null
  isDragging: boolean
  loading: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onPickClick: () => void
  onFileChange: (f: File | undefined | null) => void
  onClear: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  return (
    <FieldShell
      label="CV"
      step="01"
      help="PDF o Word (.docx) · Máx. 10 MB"
    >
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-input bg-card/30 p-6 text-center transition-colors",
          isDragging && "border-primary/60 bg-primary/5",
          file && "border-border bg-card/60",
          loading && "pointer-events-none opacity-70"
        )}
      >
        {file ? (
          <FilePreview file={file} onClear={onClear} />
        ) : (
          <EmptyDropzone isDragging={isDragging} onPickClick={onPickClick} />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => onFileChange(e.target.files?.[0])}
        />
      </div>
    </FieldShell>
  )
}

function EmptyDropzone({
  isDragging,
  onPickClick,
}: {
  isDragging: boolean
  onPickClick: () => void
}) {
  return (
    <>
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <UploadCloud className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13.5px] font-medium">
          {isDragging ? "Suelta tu CV aquí" : "Arrastra tu CV"}
        </p>
        <p className="text-[12px] text-muted-foreground">
          o{" "}
          <button
            type="button"
            onClick={onPickClick}
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            selecciónalo desde tu equipo
          </button>
        </p>
      </div>
      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        PDF · DOCX · 10 MB
      </p>
    </>
  )
}

function FilePreview({ file, onClear }: { file: File; onClear: () => void }) {
  const ext = file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"
  const size = formatBytes(file.size)
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="relative flex w-full items-center gap-3 rounded-md border border-border/60 bg-card px-3 py-2.5 text-left">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold tracking-[0.08em] text-muted-foreground">
          {ext}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{file.name}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
            {size}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Quitar archivo"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <FileText className="size-3" />
        Listo para analizar
      </p>
    </div>
  )
}

function JobDescriptionField({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  const tooShort = value.length > 0 && value.length < JD_RECOMMENDED
  return (
    <FieldShell
      label="Descripción del puesto"
      step="02"
      help={`Pega los requisitos completos, no solo el título · ${JD_RECOMMENDED}+ caracteres recomendado`}
    >
      <div className="relative">
        <Textarea
          placeholder="Pega la descripción del puesto: requisitos, responsabilidades, habilidades técnicas, idiomas, años de experiencia, beneficios… Cuanto más completo, mejor el análisis."
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, JD_MAX))}
          disabled={disabled}
          className="min-h-[260px] resize-none font-sans text-[13.5px] leading-relaxed"
        />
        <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-2 text-[11px] text-muted-foreground/80">
          {tooShort && (
            <span className="inline-flex items-center gap-1 text-[var(--warning)]">
              <CircleAlert className="size-3" />
              Muy corto
            </span>
          )}
          <span className="font-mono tabular-nums">
            {value.length}
            <span className="text-muted-foreground/60">/{JD_MAX}</span>
          </span>
        </div>
      </div>
    </FieldShell>
  )
}

function FieldShell({
  step,
  label,
  help,
  children,
}: {
  step: string
  label: string
  help: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] font-medium text-muted-foreground">
            {step}
          </span>
          <span className="text-[13px] font-medium tracking-tight">
            {label}
          </span>
        </div>
      </div>
      {children}
      <p className="text-[11px] leading-relaxed text-muted-foreground">{help}</p>
    </div>
  )
}

function SubmitRow({
  loading,
  disabled,
  creditsLine,
}: {
  loading: boolean
  disabled: boolean
  creditsLine: string
}) {
  return (
    <div className="flex flex-col gap-3">
      {loading && <IndeterminateBar />}
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-[12px] text-muted-foreground">
          {loading ? (
            <LoadingHint />
          ) : (
            <>
              <span className="text-foreground/80">Costo:</span> 1 análisis ·{" "}
              <span className="text-foreground/80">{creditsLine}</span>
            </>
          )}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={loading || disabled}
          className="gap-1.5 sm:min-w-[180px]"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analizando…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Analizar ahora
              <ArrowRight className="size-3.5 opacity-70" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function IndeterminateBar() {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
      <span className="absolute inset-y-0 left-0 w-full origin-left animate-[indeterminate_1.4s_ease-in-out_infinite] bg-primary" />
    </div>
  )
}

function LoadingHint() {
  const phrases = [
    "Extrayendo texto del CV…",
    "Comparando contra el puesto…",
    "Identificando fortalezas y brechas…",
    "Generando sugerencias…",
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length)
    }, 2200)
    return () => clearInterval(t)
  }, [phrases.length])

  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="size-1.5 animate-pulse rounded-full bg-primary" />
      {phrases[index]}
    </span>
  )
}

function NoCreditsEmpty({ isGuest }: { isGuest: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-10 text-center sm:p-14">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[var(--warning)]/30 bg-[var(--warning)]/10">
        <CircleAlert className="size-5 text-[var(--warning)]" />
      </div>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Sin créditos
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        {isGuest
          ? "Ya usaste tus 5 análisis gratis."
          : "No tienes créditos disponibles."}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
        Compra un paquete y sigue analizando puestos sin límite. Los créditos no
        vencen.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Link href="/precios">
          <Button size="lg" className="gap-1.5">
            Ver planes
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
        <Link href="/dashboard/historial">
          <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
            Ver análisis anteriores
          </Button>
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── */

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}
