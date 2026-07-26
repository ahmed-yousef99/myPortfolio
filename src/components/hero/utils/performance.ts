/** Quality tiers for the 3D scene. */
export type QualityPreset = 'ultra' | 'high' | 'medium' | 'low'

export interface QualityConfig {
  dpr: [number, number]
  bloomIntensity: number
  bloomThreshold: number
  glassThickness: number
  glassChromaticAberration: number
  glassAnisotropy: number
  shadowBlur: number
  shadowOpacity: number
  roundedBoxSmoothness: number
  enablePostProcessing: boolean
  enableContactShadow: boolean
  maxFaceAnimDuration: number
}

const PRESETS: Record<QualityPreset, QualityConfig> = {
  ultra: {
    dpr: [1, 2],
    bloomIntensity: 0.2,
    bloomThreshold: 0.88,
    glassThickness: 0.26,
    glassChromaticAberration: 0.015,
    glassAnisotropy: 0.04,
    shadowBlur: 2.2,
    shadowOpacity: 0.28,
    roundedBoxSmoothness: 4,
    enablePostProcessing: true,
    enableContactShadow: true,
    maxFaceAnimDuration: 0.55,
  },
  high: {
    dpr: [1, 1.5],
    bloomIntensity: 0.15,
    bloomThreshold: 0.9,
    glassThickness: 0.26,
    glassChromaticAberration: 0.01,
    glassAnisotropy: 0.02,
    shadowBlur: 1.8,
    shadowOpacity: 0.24,
    roundedBoxSmoothness: 3,
    enablePostProcessing: true,
    enableContactShadow: true,
    maxFaceAnimDuration: 0.5,
  },
  medium: {
    dpr: [1, 1],
    bloomIntensity: 0.1,
    bloomThreshold: 0.92,
    glassThickness: 0.22,
    glassChromaticAberration: 0.006,
    glassAnisotropy: 0,
    shadowBlur: 1.5,
    shadowOpacity: 0.18,
    roundedBoxSmoothness: 2,
    enablePostProcessing: true,
    enableContactShadow: false,
    maxFaceAnimDuration: 0.45,
  },
  low: {
    dpr: [1, 1],
    bloomIntensity: 0,
    bloomThreshold: 1,
    glassThickness: 0.18,
    glassChromaticAberration: 0,
    glassAnisotropy: 0,
    shadowBlur: 1,
    shadowOpacity: 0.12,
    roundedBoxSmoothness: 1,
    enablePostProcessing: false,
    enableContactShadow: false,
    maxFaceAnimDuration: 0.4,
  },
}

/** Detect quality preset based on device capabilities. */
export function detectQuality(): QualityPreset {
  // SSR guard
  if (typeof window === 'undefined') return 'high'

  const dpr = window.devicePixelRatio ?? 1
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  
  // Very low-end devices
  if (mobile && dpr <= 1) return 'low'
  // Mobile with retina
  if (mobile) return 'medium'
  // Desktop with DPR > 1.5 → ultra
  if (dpr >= 1.5) return 'ultra'
  // Desktop standard
  return 'high'
}

export function getQualityConfig(preset: QualityPreset): QualityConfig {
  return PRESETS[preset]
}
