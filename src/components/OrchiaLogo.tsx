import { useEffect, useRef } from 'react'

interface Props {
  width?: number
  height?: number
  className?: string
}

export default function OrchiaLogo({ width = 480, height = 300, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let p5Instance: any

    import('p5').then(({ default: P5 }) => {
      if (!containerRef.current) return

      const sketch = (p: any) => {
        const W = width
        const H = height

        // Grid — right ~40% of canvas
        const G_COLS = 5
        const G_ROWS = 5
        const gLeft  = W * 0.55
        const gRight = W * 0.97
        const gTop   = H * 0.06
        const gBot   = H * 0.94
        const cellW  = (gRight - gLeft) / (G_COLS - 1)
        const cellH  = (gBot   - gTop)  / (G_ROWS - 1)
        const rowY   = Array.from({ length: G_ROWS }, (_, r) => gTop + r * cellH)

        // 12 curves: starts spread over full canvas height, ends at 5 grid rows
        const curves = [
          { startY: H * 0.00, row: 0 },
          { startY: H * 0.09, row: 0 },
          { startY: H * 0.18, row: 0 },
          { startY: H * 0.30, row: 1 },
          { startY: H * 0.40, row: 1 },
          { startY: H * 0.49, row: 2 },
          { startY: H * 0.56, row: 2 },
          { startY: H * 0.65, row: 3 },
          { startY: H * 0.74, row: 3 },
          { startY: H * 0.83, row: 4 },
          { startY: H * 0.92, row: 4 },
          { startY: H * 1.00, row: 4 },
        ]

        // Warm gray — matches --text-muted (#7A736B)
        const CR = 122, CG = 115, CB = 107

        let t = 0

        p.setup = () => {
          p.createCanvas(W, H)
          p.smooth()
          p.noFill()
        }

        p.draw = () => {
          p.clear()
          t += 0.007

          for (let i = 0; i < curves.length; i++) {
            const { startY, row } = curves[i]
            const endY = rowY[row]

            // Breathing wave — travels left→right (subtract x-based phase)
            const wave = Math.sin(t * 1.1 - i * 0.32) * 5

            // S-curve: horizontal tangent at start, horizontal arrival at grid
            const cp1x = gLeft * 0.30
            const cp1y = startY + wave
            const cp2x = gLeft * 0.68
            const cp2y = endY - wave

            // Draw curve
            p.stroke(CR, CG, CB, 68)
            p.strokeWeight(1.15)
            p.noFill()
            p.bezier(0, startY, cp1x, cp1y, cp2x, cp2y, gLeft, endY)

            // Traveling particle (flows left → right)
            const u = ((t * 0.20) + i * (1 / curves.length)) % 1.0
            const fx = p.bezierPoint(0,      cp1x, cp2x, gLeft, u)
            const fy = p.bezierPoint(startY, cp1y, cp2y, endY,  u)
            p.fill(CR, CG, CB, 160)
            p.noStroke()
            p.circle(fx, fy, 3.0)

            // Start dot
            const dr = 2.2 + Math.sin(t * 1.4 + i * 0.55) * 0.5
            p.fill(CR, CG, CB, 120)
            p.noStroke()
            p.circle(0, startY, dr * 2)
          }

          drawGrid()
        }

        const drawGrid = () => {
          p.noFill()

          // Horizontal lines
          p.stroke(CR, CG, CB, 65)
          p.strokeWeight(1.15)
          for (let r = 0; r < G_ROWS; r++) {
            p.line(gLeft, rowY[r], gRight, rowY[r])
          }

          // Vertical lines
          for (let c = 0; c < G_COLS; c++) {
            const x = gLeft + c * cellW
            p.line(x, gTop, x, gBot)
          }

          // Intersection dots — ripple outward from left column
          p.noStroke()
          for (let r = 0; r < G_ROWS; r++) {
            for (let c = 0; c < G_COLS; c++) {
              const x = gLeft + c * cellW
              const y = rowY[r]
              // Phase delay increases with column (ripple effect)
              const phase = t * 0.85 - c * 0.55 + r * 0.40
              const dr = 2.1 + Math.sin(phase) * 0.55
              p.fill(CR, CG, CB, 118)
              p.circle(x, y, dr * 2)
            }
          }
        }
      }

      p5Instance = new P5(sketch, containerRef.current!)
    })

    return () => p5Instance?.remove()
  }, [width, height])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ lineHeight: 0 }}
    />
  )
}
