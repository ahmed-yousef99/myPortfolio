import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  twinklePhase: number
  twinkleSpeed: number
  vx: number
  vy: number
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  brightness: number
  life: number
}

const STAR_LAYERS = [
  { count: 80, minR: 0.3, maxR: 0.7, minO: 0.08, maxO: 0.22, driftMul: 0.12, twinkleMul: 0.3 },
  { count: 50, minR: 0.6, maxR: 1.2, minO: 0.15, maxO: 0.38, driftMul: 0.25, twinkleMul: 0.5 },
  { count: 25, minR: 1.0, maxR: 1.8, minO: 0.2, maxO: 0.5, driftMul: 0.4, twinkleMul: 0.7 },
]

function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cvsEl = canvasRef.current
    if (!cvsEl) return

    const ctx = cvsEl.getContext('2d')
    if (!ctx) return

    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMqChange = (e: MediaQueryListEvent) => { reduced = e.matches }
    mq.addEventListener('change', onMqChange)

    let w = 0
    let h = 0
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let nextMeteorAt = 0
    let animId = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      cvsEl!.width = w * dpr
      cvsEl!.height = h * dpr
      cvsEl!.style.width = `${w}px`
      cvsEl!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      generateStars()
    }

    function generateStars() {
      stars = []
      for (const layer of STAR_LAYERS) {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: layer.minR + Math.random() * (layer.maxR - layer.minR),
            baseOpacity: layer.minO + Math.random() * (layer.maxO - layer.minO),
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.3 + Math.random() * 0.8,
            vx: (Math.random() - 0.5) * layer.driftMul * (reduced ? 0 : 1),
            vy: (Math.random() - 0.5) * layer.driftMul * (reduced ? 0 : 1),
          })
        }
      }
    }

    function spawnMeteor() {
      const path = Math.floor(Math.random() * 3)
      let sx: number
      let sy: number
      let vxMul: number
      let vyMul: number

      if (path === 0) {
        sx = Math.random() * w * 0.7
        sy = -60 - Math.random() * 40
        vxMul = 1
        vyMul = 1
      } else if (path === 1) {
        sx = w + 60 + Math.random() * 40
        sy = Math.random() * h * 0.35
        vxMul = -1
        vyMul = 1
      } else {
        sx = -60 - Math.random() * 40
        sy = Math.random() * h * 0.3
        vxMul = 1
        vyMul = 1
      }

      const baseSpeed = 500 + Math.random() * 400
      const angleDeg = 25 + Math.random() * 30
      const angleRad = (angleDeg * Math.PI) / 180
      const vx = Math.cos(angleRad) * baseSpeed * vxMul
      const vy = Math.sin(angleRad) * baseSpeed * vyMul

      meteors.push({
        x: sx,
        y: sy,
        vx,
        vy,
        length: 140 + Math.random() * 100,
        brightness: 0.5 + Math.random() * 0.5,
        life: 0,
      })
    }

    function draw(time: number) {
      const now = time * 0.001
      const dt = Math.min(1 / 30, 1 / 60)
      ctx!.clearRect(0, 0, w, h)

      // Stars
      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < -10) s.x = w + 10
        if (s.x > w + 10) s.x = -10
        if (s.y < -10) s.y = h + 10
        if (s.y > h + 10) s.y = -10

        const twinkle = Math.sin(now * s.twinkleSpeed + s.twinklePhase) * 0.3 + 0.7
        const alpha = s.baseOpacity * twinkle
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${alpha})`
        ctx!.fill()
      }

      // Meteors
      if (!reduced) {
        const nowMs = time
        if (nowMs > nextMeteorAt && meteors.length < 2) {
          spawnMeteor()
          nextMeteorAt = nowMs + 2500 + Math.random() * 4500
        }

        const alive: Meteor[] = []
        for (const m of meteors) {
          m.life += dt * 0.5
          if (m.life >= 1) continue

          m.x += m.vx * dt
          m.y += m.vy * dt

          if (m.x < -w * 1.2 || m.x > w * 2.2 || m.y < -h || m.y > h * 2) continue

          let alpha = m.brightness
          if (m.life < 0.15) {
            alpha *= m.life / 0.15
          } else if (m.life > 0.72) {
            alpha *= Math.max(0, (1 - m.life) / 0.28)
          }
          if (alpha <= 0) continue

          const headAlpha = Math.min(1, alpha * 1.3)
          const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy)
          if (speed < 0.01) continue
          const nx = m.vx / speed
          const ny = m.vy / speed
          const dx = nx * m.length
          const dy = ny * m.length

          // Outer trail glow
          ctx!.beginPath()
          ctx!.moveTo(m.x, m.y)
          ctx!.lineTo(m.x - dx * 0.1, m.y - dy * 0.1)
          ctx!.strokeStyle = `rgba(150,170,255,${alpha * 0.12})`
          ctx!.lineWidth = 5
          ctx!.lineCap = 'round'
          ctx!.stroke()

          // Main trail
          const grad = ctx!.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy)
          grad.addColorStop(0, `rgba(255,255,255,${headAlpha})`)
          grad.addColorStop(0.12, `rgba(230,235,255,${alpha * 0.5})`)
          grad.addColorStop(0.5, `rgba(200,210,255,${alpha * 0.15})`)
          grad.addColorStop(1, `rgba(255,255,255,0)`)

          ctx!.beginPath()
          ctx!.moveTo(m.x, m.y)
          ctx!.lineTo(m.x - dx, m.y - dy)
          ctx!.strokeStyle = grad
          ctx!.lineWidth = 1.5 + m.brightness * 0.6
          ctx!.lineCap = 'round'
          ctx!.stroke()

          // Bright head
          ctx!.beginPath()
          ctx!.arc(m.x, m.y, 1.8 + m.brightness * 0.7, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(255,255,255,${headAlpha})`
          ctx!.fill()

          // Head glow
          ctx!.beginPath()
          ctx!.arc(m.x, m.y, 3 + m.brightness, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(180,200,255,${alpha * 0.15})`
          ctx!.fill()

          alive.push(m)
        }
        meteors = alive
      }

      animId = requestAnimationFrame(draw)
    }

    function initMeteorTimer() {
      nextMeteorAt = performance.now() + 1000 + Math.random() * 2000
    }

    resize()
    initMeteorTimer()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      mq.removeEventListener('change', onMqChange)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.012] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
    </>
  )
}

export { BackgroundEffects }
