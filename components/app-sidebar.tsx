"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronsUpDown,
  CreditCard,
  History,
  LifeBuoy,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import type { Session } from "next-auth"
import { signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const workspaceNav = [
  { title: "Analizar", href: "/dashboard/analizar", icon: Sparkles },
  { title: "Historial", href: "/dashboard/historial", icon: History },
]

const accountNav = [
  { title: "Créditos", href: "/dashboard/creditos", icon: CreditCard },
  { title: "Perfil", href: "/dashboard/perfil", icon: User },
]

interface AppSidebarProps {
  session: Session | null
}

export function AppSidebar({ session }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-2.5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-1.5 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary/90 to-primary/60 text-[10px] font-bold text-primary-foreground ring-1 ring-primary/40"
          >
            CV
          </span>
          <span className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            CVMatch
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5 pt-2">
        <NavGroup
          label="Espacio de trabajo"
          items={workspaceNav}
          pathname={pathname}
        />
        <NavGroup
          label="Cuenta"
          items={accountNav}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-1.5">
        <UserWidget session={session} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
  pathname: string
}) {
  return (
    <SidebarGroup className="px-0 py-1">
      <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ title, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={active}
                tooltip={title}
                className={cn(
                  "h-8 gap-2.5 rounded-md px-2 text-[13px] font-medium text-sidebar-foreground/75",
                  "hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                  "data-active:bg-sidebar-accent data-active:text-sidebar-foreground data-active:font-medium"
                )}
              >
                <Link href={href}>
                  <Icon className="size-3.5 shrink-0" />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function UserWidget({ session }: { session: Session | null }) {
  const { isMobile } = useSidebar()

  if (!session?.user) {
    return (
      <SidebarMenuButton asChild tooltip="Iniciar sesión" className="h-8 rounded-md text-[13px]">
        <Link href="/">
          <User className="size-3.5" />
          <span>Iniciar sesión</span>
        </Link>
      </SidebarMenuButton>
    )
  }

  const initial = session.user.name?.[0]?.toUpperCase() ?? "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          tooltip={session.user.name ?? "Cuenta"}
          className="h-10 gap-2.5 rounded-md px-1.5 hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent"
        >
          <Avatar className="size-7 shrink-0">
            <AvatarImage
              src={session.user.image ?? ""}
              alt={session.user.name ?? ""}
            />
            <AvatarFallback className="bg-muted text-[10px] font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[12.5px] font-medium leading-tight">
              {session.user.name ?? "Sin nombre"}
            </span>
            <span className="truncate text-[10.5px] text-muted-foreground leading-tight">
              {session.user.email}
            </span>
          </div>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={6}
        className="w-56"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12.5px] font-medium">
              {session.user.name}
            </span>
            <span className="truncate text-[10.5px] font-normal text-muted-foreground">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/perfil">
            <Settings className="size-3.5" />
            Perfil y cuenta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/creditos">
            <CreditCard className="size-3.5" />
            Créditos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="mailto:soporte@cvmatch.app">
            <LifeBuoy className="size-3.5" />
            Soporte
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <form action={signOutAction}>
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="size-3.5" />
              Cerrar sesión
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
