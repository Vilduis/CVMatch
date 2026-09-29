import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateObject } from "ai"
import { z } from "zod"
import { PLACEHOLDER, type CvBullet, type TailoredCv } from "@/lib/cv-types"

const deepseek = createDeepSeek({ apiKey: process.env.AI_API_KEY })

const rawBullet = z.object({
  original: z.string(),
  suggested: z.string(),
  reason: z.string(),
})

const rawCvSchema = z.object({
  target: z.object({ role: z.string(), company: z.string() }),
  name: z.string(),
  contact: z.array(z.string()),
  summary: rawBullet,
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
      bullets: z.array(rawBullet),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      dates: z.string(),
      bullets: z.array(rawBullet),
    })
  ),
  skills: z.array(
    z.object({ category: z.string(), items: z.array(z.string()) })
  ),
  languages: z.array(z.string()),
})

const SYSTEM = `Eres un reclutador técnico senior que adapta CVs a una oferta concreta sin mentir. Tu trabajo es que un reclutador vea en segundos por qué este candidato encaja, usando solo lo que el candidato realmente hizo.

Reglas estrictas:
- Nombres, empresas, cargos, instituciones, ubicaciones y fechas se copian exactamente como están en el CV.
- "original" de cada bullet es el texto exacto del CV (sin el símbolo de viñeta). No agregues bullets que no existan en el CV ni elimines los que existen.
- "suggested" reescribe el bullet: verbo de acción en pasado al inicio, qué hizo, con qué tecnología y para qué. Usa los términos de la oferta solo cuando describen lo mismo que el candidato hizo (p. ej. ASP.NET MVC es .NET Framework).
- Nunca agregues tecnologías, metodologías, herramientas, métricas ni responsabilidades que no estén en el CV. Cuando un bullet menciona un impacto sin cifra (acelerando, optimizando, simplificando, alto tráfico, reduciendo), agrega un marcador entre corchetes para que el candidato complete el dato real, p. ej. [X%], [N usuarios] o [N pantallas]. Máximo un marcador por bullet.
- Si un bullet ya es bueno para esta oferta, "suggested" es igual a "original" y "reason" queda vacío. No cambies por cambiar.
- "reason": una frase corta con el porqué del cambio para esta oferta.
- Dentro de cada experiencia, ordena los bullets de más a menos relevante para la oferta. Las experiencias van en orden cronológico inverso, como en el CV.
- summary: 2 o 3 líneas que respondan "por qué este candidato para este puesto", solo con hechos del CV. Si el CV ya tenía un resumen, "original" es ese texto; si no, "original" queda vacío.
- skills: solo habilidades que aparecen en el CV, agrupadas por categoría y con las más relevantes para la oferta primero.
- languages: solo idiomas que aparecen en el CV, con el nivel tal como está escrito. Si no hay, lista vacía.
- target: nombre del puesto y empresa tal como aparecen en la oferta; empresa vacía si no se menciona.
- Español latino neutro, texto plano sin markdown.`

function buildPrompt(cvText: string, jobDescription: string, gaps: string[]) {
  return `OFERTA:
${jobDescription}

BRECHAS DETECTADAS EN EL ANÁLISIS (no las inventes en el CV; solo evidencia lo que sí existe):
${gaps.map((g) => `- ${g}`).join("\n")}

CV DEL CANDIDATO:
${cvText}

Devuelve el CV completo adaptado a esta oferta con la estructura pedida.`
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9+#]/g, "")
}

// Términos técnicos que la sugerencia toma de la oferta y no existen en el CV
function termsNotInCv(text: string, cvNorm: string, jobNorm: string) {
  const terms = text
    .replace(PLACEHOLDER, " ")
    .split(/\s+/)
    .slice(1)
    .map((t) => t.replace(/^[^\p{L}\p{N}.#+]+|[^\p{L}\p{N}#+]+$/gu, ""))
    .filter((t) => /^[\p{Lu}.]/u.test(t) || /[#+]/.test(t))
    .filter((t) => {
      const n = normalize(t)
      return n.length >= 2 && !cvNorm.includes(n) && jobNorm.includes(n)
    })
  return [...new Set(terms)]
}

export async function tailorCv(
  cvText: string,
  jobDescription: string,
  gaps: string[]
): Promise<TailoredCv> {
  const { object: raw } = await generateObject({
    model: deepseek("deepseek-flash"),
    providerOptions: { deepseek: { thinking: { type: "disabled" } } },
    temperature: 0.2,
    schema: rawCvSchema,
    system: SYSTEM,
    prompt: buildPrompt(cvText, jobDescription, gaps),
  })

  const cvNorm = normalize(cvText)
  const jobNorm = normalize(jobDescription)
  const inCv = (value: string) => {
    const n = normalize(value)
    return n.length > 0 && cvNorm.includes(n)
  }

  const toBullet = (b: z.infer<typeof rawBullet>): CvBullet => {
    const original = b.original.trim()
    const suggested = b.suggested.trim() || original
    const unverified = termsNotInCv(suggested, cvNorm, jobNorm)
    return {
      original,
      suggested,
      text: unverified.length > 0 && original ? original : suggested,
      reason: suggested === original ? "" : b.reason.trim(),
      unverified,
    }
  }
  // Un bullet cuyo "original" no está en el CV fue inventado por el modelo
  const groundedBullets = (bullets: z.infer<typeof rawBullet>[]) =>
    bullets.filter((b) => inCv(b.original)).map(toBullet)

  const summary = toBullet({
    ...raw.summary,
    original: inCv(raw.summary.original) ? raw.summary.original : "",
  })

  return {
    target: raw.target,
    name: raw.name.trim(),
    contact: raw.contact.filter(inCv),
    summary,
    education: raw.education.filter((e) => inCv(e.institution)),
    experience: raw.experience
      .filter((e) => inCv(e.organization))
      .map((e) => ({ ...e, bullets: groundedBullets(e.bullets) })),
    projects: raw.projects
      .filter((p) => inCv(p.name))
      .map((p) => ({ ...p, bullets: groundedBullets(p.bullets) })),
    skills: raw.skills
      .map((s) => ({
        category: s.category,
        items: s.items.filter(inCv).join(", "),
      }))
      .filter((s) => s.items),
    languages: raw.languages.filter(inCv).join(", "),
  }
}
