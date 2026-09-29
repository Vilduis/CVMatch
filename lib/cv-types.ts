import { z } from "zod"

const bulletSchema = z.object({
  original: z.string(),
  suggested: z.string(),
  text: z.string(),
  reason: z.string(),
  unverified: z.array(z.string()),
})

export const tailoredCvSchema = z.object({
  target: z.object({ role: z.string(), company: z.string() }).optional(),
  name: z.string(),
  contact: z.array(z.string()),
  summary: bulletSchema,
  education: z.array(
    z.object({
      institution: z.string(),
      location: z.string(),
      degree: z.string(),
      dates: z.string(),
      details: z.array(z.string()),
    })
  ),
  experience: z.array(
    z.object({
      organization: z.string(),
      location: z.string(),
      role: z.string(),
      dates: z.string(),
      bullets: z.array(bulletSchema),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      dates: z.string(),
      bullets: z.array(bulletSchema),
    })
  ),
  skills: z.array(z.object({ category: z.string(), items: z.string() })),
  languages: z.string(),
})

export type TailoredCv = z.infer<typeof tailoredCvSchema>
export type CvBullet = z.infer<typeof bulletSchema>

export const PLACEHOLDER = /\[[^\]]+\]/g

export function isChanged(bullet: CvBullet) {
  return bullet.suggested.trim() !== bullet.original.trim()
}

export function allBullets(cv: TailoredCv) {
  return [
    cv.summary,
    ...cv.experience.flatMap((e) => e.bullets),
    ...cv.projects.flatMap((p) => p.bullets),
  ]
}

export function pendingPlaceholders(cv: TailoredCv) {
  return allBullets(cv).reduce(
    (count, b) => count + (b.text.match(PLACEHOLDER)?.length ?? 0),
    0
  )
}

export function formatContact(contact: string[]) {
  return contact
    .map((c) =>
      c
        .trim()
        .replace(/^https?:\/\/(www\.)?/, "")
        .replace(/\/$/, "")
    )
    .join("  •  ")
}
