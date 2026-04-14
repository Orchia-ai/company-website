import { useEffect, useRef } from 'react'

interface Props {
  size?: number
  className?: string
}

export default function OrchiaLogo({ size = 280, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let p5Instance: any

    let cancelled = false

    import('p5').then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return

      const sketch = (p: any) => {
        const W = size
        const H = size
        const cx = W / 2
        const cy = H / 2
        // Far arms reach R * 2.85 — back-calculate so they land at canvas edge minus padding
        const R = (size * 0.5 - size * 0.025) / 2.85

        // Site palette
        const [MR, MG, MB] = [122, 115, 107]  // --text-muted warm gray
        const [GR, GG, GB] = [139, 105, 20]   // --accent gold

        let t = 0
        const d2r = (deg: number) => (deg * Math.PI) / 180

        // ── Primitive helpers ──────────────────────────────────

        const solidRing = (r: number, cr: number, cg: number, cb: number, a: number, sw = 1.0) => {
          p.noFill(); p.stroke(cr, cg, cb, a); p.strokeWeight(sw)
          p.circle(0, 0, r * 2)
        }

        const doubleRing = (r: number, cr: number, cg: number, cb: number, a: number) => {
          solidRing(r, cr, cg, cb, a)
          solidRing(r * 0.958, cr, cg, cb, a * 0.5, 0.7)
        }

        // Evenly spaced arcs (mechanical dashed ring)
        const arcSegmentRing = (r: number, count: number, spanDeg: number, cr: number, cg: number, cb: number, a: number) => {
          p.noFill(); p.stroke(cr, cg, cb, a); p.strokeWeight(1)
          const step = 360 / count
          for (let i = 0; i < count; i++) {
            const s = d2r(step * i)
            const e = d2r(step * i + spanDeg)
            p.arc(0, 0, r * 2, r * 2, s, e)
          }
        }

        // Dotted ring of pulsing circles
        const dottedRing = (r: number, n: number, cr: number, cg: number, cb: number, a: number) => {
          p.noStroke()
          for (let i = 0; i < n; i++) {
            const rad = d2r((360 / n) * i)
            const dr = 1.25 + Math.sin(t * 0.038 + i * 0.21) * 0.32
            p.fill(cr, cg, cb, a)
            p.circle(Math.cos(rad) * r, Math.sin(rad) * r, dr * 2)
          }
        }

        // Regular polygon with notched alternating vertices
        const notchedPolygon = (r: number, sides: number, cr: number, cg: number, cb: number, a: number, sw = 1.0) => {
          p.stroke(cr, cg, cb, a); p.strokeWeight(sw); p.noFill()
          p.beginShape()
          for (let i = 0; i <= sides; i++) {
            const rad = d2r((360 / sides) * i - 90)
            const rv = i % 2 === 0 ? r : r * 0.89
            p.vertex(Math.cos(rad) * rv, Math.sin(rad) * rv)
          }
          p.endShape()
        }

        // Polygram: connects every `step`-th of `n` points (star)
        const polygram = (r: number, n: number, step: number, cr: number, cg: number, cb: number, a: number, sw = 0.75) => {
          p.stroke(cr, cg, cb, a); p.strokeWeight(sw); p.noFill()
          for (let i = 0; i < n; i++) {
            const a1 = d2r((360 / n) * i - 90)
            const a2 = d2r((360 / n) * ((i + step) % n) - 90)
            p.line(Math.cos(a1) * r, Math.sin(a1) * r, Math.cos(a2) * r, Math.sin(a2) * r)
          }
        }

        // Spokes from innerR to outerR, n rays
        const spokeRing = (innerR: number, outerR: number, n: number, cr: number, cg: number, cb: number, a: number, sw = 0.8) => {
          p.stroke(cr, cg, cb, a); p.strokeWeight(sw)
          for (let i = 0; i < n; i++) {
            const rad = d2r((360 / n) * i)
            p.line(Math.cos(rad) * innerR, Math.sin(rad) * innerR,
                   Math.cos(rad) * outerR, Math.sin(rad) * outerR)
          }
        }

        // Outward petals — quadratic arc between adjacent spoke tips (convex outward)
        const outwardPetals = (r: number, n: number, bulge: number, cr: number, cg: number, cb: number, a: number) => {
          p.noFill()
          for (let i = 0; i < n; i++) {
            const a1 = d2r((360 / n) * i - 90)
            const a2 = d2r((360 / n) * (i + 1) - 90)
            const am = d2r((360 / n) * (i + 0.5) - 90)
            const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r
            const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r
            const cpx = Math.cos(am) * r * bulge
            const cpy = Math.sin(am) * r * bulge
            p.stroke(cr, cg, cb, a); p.strokeWeight(0.9)
            p.beginShape(); p.vertex(x1, y1); p.quadraticVertex(cpx, cpy, x2, y2); p.endShape()
            // Spoke-tip dot
            const dr = 1.55 + Math.sin(t * 0.055 + i * 0.42) * 0.3
            p.fill(cr, cg, cb, a + 20); p.noStroke()
            p.circle(x1, y1, dr * 2)
          }
        }

        // Inward teardrop petals: outer ring points → inner ring (bezier width)
        const inwardTeardrops = (outerR: number, innerR: number, n: number, cr: number, cg: number, cb: number, a: number) => {
          p.noFill()
          for (let i = 0; i < n; i++) {
            const ang = d2r((360 / n) * i - 90)
            const perp = ang + Math.PI / 2
            const ox = Math.cos(ang) * outerR, oy = Math.sin(ang) * outerR
            const ix = Math.cos(ang) * innerR, iy = Math.sin(ang) * innerR
            const spread = (outerR - innerR) * 0.38
            const mid = (outerR + innerR) * 0.5
            const cpx1 = Math.cos(ang) * mid + Math.cos(perp) * spread
            const cpy1 = Math.sin(ang) * mid + Math.sin(perp) * spread
            const cpx2 = Math.cos(ang) * mid - Math.cos(perp) * spread
            const cpy2 = Math.sin(ang) * mid - Math.sin(perp) * spread
            p.stroke(cr, cg, cb, a); p.strokeWeight(0.85)
            // Left edge
            p.beginShape(); p.vertex(ox, oy)
            p.bezierVertex(cpx1, cpy1, cpx1, cpy1, ix, iy); p.endShape()
            // Right edge
            p.beginShape(); p.vertex(ox, oy)
            p.bezierVertex(cpx2, cpy2, cpx2, cpy2, ix, iy); p.endShape()
            // Outer tip dot
            const dr = 1.4 + Math.sin(t * 0.06 + i * 0.55) * 0.28
            p.fill(cr, cg, cb, a + 15); p.noStroke()
            p.circle(ox, oy, dr * 2)
          }
        }

        // Chevron markers at ring-spoke intersections (pointing inward)
        const spokeChevrons = (r: number, n: number, cr: number, cg: number, cb: number, a: number) => {
          const s = R * 0.028
          p.stroke(cr, cg, cb, a); p.strokeWeight(0.8); p.noFill()
          for (let i = 0; i < n; i++) {
            const ang = d2r((360 / n) * i)
            const cos = Math.cos(ang), sin = Math.sin(ang)
            const px = -sin, py = cos
            // Two lines meeting at inner tip
            const tip = r - s * 1.1
            p.line(cos * r + px * s, sin * r + py * s, cos * tip, sin * tip)
            p.line(cos * r - px * s, sin * r - py * s, cos * tip, sin * tip)
          }
        }

        // Small lozenge at ring-spoke crossing
        const lozengeMarkers = (r: number, n: number, cr: number, cg: number, cb: number, a: number) => {
          const s = R * 0.022
          p.stroke(cr, cg, cb, a); p.strokeWeight(0.8); p.noFill()
          for (let i = 0; i < n; i++) {
            const ang = d2r((360 / n) * i)
            const cos = Math.cos(ang), sin = Math.sin(ang)
            const px = -sin, py = cos
            const cx2 = cos * r, cy2 = sin * r
            p.quad(
              cx2 + px * s,      cy2 + py * s,
              cx2 + cos * s,     cy2 + sin * s,
              cx2 - px * s,      cy2 - py * s,
              cx2 - cos * s,     cy2 - sin * s
            )
          }
        }

        // ── Circuit arms ────────────────────────────────────────
        const drawCircuitArms = () => {
          const near = R * 1.04
          const far  = R * 2.85

          for (let i = 0; i < 8; i++) {
            const ang = d2r(45 * i)
            const cos = Math.cos(ang), sin = Math.sin(ang)
            const px = -sin, py = cos  // perpendicular

            if (i % 2 === 0) {
              // Cardinal arm — long + 3 circuit notch sets
              p.stroke(MR, MG, MB, 30); p.strokeWeight(1); p.noFill()
              p.line(cos * near, sin * near, cos * far, sin * far)

              // Notch set 1 (close)
              const n1s = R * 1.42, n1e = R * 1.60, nL1 = R * 0.095
              p.line(cos*n1s, sin*n1s, cos*n1s + px*nL1, sin*n1s + py*nL1)
              p.line(cos*n1s + px*nL1, sin*n1s + py*nL1, cos*n1e + px*nL1, sin*n1e + py*nL1)
              p.line(cos*n1e + px*nL1, sin*n1e + py*nL1, cos*n1e, sin*n1e)
              // Mirrored branch
              const nL1b = nL1 * 0.65
              p.line(cos*n1s, sin*n1s, cos*n1s - px*nL1b, sin*n1s - py*nL1b)
              p.line(cos*n1s - px*nL1b, sin*n1s - py*nL1b, cos*(n1s + R*0.09) - px*nL1b, sin*(n1s + R*0.09) - py*nL1b)
              p.line(cos*(n1s + R*0.09) - px*nL1b, sin*(n1s + R*0.09) - py*nL1b, cos*(n1s + R*0.09), sin*(n1s + R*0.09))
              // Endpoint dot on mirrored
              p.fill(MR, MG, MB, 48); p.noStroke()
              p.circle(cos*(n1s + R*0.09), sin*(n1s + R*0.09), 3)
              p.noFill(); p.stroke(MR, MG, MB, 30); p.strokeWeight(1)

              // Notch set 2 (mid)
              const n2s = R * 1.88, n2e = R * 2.05, nL2 = R * 0.082
              p.line(cos*n2s, sin*n2s, cos*n2s - px*nL2, sin*n2s - py*nL2)
              p.line(cos*n2s - px*nL2, sin*n2s - py*nL2, cos*n2e - px*nL2, sin*n2e - py*nL2)
              p.line(cos*n2e - px*nL2, sin*n2e - py*nL2, cos*n2e, sin*n2e)
              // Sub-branch off notch 2
              const n2mid = R * 1.96, nL2b = R * 0.062
              p.line(cos*n2mid - px*nL2, sin*n2mid - py*nL2,
                     cos*n2mid - px*(nL2 + nL2b), sin*n2mid - py*(nL2 + nL2b))
              p.line(cos*n2mid - px*(nL2 + nL2b), sin*n2mid - py*(nL2 + nL2b),
                     cos*(n2mid + R*0.08) - px*(nL2 + nL2b), sin*(n2mid + R*0.08) - py*(nL2 + nL2b))
              p.fill(MR, MG, MB, 50); p.noStroke()
              p.circle(cos*(n2mid + R*0.08) - px*(nL2 + nL2b), sin*(n2mid + R*0.08) - py*(nL2 + nL2b), 3.2)
              p.noFill(); p.stroke(MR, MG, MB, 30); p.strokeWeight(1)

              // Notch set 3 (far)
              const n3s = R * 2.35, n3e = R * 2.48, nL3 = R * 0.072
              p.line(cos*n3s, sin*n3s, cos*n3s + px*nL3, sin*n3s + py*nL3)
              p.line(cos*n3s + px*nL3, sin*n3s + py*nL3, cos*n3e + px*nL3, sin*n3e + py*nL3)
              p.line(cos*n3e + px*nL3, sin*n3e + py*nL3, cos*n3e, sin*n3e)

              // Terminal cap: 2 terminal dots
              p.fill(MR, MG, MB, 58); p.noStroke()
              p.circle(cos*far, sin*far, 5.2)
              p.circle(cos*(far - R*0.14), sin*(far - R*0.14), 3.0)
              // Node mid-arm
              const nodePulse = 2.0 + Math.sin(t * 0.045 + i * 1.1) * 0.5
              p.circle(cos * R * 2.1, sin * R * 2.1, nodePulse * 2)
              p.noFill()

            } else {
              // Diagonal arm — medium with 2 notch sets
              const diagFar = R * 1.90
              p.stroke(MR, MG, MB, 22); p.strokeWeight(0.9); p.noFill()
              p.line(cos*near, sin*near, cos*diagFar, sin*diagFar)

              const d1s = R * 1.38, d1e = R * 1.52, dL1 = R * 0.075
              p.line(cos*d1s, sin*d1s, cos*d1s + px*dL1, sin*d1s + py*dL1)
              p.line(cos*d1s + px*dL1, sin*d1s + py*dL1, cos*d1e + px*dL1, sin*d1e + py*dL1)
              p.line(cos*d1e + px*dL1, sin*d1e + py*dL1, cos*d1e, sin*d1e)

              const d2s = R * 1.68, d2e = R * 1.78, dL2 = R * 0.06
              p.line(cos*d2s, sin*d2s, cos*d2s - px*dL2, sin*d2s - py*dL2)
              p.line(cos*d2s - px*dL2, sin*d2s - py*dL2, cos*d2e - px*dL2, sin*d2e - py*dL2)
              p.line(cos*d2e - px*dL2, sin*d2e - py*dL2, cos*d2e, sin*d2e)

              p.fill(MR, MG, MB, 46); p.noStroke()
              p.circle(cos*diagFar, sin*diagFar, 4.0)
              p.noFill()
            }

            // Intersection node at main ring
            const intPulse = 1.9 + Math.sin(t * 0.042 + i * 0.78) * 0.42
            p.fill(MR, MG, MB, 68); p.noStroke()
            p.circle(cos * near, sin * near, intPulse * 2)
            p.noFill()
          }
        }

        // ── Core ────────────────────────────────────────────────
        const drawCore = () => {
          // Innermost ring pair
          solidRing(R * 0.215, MR, MG, MB, 68, 0.85)
          solidRing(R * 0.185, MR, MG, MB, 40, 0.7)

          // 6-pointed asterisk
          p.stroke(MR, MG, MB, 75); p.strokeWeight(1)
          const cR = R * 0.165
          for (let i = 0; i < 6; i++) {
            const rad = d2r(60 * i)
            p.line(Math.cos(rad) * cR, Math.sin(rad) * cR,
                   Math.cos(rad + Math.PI) * cR, Math.sin(rad + Math.PI) * cR)
          }

          // Gold accent ring just outside asterisk
          p.noFill(); p.stroke(GR, GG, GB, 48); p.strokeWeight(0.8)
          p.circle(0, 0, R * 0.26 * 2)

          // Central pulsing dot
          const pulse = 3.2 + Math.sin(t * 0.055) * 0.9
          p.fill(MR, MG, MB, 112); p.noStroke()
          p.circle(0, 0, pulse * 2)
        }

        // ── Particles ────────────────────────────────────────────
        const drawParticles = () => {
          // Along 4 cardinal arms
          for (let i = 0; i < 4; i++) {
            const rad = d2r(90 * i)
            const u = ((t * 0.0065) + i * 0.25) % 1.0
            const dist = R * 1.04 + u * (R * 2.85 - R * 1.04)
            p.fill(MR, MG, MB, 148); p.noStroke()
            p.circle(Math.cos(rad) * dist, Math.sin(rad) * dist, 2.6)
          }
          // 2 orbiting outer polygon ring
          for (let i = 0; i < 2; i++) {
            const rad = d2r(((t * 0.42) + i * 180) % 360)
            p.fill(GR, GG, GB, 95); p.noStroke()
            p.circle(Math.cos(rad) * R * 0.78, Math.sin(rad) * R * 0.78, 2.0)
          }
          // 3 orbiting inner gold ring
          for (let i = 0; i < 3; i++) {
            const rad = d2r(((t * 0.68) + i * 120) % 360)
            p.fill(GR, GG, GB, 82); p.noStroke()
            p.circle(Math.cos(rad) * R * 0.52, Math.sin(rad) * R * 0.52, 1.8)
          }
          // 1 slow orbiting innermost zone
          {
            const rad = d2r((t * 0.28) % 360)
            p.fill(MR, MG, MB, 90); p.noStroke()
            p.circle(Math.cos(rad) * R * 0.32, Math.sin(rad) * R * 0.32, 1.6)
          }
        }

        // ── Main draw loop ───────────────────────────────────────
        p.draw = () => {
          p.clear()
          t += 0.18

          p.push()
          p.translate(cx, cy)
          p.noFill()

          // Layer 1 — circuit arms (outermost, static angle)
          drawCircuitArms()

          // Layer 2 — outer dotted scattering ring
          dottedRing(R * 1.13, 84, MR, MG, MB, 36)

          // Layer 3 — main circle (solid)
          solidRing(R, MR, MG, MB, 82, 1.05)

          // Layer 4 — arc-segment ring (mechanical, CW slow)
          p.push(); p.rotate(t * 0.010)
          arcSegmentRing(R * 0.935, 28, 9.5, GR, GG, GB, 40)
          p.pop()

          // Layer 5 — outward petal ring 16 (CCW)
          p.push(); p.rotate(-t * 0.007)
          outwardPetals(R * 0.83, 16, 1.20, GR, GG, GB, 46)
          p.pop()

          // Layer 6 — spokes (outer, 16 rays, CW slow)
          p.push(); p.rotate(t * 0.005)
          spokeRing(R * 0.83, R, 16, MR, MG, MB, 28, 0.8)
          p.pop()

          // Layer 7 — notched 12-gon (CCW)
          p.push(); p.rotate(-t * 0.013)
          notchedPolygon(R * 0.80, 12, MR, MG, MB, 50)
          p.pop()

          // Layer 8 — chevron markers at 12-gon radius (static)
          spokeChevrons(R * 0.80, 12, MR, MG, MB, 28)

          // Layer 9 — double ring at 0.69
          doubleRing(R * 0.69, MR, MG, MB, 42)

          // Layer 10 — 12-polygram star (CW medium)
          p.push(); p.rotate(t * 0.008)
          polygram(R * 0.67, 12, 5, GR, GG, GB, 26, 0.75)
          p.pop()

          // Layer 11 — inner spokes 24 rays (CCW)
          p.push(); p.rotate(-t * 0.007)
          spokeRing(R * 0.35, R * 0.67, 24, MR, MG, MB, 22, 0.7)
          p.pop()

          // Layer 12 — inward teardrop petals 16 (CW)
          p.push(); p.rotate(t * 0.009)
          inwardTeardrops(R * 0.60, R * 0.41, 16, GR, GG, GB, 40)
          p.pop()

          // Layer 13 — dotted gold ring at 0.575
          dottedRing(R * 0.575, 48, GR, GG, GB, 48)

          // Layer 14 — arc-segment ring at 0.50 (CCW, different arc length)
          p.push(); p.rotate(-t * 0.016)
          arcSegmentRing(R * 0.50, 18, 14, MR, MG, MB, 46)
          p.pop()

          // Layer 15 — notched 8-gon (CW faster)
          p.push(); p.rotate(t * 0.020)
          notchedPolygon(R * 0.455, 8, GR, GG, GB, 50)
          p.pop()

          // Layer 16 — lozenge markers at 8-gon vertices
          p.push(); p.rotate(t * 0.020)
          lozengeMarkers(R * 0.455, 8, GR, GG, GB, 38)
          p.pop()

          // Layer 17 — 8-polygram inner star (CCW)
          p.push(); p.rotate(-t * 0.011)
          polygram(R * 0.44, 8, 3, MR, MG, MB, 32, 0.72)
          p.pop()

          // Layer 18 — small outward petals ring (12, CCW)
          p.push(); p.rotate(-t * 0.013)
          outwardPetals(R * 0.335, 12, 1.30, MR, MG, MB, 38)
          p.pop()

          // Layer 19 — inner dotted ring
          dottedRing(R * 0.29, 24, MR, MG, MB, 56)

          // Layer 20 — core
          drawCore()

          // Particles (top layer)
          drawParticles()

          p.pop()
        }
      }

      p5Instance = new P5(sketch, containerRef.current!)
    })

    return () => { cancelled = true; p5Instance?.remove() }
  }, [size])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
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
