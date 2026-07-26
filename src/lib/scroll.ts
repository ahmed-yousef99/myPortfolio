import Lenis from 'lenis'

let lenis: Lenis | null = null

function createLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  function raf(time: number) {
    lenis!.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
  return lenis
}

export function initLenis(): void {
  // Defer to requestIdleCallback so Lenis setup doesn't compete with
  // the critical rendering path (improves LCP by freeing main thread).
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => { createLenis() }, { timeout: 2000 })
  } else {
    // Fallback: defer with a short timeout for Safari
    setTimeout(() => { createLenis() }, 200)
  }
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (el && lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
