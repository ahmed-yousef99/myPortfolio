/* eslint-disable @typescript-eslint/no-explicit-any */
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import type { QualityConfig } from '../utils/performance'
import type { FC } from 'react'

// Cast away the React 19 / r3f-postprocessing children type mismatch.
// This is a known upstream issue — runtime behavior is fully correct.
const SafeBloom = Bloom as FC<any>
const SafeToneMapping = ToneMapping as FC<any>

interface PostProcessingProps {
  quality: QualityConfig
}

export function PostProcessing({ quality }: PostProcessingProps) {
  if (!quality.enablePostProcessing) return null

  return (
    <EffectComposer enableNormalPass={false}>
      <SafeBloom
        luminanceThreshold={0.98} // extremely high threshold -> only raw specular sparks bloom
        luminanceSmoothing={0.2}
        intensity={quality.bloomIntensity * 0.15} // extremely soft, luxury-grade bloom
        mipmapBlur
      />
      <SafeToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
