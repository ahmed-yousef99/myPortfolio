import * as THREE from 'three'

// ─── Easing ───────────────────────────────────────────────────────────────────

export function easeInOut(t: number): number {
  // Quintic smootherstep easing for luxurious, ultra-soft acceleration and deceleration
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function easeIn(t: number): number {
  return t * t * t
}

// ─── Lerp Helpers ─────────────────────────────────────────────────────────────

/** Frame-rate independent exponential lerp (damped). */
export function lerpDamped(current: number, target: number, lambda: number, delta: number): number {
  return target + (current - target) * Math.exp(-lambda * delta)
}

export function lerpVector3(out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  out.lerpVectors(a, b, t)
  return out
}

// ─── Quaternion Helpers ───────────────────────────────────────────────────────

const _v = new THREE.Vector3()

// ─── Pre-allocated objects for applyArcballDelta (INP fix) ───────────────────
// These are hot-path allocations called on every pointermove event.
// Using module-level pre-allocated objects eliminates GC pressure.
const _arcballAxis = new THREE.Vector3()
const _arcballDeltaQuat = new THREE.Quaternion()

/**
 * Physically correct trackball rotation.
 * Computes a single rotation axis perpendicular to the screen-space drag vector,
 * with an angle proportional to the drag distance. This produces the natural
 * "globe rotation" feel where dragging right always spins the cube right,
 * regardless of the cube's current orientation.
 *
 * Uses pre-allocated objects to avoid GC churn on every pointermove (INP fix).
 */
export function applyArcballDelta(
  quat: THREE.Quaternion,
  dx: number,
  dy: number,
  sensitivity: number = 0.005
): THREE.Quaternion {
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 0.1) return quat

  // Screen-space drag → rotation axis is perpendicular in world space
  // Dragging right (dx>0) should rotate around Y axis (positive)
  // Dragging down (dy>0) should rotate around X axis (positive)
  _arcballAxis.set(dy, dx, 0).normalize()
  const angle = dist * sensitivity

  // Re-use pre-allocated quaternion (no `new THREE.Quaternion()`)
  _arcballDeltaQuat.setFromAxisAngle(_arcballAxis, angle)
  // Premultiply: apply rotation in world/camera space (not local)
  return _arcballDeltaQuat.multiply(quat)
}

/** Smooth slerp toward target, framerate-independent. */
export function slerpDamped(
  current: THREE.Quaternion,
  target: THREE.Quaternion,
  lambda: number,
  delta: number
): THREE.Quaternion {
  const t = 1 - Math.exp(-lambda * delta)
  return current.slerp(target, t)
}

// ─── Improved Perlin Noise ────────────────────────────────────────────────────
// Classic Ken Perlin improved noise — deterministic, smooth, no external deps.

const _perm = new Uint8Array(512)
const _GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  [1, 1, 0], [-1, 1, 0], [0, -1, 1], [0, -1, -1],
]

// Seeded permutation table (deterministic — same every session)
;(function initPerm() {
  const p = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,
    140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
    247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,
    57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
    74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,
    60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,
    65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,
    200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,
    52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
    207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,
    119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
    129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,
    218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,
    81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,
    184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,
    222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180,
  ]
  for (let i = 0; i < 256; i++) _perm[i] = _perm[i + 256] = p[i]
})()

function _fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10) }
function _lerpN(a: number, b: number, t: number): number { return a + t * (b - a) }
function _grad(hash: number, x: number, y: number, z: number): number {
  const g = _GRAD3[hash & 15]
  return g[0] * x + g[1] * y + g[2] * z
}

/**
 * Classic Perlin 3D noise. Returns value in approximately [-1, 1].
 * Deterministic — same seed every call.
 */
export function perlinNoise3D(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const zf = z - Math.floor(z)
  const u = _fade(xf), v = _fade(yf), w = _fade(zf)

  const A  = _perm[X]     + Y, AA = _perm[A]     + Z, AB = _perm[A + 1] + Z
  const B  = _perm[X + 1] + Y, BA = _perm[B]     + Z, BB = _perm[B + 1] + Z

  return _lerpN(
    _lerpN(
      _lerpN(_grad(_perm[AA],     xf,     yf,     zf    ), _grad(_perm[BA],     xf - 1, yf,     zf    ), u),
      _lerpN(_grad(_perm[AB],     xf,     yf - 1, zf    ), _grad(_perm[BB],     xf - 1, yf - 1, zf    ), u), v),
    _lerpN(
      _lerpN(_grad(_perm[AA + 1], xf,     yf,     zf - 1), _grad(_perm[BA + 1], xf - 1, yf,     zf - 1), u),
      _lerpN(_grad(_perm[AB + 1], xf,     yf - 1, zf - 1), _grad(_perm[BB + 1], xf - 1, yf - 1, zf - 1), u), v),
    w
  )
}

// ─── Perlin-based Organic Motion ──────────────────────────────────────────────

/**
 * Smooth Perlin-noise vertical float.
 * Layered octaves give a more organic feel than pure sine waves.
 */
export function noiseFloat(time: number, amplitude = 0.12): number {
  return (
    perlinNoise3D(time * 0.22, 0.5, 0.0) * amplitude * 0.6 +
    perlinNoise3D(time * 0.48, 0.5, 5.0) * amplitude * 0.3 +
    perlinNoise3D(time * 0.95, 0.5, 10.0) * amplitude * 0.1
  )
}

/** Smooth Perlin-noise lateral drift. */
export function noiseDrift(time: number, amplitude = 0.04): number {
  return (
    perlinNoise3D(0.0, time * 0.18, 2.0) * amplitude * 0.7 +
    perlinNoise3D(0.0, time * 0.40, 7.0) * amplitude * 0.3
  )
}

/**
 * Slow cinematic camera drift — 2D Perlin on x/y plane.
 * Returns {x, y} offsets in world-space units.
 */
export function cameraDrift(time: number, radius = 0.18): { x: number; y: number } {
  return {
    x: perlinNoise3D(time * 0.07, 0.0, 0.0) * radius,
    y: perlinNoise3D(0.0, time * 0.05, 0.0) * radius * 0.6,
  }
}

// Keep sine-wave versions as lightweight fallbacks (used by legacy callers)
/** @deprecated Prefer noiseFloat */
export function organicFloat(time: number, amplitude = 0.12): number {
  return (
    Math.sin(time * 0.7) * amplitude * 0.5 +
    Math.sin(time * 1.1 + 1.2) * amplitude * 0.3 +
    Math.sin(time * 0.3 + 2.8) * amplitude * 0.2
  )
}

/** @deprecated Prefer noiseDrift */
export function organicDrift(time: number, amplitude = 0.04): number {
  return (
    Math.sin(time * 0.5 + 1.0) * amplitude * 0.6 +
    Math.sin(time * 0.9 + 2.5) * amplitude * 0.4
  )
}

export function organicRotation(time: number): number {
  return (
    Math.sin(time * 0.4) * 0.015 +
    Math.sin(time * 0.7 + 0.5) * 0.008
  )
}

// ─── Position Helpers ─────────────────────────────────────────────────────────

/** Rotate an integer grid position vector by a quaternion and round back to integers. */
export function rotateGridPosition(
  pos: readonly [number, number, number],
  axis: THREE.Vector3,
  angle: number
): [number, number, number] {
  _v.set(...pos).applyAxisAngle(axis, angle)
  return [Math.round(_v.x), Math.round(_v.y), Math.round(_v.z)]
}
