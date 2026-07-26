import { ContactShadows, Environment } from '@react-three/drei'
import type { QualityConfig } from '../utils/performance'

interface LightingProps {
  quality: QualityConfig
}

export function Lighting({ quality }: LightingProps) {
  return (
    <>
      {/* HDRI environment for reflections — city preset gives nice glass reflections */}
      <Environment preset="city" />

      {/* Softer, cooler ambient fill */}
      <ambientLight intensity={0.08} color="#a5b2f2" />

      {/* Key light — top-left cool white, slightly dimmer for subtle crystal highlights */}
      <rectAreaLight
        position={[-3, 4, 3]}
        width={4}
        height={4}
        intensity={2.2}
        color="#d0d7f2"
      />

      {/* Fill light — bottom-right soft blue-gray */}
      <rectAreaLight
        position={[3, -2, 2]}
        width={3}
        height={3}
        intensity={0.8}
        color="#6f81c9"
      />

      {/* Rim light — defines sharp crystal outlines without glaring the faces */}
      <spotLight
        position={[2.5, 3, -4]}
        intensity={2.5}
        angle={0.45}
        penumbra={0.9}
        color="#cbd5ff"
        castShadow={false}
      />

      {/* Accent glow from below — extremely soft cool blue-indigo to merge into the dark background */}
      <pointLight position={[0, -3.0, 0]} intensity={0.25} color="#4553c7" />

      {/* Contact shadow below cube */}
      {quality.enableContactShadow && (
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={quality.shadowOpacity}
          scale={6}
          blur={quality.shadowBlur}
          far={3}
          color="#0a0b12"
        />
      )}
    </>
  )
}
