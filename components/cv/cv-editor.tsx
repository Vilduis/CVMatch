"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  allBullets,
  formatContact,
  isChanged,
  pendingPlaceholders,
  PLACEHOLDER,
  type CvBullet,
  type TailoredCv,
} from "@/lib/cv-types"
import { saveTailoredCv } from "@/app/(app)/dashboard/resultado/[id]/actions"

export default function CvEditor({
  analysisId,
  initialCv,
}: {
  analysisId: string
  initialCv: TailoredCv
}) {
  const [cv, setCv] = useState(initialCv)
  const [dirty, setDirty] = useState(false)
  const [saving, startSaving] = useTransition()

  const changes = allBullets(cv).filter(isChanged).length
  const pending = pendingPlaceholders(cv)

  function update(mutate: (draft: TailoredCv) => void) {
    setCv((prev) => {
      const next = structuredClone(prev)
      mutate(next)
      return next
    })
    setDirty(true)
  }

  async function save() {
    const { ok } = await saveTailoredCv(analysisId, cv)
    if (!ok) toast.error("No se pudieron guardar los cambios")
    else setDirty(false)
    return ok
  }

  function handleSave() {
    startSaving(async () => {
      if (await save()) toast.success("Cambios guardados")
    })
  }

  function handleDownload() {
    startSaving(async () => {
      if (dirty && !(await save())) return
      window.location.href = `/api/cv/${analysisId}`
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/dashboard/resultado/${analysisId}`}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Volver al análisis
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Tu CV adaptado
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {changes} {changes === 1 ? "cambio sugerido" : "cambios sugeridos"}.
            Haz clic en cualquier texto para editarlo.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={saving || !dirty}
              onClick={handleSave}
              className="gap-1.5"
            >
              <Save className="size-3.5" />
              Guardar
            </Button>
            <Button
              size="sm"
              disabled={saving || pending > 0}
              onClick={handleDownload}
              className="flex-1 gap-1.5"
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Descargar PDF
            </Button>
          </div>
          {pending > 0 && (
            <p className="text-[12px] text-[var(--warning)]">
              Completa {pending} {pending === 1 ? "dato" : "datos"} entre
              corchetes para descargar.
            </p>
          )}
        </div>
      </div>

      <article className="mx-auto w-full max-w-[794px] rounded-sm bg-white px-6 py-8 font-serif text-[14px] leading-snug text-neutral-900 shadow-lg sm:px-14 sm:py-12">
        <header className="text-center">
          <h2 className="font-serif text-[22px] font-bold">{cv.name}</h2>
          <p className="mt-1 text-[13px]">{formatContact(cv.contact)}</p>
        </header>

        {(cv.summary.text || cv.summary.suggested) && (
          <PaperSection title="Perfil">
            <BulletEditor
              bullet={cv.summary}
              marker={false}
              onChange={(patch) =>
                update((d) => Object.assign(d.summary, patch))
              }
            />
          </PaperSection>
        )}

        {cv.education.length > 0 && (
          <PaperSection title="Educación">
            {cv.education.map((e, i) => (
              <div key={i} className="mb-2">
                <EntryHeader
                  title={e.institution}
                  place={e.location}
                  subtitle={e.degree}
                  dates={e.dates}
                />
                {e.details.map((d, j) => (
                  <p key={j} className="flex gap-2 pl-3">
                    <span>•</span>
                    {d}
                  </p>
                ))}
              </div>
            ))}
          </PaperSection>
        )}

        {cv.experience.length > 0 && (
          <PaperSection title="Experiencia">
            {cv.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <EntryHeader
                  title={e.organization}
                  place={e.location}
                  subtitle={e.role}
                  dates={e.dates}
                />
                {e.bullets.map((b, j) => (
                  <BulletEditor
                    key={j}
                    bullet={b}
                    onChange={(patch) =>
                      update((d) =>
                        Object.assign(d.experience[i].bullets[j], patch)
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </PaperSection>
        )}

        {cv.projects.length > 0 && (
          <PaperSection title="Proyectos">
            {cv.projects.map((p, i) => (
              <div key={i} className="mb-3">
                <EntryHeader title={p.name} place={p.dates} />
                {p.bullets.map((b, j) => (
                  <BulletEditor
                    key={j}
                    bullet={b}
                    onChange={(patch) =>
                      update((d) =>
                        Object.assign(d.projects[i].bullets[j], patch)
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </PaperSection>
        )}

        {(cv.skills.length > 0 || cv.languages) && (
          <PaperSection title="Habilidades">
            {cv.skills.map((s, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="shrink-0 font-bold">{s.category}:</span>
                <PaperTextarea
                  value={s.items}
                  onChange={(items) =>
                    update((d) => {
                      d.skills[i].items = items
                    })
                  }
                />
              </div>
            ))}
            {cv.languages && (
              <div className="flex gap-1.5">
                <span className="shrink-0 font-bold">Idiomas:</span>
                <PaperTextarea
                  value={cv.languages}
                  onChange={(languages) =>
                    update((d) => {
                      d.languages = languages
                    })
                  }
                />
              </div>
            )}
          </PaperSection>
        )}
      </article>
    </div>
  )
}

function PaperSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 border-b border-neutral-900 pb-0.5 font-serif text-[14.5px] font-bold tracking-wide uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function EntryHeader({
  title,
  place,
  subtitle,
  dates,
}: {
  title: string
  place?: string
  subtitle?: string
  dates?: string
}) {
  return (
    <>
      <div className="flex justify-between gap-4">
        <span className="font-bold">{title}</span>
        <span className="shrink-0">{place}</span>
      </div>
      {(subtitle || dates) && (
        <div className="flex justify-between gap-4 italic">
          <span>{subtitle}</span>
          <span className="shrink-0">{dates}</span>
        </div>
      )}
    </>
  )
}

function PaperTextarea({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <textarea
      value={value}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "field-sizing-content w-full resize-none rounded-sm bg-transparent text-justify outline-none hover:bg-neutral-100 focus:bg-blue-50",
        className
      )}
    />
  )
}

function BulletEditor({
  bullet,
  onChange,
  marker = true,
}: {
  bullet: CvBullet
  onChange: (patch: Partial<CvBullet>) => void
  marker?: boolean
}) {
  const changed = isChanged(bullet)
  const usingSuggestion = bullet.text === bullet.suggested
  const hasPlaceholder = (bullet.text.match(PLACEHOLDER)?.length ?? 0) > 0
  const flagged = bullet.unverified.length > 0

  return (
    <div
      className={cn(
        "mt-1 border-l-2 pl-2",
        !changed && "border-transparent",
        changed && "border-blue-500",
        changed && flagged && "border-amber-500",
        hasPlaceholder && "border-amber-500"
      )}
    >
      <div className={cn("flex gap-2", marker && "pl-1")}>
        {marker && <span>•</span>}
        <PaperTextarea
          value={bullet.text}
          onChange={(text) => onChange({ text })}
          className={cn(hasPlaceholder && "bg-amber-50")}
        />
      </div>

      {(changed || hasPlaceholder) && (
        <div className="mt-1 mb-2 flex flex-col gap-1 font-sans text-[11.5px] leading-relaxed text-neutral-600">
          {changed && bullet.reason && <p>{bullet.reason}</p>}
          {flagged && (
            <p className="text-amber-700">
              La sugerencia agrega {bullet.unverified.join(", ")}, que no está
              en tu CV original. Úsala solo si es verdad.
            </p>
          )}
          {hasPlaceholder && (
            <p className="text-amber-700">
              Reemplaza lo que está entre corchetes con tu dato real, o bórralo.
            </p>
          )}
          {changed && (
            <div className="flex gap-3">
              <button
                type="button"
                disabled={bullet.text === bullet.original}
                onClick={() => onChange({ text: bullet.original })}
                className="font-medium text-blue-700 hover:underline disabled:text-neutral-400 disabled:no-underline"
              >
                {bullet.original ? "Usar original" : "Quitar"}
              </button>
              <button
                type="button"
                disabled={usingSuggestion}
                onClick={() => onChange({ text: bullet.suggested })}
                className="font-medium text-blue-700 hover:underline disabled:text-neutral-400 disabled:no-underline"
              >
                Usar sugerencia
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
