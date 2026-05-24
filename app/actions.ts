"use server"

import { sql } from "drizzle-orm"
import { auth, signIn, signOut } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard/analizar" })
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
