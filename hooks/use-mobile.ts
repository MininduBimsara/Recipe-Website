import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * React hook to listen to browser screen sizes and determine
 * whether the current rendering landscape matches mobile footprints (less than 768px).
 * 
 * @returns Boolean representing if screen width is under mobile breakpoint width.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
