import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { PageTransition } from "@/components/page-transition"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

async function getUserCredits(email: string): Promise<number> {
  const [row] = await db
    .select({ credits: users.credits })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
  return row?.credits ?? 0
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/")

  const credits = session.user.email
    ? await getUserCredits(session.user.email)
    : 0

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset className="bg-background">
        <DashboardTopbar credits={credits} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
