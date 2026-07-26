import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface BentoCardRegistration {
  id: string
  element: HTMLDivElement
  spotlightElement: HTMLDivElement | null
  borderSpotlightElement: HTMLDivElement | null
  enableSpotlight: boolean
  enableBorderGlow: boolean
}

interface MagicBentoContextType {
  registerCard: (card: BentoCardRegistration) => void
  unregisterCard: (id: string) => void
}

const MagicBentoContext = createContext<MagicBentoContextType | null>(null)

interface MagicBentoGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightRadius?: number
  glowColor?: string
}

export function MagicBentoGroup({
  spotlightRadius = 550,
  glowColor = "94, 106, 210",
  className,
  children,
  ...props
}: MagicBentoGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Map<string, BentoCardRegistration>>(new Map())
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)

    setIsTouch(window.matchMedia('(pointer: coarse)').matches)

    return () => {
      mediaQuery.removeEventListener('change', listener)
      // Clean up all GSAP animations inside the group on unmount
      cardsRef.current.forEach((card) => {
        if (card.spotlightElement) gsap.killTweensOf(card.spotlightElement)
        if (card.borderSpotlightElement) gsap.killTweensOf(card.borderSpotlightElement)
      })
    }
  }, [])

  const registerCard = (card: BentoCardRegistration) => {
    cardsRef.current.set(card.id, card)
  }

  const unregisterCard = (id: string) => {
    const card = cardsRef.current.get(id)
    if (card) {
      if (card.spotlightElement) gsap.killTweensOf(card.spotlightElement)
      if (card.borderSpotlightElement) gsap.killTweensOf(card.borderSpotlightElement)
    }
    cardsRef.current.delete(id)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isTouch) return
    const halfSize = spotlightRadius

    cardsRef.current.forEach((card) => {
      if (!card.element) return
      const rect = card.element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (card.enableSpotlight && card.spotlightElement) {
        gsap.to(card.spotlightElement, {
          x: x - halfSize,
          y: y - halfSize,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }

      if (card.enableBorderGlow && card.borderSpotlightElement) {
        gsap.to(card.borderSpotlightElement, {
          x: x - halfSize,
          y: y - halfSize,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    })
  }

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isTouch) return
    const halfSize = spotlightRadius

    cardsRef.current.forEach((card) => {
      if (!card.element) return
      const rect = card.element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (card.enableSpotlight && card.spotlightElement) {
        gsap.set(card.spotlightElement, { x: x - halfSize, y: y - halfSize })
        gsap.to(card.spotlightElement, {
          opacity: 0.57,
          duration: 0.3,
          overwrite: 'auto'
        })
      }

      if (card.enableBorderGlow && card.borderSpotlightElement) {
        gsap.set(card.borderSpotlightElement, { x: x - halfSize, y: y - halfSize })
        gsap.to(card.borderSpotlightElement, {
          opacity: 0.50,
          duration: 0.3,
          overwrite: 'auto'
        })
      }
    })
  }

  const onMouseLeave = () => {
    if (prefersReducedMotion || isTouch) return

    cardsRef.current.forEach((card) => {
      if (card.enableSpotlight && card.spotlightElement) {
        gsap.to(card.spotlightElement, {
          opacity: 0,
          duration: 0.3,
          overwrite: 'auto'
        })
      }
      if (card.enableBorderGlow && card.borderSpotlightElement) {
        gsap.to(card.borderSpotlightElement, {
          opacity: 0,
          duration: 0.3,
          overwrite: 'auto'
        })
      }
    })
  }

  return (
    <MagicBentoContext.Provider value={{ registerCard, unregisterCard }}>
      <div
        ref={groupRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    </MagicBentoContext.Provider>
  )
}

interface MagicBentoProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode
  enableSpotlight?: boolean
  enableBorderGlow?: boolean
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  spotlightRadius?: number
  glowColor?: string
  innerClassName?: string
}

export function MagicBento({
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 550,
  glowColor = "94, 106, 210",
  className,
  innerClassName,
  children,
  ...props
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const borderSpotlightRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const context = useContext(MagicBentoContext)
  const cardId = useRef(Math.random().toString(36).substring(2, 9))

  const size = spotlightRadius * 2
  const halfSize = spotlightRadius

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)

    setIsTouch(window.matchMedia('(pointer: coarse)').matches)

    return () => {
      mediaQuery.removeEventListener('change', listener)
      // Clean up self active animations
      if (spotlightRef.current) gsap.killTweensOf(spotlightRef.current)
      if (borderSpotlightRef.current) gsap.killTweensOf(borderSpotlightRef.current)
    }
  }, [])

  // Register card to the parent MagicBentoGroup if it exists
  useEffect(() => {
    if (context && containerRef.current) {
      context.registerCard({
        id: cardId.current,
        element: containerRef.current,
        spotlightElement: spotlightRef.current,
        borderSpotlightElement: borderSpotlightRef.current,
        enableSpotlight,
        enableBorderGlow
      })
      return () => {
        context.unregisterCard(cardId.current)
      }
    }
  }, [context, enableSpotlight, enableBorderGlow])

  // Standalone event handlers (only active if no MagicBentoGroup context is found)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (context || prefersReducedMotion || isTouch) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (enableSpotlight && spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: x - halfSize,
        y: y - halfSize,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
    if (enableBorderGlow && borderSpotlightRef.current) {
      gsap.to(borderSpotlightRef.current, {
        x: x - halfSize,
        y: y - halfSize,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (context || prefersReducedMotion || isTouch) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (enableSpotlight && spotlightRef.current) {
      gsap.set(spotlightRef.current, { x: x - halfSize, y: y - halfSize })
      gsap.to(spotlightRef.current, { opacity: 0.57, duration: 0.3, overwrite: 'auto' })
    }
    if (enableBorderGlow && borderSpotlightRef.current) {
      gsap.set(borderSpotlightRef.current, { x: x - halfSize, y: y - halfSize })
      gsap.to(borderSpotlightRef.current, { opacity: 0.50, duration: 0.3, overwrite: 'auto' })
    }
  }

  const handleMouseLeave = () => {
    if (context || prefersReducedMotion || isTouch) return
    if (enableSpotlight && spotlightRef.current) {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, overwrite: 'auto' })
    }
    if (enableBorderGlow && borderSpotlightRef.current) {
      gsap.to(borderSpotlightRef.current, { opacity: 0, duration: 0.3, overwrite: 'auto' })
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickEffect || prefersReducedMotion) return
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = document.createElement('div')
    ripple.className = 'absolute pointer-events-none rounded-full bg-accent/20 z-20'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.width = '4px'
    ripple.style.height = '4px'
    ripple.style.transform = 'translate(-50%, -50%)'
    container.appendChild(ripple)

    gsap.to(ripple, {
      width: 80,
      height: 80,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple)
        }
      }
    })

    for (let i = 0; i < 6; i++) {
      const spark = document.createElement('div')
      spark.className = 'absolute pointer-events-none rounded-full z-20 w-[3px] h-[3px]'
      spark.style.left = `${x}px`
      spark.style.top = `${y}px`
      spark.style.backgroundColor = `rgba(${glowColor}, 0.6)`
      container.appendChild(spark)

      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4
      const distance = 20 + Math.random() * 15
      const px = Math.cos(angle) * distance
      const py = Math.sin(angle) * distance

      gsap.to(spark, {
        x: px,
        y: py,
        opacity: 0,
        scale: 0.1,
        duration: 0.5,
        ease: 'power1.out',
        onComplete: () => {
          if (spark.parentNode) {
            spark.parentNode.removeChild(spark)
          }
        }
      })
    }
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className={cn(
        "group relative rounded-xl p-[1px] overflow-hidden bg-hairline transition-colors duration-300",
        "hover:bg-hairline-strong",
        className
      )}
      {...props}
    >
      {/* Border Spotlight Glow */}
      {enableBorderGlow && !prefersReducedMotion && (
        <div
          ref={borderSpotlightRef}
          className="absolute rounded-full opacity-0 pointer-events-none z-0"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: 0,
            top: 0,
            background: `radial-gradient(${halfSize}px circle at center, rgba(${glowColor}, 0.18) 0%, rgba(${glowColor}, 0.09) 50%, rgba(${glowColor}, 0.025) 80%, transparent 100%)`
          }}
        />
      )}

      {/* Inner Content Container */}
      <div className={cn("relative z-10 w-full h-full rounded-[inherit] bg-surface-1 overflow-hidden", innerClassName)}>
        {/* Background Spotlight Glow */}
        {enableSpotlight && !prefersReducedMotion && (
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute rounded-full z-0 opacity-0"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: 0,
              top: 0,
              background: `radial-gradient(${halfSize}px circle at center, rgba(${glowColor}, 0.16) 0%, rgba(${glowColor}, 0.08) 50%, rgba(${glowColor}, 0.025) 80%, transparent 100%)`
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-[2] w-full h-full">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function MagicBentoCard(props: MagicBentoProps) {
  return <MagicBento {...props} />
}
