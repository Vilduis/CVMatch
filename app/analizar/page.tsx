import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import AnalizarForm from "./form"
import { FREE_COOKIE, FREE_MAX } from "@/app/api/analyze/route"

export default async function AnalizarPage() {
  const session = await auth()
  const cookieStore = await cookies()
  const freeCount = parseInt(cookieStore.get(FREE_COOKIE)?.value ?? "0", 10)
  const freeRemaining = Math.max(0, FREE_MAX - freeCount)

  let credits: number | null = null
  if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: { credits: true },
    })
    credits = user?.credits ?? 0
  }

  return <AnalizarForm credits={credits} freeRemaining={freeRemaining} />
}
