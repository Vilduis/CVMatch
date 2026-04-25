# CVMatch AI

Plataforma web en español para Latinoamérica. El usuario sube su CV (PDF o Word) y pega la descripción de un trabajo; la IA analiza qué tan buen candidato es para ese puesto y devuelve: puntaje de match, fortalezas, brechas, sugerencias para mejorar el CV, y (si el match es ≥ 70%) preguntas probables de entrevista.

## Stack

- **Framework**: Next.js 16 con App Router y Turbopack
- **Auth**: Auth.js v5 (next-auth@beta) con proveedor Google OAuth
- **UI**: shadcn/ui + Tailwind CSS v4 + Radix UI + Lucide React
- **Base de datos**: Neon DB (PostgreSQL serverless)
- **ORM**: Drizzle ORM
- **IA**: Gemini API via Vercel AI SDK (`ai` package)
- **Parsing CV**: `pdf-parse` (PDF) + `mammoth` (Word)
- **Pagos**: Stripe (pago único por paquete de créditos)
- **Lenguaje**: TypeScript strict
- **Deploy**: Vercel

## Comandos

```bash
npm run dev       # Servidor de desarrollo (Turbopack)
npm run build     # Build de producción
npm run typecheck # Verificar tipos sin emitir
npm run lint      # ESLint
npm run format    # Prettier sobre archivos .ts y .tsx
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Landing page (hero, cómo funciona, CTA) |
| `/analizar` | Formulario principal: sube CV + pega descripción del trabajo |
| `/resultado/[id]` | Resultado del análisis (score, fortalezas, brechas, sugerencias, preguntas) |
| `/historial` | Análisis anteriores del usuario (requiere auth) |

## Esquema de base de datos

```
users      → id, email, name, image, credits (sincronizado desde Auth.js)
analyses   → id, userId, cvText, jobDescription, matchScore,
             strengths, gaps, cvSuggestions, interviewQuestions,
             createdAt
```

## Lógica de negocio clave

- El CV nunca se almacena como archivo — se parsea en el servidor, se extrae el texto y se guarda en Neon
- Si `matchScore >= 70` → se generan preguntas de entrevista; si no, ese campo queda vacío
- El análisis puede hacerse sin cuenta; el historial requiere login
- Cada análisis consume 1 crédito; sin créditos no se puede analizar
- Los créditos se compran en paquetes (pago único via Stripe), no hay suscripción

## Estructura relevante

```
auth.ts                            # Configuración de Auth.js (handlers, signIn, signOut, auth)
db/
  schema.ts                        # Esquema Drizzle (users, analyses)
  index.ts                         # Cliente Drizzle + Neon
app/
  api/
    auth/[...nextauth]/route.ts    # Route handler de Auth.js
    analyze/route.ts               # POST: recibe CV + descripción, llama a Gemini, guarda resultado
    stripe/checkout/route.ts       # POST: crea sesión de pago en Stripe
    stripe/webhook/route.ts        # POST: recibe eventos de Stripe (futuro)
  (marketing)/
    page.tsx                       # Landing page
  analizar/
    page.tsx                       # Formulario de análisis
  resultado/[id]/
    page.tsx                       # Página de resultados
  historial/
    page.tsx                       # Historial del usuario
  precios/
    page.tsx                       # Paquetes de créditos disponibles
components/
  ui/                              # Componentes shadcn/ui
  theme-provider.tsx               # Proveedor de tema (next-themes)
lib/
  proxy.ts                         # Re-exporta auth como proxy
  utils.ts                         # Utilidades (cn)
  parse-cv.ts                      # Lógica de parsing PDF/Word
  gemini.ts                        # Cliente y prompts de Gemini
hooks/                             # Custom hooks
public/                            # Archivos estáticos
```

## Variables de entorno requeridas

```bash
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
DATABASE_URL=                        # Connection string de Neon
GOOGLE_GENERATIVE_AI_API_KEY=        # Google AI Studio (requerido por @ai-sdk/google)
STRIPE_SECRET_KEY=                   # Stripe dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Stripe dashboard → Developers → API keys
# STRIPE_WEBHOOK_SECRET=             # Plan futuro — para procesar eventos automáticamente
```

## Auth

- Archivo principal: `auth.ts` en la raíz (convención Auth.js v5)
- Redirect URI para desarrollo: `http://localhost:3000/api/auth/callback/google`
- Neon Auth NO está activado — se usa Auth.js directamente

## shadcn/ui

- Agregar componentes: `npx shadcn add <componente>`
- Los componentes se instalan en `components/ui/`
- Configuración en `components.json`

## IA / Gemini

- Modelo: `gemini-2.0-flash` via Vercel AI SDK
- **Los prompts se escriben en español** — tanto el system prompt como el user prompt
- **Las respuestas de la IA deben ser en español** — indicarlo explícitamente en el system prompt
- El system prompt debe instruir a Gemini a responder siempre en español latino, sin importar el idioma del CV o la descripción del trabajo

## Stripe

- Modelo: pago único por paquete de créditos (sin suscripción)
- Cada análisis consume 1 crédito; los créditos se guardan en `users.credits`
- Paquetes: definir en la página `/precios` (ej. 5, 20, 50 análisis) — precios en **Soles (PEN)**
- Paquetes: `npm install stripe @stripe/stripe-js`
- `STRIPE_WEBHOOK_SECRET` es plan futuro — por ahora los créditos se asignan manualmente o vía redirect tras el pago

## Notas

- `.env` está en `.gitignore` — nunca commitear credenciales
- Alias `@/` apunta a la raíz del proyecto (`CVMatch/`)
