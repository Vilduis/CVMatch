import { randomUUID } from "crypto"
import { sql } from "drizzle-orm"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { cookies } from "next/headers"
import { db } from "@/db"
import { users } from "@/db/schema"
import { SIGNUP_CREDITS } from "@/lib/credits"

export const AUTH_INTENT_COOKIE = "cvmatch_auth_intent"
export type AuthIntent = "login" | "register"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    // Desde el tab "Iniciar sesión" solo se permite entrar si la cuenta ya existe.
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true

      const cookieStore = await cookies()
      const intent = cookieStore.get(AUTH_INTENT_COOKIE)?.value
      cookieStore.delete(AUTH_INTENT_COOKIE)
      if (intent !== "login") return true

      const email = user.email.trim().toLowerCase()
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${email}`)
        .limit(1)

      return existing ? true : "/auth?tab=registro&error=no-account"
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
    async jwt({ token, user, account }) {
      // Upsert por email para que `session.user.id` siempre coincida con `users.id`
      if (account && user?.email) {
        const email = user.email.trim().toLowerCase()
        const [row] = await db
          .insert(users)
          .values({
            id: user.id ?? randomUUID(),
            email,
            name: user.name ?? null,
            image: user.image ?? null,
            // Solo aplica al crear la fila; un usuario existente conserva su saldo
            credits: SIGNUP_CREDITS,
          })
          .onConflictDoUpdate({
            target: users.email,
            set: {
              name: user.name ?? null,
              image: user.image ?? null,
            },
          })
          .returning({ id: users.id })

        if (row) token.sub = row.id
      }
      return token
    },
  },
})
