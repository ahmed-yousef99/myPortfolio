// ─── States ───────────────────────────────────────────────────────────────────

export type AnimState =
  | 'Idle'        // auto rotation + floating + move queue active
  | 'Hover'       // pointer over — slight glow increase, queue continues
  | 'Grab'        // pointer down — auto animations paused
  | 'Dragging'    // pointer moved beyond threshold — applying drag delta
  | 'Inertia'     // pointer up — angular velocity decaying
  | 'AutoResume'  // inactivity timer running — transitioning back to Idle

export interface AnimFSM {
  state: AnimState
  /** Timestamp (in seconds) of last interaction event */
  lastInteractionAt: number
  /** How long to wait before AutoResume → Idle transition (seconds) */
  resumeDelay: number
  /** Current inertia angular speed magnitude */
  inertiaSpeed: number
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function createAnimFSM(resumeDelay = 2.5): AnimFSM {
  return {
    state: 'Idle',
    lastInteractionAt: 0,
    resumeDelay,
    inertiaSpeed: 0,
  }
}

// ─── Transitions ──────────────────────────────────────────────────────────────

export function onPointerEnter(fsm: AnimFSM): void {
  if (fsm.state === 'Idle') fsm.state = 'Hover'
}

export function onPointerLeave(fsm: AnimFSM): void {
  if (fsm.state === 'Hover') fsm.state = 'Idle'
}

export function onPointerDown(fsm: AnimFSM, now: number): void {
  fsm.state = 'Grab'
  fsm.lastInteractionAt = now
  fsm.inertiaSpeed = 0
}

export function onPointerMove(fsm: AnimFSM, now: number, hasDelta: boolean): void {
  if ((fsm.state === 'Grab' || fsm.state === 'Dragging') && hasDelta) {
    fsm.state = 'Dragging'
    fsm.lastInteractionAt = now
  }
}

export function onPointerUp(fsm: AnimFSM, now: number, speed: number): void {
  if (fsm.state === 'Grab' || fsm.state === 'Dragging') {
    fsm.lastInteractionAt = now
    fsm.state = 'Inertia'
    fsm.inertiaSpeed = speed
  }
}

/** Call every frame. Returns whether a state transition occurred. */
export function tickFSM(_fsm: AnimFSM, _delta: number, _now: number): boolean {
  // Blending from Inertia to Idle is handled smoothly in the main render loop.
  return false
}

/** Whether the cube's idle/auto behavior should be active. */
export function isIdling(fsm: AnimFSM): boolean {
  return fsm.state === 'Idle' || fsm.state === 'Hover'
}

/** Whether the user is in control (drag or inertia). */
export function isUserControlled(fsm: AnimFSM): boolean {
  return fsm.state === 'Grab' || fsm.state === 'Dragging' || fsm.state === 'Inertia'
}
