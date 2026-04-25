import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import AnalizarForm from "./form"

const FREE_COOKIE = "cvmatch_free_used"

export default async function AnalizarPage() {
  const session = await auth()
  const cookieStore = await cookies()
  const freeUsed = !!cookieStore.get(FREE_COOKIE)

  let credits: number | null = null
  if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: { credits: true },
    })
    credits = user?.credits ?? 0
  }

  return <AnalizarForm credits={credits} freeUsed={freeUsed} />
}
