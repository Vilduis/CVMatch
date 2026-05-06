"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CloudUpload,
  FileText,
  Info,
  Loader2,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface AnalizarFormProps {
  credits: number | null
  freeRemaining: number
}

export default function AnalizarForm({ credits, freeRemaining }: AnalizarFormProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isGuest = credits === null
  const canAnalyze = isGuest ? freeRemaining > 0 : credits > 0

  function handleFile(f: File | undefined | null) {
    if (!f) return
    if (!f.name.endsWith(".pdf") && !f.name.endsWith(".docx")) {
      toast.error("Solo se aceptan archivos PDF o Word (.docx)")
      return
    }
    setFile(f)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (canAnalyze) setIsDragging(true)
  }, [canAnalyze])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!canAnalyze) return
    handleFile(e.dataTransfer.files?.[0])
  }, [canAnalyze]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canAnalyze) return
    if (!file) return void toast.error("Debes subir tu CV en PDF o Word")
    if (!jobDescription.trim()) return void toast.error("Pega la descripción del trabajo")

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("cv", file)
      formData.append("jobDescription", jobDescription)

      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al analizar")

      router.push(`/resultado/${data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error inesperado")
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Analiza tu CV
        </h1>
        <p className="text-muted-foreground">
          Sube tu CV y pega la descripción del trabajo. La IA hace el resto en segundos.
        </p>
      </div>

      {/* Banners */}
      {canAnalyze && isGuest && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Tienes{" "}
            <span className="font-semibold text-foreground">
              {freeRemaining} análisis gratuito{freeRemaining !== 1 ? "s" : ""}
            </span>{" "}
            disponible{freeRemaining !== 1 ? "s" : ""}.{" "}
            <Link href="/precios" className="text-primary underline-offset-4 hover:underline">
              Compra créditos
            </Link>{" "}
            para más.
          </p>
        </div>
      )}

      {canAnalyze && !isGuest && credits !== null && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Tienes{" "}
            <span className="font-semibold text-foreground">
              {credits} crédito{credits !== 1 ? "s" : ""}
            </span>{" "}
            disponible{credits !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {!canAnalyze && isGuest && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Ya usaste tus 5 análisis gratuitos
            </p>
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
              Inicia sesión y compra créditos para seguir analizando.
            </p>
          </div>
          <Link href="/precios" className="shrink-0">
            <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
              Ver planes
            </Button>
          </Link>
        </div>
      )}

      {!canAnalyze && !isGuest && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Sin créditos disponibles
            </p>
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
              Compra un paquete para continuar analizando tu CV.
            </p>
          </div>
          <Link href="/precios" className="shrink-0">
            <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
              Ver planes
            </Button>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Grid: CV | Descripción */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch">

          {/* Step 1 — Subir CV */}
          <Card className="flex flex-col border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                Tu CV (PDF o Word)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/8 scale-[1.01]"
                    : file
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                } ${!canAnalyze ? "pointer-events-none opacity-50" : ""}`}
              >
                {file ? (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{file.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Quitar archivo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-xs text-muted-foreground">
                      Arrastra otro archivo para cambiar
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                      <CloudUpload className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {isDragging ? "Suelta tu CV aquí" : "Arrastra tu CV o haz clic"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        PDF o Word (.docx) · Máx. 10 MB
                      </p>
                    </div>
                  </>
                )}

                {/* Clickable overlay input */}
                {!file && (
                  <label htmlFor="cv-upload" className="absolute inset-0 cursor-pointer rounded-xl">
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.docx"
                      className="sr-only"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      disabled={!canAnalyze}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 2 — Descripción del trabajo */}
          <Card className="flex flex-col border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                Descripción del trabajo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <Textarea
                placeholder="Pega aquí la descripción completa del puesto: requisitos, responsabilidades, habilidades requeridas, etc. Cuanto más detalle, mejor el análisis."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="flex-1 resize-none border-border/60 focus-visible:ring-primary/30 min-h-[280px]"
                disabled={!canAnalyze}
              />
              {jobDescription.length > 0 && (
                <p className="mt-1.5 text-right text-xs text-muted-foreground">
                  {jobDescription.length} caracteres
                </p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={loading || !canAnalyze}
          className="w-full gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando tu CV...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analizar ahora
            </>
          )}
        </Button>

        {loading && (
          <p className="animate-pulse text-center text-sm text-muted-foreground">
            La IA está procesando tu CV. Esto puede tomar unos segundos...
          </p>
        )}
      </form>
    </main>
  )
}
