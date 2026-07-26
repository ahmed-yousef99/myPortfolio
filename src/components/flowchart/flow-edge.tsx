import { useRef, useEffect } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react'
import { cn } from '@/lib/utils'

interface FlowEdgeData {
  isActive: boolean
  isDimmed: boolean
  label?: string
  isTraveling?: boolean
  isStraight?: boolean
}

function FlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  id,
}: EdgeProps) {
  const { isActive = false, isDimmed = false, label, isTraveling = false, isStraight = false } = (data as FlowEdgeData | undefined) ?? {}

  const [edgePath, labelX, labelY] = isStraight
    ? getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      })
    : getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
      })

  const pathRef = useRef<SVGPathElement>(null)
  const cometRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!isTraveling || !pathRef.current || !cometRef.current || !glowRef.current) {
      return
    }

    const pathEl = pathRef.current
    const cometEl = cometRef.current
    const glowEl = glowRef.current
    const pathLength = pathEl.getTotalLength()

    const duration = 800 // 800ms animation duration

    let animationFrameId: number

    const tick = () => {
      const now = performance.now()
      
      // Fallback start time if not set yet globally
      if (!(window as any).cometStartTime) {
        ;(window as any).cometStartTime = now
      }

      const elapsed = now - ((window as any).cometStartTime || now)
      const progress = Math.min(elapsed / duration, 1)

      // Easing: standard linear for smooth path movement
      const currentLength = progress * pathLength
      const point = pathEl.getPointAtLength(currentLength)

      cometEl.setAttribute('cx', point.x.toString())
      cometEl.setAttribute('cy', point.y.toString())
      glowEl.setAttribute('cx', point.x.toString())
      glowEl.setAttribute('cy', point.y.toString())

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick)
      }
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isTraveling, edgePath])

  return (
    <>
      {/* Invisible path for length calculations */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke="transparent"
        className="pointer-events-none"
        style={{ visibility: 'hidden' }}
      />

      {/* Traveling light overlay (Single Comet-Like Pulse with Fused Glow) */}
      {isTraveling && (
        <>
          {/* Fused Glow Layer */}
          <circle
            ref={glowRef}
            r={12}
            fill="#5e6ad2"
            opacity={0.35}
            style={{ filter: 'blur(3px)' }}
            className="pointer-events-none"
          />
          {/* Bright Core Head */}
          <circle
            ref={cometRef}
            r={4.5}
            fill="#5e6ad2"
            opacity={1}
            style={{
              filter: 'drop-shadow(0px 0px 4px rgba(94, 106, 210, 0.85))',
            }}
            className="pointer-events-none"
          />
        </>
      )}

      {/* Very subtle glow behind active edges */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="#5e6ad2"
          strokeWidth={5}
          opacity={0.07}
          className="pointer-events-none"
        />
      )}

      {/* Main edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isActive ? '#5e6ad2' : '#34343a',
          strokeWidth: isActive ? 2 : 1.5,
          opacity: isDimmed ? 0.35 : 1,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease',
        }}
      />

      {/* Animated dash overlay — only on active hover paths */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="#5e6ad2"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.35}
          className="flow-edge-dash pointer-events-none"
        />
      )}

      {/* Edge label (YES / NO) */}
      {label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'absolute font-mono text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm pointer-events-none select-none transition-colors duration-300',
              isActive ? 'text-accent' : 'text-ink-subtle'
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'var(--color-canvas)',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export { FlowEdge }
export type { FlowEdgeData }
