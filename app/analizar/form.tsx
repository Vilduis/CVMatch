"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CloudUpload, FileText, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface AnalizarFormProps {
  credits: number | null  // null = invitado sin cuenta
  freeUsed: boolean
}

export default function AnalizarForm({ credits, freeUsed }: AnalizarFormProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const isGuest = credits === null
  const canAnalyze = isGuest ? !freeUsed : credits > 0

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
    <main className="container mx-auto max-w-5xl px-4 py-12">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Analiza tu CV</h1>
        <p className="text-muted-foreground">
          Sube tu CV y pega la descripción del trabajo. La IA hace el resto.
        </p>
      </div>

      {/* Banner: invitado con análisis gratuito disponible */}
      {canAnalyze && isGuest && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Tienes <span className="font-semibold text-foreground">1 análisis gratuito</span> disponible.{" "}
            <Link href="/precios" className="text-primary underline-offset-4 hover:underline">
              Compra créditos
            </Link>{" "}
            para más.
          </p>
        </div>
      )}

      {/* Banner: usuario con créditos */}
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

      {/* Banner: invitado sin análisis gratuito */}
      {!canAnalyze && isGuest && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Ya usaste tu análisis gratuito
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

      {/* Banner: usuario sin créditos */}
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

        {/* Grid 2 columnas: CV | Descripción */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch">

          {/* Step 1 - Subir CV */}
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
              <label
                htmlFor="cv-upload"
                className={`group flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  file
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                } ${!canAnalyze ? "pointer-events-none opacity-50" : ""}`}
              >
                {file ? (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB — Click para cambiar
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                      <CloudUpload className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Haz click para subir tu CV</p>
                      <p className="text-xs text-muted-foreground mt-0.5">PDF o Word (.docx)</p>
                    </div>
                  </>
                )}
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  disabled={!canAnalyze}
                />
              </label>
            </CardContent>
          </Card>

          {/* Step 2 - Descripción del trabajo */}
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
                placeholder="Pega aquí la descripción completa del puesto al que quieres aplicar: requisitos, responsabilidades, habilidades, etc."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="flex-1 resize-none border-border/60 focus-visible:ring-primary/30 min-h-[260px]"
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

        {/* Botón submit */}
        <Button
          type="submit"
          size="lg"
          disabled={loading || !canAnalyze}
          className="w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-700 hover:to-violet-700 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando tu CV...
            </>
          ) : (
            "Analizar ahora"
          )}
        </Button>

        {loading && (
          <p className="text-center text-sm text-muted-foreground animate-pulse">
            La IA está procesando tu CV. Esto puede tomar unos segundos...
          </p>
        )}
      </form>
    </main>
  )
}
