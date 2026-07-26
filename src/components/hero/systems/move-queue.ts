import { ALL_MOVES, type MoveId } from './rubiks-engine'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MoveQueue {
  pending: MoveId[]
  lastMove: MoveId | null
  timeSinceLastMove: number
  intervalMin: number
  intervalMax: number
  enabled: boolean
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function createMoveQueue(intervalMin = 1.2, intervalMax = 2.4): MoveQueue {
  return {
    pending: generateSequence(null),
    lastMove: null,
    timeSinceLastMove: 0,
    intervalMin,
    intervalMax,
    enabled: true,
  }
}

// ─── Sequence Generator ───────────────────────────────────────────────────────

/**
 * Generates 6–12 legal random moves.
 * Never picks the exact inverse of the last move (avoids trivial undo).
 */
function generateSequence(lastMove: MoveId | null): MoveId[] {
  const count = 6 + Math.floor(Math.random() * 7) // 6–12
  const seq: MoveId[] = []
  let prev = lastMove

  for (let i = 0; i < count; i++) {
    let pick: MoveId

    // Build candidate list (exclude trivial inverse of previous move)
    const candidates = ALL_MOVES.filter(m => {
      if (!prev) return true
      // Avoid same move twice in a row (keeps animation varied)
      if (m === prev) return false
      return true
    })

    pick = candidates[Math.floor(Math.random() * candidates.length)]
    seq.push(pick)
    prev = pick
  }

  return seq
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Advances the queue timer. Returns the next MoveId to execute,
 * or null if no move is ready yet.
 */
export function tickMoveQueue(queue: MoveQueue, delta: number): MoveId | null {
  if (!queue.enabled) return null

  queue.timeSinceLastMove += delta

  // Sample a random interval for this move
  const interval = queue.intervalMin + Math.random() * (queue.intervalMax - queue.intervalMin)

  if (queue.timeSinceLastMove < interval) return null

  // Time to fire a move
  queue.timeSinceLastMove = 0

  if (queue.pending.length === 0) {
    // Refill queue
    queue.pending = generateSequence(queue.lastMove)
  }

  const move = queue.pending.shift()!
  queue.lastMove = move
  return move
}
