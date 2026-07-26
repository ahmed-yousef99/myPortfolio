import { type MeshTransmissionMaterialProps } from '@react-three/drei'
import type { QualityConfig } from '../utils/performance'

/** Returns props for MeshTransmissionMaterial based on quality preset. */
export function buildGlassMaterialProps(
  quality: QualityConfig,
  envMapIntensity = 1.2
): MeshTransmissionMaterialProps {
  return {
    // Core glass parameters
    transmission: 0.96,
    thickness: quality.glassThickness,
    roughness: 0.04,
    ior: 1.5,

    // Chromatic aberration + anisotropy
    chromaticAberration: quality.glassChromaticAberration,
    anisotropy: quality.glassAnisotropy,

    // Backside rendering for internal reflections
    backside: true,
    backsideThickness: quality.glassThickness * 0.75,

    // Subtle distortion (temporal flickering disabled on lower tiers)
    temporalDistortion: quality.glassAnisotropy > 0 ? 0.08 : 0,
    distortionScale: quality.glassAnisotropy > 0 ? 0.08 : 0,

    // Environment
    envMapIntensity,

    // Visual appearance — subtle cool tint, deep indigo-charcoal core attenuation
    color: '#dbe4ff',
    attenuationColor: '#1a1d36',
    attenuationDistance: 0.48,

    // No shadows blocking transmission
    transparent: true,
    opacity: 1,
  }
}
