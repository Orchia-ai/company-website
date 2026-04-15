import { useEffect, useRef } from 'react'

interface Props {
  size?: number
  fullscreen?: boolean
  className?: string
  showText?: boolean
}

export default function OrchiaLogo({
  size = 280,
  fullscreen = false,
  className = '',
  showText = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let p5Instance: any
    let cancelled = false

    import('p5').then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return

      const sketch = (p: any) => {
        let W  = fullscreen ? window.innerWidth  : size
        let H  = fullscreen ? window.innerHeight : size
        let cx = W / 2
        let cy = H / 2
        // Reduce R when text is shown below the mark
        let R  = Math.min(W, H) * (fullscreen ? (showText ? 0.30 : 0.38) : 0.38)

        const TAU = Math.PI * 2

        // ── Palette ──────────────────────────────────────────────
        const [MR, MG, MB] = [122, 115, 107]   // organic warm gray
        const [GR, GG, GB] = [139, 105,  20]   // gold accent
        const [SR, SG, SB] = [48,  46,  44]    // structural charcoal

        // ── Hub-and-spoke constants ───────────────────────────────
        const N_SPOKES = 8
        const spokeAngle = (i: number) => (TAU / N_SPOKES) * i - Math.PI / 2  // start at top

        // ── 1. PHEROMONE GRID (slime mold substrate) ─────────────
        class PheromoneGrid {
          gw: number; gh: number; data: Float32Array
          constructor(gw: number, gh: number) {
            this.gw = gw; this.gh = gh
            this.data = new Float32Array(gw * gh)
          }
          _idx(wx: number, wy: number) {
            const gx = Math.max(0, Math.min(this.gw - 1, Math.floor((wx / W) * this.gw)))
            const gy = Math.max(0, Math.min(this.gh - 1, Math.floor((wy / H) * this.gh)))
            return gy * this.gw + gx
          }
          deposit(wx: number, wy: number, amt: number) {
            const i = this._idx(wx, wy)
            this.data[i] = Math.min(1, this.data[i] + amt)
          }
          sample(wx: number, wy: number) { return this.data[this._idx(wx, wy)] }
          decay(f: number) { for (let i = 0; i < this.data.length; i++) this.data[i] *= f }
          diffuse() {
            const { gw, gh, data } = this
            const tmp = new Float32Array(data)
            for (let y = 1; y < gh - 1; y += 2) {
              for (let x = 1; x < gw - 1; x += 2) {
                tmp[y * gw + x] = (
                  data[(y-1)*gw+(x-1)] + data[(y-1)*gw+x] + data[(y-1)*gw+(x+1)] +
                  data[y*gw+(x-1)]     + data[y*gw+x]     + data[y*gw+(x+1)] +
                  data[(y+1)*gw+(x-1)] + data[(y+1)*gw+x] + data[(y+1)*gw+(x+1)]
                ) / 9
              }
            }
            data.set(tmp)
          }
          reset() { this.data = new Float32Array(this.gw * this.gh) }
        }

        // ── 2. SLIME MOLD AGENT ───────────────────────────────────
        class SlimeAgent {
          x: number; y: number; angle: number; speed: number
          sD: number; sA: number
          history: { x: number; y: number }[]

          constructor(x: number, y: number, angle: number, speed: number) {
            this.x = x; this.y = y; this.angle = angle; this.speed = speed
            this.sD = R * 0.09; this.sA = Math.PI / 4.5
            this.history = []
          }

          step(grid: PheromoneGrid, t: number) {
            const { angle: a, sD, sA } = this
            const FL = grid.sample(this.x + Math.cos(a-sA)*sD, this.y + Math.sin(a-sA)*sD)
            const FC = grid.sample(this.x + Math.cos(a)*sD,    this.y + Math.sin(a)*sD)
            const FR = grid.sample(this.x + Math.cos(a+sA)*sD, this.y + Math.sin(a+sA)*sD)
            if      (FC >= FL && FC >= FR) { /* keep heading */ }
            else if (FL > FR) this.angle -= 0.22 + Math.random() * 0.08
            else if (FR > FL) this.angle += 0.22 + Math.random() * 0.08
            else              this.angle += (Math.random() - 0.5) * 0.55
            this.angle += (p.noise(this.x*0.005, this.y*0.005, t*0.0004) - 0.5) * 0.45
            const dx = cx - this.x, dy = cy - this.y
            if (Math.hypot(dx, dy) > R * 1.05)
              this.angle += 0.04 * (Math.atan2(dy, dx) - this.angle)
            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > 28) this.history.shift()
            this.x += Math.cos(this.angle) * this.speed
            this.y += Math.sin(this.angle) * this.speed
            grid.deposit(this.x, this.y, 0.32)
          }

          draw() {
            if (this.history.length < 2) return
            const n = this.history.length
            for (let i = 1; i < n; i++) {
              const fade = (i / n) ** 2.2
              p.stroke(MR, MG, MB, 58 * fade)
              p.strokeWeight(0.65)
              p.line(this.history[i-1].x, this.history[i-1].y, this.history[i].x, this.history[i].y)
            }
          }
        }

        // ── 3. HARMONOGRAPH TURTLE ─────────────────────────────────
        // Dual-pendulum curves with musical frequency ratios (3:2, 4:3, 5:4 …).
        // Phases drift via Perlin noise — shape continuously morphs.
        class HarmonographTurtle {
          A!: number; B!: number; C!: number; D!: number
          f1!: number; f2!: number
          p1!: number; p2!: number; p3!: number; p4!: number
          noiseOff!: number; t: number
          history: { x: number; y: number }[]
          maxHist!: number
          cr!: number; cg!: number; cb!: number
          alpha!: number; weight!: number

          constructor(
            A: number, B: number, f1: number, f2: number,
            p1: number, p2: number, p3: number, p4: number,
            noiseOff: number, maxHist: number,
            cr: number, cg: number, cb: number, alpha: number, weight: number
          ) {
            Object.assign(this, { A, B, C: A*0.92, D: B*0.92, f1, f2,
              p1, p2, p3, p4, noiseOff, maxHist, cr, cg, cb, alpha, weight })
            this.t = 0; this.history = []
          }

          advance(globalT: number) {
            const n = this.noiseOff
            const φ1 = this.p1 + p.noise(globalT*0.00035, n)    * 1.1
            const φ2 = this.p2 + p.noise(globalT*0.00035, n+11) * 1.1
            const φ3 = this.p3 + p.noise(globalT*0.00035, n+22) * 1.1
            const φ4 = this.p4 + p.noise(globalT*0.00035, n+33) * 1.1
            const breathe = 1 + 0.06 * Math.sin(globalT*0.018 + n)
            const x = cx + breathe * (this.A*Math.sin(this.f1*this.t+φ1) + this.B*Math.sin(this.f2*this.t+φ2))
            const y = cy + breathe * (this.C*Math.sin(this.f2*this.t+φ3) + this.D*Math.sin(this.f1*this.t+φ4))
            this.history.push({ x, y })
            if (this.history.length > this.maxHist) this.history.shift()
            this.t += 0.017 + p.noise(this.noiseOff, globalT*0.0002) * 0.006
          }

          draw() {
            if (this.history.length < 2) return
            const n = this.history.length
            p.noFill()
            for (let i = 1; i < n; i++) {
              const fade = (i / n) ** 1.5
              p.stroke(this.cr, this.cg, this.cb, this.alpha * fade)
              p.strokeWeight(this.weight * (0.35 + 0.65 * fade))
              p.line(this.history[i-1].x, this.history[i-1].y, this.history[i].x, this.history[i].y)
            }
            const tip = this.history[n - 1]
            p.fill(this.cr, this.cg, this.cb, Math.min(255, this.alpha * 1.6))
            p.noStroke()
            p.circle(tip.x, tip.y, this.weight * 4)
          }
        }

        // ── 4. PERLIN FLOW PARTICLE ───────────────────────────────
        class FlowParticle {
          x: number; y: number; px: number; py: number
          speed: number; life: number; maxLife: number

          constructor() { this.x=this.y=this.px=this.py=this.speed=this.life=this.maxLife=0; this.reset() }

          reset() {
            const a = Math.random() * TAU
            const r = R * (0.05 + Math.random() * 1.05)
            this.x = this.px = cx + Math.cos(a) * r
            this.y = this.py = cy + Math.sin(a) * r
            this.speed   = 0.7 + Math.random() * 1.4
            this.life    = 0
            this.maxLife = 60 + Math.floor(Math.random() * 140)
          }

          step(t: number) {
            this.px = this.x; this.py = this.y
            const noiseAngle = p.noise(this.x*0.0035, this.y*0.0035, t*0.0005) * TAU * 3.5
            const orbitAngle = Math.atan2(this.y-cy, this.x-cx) + Math.PI / 2
            const angle = noiseAngle * 0.65 + orbitAngle * 0.35
            this.x += Math.cos(angle) * this.speed
            this.y += Math.sin(angle) * this.speed
            this.life++
            if (this.life > this.maxLife || Math.hypot(this.x-cx, this.y-cy) > R*1.35) this.reset()
          }

          draw() {
            const fade = Math.sin((this.life / this.maxLife) * Math.PI)
            p.stroke(MR, MG, MB, 28 * fade)
            p.strokeWeight(0.55)
            p.line(this.px, this.py, this.x, this.y)
          }
        }

        // ── 5. NEURAL NODE ─────────────────────────────────────────
        class NeuralNode {
          x: number; y: number; phase: number; r: number; pulseSpeed: number

          constructor(x: number, y: number, r: number, phase: number) {
            this.x=x; this.y=y; this.r=r; this.phase=phase
            this.pulseSpeed = 0.025 + Math.random() * 0.02
          }

          draw(t: number) {
            const pulse = 1 + 0.18 * Math.sin(t * this.pulseSpeed + this.phase)
            p.noFill(); p.stroke(GR, GG, GB, 40 * pulse); p.strokeWeight(0.7)
            p.circle(this.x, this.y, this.r * pulse * 2)
            p.stroke(MR, MG, MB, 25)
            p.circle(this.x, this.y, this.r * 0.45 * pulse * 2)
            p.fill(GR, GG, GB, 70); p.noStroke()
            p.circle(this.x, this.y, 2.5)
          }
        }

        // ── INSTANTIATE ───────────────────────────────────────────
        let agents:  SlimeAgent[]         = []
        let turtles: HarmonographTurtle[] = []
        let flow:    FlowParticle[]       = []
        let nodes:   NeuralNode[]         = []
        let grid:    PheromoneGrid
        let globalT = 0

        // ── GEOMETRIC STRUCTURE ───────────────────────────────────
        // Hub-and-spoke: central circle, 8 radial lines, square nodes,
        // and 4 concentric rings. Drawn as the structural base layer.
        const drawGeometry = (t: number) => {
          // Very subtle outer-ring pulse to suggest signal propagation
          const outerPulse = 0.90 + 0.10 * Math.sin(t * 0.020)

          p.push()

          // Concentric rings (background field / radar)
          p.noFill()
          const ringRatios = [0.28, 0.52, 0.76, 1.0]
          ringRatios.forEach((ratio, i) => {
            const baseAlpha = 12 + i * 7
            const alpha = i === 3 ? baseAlpha * outerPulse : baseAlpha
            p.stroke(SR, SG, SB, alpha)
            p.strokeWeight(i === 3 ? 0.85 : 0.50)
            p.circle(cx, cy, R * ratio * 2)
          })

          // 8 radial spokes
          p.stroke(SR, SG, SB, 35)
          p.strokeWeight(0.60)
          for (let i = 0; i < N_SPOKES; i++) {
            const a = spokeAngle(i)
            p.line(cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R)
          }

          // Square endpoint nodes — two sizes, alternating
          for (let i = 0; i < N_SPOKES; i++) {
            const a  = spokeAngle(i)
            const nx = cx + Math.cos(a) * R
            const ny = cy + Math.sin(a) * R
            const isLarge = i % 2 === 0
            const sq = isLarge ? R * 0.050 : R * 0.031
            p.stroke(SR, SG, SB, isLarge ? 58 : 40)
            p.strokeWeight(0.70)
            p.fill(SR, SG, SB, isLarge ? 18 : 10)
            p.rect(nx - sq, ny - sq, sq * 2, sq * 2)
          }

          // Hub circle (central control node)
          p.noFill()
          p.stroke(SR, SG, SB, 65)
          p.strokeWeight(0.85)
          p.circle(cx, cy, R * 0.096 * 2)

          // Hub inner fill
          p.fill(SR, SG, SB, 22)
          p.noStroke()
          p.circle(cx, cy, R * 0.052 * 2)

          p.pop()
        }

        // ── TYPOGRAPHY ────────────────────────────────────────────
        // Uses drawingContext directly for CSS font-weight 100 (Josefin Sans thin —
        // same as the landing page wordmark). Per-character rendering for precise tracking.
        const renderTracked = (
          ctx: CanvasRenderingContext2D,
          text: string, x: number, y: number,
          spacing: number, sz: number, alpha: number
        ): number => {
          ctx.font = `100 ${sz}px "Josefin Sans", sans-serif`
          ctx.fillStyle = `rgba(${SR}, ${SG}, ${SB}, ${(alpha / 255).toFixed(3)})`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          const chars = text.split('')
          const ws = chars.map((c: string) => ctx.measureText(c).width)
          const totalW = ws.reduce((a: number, b: number) => a + b, 0) + spacing * (chars.length - 1)
          let xPos = x - totalW / 2
          for (let i = 0; i < chars.length; i++) {
            ctx.fillText(chars[i], xPos, y)
            xPos += ws[i] + spacing
          }
          return totalW
        }

        const drawText = () => {
          if (!showText) return
          const ctx = p.drawingContext as CanvasRenderingContext2D
          ctx.save()

          const textY      = cy + R * 1.18
          const orchiaSize = Math.max(10, R * 0.115)

          // "ORCHIA" — all caps, Josefin Sans 100, wide tracking
          renderTracked(ctx, 'ORCHIA', cx, textY, orchiaSize * 0.50, orchiaSize, 185)

          // "STUDIO" — smaller, framed by horizontal rules
          const studioY    = textY + orchiaSize * 1.08
          const studioSize = Math.max(7, R * 0.064)
          const studioW    = renderTracked(ctx, 'STUDIO', cx, studioY, studioSize * 0.48, studioSize, 130)

          ctx.restore()

          // Flanking lines drawn via P5 (consistent stroke style)
          const gap     = R * 0.042
          const lineLen = R * 0.082
          p.noFill()
          p.stroke(SR, SG, SB, 110)
          p.strokeWeight(0.60)
          p.line(cx - studioW/2 - gap - lineLen, studioY, cx - studioW/2 - gap, studioY)
          p.line(cx + studioW/2 + gap, studioY,  cx + studioW/2 + gap + lineLen, studioY)
        }

        // ── BUILD ALL ─────────────────────────────────────────────
        const buildAll = () => {
          grid = new PheromoneGrid(110, 110)

          // Slime agents — placed on concentric rings
          agents = Array.from({ length: 96 }, (_, i) => {
            const rings = [0.22, 0.46, 0.72, 0.95]
            const rho   = R * rings[i % rings.length] * (0.9 + Math.random() * 0.2)
            const a     = (TAU / 96) * i + Math.random() * 0.3
            return new SlimeAgent(
              cx + Math.cos(a) * rho, cy + Math.sin(a) * rho,
              a + Math.PI / 2 + (Math.random() - 0.5),
              0.9 + Math.random() * 1.0
            )
          })

          // Pre-seed pheromone at spoke endpoints so organic growth
          // is attracted to the geometric nodes — structure and life become one
          for (let i = 0; i < N_SPOKES; i++) {
            const a  = spokeAngle(i)
            const nx = cx + Math.cos(a) * R
            const ny = cy + Math.sin(a) * R
            for (let j = 0; j < 22; j++) {
              grid.deposit(
                nx + (Math.random() - 0.5) * R * 0.07,
                ny + (Math.random() - 0.5) * R * 0.07,
                0.88
              )
            }
          }

          // Harmonograph turtles — musical frequency ratios
          const configs = [
            { f1:3, f2:2, A:R*0.40, B:R*0.14, p1:0,            p2:Math.PI/2,  p3:0.4,        p4:1.1, n:0,  h:260, gold:true,  w:1.3  },
            { f1:3, f2:2, A:R*0.36, B:R*0.11, p1:Math.PI*0.35, p2:Math.PI*0.9,p3:0.7,        p4:0.3, n:7,  h:240, gold:false, w:1.0  },
            { f1:4, f2:3, A:R*0.33, B:R*0.10, p1:0,            p2:Math.PI/3,  p3:Math.PI/5,  p4:0.8, n:14, h:220, gold:true,  w:0.95 },
            { f1:4, f2:3, A:R*0.30, B:R*0.09, p1:Math.PI*0.6,  p2:0.2,        p3:Math.PI*0.8,p4:1.5, n:21, h:200, gold:false, w:0.85 },
            { f1:5, f2:4, A:R*0.27, B:R*0.08, p1:0,            p2:Math.PI/4,  p3:0.6,        p4:0.2, n:28, h:190, gold:true,  w:0.85 },
            { f1:7, f2:4, A:R*0.24, B:R*0.08, p1:Math.PI/3,    p2:Math.PI/2,  p3:1.0,        p4:0.5, n:35, h:180, gold:false, w:0.75 },
            { f1:2, f2:1, A:R*0.21, B:R*0.07, p1:Math.PI/2,    p2:0,          p3:0.3,        p4:0.9, n:42, h:170, gold:false, w:0.75 },
            { f1:5, f2:3, A:R*0.19, B:R*0.06, p1:0.1,          p2:1.2,        p3:0.5,        p4:0.8, n:49, h:160, gold:true,  w:0.7  },
          ]
          turtles = configs.map(c => new HarmonographTurtle(
            c.A, c.B, c.f1, c.f2, c.p1, c.p2, c.p3, c.p4, c.n, c.h,
            c.gold ? GR : MR, c.gold ? GG : MG, c.gold ? GB : MB,
            c.gold ? 75 : 56, c.w
          ))

          // Flow particles
          flow = Array.from({ length: 160 }, () => new FlowParticle())

          // Neural nodes
          nodes = Array.from({ length: 14 }, (_, i) => {
            const a = (TAU / 14) * i
            const r = R * (0.18 + (i % 3) * 0.22) * (0.85 + Math.random() * 0.3)
            return new NeuralNode(
              cx + Math.cos(a) * r, cy + Math.sin(a) * r,
              R * (0.022 + Math.random() * 0.018), i * 0.45
            )
          })

          // Warm-up: 400 silent steps so pattern is established on first paint
          for (let i = 0; i < 400; i++) {
            globalT++
            for (const a of agents)  a.step(grid, globalT)
            for (const t of turtles) t.advance(globalT)
            for (const f of flow)    f.step(globalT)
            if (i % 2 === 0) { grid.decay(0.96); grid.diffuse() }
          }
        }

        // ── P5 LIFECYCLE ──────────────────────────────────────────
        p.setup = () => {
          const canvas = p.createCanvas(W, H)
          if (fullscreen) canvas.style('display', 'block')
          p.smooth()
          buildAll()
        }

        p.windowResized = () => {
          if (!fullscreen) return
          W = window.innerWidth; H = window.innerHeight
          cx = W / 2; cy = H / 2
          R = Math.min(W, H) * (showText ? 0.30 : 0.38)
          p.resizeCanvas(W, H)
          buildAll()
        }

        p.draw = () => {
          p.clear()
          globalT++

          // Layer 0 — geometric skeleton (hub/spokes/nodes/rings)
          drawGeometry(globalT)

          // Layer 1 — flow field particles (background haze)
          for (const f of flow) { f.step(globalT); f.draw() }

          // Layer 2 — slime mold network (grows toward geometric nodes)
          if (globalT % 2 === 0) { grid.decay(0.965); grid.diffuse() }
          for (const a of agents) { a.step(grid, globalT); a.draw() }

          // Layer 3 — neural nodes
          for (const n of nodes) n.draw(globalT)

          // Layer 4 — harmonograph turtles (musical Lissajous curves)
          for (const t of turtles) { t.advance(globalT); t.draw() }

          // Layer 5 — centre focal pulse (hub accent)
          const pulse = 1 + 0.12 * Math.sin(globalT * 0.038)
          p.noFill()
          p.stroke(GR, GG, GB, 55); p.strokeWeight(1)
          p.circle(cx, cy, R * 0.065 * pulse * 2)
          p.stroke(MR, MG, MB, 38); p.strokeWeight(0.8)
          p.circle(cx, cy, R * 0.028 * 2)
          p.fill(GR, GG, GB, 110); p.noStroke()
          p.circle(cx, cy, 4.5)

          // Layer 6 — ORCHIA / STUDIO typography
          drawText()
        }
      }

      p5Instance = new P5(sketch, containerRef.current!)
    })

    return () => { cancelled = true; p5Instance?.remove() }
  }, [size, fullscreen, showText])

  return (
    <div
      ref={containerRef}
      className={className}
      style={fullscreen ? {
        lineHeight: 0,
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      } : {
        lineHeight: 0,
        width: size,
        height: size,
        flexShrink: 0,
        overflow: 'visible',
        display: 'block',
      }}
    />
  )
}
