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
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return
      const id = user.id ?? randomUUID()
      await db
        .insert(users)
        .values({
          id,
          email: user.email,
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
    },
  },
})
