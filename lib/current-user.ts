import { cache } from "react"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

// `cache` deduplica la consulta entre el layout y la página del mismo request
export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth")

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })
  if (!user) redirect("/")

  return user
})
