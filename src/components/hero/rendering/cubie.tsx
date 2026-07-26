import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { RefObject } from 'react'
import type { CubieState, ActiveMove } from '../systems/rubiks-engine'
import type { QualityConfig } from '../utils/performance'
import { getLogoTexture, getLogoColor } from './logo-textures'

// Spacing to keep it tightly aligned like a premium Rubik's Cube product
const SPACING = 1.025

// Face direction normals indexed by face value (0–5)
const FACE_OFFSETS: [number, number, number][] = [
  [1, 0, 0],   // 0: +X
  [-1, 0, 0],  // 1: -X
  [0, 1, 0],   // 2: +Y
  [0, -1, 0],  // 3: -Y
  [0, 0, 1],   // 4: +Z
  [0, 0, -1],  // 5: -Z
]

// Euler angles to rotate a front-facing plane to each face direction
const FACE_ROTATIONS: [number, number, number][] = [
  [0, Math.PI / 2, 0],   // 0: +X
  [0, -Math.PI / 2, 0],  // 1: -X
  [-Math.PI / 2, 0, 0],  // 2: +Y
  [Math.PI / 2, 0, 0],   // 3: -Y
  [0, 0, 0],             // 4: +Z
  [0, Math.PI, 0],       // 5: -Z
]

interface CubieProps {
  state: CubieState
  quality: QualityConfig
  activeMoveRef: RefObject<ActiveMove | null>
  faceMoveQuatRef: RefObject<THREE.Quaternion>
}

export function Cubie({ state, quality, activeMoveRef, faceMoveQuatRef }: CubieProps) {
  const groupRef = useRef<THREE.Group>(null!)

  // Get first logo index to determine the glowing core color
  const primaryLogoIndex = useMemo(() => {
    return state.logoIndices.find(idx => idx >= 0) ?? -1
  }, [state.logoIndices])

  const coreColor = useMemo(() => {
    return new THREE.Color(getLogoColor(primaryLogoIndex))
  }, [primaryLogoIndex])

  // Map non-negative logo indices to their face geometries and textures
  const logoPlanes = useMemo(() => {
    const planes: { face: number; texture: THREE.CanvasTexture }[] = []
    for (let face = 0; face < 6; face++) {
      const logoIdx = state.logoIndices[face]
      if (logoIdx >= 0) {
        planes.push({
          face,
          texture: getLogoTexture(logoIdx),
        })
      }
    }
    return planes
  }, [state.logoIndices])

  // Precompute base position
  const basePos = useMemo(() => {
    return state.logicalPos.map(v => v * SPACING) as [number, number, number]
  }, [state.logicalPos])

  // Clean Smoked Sapphire Crystal Glass Material
  // Charcoal blue-gray tint `#141724` with high opacity (0.76) to completely eliminate ghosting
  // Highly polished roughness (0.005) and boosted envMapIntensity for crisp highlights on edges
  const glassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#141724'), // dark charcoal/blue-gray smoked crystal color
      metalness: 0.15,
      roughness: 0.005, // highly polished
      ior: 1.54, // crystal glass IOR
      transparent: true,
      opacity: 0.76, // semi-opaque smoked crystal to blend into the website background
      envMapIntensity: 2.8, // catches strong specular highlights on rounded corners
      clearcoat: 1.0,
      clearcoatRoughness: 0.005,
      side: THREE.FrontSide,
      depthWrite: true,
    })
  }, [])

  // Direct useFrame animation for smooth 60 FPS face rotations
  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    const activeMove = activeMoveRef.current

    if (activeMove !== null && activeMove.cubieIds.includes(state.id)) {
      const currentFaceQuat = faceMoveQuatRef.current
      const v = new THREE.Vector3(...state.logicalPos).applyQuaternion(currentFaceQuat)
      group.position.set(v.x * SPACING, v.y * SPACING, v.z * SPACING)

      const q = new THREE.Quaternion().multiplyQuaternions(currentFaceQuat, state.quat)
      group.quaternion.copy(q)
    } else {
      group.position.set(...basePos)
      group.quaternion.copy(state.quat)
    }
  })

  const isCenter = primaryLogoIndex < 0

  return (
    <group ref={groupRef}>
      {/* 1. Crystal glass body — rendered with order 1 */}
      <RoundedBox
        args={[0.98, 0.98, 0.98]} // tight gap for realistic silhouette
        radius={0.06}
        smoothness={quality.roundedBoxSmoothness}
        material={glassMat}
        renderOrder={1}
      />

      {/* 2. Soft internal core glow — extremely subtle color accent (reduced by 90% for restraint) */}
      {!isCenter && (
        <mesh renderOrder={2}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial
            color={coreColor}
            transparent={true}
            opacity={0.015} // extremely soft interior color hint
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3. Logo stickers engraved on the FRONT OUTER FACE (offset 0.493) */}
      {logoPlanes.map(p => (
        <mesh
          key={p.face}
          position={[
            FACE_OFFSETS[p.face][0] * 0.493,
            FACE_OFFSETS[p.face][1] * 0.493,
            FACE_OFFSETS[p.face][2] * 0.493,
          ]}
          rotation={FACE_ROTATIONS[p.face]}
          renderOrder={3} // drawn on top of the glass
        >
          <planeGeometry args={[0.82, 0.82]} />
          <meshBasicMaterial
            map={p.texture}
            transparent={true}
            opacity={0.92}
            side={THREE.FrontSide} // FrontSide only: completely eliminates ghosting
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export { SPACING }
