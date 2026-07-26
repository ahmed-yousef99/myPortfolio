import * as THREE from 'three'
import { rotateGridPosition } from '../utils/math'

// ─── Types ────────────────────────────────────────────────────────────────────

export type GridPos = [number, number, number]

export interface CubieState {
  id: number
  logicalPos: GridPos
  /** Accumulated rotation quaternion — describes the cubie's current orientation. */
  quat: THREE.Quaternion
  /** Logo index for each of the 6 faces. -1 = no logo. Order: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z */
  logoIndices: [number, number, number, number, number, number]
}

export type MoveId = 'R' | "R'" | 'R2' | 'L' | "L'" | 'L2' | 'U' | "U'" | 'U2' | 'D' | "D'" | 'D2' | 'F' | "F'" | 'F2' | 'B' | "B'" | 'B2'

export interface MoveDef {
  axis: THREE.Vector3
  sliceCoord: 0 | 1 | 2    // 0=x, 1=y, 2=z
  sliceVal: -1 | 1
  targetAngle: number
  inverse: MoveId
}

export interface ActiveMove {
  def: MoveDef
  cubieIds: number[]
  elapsed: number
  duration: number
}

// ─── Move Definitions ─────────────────────────────────────────────────────────

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const Z = new THREE.Vector3(0, 0, 1)
const PI2 = Math.PI / 2

export const MOVES: Record<MoveId, MoveDef> = {
  'R':  { axis: X, sliceCoord: 0, sliceVal:  1, targetAngle:  PI2, inverse: "R'" },
  "R'": { axis: X, sliceCoord: 0, sliceVal:  1, targetAngle: -PI2, inverse: 'R'  },
  'R2': { axis: X, sliceCoord: 0, sliceVal:  1, targetAngle:  Math.PI, inverse: 'R2' },
  'L':  { axis: X, sliceCoord: 0, sliceVal: -1, targetAngle: -PI2, inverse: "L'" },
  "L'": { axis: X, sliceCoord: 0, sliceVal: -1, targetAngle:  PI2, inverse: 'L'  },
  'L2': { axis: X, sliceCoord: 0, sliceVal: -1, targetAngle:  Math.PI, inverse: 'L2' },
  'U':  { axis: Y, sliceCoord: 1, sliceVal:  1, targetAngle:  PI2, inverse: "U'" },
  "U'": { axis: Y, sliceCoord: 1, sliceVal:  1, targetAngle: -PI2, inverse: 'U'  },
  'U2': { axis: Y, sliceCoord: 1, sliceVal:  1, targetAngle:  Math.PI, inverse: 'U2' },
  'D':  { axis: Y, sliceCoord: 1, sliceVal: -1, targetAngle: -PI2, inverse: "D'" },
  "D'": { axis: Y, sliceCoord: 1, sliceVal: -1, targetAngle:  PI2, inverse: 'D'  },
  'D2': { axis: Y, sliceCoord: 1, sliceVal: -1, targetAngle:  Math.PI, inverse: 'D2' },
  'F':  { axis: Z, sliceCoord: 2, sliceVal:  1, targetAngle: -PI2, inverse: "F'" },
  "F'": { axis: Z, sliceCoord: 2, sliceVal:  1, targetAngle:  PI2, inverse: 'F'  },
  'F2': { axis: Z, sliceCoord: 2, sliceVal:  1, targetAngle:  Math.PI, inverse: 'F2' },
  'B':  { axis: Z, sliceCoord: 2, sliceVal: -1, targetAngle:  PI2, inverse: "B'" },
  "B'": { axis: Z, sliceCoord: 2, sliceVal: -1, targetAngle: -PI2, inverse: 'B'  },
  'B2': { axis: Z, sliceCoord: 2, sliceVal: -1, targetAngle:  Math.PI, inverse: 'B2' },
}

export const ALL_MOVES = Object.keys(MOVES) as MoveId[]

// ─── Cubie Initialization ─────────────────────────────────────────────────────


export function initCubies(): CubieState[] {
  // Step 1: Build all cubies with no logos yet
  const cubies: CubieState[] = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: cubies.length,
          logicalPos: [x, y, z] as GridPos,
          quat: new THREE.Quaternion(),
          logoIndices: [-1, -1, -1, -1, -1, -1],
        })
      }
    }
  }

  // Step 2: Collect every outer-face slot, marking each as visible or hidden.
  // Visible faces are the three camera-facing sides: +Z (front), +Y (top), +X (right).
  // These get logo indices 0-26 (priority technologies).
  // Hidden faces (-Z, -Y, -X) get indices 27-53 (secondary technologies).
  interface FaceSlot { cubieId: number; faceIndex: number; visible: boolean }
  const slots: FaceSlot[] = []

  for (const cubie of cubies) {
    const [x, y, z] = cubie.logicalPos
    if (x === 0 && y === 0 && z === 0) continue // skip center piece

    // Order must match faceIndex constants: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
    if (x === 1)  slots.push({ cubieId: cubie.id, faceIndex: 0, visible: true  })
    if (x === -1) slots.push({ cubieId: cubie.id, faceIndex: 1, visible: false })
    if (y === 1)  slots.push({ cubieId: cubie.id, faceIndex: 2, visible: true  })
    if (y === -1) slots.push({ cubieId: cubie.id, faceIndex: 3, visible: false })
    if (z === 1)  slots.push({ cubieId: cubie.id, faceIndex: 4, visible: true  })
    if (z === -1) slots.push({ cubieId: cubie.id, faceIndex: 5, visible: false })
  }

  // Step 3: Sort — visible faces come first (stable within each group).
  slots.sort((a, b) => {
    if (a.visible === b.visible) return 0
    return a.visible ? -1 : 1
  })

  // Step 4: Assign sequential unique logo indices.
  // Indices 0-26  → visible faces  → JSON positions 0-26  (priority technologies)
  // Indices 27-53 → hidden faces   → JSON positions 27-53 (secondary technologies)
  slots.forEach((slot, idx) => {
    cubies[slot.cubieId].logoIndices[slot.faceIndex] = idx
  })

  return cubies
}


// ─── Face Slice Query ─────────────────────────────────────────────────────────

export function getCubiesInFace(cubies: CubieState[], def: MoveDef): number[] {
  return cubies
    .filter(c => c.logicalPos[def.sliceCoord] === def.sliceVal)
    .map(c => c.id)
}

// ─── Move Finalization ────────────────────────────────────────────────────────

const _q = new THREE.Quaternion()

/** Bake the completed rotation into each cubie's state. */
export function finalizeMove(cubies: CubieState[], move: ActiveMove): void {
  const { def, cubieIds } = move
  _q.setFromAxisAngle(def.axis, def.targetAngle)

  for (const id of cubieIds) {
    const c = cubies[id]
    // Update logical position (grid coordinates)
    c.logicalPos = rotateGridPosition(c.logicalPos, def.axis, def.targetAngle)
    // Accumulate rotation into the cubie's quaternion (premultiply = world-space rotation)
    c.quat.premultiply(_q)
  }
}
