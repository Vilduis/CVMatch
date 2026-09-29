import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateObject } from "ai"
import { z } from "zod"

const deepseek = createDeepSeek({ apiKey: process.env.AI_API_KEY })

const INTERVIEW_THRESHOLD = 70

const requirementSchema = z.object({
  requirement: z.string(),
  type: z.enum(["obligatorio", "deseable"]),
  status: z.enum(["cumple", "parcial", "sin_evidencia", "no_cumple"]),
  evidence: z.string(),
})

const modelSchema = z.object({
  requirements: z.array(requirementSchema).min(1),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  cvSuggestions: z.array(z.string()),
  interviewQuestions: z.array(z.string()),
})

export type AnalysisResult = {
  matchScore: number
  strengths: string[]
  gaps: string[]
  cvSuggestions: string[]
  interviewQuestions?: string[]
}

const WEIGHT = { obligatorio: 3, deseable: 1 } as const
const CREDIT = { cumple: 1, parcial: 0.5, sin_evidencia: 0, no_cumple: 0 }

// El puntaje sale de la tabla de requisitos, no de la "impresión" del modelo,
// para que sea consistente entre análisis y no se infle
function scoreRequirements(requirements: z.infer<typeof requirementSchema>[]) {
  let earned = 0
  let total = 0
  for (const r of requirements) {
    earned += WEIGHT[r.type] * CREDIT[r.status]
    total += WEIGHT[r.type]
  }
  return Math.round((earned / total) * 100)
}

function uniqueItems(items: string[], max: number) {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of items) {
    const text = item.trim()
    const key = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "")
    if (!text || seen.has(key)) continue
    seen.add(key)
    result.push(text)
    if (result.length === max) break
  }
  return result
}

const SYSTEM = `Eres un reclutador técnico senior en Latinoamérica filtrando postulantes para una empresa exigente. Lees el CV con la oferta al lado y decides si el candidato pasa a entrevista. Eres crítico, concreto y honesto: no halagas, no rellenas y no inventas.

Reglas:
- Solo cuenta lo que está escrito en el CV. Una habilidad listada en "competencias" sin experiencia, proyecto o estudio que la respalde vale "parcial", nunca "cumple".
- Tecnologías equivalentes o que son parte de otra cuentan (p. ej. ASP.NET MVC es .NET Framework; Next.js implica React). No penalices por nombres distintos de lo mismo.
- Si un requisito no aparece en el CV, es "sin_evidencia" (el candidato quizá lo tenga pero no lo escribió). Usa "no_cumple" solo cuando el CV contradice el requisito.
- Cada punto aparece una sola vez en todo el análisis. Si una brecha ya está en "gaps", la sugerencia debe decir cómo cerrarla, no repetirla.
- Prohibido el relleno: nada de "demuestra capacidad de aprendizaje", "perfil prometedor", becas o premios que no tengan relación con el puesto, ni habilidades blandas que no se puedan verificar en el CV.
- Nunca sugieras agregar al CV algo que el candidato no tiene. Si falta algo, sugiere cómo obtenerlo o, si ya lo tiene, cómo evidenciarlo.
- En los bullets de ejemplo no inventes métricas, herramientas ni responsabilidades: usa solo hechos del CV y marca entre corchetes lo que el candidato debe completar (p. ej. [X%], [N usuarios]).
- No sugieras romper el orden cronológico inverso de la experiencia; para resaltar algo, usa el resumen profesional del inicio.
- Español latino neutro, texto plano sin HTML ni markdown. Cada punto en una o dos frases.`

function buildPrompt(cvText: string, jobDescription: string) {
  return `OFERTA:
${jobDescription}

CV DEL CANDIDATO:
${cvText}

Devuelve:
- requirements: los requisitos reales de la oferta, uno por fila (sin agrupar dos tecnologías en una fila si se evalúan distinto). "obligatorio" si la oferta lo exige (requisitos, "indispensable", "experiencia en"); "deseable" si es un plus o solo aparece en responsabilidades (lo que se aprende en el puesto). No incluyas habilidades blandas genéricas (proactividad, multitasking, trabajo en equipo). evidence: cita breve del CV que justifica el estado, o cadena vacía si no hay.
- strengths: máximo 4. Lo que haría que un reclutador lo preseleccione, cada uno con la evidencia concreta del CV (empresa, tecnología, resultado). Ordenadas de mayor a menor peso para esta oferta.
- gaps: máximo 4. Solo brechas que pueden costarle la entrevista, ordenadas por impacto. Di explícitamente si es un requisito obligatorio.
- cvSuggestions: máximo 5, ordenadas por impacto. Acciones concretas para que este CV destaque frente a otros postulantes a este mismo puesto: reescribir un bullet existente usando los términos de la oferta (muestra el bullet sugerido), cuantificar un logro que ya está descrito, reordenar para que lo más relevante se vea en los primeros segundos, o evidenciar un requisito que probablemente cumple pero no escribió. Nada genérico que sirva para cualquier CV.
- interviewQuestions: 6 a 8 preguntas que este entrevistador haría a este candidato, basadas en su experiencia concreta y en sus brechas para esta oferta. Incluye al menos una técnica y una de comportamiento.`
}

export async function analyzeCv(
  cvText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const { object } = await generateObject({
    model: deepseek("deepseek-flash"),
    providerOptions: { deepseek: { thinking: { type: "disabled" } } },
    temperature: 0.2,
    schema: modelSchema,
    system: SYSTEM,
    prompt: buildPrompt(cvText, jobDescription),
  })

  const matchScore = scoreRequirements(object.requirements)

  return {
    matchScore,
    strengths: uniqueItems(object.strengths, 4),
    gaps: uniqueItems(object.gaps, 4),
    cvSuggestions: uniqueItems(object.cvSuggestions, 5),
    interviewQuestions:
      matchScore >= INTERVIEW_THRESHOLD
        ? uniqueItems(object.interviewQuestions, 8)
        : undefined,
  }
}
