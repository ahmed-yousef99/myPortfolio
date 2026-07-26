import { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Cubie } from './rendering/cubie'
import { Lighting } from './rendering/lighting'
import { PostProcessing } from './rendering/post-processing'
import { assertUniqueLogos, disposeLogoTextures } from './rendering/logo-textures'
import {
  initCubies,
  getCubiesInFace,
  finalizeMove,
  MOVES,
  type CubieState,
  type ActiveMove,
} from './systems/rubiks-engine'
import {
  createMoveQueue,
  tickMoveQueue,
  type MoveQueue,
} from './systems/move-queue'
import {
  createAnimFSM,
  tickFSM,
  isIdling,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  type AnimFSM,
} from './systems/animation-state'
import {
  applyArcballDelta,
  easeInOut,
  noiseFloat,
  noiseDrift,
  cameraDrift,
} from './utils/math'
import { detectQuality, getQualityConfig, type QualityPreset } from './utils/performance'

// ─── Props ────────────────────────────────────────────────────────────────────

interface PremiumRubiksCubeProps {
  quality?: QualityPreset
}

// ─── Arcball Projection Helper ────────────────────────────────────────────────
// Pre-allocated to avoid object creation on every pointermove (INP fix)
const _arcballVec = new THREE.Vector3()

function getArcballVector(x: number, y: number, width: number, height: number): THREE.Vector3 {
  const r = Math.min(width, height) / 2
  const cx = width / 2
  const cy = height / 2

  const dx = (x - cx) / r
  const dy = (cy - y) / r // Invert Y so up is positive in world space

  _arcballVec.set(dx, dy, 0)
  const distSq = dx * dx + dy * dy
  if (distSq <= 1.0) {
    _arcballVec.z = Math.sqrt(1.0 - distSq)
  } else {
    _arcballVec.z = 0
    _arcballVec.normalize() // project to the boundary edge of the sphere (z = 0)
  }
  return _arcballVec
}

// ─── Pre-allocated THREE objects for useFrame (INP fix) ──────────────────────
// Allocating these once at module level avoids GC churn in the 60fps render loop.
const _idleAxis = new THREE.Vector3(0.15, 1, 0.05).normalize()
const _idleDelta = new THREE.Quaternion()
const _userDelta = new THREE.Quaternion()
const _blendedDelta = new THREE.Quaternion()
const _dragCrossVec = new THREE.Vector3()
const _dragQuat = new THREE.Quaternion()
const _pCurr = new THREE.Vector3()
const _cameraPos = new THREE.Vector3()

// ─── Component ────────────────────────────────────────────────────────────────

