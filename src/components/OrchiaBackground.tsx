import { useEffect, useRef } from 'react'

export default function OrchiaBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let p5Instance: any

    let cancelled = false

    import('p5').then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return

      const sketch = (p: any) => {
        let W = window.innerWidth
        let H = window.innerHeight

        // Grid — right portion
        const G_COLS = 5
        const G_ROWS = 5
        let gLeft: number, gRight: number, gTop: number, gBot: number
        let cellW: number, cellH: number, rowY: number[]

        const buildGrid = () => {
          gLeft  = W * 0.56
          gRight = W * 0.97
          gTop   = H * 0.06
          gBot   = H * 0.94
          cellW  = (gRight - gLeft) / (G_COLS - 1)
          cellH  = (gBot   - gTop)  / (G_ROWS - 1)
          rowY   = Array.from({ length: G_ROWS }, (_, r) => gTop + r * cellH)
        }

        const curves = [
          { fY: 0.00, row: 0 },
          { fY: 0.09, row: 0 },
          { fY: 0.18, row: 0 },
          { fY: 0.30, row: 1 },
          { fY: 0.40, row: 1 },
          { fY: 0.49, row: 2 },
          { fY: 0.56, row: 2 },
          { fY: 0.65, row: 3 },
          { fY: 0.74, row: 3 },
          { fY: 0.83, row: 4 },
          { fY: 0.92, row: 4 },
          { fY: 1.00, row: 4 },
        ]

        // Warm gray matching --text-muted (#7A736B)
        const CR = 122, CG = 115, CB = 107

        let t = 0

        p.setup = () => {
          const canvas = p.createCanvas(W, H)
          canvas.style('display', 'block')
          buildGrid()
          p.smooth()
          p.noFill()
        }

        p.windowResized = () => {
          W = window.innerWidth
          H = window.innerHeight
          p.resizeCanvas(W, H)
          buildGrid()
        }

        p.draw = () => {
          p.clear()
          t += 0.007

          for (let i = 0; i < curves.length; i++) {
            const startY = curves[i].fY * H
            const endY   = rowY[curves[i].row]

            const wave = Math.sin(t * 1.1 - i * 0.32) * (H * 0.016)

            const cp1x = gLeft * 0.30
            const cp1y = startY + wave
            const cp2x = gLeft * 0.68
            const cp2y = endY   - wave

            // Curve
            p.stroke(CR, CG, CB, 38)
            p.strokeWeight(1.1)
            p.noFill()
            p.bezier(0, startY, cp1x, cp1y, cp2x, cp2y, gLeft, endY)

            // Traveling particle
            const u  = ((t * 0.20) + i * (1 / curves.length)) % 1.0
            const fx = p.bezierPoint(0,      cp1x, cp2x, gLeft, u)
            const fy = p.bezierPoint(startY, cp1y, cp2y, endY,  u)
            p.fill(CR, CG, CB, 90)
            p.noStroke()
            p.circle(fx, fy, 2.8)

            // Start dot
            const dr = 2.1 + Math.sin(t * 1.4 + i * 0.55) * 0.5
            p.fill(CR, CG, CB, 65)
            p.noStroke()
            p.circle(0, startY, dr * 2)
          }

          // Grid lines
          p.noFill()
          p.stroke(CR, CG, CB, 36)
          p.strokeWeight(1.1)
          for (let r = 0; r < G_ROWS; r++) {
            p.line(gLeft, rowY[r], gRight, rowY[r])
          }
          for (let c = 0; c < G_COLS; c++) {
            const x = gLeft + c * cellW
            p.line(x, gTop, x, gBot)
          }

          // Grid dots — ripple from left column
          p.noStroke()
          for (let r = 0; r < G_ROWS; r++) {
            for (let c = 0; c < G_COLS; c++) {
              const x  = gLeft + c * cellW
              const y  = rowY[r]
              const dr = 2.0 + Math.sin(t * 0.85 - c * 0.55 + r * 0.40) * 0.5
              p.fill(CR, CG, CB, 72)
              p.circle(x, y, dr * 2)
            }
          }
        }
      }

      p5Instance = new P5(sketch, containerRef.current!)
    })

    return () => { cancelled = true; p5Instance?.remove() }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        lineHeight: 0,
      }}
    />
  )
}
