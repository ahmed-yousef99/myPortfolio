import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PremiumRubiksCube } from './premium-rubiks-cube'
import { detectQuality, getQualityConfig } from './utils/performance'

const quality = detectQuality()
const cfg = getQualityConfig(quality)

export function HeroScene() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Smoothly fade in after shaders compile and mount completes
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-1000 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        dpr={cfg.dpr}
        camera={{ position: [0, 0, 6], fov: 44, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{ background: 'transparent', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <PremiumRubiksCube quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
