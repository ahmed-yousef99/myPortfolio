import * as THREE from 'three'
import logoPaths from './logo-paths.json'

interface LogoEntry {
  path: string
  color: string
}

const LOGO_DATA = logoPaths as Record<string, LogoEntry>
const LOGO_KEYS = Object.keys(LOGO_DATA)

const SIZE = 512
// Keyed by face-index string (not logo name) so two different indices
// can never accidentally share the same texture object.
const CACHE = new Map<number, THREE.CanvasTexture>()

/**
 * Converted hex brand color to HSL, reduced saturation by 20%
 * and ensured lightness is at least 70% to match the premium dark crystal.
 */
function getAdjustedBrandColor(hex: string): string {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Reduce saturation by 20% for a premium, less cartoonish feel
  s = Math.max(0, s * 0.8)
  
  // Ensure lightness is at least 72% for clear contrast on dark glass
  const finalL = Math.max(0.72, l)

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(finalL * 100)}%)`
}

function createLogoCanvas(entry: LogoEntry): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  const S = SIZE

  // 1. Clear transparent background
  ctx.clearRect(0, 0, S, S)

  const padding = S * 0.16 // balanced padding
  const iconSize = S - padding * 2
  const scale = iconSize / 24
  const path = new Path2D(entry.path)

  const adjustedColor = getAdjustedBrandColor(entry.color)

  // 2. Bevel Drop Shadow (gives the engraved / depth effect)
  ctx.save()
  // Translate shifted by 2 pixels down-right
  ctx.translate(padding + 2.0, padding + 2.0)
  ctx.scale(scale, scale)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)' // dark inner shadow color
  ctx.fill(path)
  ctx.restore()

  // 3. Crisp Engraved Front Face (sharp fill)
  ctx.save()
  ctx.translate(padding, padding)
  ctx.scale(scale, scale)
  ctx.fillStyle = adjustedColor
  ctx.fill(path)
  ctx.restore()

  return canvas
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getLogoTexture(index: number): THREE.CanvasTexture {
  // Hard guard — index must be within the JSON pool.
  // If it ever falls outside (engine/JSON mismatch), we get an immediate
  // visible error instead of a silent modulo-wrap that reuses logos.
  if (index < 0 || index >= LOGO_KEYS.length) {
    console.error(`[logo-textures] index ${index} out of range (pool size: ${LOGO_KEYS.length})`)
    index = 0
  }

  // Cache keyed by index — guarantees each face slot gets its own texture object.
  if (CACHE.has(index)) return CACHE.get(index)!

  const key = LOGO_KEYS[index]          // direct access, NO modulo
  const entry = LOGO_DATA[key]

  const canvas = createLogoCanvas(entry)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true

  CACHE.set(index, texture)
  return texture
}

export function getLogoColor(index: number): string {
  if (index < 0 || index >= LOGO_KEYS.length) return '#5e6ad2'
  return LOGO_DATA[LOGO_KEYS[index]].color  // direct access, NO modulo
}

export const LOGO_COUNT = LOGO_KEYS.length

export function disposeLogoTextures(): void {
  for (const tex of CACHE.values()) tex.dispose()
  CACHE.clear()
}

/** Dev-mode sanity check — call once at startup to assert no duplicate indices. */
export function assertUniqueLogos(logoIndicesAllCubies: number[][]): void {
  const seen = new Set<number>()
  const dupes: number[] = []
  for (const indices of logoIndicesAllCubies) {
    for (const idx of indices) {
      if (idx < 0) continue
      if (seen.has(idx)) dupes.push(idx)
      else seen.add(idx)
    }
  }
  if (dupes.length > 0) {
    console.error('[logo-textures] DUPLICATE logo indices detected:', dupes)
  } else {
    console.info(`[logo-textures] ✓ All ${seen.size} face stickers have unique logo IDs`)
  }
}
