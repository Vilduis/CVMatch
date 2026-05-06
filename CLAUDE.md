# CVMatch AI

Plataforma web en español para Latinoamérica. El usuario sube su CV (PDF o Word) y pega la descripción de un trabajo; la IA analiza qué tan buen candidato es para ese puesto y devuelve: puntaje de match, fortalezas, brechas, sugerencias para mejorar el CV, y (si el match es ≥ 70%) preguntas probables de entrevista.

## Stack

- **Framework**: Next.js 16 con App Router y Turbopack
- **Auth**: Auth.js v5 (next-auth@beta) con proveedor Google OAuth
- **UI**: shadcn/ui + Tailwind CSS v4 + Radix UI + Lucide React + AOS (scroll animations)
- **Fuentes**: Geist + Geist Mono (Google Fonts)
- **Base de datos**: Neon DB (PostgreSQL serverless)
- **ORM**: Drizzle ORM
- **IA**: Gemini 2.5 Flash via Vercel AI SDK (`@ai-sdk/google` + `ai`)
- **Parsing CV**: `pdf-parse` (PDF) + `mammoth` (Word)
- **Pagos**: Stripe — pago único por paquete de créditos, webhook activo
- **Lenguaje**: TypeScript strict
- **Deploy**: Vercel (`https://cv-match-pe.vercel.app`)

## Comandos

```bash
npm run dev       # Servidor de desarrollo (Turbopack)
npm run build     # Build de producción
npm run typecheck # Verificar tipos sin emitir
npm run lint      # ESLint
npm run format    # Prettier sobre archivos .ts y .tsx
npx drizzle-kit push   # Aplicar cambios de schema a Neon
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Landing page (hero, cómo funciona, features, CTA) |
| `/analizar` | Formulario: sube CV + pega descripción del trabajo |
| `/resultado/[id]` | Resultado del análisis (score ring, fortalezas, brechas, sugerencias, preguntas) |
| `/historial` | Análisis anteriores del usuario (requiere auth) |
| `/precios` | Paquetes de créditos disponibles |
| `/exito` | Confirmación de pago exitoso (verifica sesión Stripe) |

## Esquema de base de datos

```
users         → id, email, name, image, credits, createdAt
analyses      → id, userId, cvText, jobDescription, matchScore,
                strengths, gaps, cvSuggestions, interviewQuestions, createdAt
stripe_events → eventId (PK), processedAt  ← idempotencia de webhook
```

## Lógica de negocio

- El CV nunca se almacena como archivo — se parsea en el servidor y se guarda solo el texto
- Si `matchScore >= 70` → se generan preguntas de entrevista; si no, ese campo queda vacío
- **Invitados**: 5 análisis gratuitos via cookie (`cvmatch_free_count`, max `FREE_MAX = 5`)
- **Usuarios autenticados**: sistema de créditos — 1 crédito por análisis
- Los créditos se compran en paquetes (pago único via Stripe), sin suscripción

## Planes (`lib/plans.ts`)

| Plan | Créditos | Precio PEN |
|---|---|---|
| Básico | 10 | S/ 14.90 |
| Popular | 30 | S/ 34.90 |
| Pro | 80 | S/ 74.90 |

## Stripe

- Webhook activo y funcional: `https://cv-match-pe.vercel.app/api/stripe/webhook`
- Los créditos se asignan en `checkout.session.completed` vía `metadata.userId`
- Idempotencia implementada con tabla `stripe_events` — evita doble acreditación si Stripe reintenta
- Las tres variables de entorno de Stripe están configuradas en Vercel y en `.env`

## Auth

- Archivo principal: `auth.ts` en la raíz
- `session.user.id` se expone desde `token.sub` en el callback `session`
- Al hacer `signIn` se hace upsert del usuario en la tabla `users`
- Redirect URI para desarrollo: `http://localhost:3000/api/auth/callback/google`

## Variables de entorno requeridas

```bash
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
DATABASE_URL=                        # Connection string de Neon
GOOGLE_GENERATIVE_AI_API_KEY=        # Google AI Studio
STRIPE_SECRET_KEY=                   # Stripe → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Stripe → Developers → API keys
STRIPE_WEBHOOK_SECRET=               # Stripe → Developers → Webhooks → endpoint signing secret
```

## Estructura relevante

```
auth.ts
db/
  schema.ts        # Tablas: users, analyses, stripe_events
  index.ts         # Cliente Drizzle + Neon (import * as schema)
lib/
  plans.ts         # Definición de paquetes de créditos
  gemini.ts        # Cliente Gemini 2.5 Flash + prompt de análisis
  parse-cv.ts      # Parsing PDF (pdf-parse) y Word (mammoth)
  utils.ts         # cn()
app/
  api/
    analyze/route.ts          # POST: analiza CV, consume crédito, guarda resultado
    stripe/checkout/route.ts  # POST: crea sesión de pago Stripe
    stripe/webhook/route.ts   # POST: acredita créditos tras pago exitoso
  analizar/
    page.tsx        # Server: lee créditos/cookie y pasa props al form
    form.tsx        # Client: drag & drop upload, textarea, submit
  resultado/[id]/page.tsx     # Resultado con ScoreRing SVG animado
  historial/page.tsx          # Requiere auth; lista análisis del usuario
  precios/
    page.tsx        # Cards de planes
    buy-button.tsx  # Client: llama a /api/stripe/checkout
  exito/page.tsx    # Verifica sesión Stripe y muestra confirmación
components/
  navbar.tsx
  ui/score-ring.tsx  # SVG circular progress animado con CSS transition
```

## Notas

- `.env` está en `.gitignore` — nunca commitear credenciales
- Alias `@/` apunta a la raíz del proyecto (`CVMatch/`)
- `export const dynamic = "force-dynamic"` en `app/layout.tsx` — toda la app es dinámica
- shadcn/ui: `npx shadcn add <componente>` instala en `components/ui/`
