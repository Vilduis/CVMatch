export const PLANS = {
  basico: {
    id: "basico",
    nombre: "Básico",
    credits: 5,
    precio: "9.90",
    amount: 990, // centavos PEN
    descripcion: "Ideal para probar la plataforma.",
    popular: false,
  },
  popular: {
    id: "popular",
    nombre: "Popular",
    credits: 20,
    precio: "29.90",
    amount: 2990,
    descripcion: "El favorito de quienes están en búsqueda activa.",
    popular: true,
  },
  pro: {
    id: "pro",
    nombre: "Pro",
    credits: 50,
    precio: "59.90",
    amount: 5990,
    descripcion: "Para profesionales que aplican a múltiples puestos.",
    popular: false,
  },
} as const

export type PlanId = keyof typeof PLANS
export const plansList = Object.values(PLANS)
