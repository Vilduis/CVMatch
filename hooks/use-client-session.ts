"use client"

import { useEffect, useState } from "react"
import type { Session } from "next-auth"

// Las páginas públicas son estáticas; la sesión se resuelve en el cliente
export function useClientSession() {
  const [state, setState] = useState<{
    loading: boolean
    session: Session | null
  }>({ loading: true, session: null })

  useEffect(() => {
    let active = true
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((session: Session | null) => {
        if (active) {
          setState({ loading: false, session: session?.user ? session : null })
        }
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
