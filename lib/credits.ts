import { and, eq, gt, sql } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const SIGNUP_CREDITS = 5

// Atómico: dos peticiones simultáneas con 1 crédito no pueden pasar ambas
export async function reserveCredit(userId: string) {
  const [row] = await db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(and(eq(users.id, userId), gt(users.credits, 0)))
    .returning({ id: users.id })
  return Boolean(row)
}

export async function refundCredit(userId: string) {
  await db
    .update(users)
    .set({ credits: sql`${users.credits} + 1` })
    .where(eq(users.id, userId))
}
