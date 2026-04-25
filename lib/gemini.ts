import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  cvSuggestions: z.array(z.string()),
  interviewQuestions: z.array(z.string()).optional(),
})

export type AnalysisResult = z.infer<typeof analysisSchema>

export async function analyzeCv(
  cvText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: analysisSchema,
    system: `Eres un experto en recursos humanos y reclutamiento para Latinoamérica.
Analiza CVs y descripciones de trabajo con criterio profesional.
Siempre responde en español latino. Sé directo, útil y constructivo.`,
    prompt: `Analiza qué tan bien este candidato encaja con el trabajo descrito.

CV DEL CANDIDATO:
${cvText}

DESCRIPCIÓN DEL TRABAJO:
${jobDescription}

Devuelve:
- matchScore: puntaje del 0 al 100 indicando qué tan buen candidato es
- strengths: array de strings, cada uno una fortaleza del candidato para este puesto. Sin HTML, texto plano.
- gaps: array de strings, cada uno una brecha o carencia del candidato. Sin HTML, texto plano.
- cvSuggestions: array de strings, cada uno una sugerencia concreta para mejorar el CV. Sin HTML, texto plano.
- interviewQuestions: si matchScore >= 70, array de 8 a 10 preguntas probables de entrevista; si es menor de 70, omitir el campo.`,
  })

  return object
}