export function PremiumRubiksCube({ quality: qualityProp }: PremiumRubiksCubeProps) {
  // Quality config
  const quality = useMemo(() => {
    const preset = qualityProp ?? detectQuality()
    return getQualityConfig(preset)
  }, [qualityProp])

  // ── Core state refs (never trigger re-renders) ────────────────────────────
  const cubiesRef = useRef<CubieState[]>(initCubies())
  const activeMoveRef = useRef<ActiveMove | null>(null)
  const moveQueueRef = useRef<MoveQueue>(createMoveQueue(1.2, 2.4))
  const fsmRef = useRef<AnimFSM>(createAnimFSM(2.5))

  // Re-initialize cubies on every mount so HMR hot-reloads
  // never leave stale logo assignments from a previous engine version.
  // Also runs the dev-mode duplicate check.
  useEffect(() => {
    cubiesRef.current = initCubies()
    assertUniqueLogos(cubiesRef.current.map(c => Array.from(c.logoIndices)))
    return () => { disposeLogoTextures() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Outer group rotation (idle + drag)
  const outerGroupRef = useRef<THREE.Group>(null!)
  const outerQuatRef = useRef(new THREE.Quaternion())

  // Drag tracking
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const angularVelocityRef = useRef(new THREE.Vector3())
  const blendWeightRef = useRef(1.0) // 1.0 = pure idle, 0.0 = pure drag/inertia
  const quatStartRef = useRef(new THREE.Quaternion())
  // Pre-allocated to avoid per-event object creation (INP fix)
  const pointerStart3D = useRef(new THREE.Vector3())
  const canvasRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)

  // Per-frame active face quaternion (for cubies in the current move)
  const faceMoveQuatRef = useRef(new THREE.Quaternion())

  // Force re-render when moves complete (so cubies render at new positions)
  const [renderTick, setRenderTick] = useState(0)

  const { gl } = useThree()

  // ── Pointer events on canvas ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement

    const handleDown = (e: PointerEvent) => {
      e.preventDefault()
      const fsm = fsmRef.current
      onPointerDown(fsm, e.timeStamp / 1000)

      // Cache rect on pointerdown only — not on every pointermove (INP fix)
      const rect = canvas.getBoundingClientRect()
      canvasRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }

      const rx = e.clientX - rect.left
      const ry = e.clientY - rect.top

      // Copy into our pre-allocated ref vector (avoids new THREE.Vector3)
      const v = getArcballVector(rx, ry, rect.width, rect.height)
      pointerStart3D.current.copy(v)
      quatStartRef.current.copy(outerQuatRef.current)

      pointerDownRef.current = { x: e.clientX, y: e.clientY }
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      angularVelocityRef.current.set(0, 0, 0)
      blendWeightRef.current = 0.0 // reset blend weight immediately on user grab
      canvas.setPointerCapture(e.pointerId)
    }

    const handleMove = (e: PointerEvent) => {
      const fsm = fsmRef.current
      if (fsm.state !== 'Grab' && fsm.state !== 'Dragging') return

      const prev = lastPointerRef.current
      if (!prev) return

      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      const hasDelta = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5
      onPointerMove(fsm, e.timeStamp / 1000, hasDelta)

      if (hasDelta) {
        const rect = canvasRectRef.current
        if (rect) {
          const rx = e.clientX - rect.left
          const ry = e.clientY - rect.top

          // getArcballVector writes into _arcballVec (pre-allocated, no new object)
          const pCurrRaw = getArcballVector(rx, ry, rect.width, rect.height)
          // Copy into our local pre-allocated vector so we can use pStart safely
          _pCurr.copy(pCurrRaw)
          const pStart = pointerStart3D.current

          // Compute rotation between absolute pointer down vector and current position
          const dot = Math.max(-1.0, Math.min(1.0, pStart.dot(_pCurr)))
          const angle = Math.acos(dot)
          if (angle > 0.001) {
            // Use pre-allocated _dragCrossVec (INP fix: no `new THREE.Vector3()`)
            _dragCrossVec.crossVectors(pStart, _pCurr)
            const len = _dragCrossVec.length()
            // Numerical stability guard: skip if vectors are collinear
            if (len > 0.0001) {
              _dragCrossVec.divideScalar(len) // safe normalization
              // Use pre-allocated _dragQuat (INP fix: no `new THREE.Quaternion()`)
              _dragQuat.setFromAxisAngle(_dragCrossVec, angle * 1.8)
              outerQuatRef.current.copy(quatStartRef.current).premultiply(_dragQuat)
            }
          }
        }

        // Store instantaneous pointer delta for releasing inertia
        angularVelocityRef.current.set(dx, dy, 0)
      }

      lastPointerRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleUp = (e: PointerEvent) => {
      const fsm = fsmRef.current
      const speed = angularVelocityRef.current.length()
      onPointerUp(fsm, e.timeStamp / 1000, speed)
      pointerDownRef.current = null
      lastPointerRef.current = null
    }

    const handleEnter = () => onPointerEnter(fsmRef.current)
    const handleLeave = () => onPointerLeave(fsmRef.current)

    canvas.addEventListener('pointerdown', handleDown)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerup', handleUp)
    canvas.addEventListener('pointercancel', handleUp) // Reset state on pointer cancel
    canvas.addEventListener('pointerenter', handleEnter)
    canvas.addEventListener('pointerleave', handleLeave)

    return () => {
      canvas.removeEventListener('pointerdown', handleDown)
      canvas.removeEventListener('pointermove', handleMove)
      canvas.removeEventListener('pointerup', handleUp)
      canvas.removeEventListener('pointercancel', handleUp)
      canvas.removeEventListener('pointerenter', handleEnter)
      canvas.removeEventListener('pointerleave', handleLeave)
    }
  }, [gl])

  // ── Main animation loop ───────────────────────────────────────────────────
  useFrame((state, delta) => {
    const fsm = fsmRef.current
    const now = state.clock.elapsedTime

    // Clamp delta to avoid huge jumps after tab visibility changes
    const dt = Math.min(delta, 0.05)

    // 1. FSM tick
    tickFSM(fsm, dt, now)

    // 2. Face rotation animation
    if (activeMoveRef.current !== null) {
      const move = activeMoveRef.current
      move.elapsed += dt
      const progress = Math.min(move.elapsed / move.duration, 1)
      const easedAngle = move.def.targetAngle * easeInOut(progress)

      // Update the face quaternion for display
      faceMoveQuatRef.current.setFromAxisAngle(move.def.axis, easedAngle)

      if (progress >= 1) {
        // Finalize — bake transform into cubie states
        finalizeMove(cubiesRef.current, move)
        activeMoveRef.current = null
        faceMoveQuatRef.current.identity()
        // Force a re-render so cubie positions update from new logicalPos
        setRenderTick(t => t + 1)
      }
    }

    // 3. Move queue — only fire when idling and no active move
    if (isIdling(fsm) && activeMoveRef.current === null) {
      const nextMove = tickMoveQueue(moveQueueRef.current, dt)
      if (nextMove) {
        const def = MOVES[nextMove]
        const cubieIds = getCubiesInFace(cubiesRef.current, def)
        activeMoveRef.current = {
          def,
          cubieIds,
          elapsed: 0,
          duration: quality.maxFaceAnimDuration,
        }
      }
    }

    // Pause queue while user is in control
    moveQueueRef.current.enabled = isIdling(fsm)

    // 4. Outer group: auto-rotation, inertia, and smooth transition blend
    // All quaternion/vector ops use pre-allocated objects (INP fix)
    if (isIdling(fsm)) {
      const idleSpeed = 0.045 // slow, luxury auto-rotation
      _idleDelta.setFromAxisAngle(_idleAxis, idleSpeed * dt)
      outerQuatRef.current.multiply(_idleDelta)
      blendWeightRef.current = 1.0
    } else if (fsm.state === 'Inertia') {
      // 5. Inertia — continue trackball rotation and gradually blend back into idle auto-rotation
      const vel = angularVelocityRef.current
      const damping = Math.pow(0.97, dt * 60)
      vel.multiplyScalar(damping)

      // User's active decaying trackball rotation (re-uses pre-allocated _userDelta)
      applyArcballDelta(_userDelta, vel.x, vel.y, 0.003)

      // Ideal idle rotation target (re-uses pre-allocated _idleDelta)
      const idleSpeed = 0.045
      _idleDelta.setFromAxisAngle(_idleAxis, idleSpeed * dt)

      // Gradually ease from inertia (0) to idle (1) over ~1.5 seconds
      blendWeightRef.current = Math.min(1.0, blendWeightRef.current + dt / 1.5)

      // Slerp user trackball rotation to idle rotation (re-uses pre-allocated _blendedDelta)
      _blendedDelta.copy(_userDelta).slerp(_idleDelta, blendWeightRef.current)
      outerQuatRef.current.multiply(_blendedDelta)

      // Once the blend is completely finished, return to Idle state
      if (blendWeightRef.current >= 1.0) {
        fsm.state = 'Idle'
      }
    } else if (fsm.state === 'Grab' || fsm.state === 'Dragging') {
      blendWeightRef.current = 0.0
    }

    // 5.5 Drag velocity decay (if pointer pauses before release, reduce stored velocity)
    if (fsm.state === 'Grab' || fsm.state === 'Dragging') {
      angularVelocityRef.current.multiplyScalar(Math.pow(0.75, dt * 60))
    }

    // 6. Apply outer rotation to group
    if (outerGroupRef.current) {
      outerGroupRef.current.quaternion.copy(outerQuatRef.current)

      // Organic floating (Perlin-based)
      const floatY = noiseFloat(now, 0.1)
      const floatX = noiseDrift(now, 0.035)
      outerGroupRef.current.position.set(floatX, floatY, 0)
    }

    // 7. Cinematic camera drift (Perlin-based) — uses pre-allocated _cameraPos
    const drift = cameraDrift(now, 0.12)
    _cameraPos.set(drift.x, drift.y, 6)
    state.camera.position.copy(_cameraPos)
    state.camera.lookAt(0, 0, 0)
  })

  // renderTick forces a React update on move completion to sync physical positions
  void renderTick

  return (
    <>
      <Lighting quality={quality} />

      <group ref={outerGroupRef} scale={0.8}>
        {cubiesRef.current.map(cubie => (
          <Cubie
            key={cubie.id}
            state={cubie}
            quality={quality}
            activeMoveRef={activeMoveRef}
            faceMoveQuatRef={faceMoveQuatRef}
          />
        ))}
      </group>

      <PostProcessing quality={quality} />
    </>
  )
}

