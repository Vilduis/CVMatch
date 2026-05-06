export const PLANS = {
  basico: {
    id: "basico",
    nombre: "Básico",
    credits: 10,
    precio: "14.90",
    amount: 1490, // centavos PEN
    descripcion: "Ideal para probar la plataforma.",
    popular: false,
  },
  popular: {
    id: "popular",
    nombre: "Popular",
    credits: 30,
    precio: "34.90",
    amount: 3490,
    descripcion: "El favorito de quienes están en búsqueda activa.",
    popular: true,
  },
  pro: {
    id: "pro",
    nombre: "Pro",
    credits: 80,
    precio: "74.90",
    amount: 7490,
    descripcion: "Para profesionales que aplican a múltiples puestos.",
    popular: false,
  },
} as const

export type PlanId = keyof typeof PLANS
export const plansList = Object.values(PLANS)
