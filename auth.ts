import { randomUUID } from "crypto"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/db"
import { users } from "@/db/schema"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
    async jwt({ token, user, account }) {
      // En el evento de sign-in (cuando viene `account`) hacemos upsert
      // por email y forzamos token.sub al id real de la fila en DB.
      // Así `session.user.id` siempre coincide con `users.id`.
      if (account && user?.email) {
        const email = user.email.trim().toLowerCase()
        const [row] = await db
          .insert(users)
          .values({
            id: user.id ?? randomUUID(),
            email,
            name: user.name ?? null,
            image: user.image ?? null,
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
