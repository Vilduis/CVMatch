import AuthTabs, { type AuthTab } from "@/components/auth/auth-tabs"

export const metadata = { title: "Acceder — CVMatch" }

// `no-account` lo pone el callback signIn de auth.ts; el resto son códigos de Auth.js
function resolveError(
  error?: string
): { tab: AuthTab; message: string } | null {
  if (!error) return null
  if (error === "no-account") {
    return {
      tab: "registro",
      message:
        "No encontramos una cuenta con ese correo de Google. Créala aquí en un clic.",
    }
  }
  if (error === "AccessDenied") {
    return {
      tab: "login",
      message: "No se pudo completar el acceso con esa cuenta de Google.",
    }
  }
  if (error === "Configuration") {
    return {
      tab: "login",
      message: "Hubo un problema en el servidor. Inténtalo en unos minutos.",
    }
  }
  return {
    tab: "login",
    message: "No pudimos iniciar sesión. Inténtalo de nuevo.",
  }
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>
}) {
  const { tab, error } = await searchParams
  const resolvedError = resolveError(error)
  const defaultTab: AuthTab =
    resolvedError?.tab ?? (tab === "registro" ? "registro" : "login")

  return <AuthTabs defaultTab={defaultTab} error={resolvedError} />
}
