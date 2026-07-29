import { useEffect, useRef } from 'react'

/**
 * The marketing site's flowing-curve backdrop, recoloured for the dark film
 * shell and drawn straight onto a 2D canvas.
 *
 * The geometry is the same sketch as `OrchiaBackground`: twelve bezier curves
 * sweeping from the left edge into a 5x5 grid on the right, each carrying a
 * travelling dot, with the grid nodes rippling. That component runs on p5,
 * which is a ~1.1MB dependency — far too much to put in front of the landing
 * page for line work this simple, hence this direct port.
 */

/* Warm paper, matching the film's own palette rather than the linen site. */
const LINE = '237, 225, 202'

const G_COLS = 5
const G_ROWS = 5

const CURVES = [
  { fY: 0.0, row: 0 },
  { fY: 0.09, row: 0 },
  { fY: 0.18, row: 0 },
  { fY: 0.3, row: 1 },
  { fY: 0.4, row: 1 },
  { fY: 0.49, row: 2 },
  { fY: 0.56, row: 2 },
  { fY: 0.65, row: 3 },
  { fY: 0.74, row: 3 },
  { fY: 0.83, row: 4 },
  { fY: 0.92, row: 4 },
  { fY: 1.0, row: 4 },
] as const

/* Alphas are lifted from the original, then scaled: light lines on near-black
   need more weight than dark lines on linen to read the same. */
const BOOST = 2.1
const rgba = (alpha: number) => `rgba(${LINE}, ${Math.min(1, (alpha / 255) * BOOST)})`

/** Point on a cubic bezier at t — p5's `bezierPoint`. */
const bezierPoint = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

export default function FilmBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let gLeft = 0
    let gRight = 0
    let gTop = 0
    let gBot = 0
    let cellW = 0
    let rowY: number[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      gLeft = width * 0.56
      gRight = width * 0.97
      gTop = height * 0.06
      gBot = height * 0.94
      cellW = (gRight - gLeft) / (G_COLS - 1)
      const cellH = (gBot - gTop) / (G_ROWS - 1)
      rowY = Array.from({ length: G_ROWS }, (_, r) => gTop + r * cellH)
    }

    const dot = (x: number, y: number, radius: number, alpha: number) => {
      ctx.fillStyle = rgba(alpha)
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    let t = 0
    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      t += 0.007
      ctx.lineWidth = 1.1

      for (let i = 0; i < CURVES.length; i++) {
        const startY = CURVES[i].fY * height
        const endY = rowY[CURVES[i].row]
        const wave = Math.sin(t * 1.1 - i * 0.32) * (height * 0.016)

        const cp1x = gLeft * 0.3
        const cp1y = startY + wave
        const cp2x = gLeft * 0.68
        const cp2y = endY - wave

        ctx.strokeStyle = rgba(38)
        ctx.beginPath()
        ctx.moveTo(0, startY)
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, gLeft, endY)
        ctx.stroke()

        // Travelling particle
        const u = ((t * 0.2 + i * (1 / CURVES.length)) % 1) as number
        dot(
          bezierPoint(0, cp1x, cp2x, gLeft, u),
          bezierPoint(startY, cp1y, cp2y, endY, u),
          1.4,
          90,
        )

        // Start dot
        dot(0, startY, 2.1 + Math.sin(t * 1.4 + i * 0.55) * 0.5, 65)
      }

      // Grid
      ctx.strokeStyle = rgba(36)
      ctx.beginPath()
      for (let r = 0; r < G_ROWS; r++) {
        ctx.moveTo(gLeft, rowY[r])
        ctx.lineTo(gRight, rowY[r])
      }
      for (let c = 0; c < G_COLS; c++) {
        const x = gLeft + c * cellW
        ctx.moveTo(x, gTop)
        ctx.lineTo(x, gBot)
      }
      ctx.stroke()

      // Grid nodes — ripple outward from the left column
      for (let r = 0; r < G_ROWS; r++) {
        for (let c = 0; c < G_COLS; c++) {
          const radius = 2.0 + Math.sin(t * 0.85 - c * 0.55 + r * 0.4) * 0.5
          dot(gLeft + c * cellW, rowY[r], radius, 72)
        }
      }

      if (!reduceMotion) {
        frame = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}
