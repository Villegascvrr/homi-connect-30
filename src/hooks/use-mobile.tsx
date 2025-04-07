
import * as React from "react"

// Define the breakpoints in an object for greater flexibility
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

type BreakpointKey = keyof typeof BREAKPOINTS

/**
 * Hook to detect if the screen is mobile size
 * @param breakpoint - The breakpoint to consider as "mobile" (default: md = 768px)
 * @returns boolean that indicates if the screen is smaller than the breakpoint
 */
export function useIsMobile(breakpoint: BreakpointKey = "md") {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [initialized, setInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Create a memoized check function to avoid recreating it on each render
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint])
      
      // Mark as initialized after first check
      if (!initialized) {
        setInitialized(true)
      }
    }
    
    // Check on initial render
    checkIfMobile()
    
    // Add event listener for window resize with debounce
    let timeoutId: number | undefined
    
    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      
      timeoutId = window.setTimeout(() => {
        checkIfMobile()
      }, 100) // Small debounce for performance
    }
    
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [breakpoint, initialized])

  // During SSR or before initialization, make an educated guess based on user agent
  React.useEffect(() => {
    if (!initialized && typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
      
      if (mobileRegex.test(userAgent)) {
        setIsMobile(true)
      }
    }
  }, [initialized])

  return isMobile
}

/**
 * Hook to get the current window size
 * @returns The current width and height of the window
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: undefined,
    height: undefined,
  })
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      
      if (!initialized) {
        setInitialized(true)
      }
    }

    // Add event listener with debounce
    let timeoutId: number | undefined
    
    const debouncedResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      
      timeoutId = window.setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    // Call handler right away to update initial state
    handleResize()
    
    return () => {
      window.removeEventListener("resize", debouncedResize)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [initialized])

  return windowSize
}

/**
 * Hook to detect the current breakpoint
 * @returns The current breakpoint (xs, sm, md, lg, xl, 2xl)
 */
export function useBreakpoint() {
  const { width } = useWindowSize()
  const [breakpoint, setBreakpoint] = React.useState<BreakpointKey>("xs")

  React.useEffect(() => {
    if (width === undefined) return

    if (width < BREAKPOINTS.xs) {
      setBreakpoint("xs")
    } else if (width < BREAKPOINTS.sm) {
      setBreakpoint("sm")
    } else if (width < BREAKPOINTS.md) {
      setBreakpoint("md")
    } else if (width < BREAKPOINTS.lg) {
      setBreakpoint("lg")
    } else if (width < BREAKPOINTS.xl) {
      setBreakpoint("xl")
    } else {
      setBreakpoint("2xl")
    }
  }, [width])

  return breakpoint
}
