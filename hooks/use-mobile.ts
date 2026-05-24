import * as React from "react"

const MOBILE_BREAKPOINT = 768

function getIsMobile() {
  if (typeof window === "undefined") return false
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function useIsMobile() {
  const isMobile = React.useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      mql.addEventListener("change", notify)
      return () => mql.removeEventListener("change", notify)
    },
    getIsMobile,
    () => false,
  )

  return isMobile
}
