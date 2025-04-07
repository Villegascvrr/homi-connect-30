import * as React from "react"

// Definimos los breakpoints en un objeto para mayor flexibilidad
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
 * Hook para detectar si la pantalla está en tamaño móvil
 * @param breakpoint - El breakpoint para considerar como "móvil" (default: md = 768px)
 * @returns boolean que indica si la pantalla es menor que el breakpoint
 */
export function useIsMobile(breakpoint: BreakpointKey = "md") {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      const currentWidth = window.innerWidth;
      const breakpointWidth = BREAKPOINTS[breakpoint];
      setIsMobile(currentWidth < breakpointWidth);
      console.log(`Initial mobile detection: ${currentWidth < breakpointWidth} (width: ${currentWidth}, breakpoint: ${breakpointWidth})`);
    }
    
    // Check on initial render
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook para obtener el tamaño actual de la pantalla
 * @returns El ancho y alto actuales de la ventana
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : undefined,
    height: typeof window !== 'undefined' ? window.innerHeight : undefined,
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

/**
 * Hook para detectar el breakpoint actual
 * @returns El breakpoint actual (xs, sm, md, lg, xl, 2xl)
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
