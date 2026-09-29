import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { PageTransition } from "@/components/page-transition"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/current-user"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const { credits } = await getCurrentUser()

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
