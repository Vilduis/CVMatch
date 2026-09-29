# CVMatch AI

Plataforma web que analiza la compatibilidad entre un CV y una oferta de trabajo usando inteligencia artificial, y adapta el CV a esa oferta sin inventar experiencia.

## Funcionalidades

- **Análisis de match**: el usuario sube su CV (PDF o Word) y pega la descripción del puesto. La IA evalúa cada requisito de la oferta (obligatorio o deseable) contra la evidencia del CV, y el puntaje se calcula a partir de esa tabla para que sea consistente y no se infle.
- **Resultado crítico y accionable**: fortalezas, brechas y sugerencias concretas, sin puntos repetidos ni relleno. Si el match es ≥ 70%, incluye preguntas probables de entrevista con guía STAR.
- **Adaptar CV a la oferta**: reescribe los bullets con los términos del puesto usando solo hechos del CV. Lo que el usuario debe completar (métricas) queda marcado entre corchetes, y cualquier término que no esté en el CV original se señala para que el usuario decida.
- **Editor y PDF formato Harvard**: el usuario revisa cada cambio (usar original o sugerencia), edita el texto y descarga un PDF de una columna, legible por sistemas ATS.
- **Mis CVs**: todos los CVs adaptados en un solo lugar, para editarlos o descargarlos de nuevo sin gastar créditos.
- **Historial** de análisis con score promedio y paginación.

## Modelo de negocio

Pago único por paquete de créditos (sin suscripción). Cada análisis y cada adaptación de CV consumen 1 crédito y requieren cuenta. Cada cuenta nueva recibe 5 créditos gratis al registrarse. Si la IA falla, el crédito se devuelve automáticamente. Los créditos se compran en paquetes con precios en Soles (PEN) vía Stripe.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 App Router + Turbopack |
| Auth | Auth.js v5 (next-auth@beta) + Google OAuth |
| DB | Drizzle ORM + Neon PostgreSQL (serverless) |
| UI | Tailwind CSS v4 + shadcn/ui + Radix UI + Lucide React |
| IA | DeepSeek V4.1 Flash via Vercel AI SDK (`ai` + `@ai-sdk/deepseek`) |
| Parsing CV | `pdf-parse` (PDF) + `mammoth` (Word/DOCX) |
| Generación PDF | `@react-pdf/renderer` (plantilla Harvard) |
| Pagos | Stripe (pago único) |
| Deploy | Vercel |
| Lenguaje | TypeScript strict |
| Paquetes | pnpm |
