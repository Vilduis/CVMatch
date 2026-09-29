"use server"

import { sql } from "drizzle-orm"
import { cookies } from "next/headers"
import {
  AUTH_INTENT_COOKIE,
  type AuthIntent,
  auth,
  signIn,
  signOut,
} from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

// El callback `signIn` de auth.ts lee esta cookie para saber si debe exigir una cuenta existente
async function signInWithGoogle(intent: AuthIntent) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_INTENT_COOKIE, intent, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  })
  await signIn("google", { redirectTo: "/dashboard/analizar" })
}

export async function loginWithGoogle() {
  await signInWithGoogle("login")
}

export async function registerWithGoogle() {
  await signInWithGoogle("register")
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

export async function deleteAccountAction() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("No autenticado")
  }
  const email = session.user.email.trim().toLowerCase()
  const deleted = await db
    .delete(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .returning({ id: users.id })

  if (deleted.length === 0) {
    throw new Error(
      `No se encontró tu cuenta en la base de datos (email: ${email}).`
    )
  }
  await signOut({ redirectTo: "/" })
}
