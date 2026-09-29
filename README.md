# CVMatch AI

Plataforma web que analiza la compatibilidad entre un CV y una oferta de trabajo usando inteligencia artificial. El usuario sube su CV (PDF o Word), pega la descripción del puesto y recibe en segundos: puntaje de match, fortalezas, brechas, sugerencias concretas para mejorar su CV y, si el match es ≥ 70%, las preguntas probables de entrevista.

## Modelo de negocio

Pago único por paquete de créditos (sin suscripción). Cada análisis consume 1 crédito y requiere cuenta. Cada cuenta nueva recibe 5 créditos gratis al registrarse. Los créditos se compran en paquetes con precios en Soles (PEN) vía Stripe.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 App Router + Turbopack |
| Auth | Auth.js v5 (next-auth@beta) + Google OAuth |
| DB | Drizzle ORM + Neon PostgreSQL (serverless) |
| UI | Tailwind CSS v4 + shadcn/ui + Radix UI + Lucide React |
| IA | Gemini 2.0 Flash via Vercel AI SDK (`ai` + `@ai-sdk/google`) |
| Parsing CV | `pdf-parse` (PDF) + `mammoth` (Word/DOCX) |
| Pagos | Stripe (pago único) |
| Deploy | Vercel |
| Lenguaje | TypeScript strict |

## Comandos

```bash
pnpm install    # Instalar dependencias
pnpm dev        # Servidor de desarrollo (Turbopack)
pnpm build      # Build de producción
pnpm typecheck  # Verificar tipos sin emitir
pnpm lint       # ESLint
pnpm format     # Prettier sobre archivos .ts y .tsx
```

## Variables de entorno requeridas

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
DATABASE_URL=
GOOGLE_GENERATIVE_AI_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
