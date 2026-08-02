import { useEffect, useRef } from 'react'

import styles from './home-film-page.module.css'

type Point = { x: number; y: number }

const TAU = Math.PI * 2

/*
 * One person, one climbing loop, five generations.
 *
 * Every turn of the helix is a generation, and nothing on it moves until the
 * person on the left hands feedback in at that turn's left edge. The system
 * runs the turn, drops a longer quality tick on the right, then sends the
 * result back down the same line to the person — who starts the next turn one
 * level up. Each turn it leaves behind is wider, heavier and brighter than the
 * one below it, so the drawing accumulates instead of just repeating.
 */
const CYCLES = 5
const THETA_START = Math.PI
const THETA_END = THETA_START + TAU * CYCLES
const THETA_SPAN = THETA_END - THETA_START

/* A cone rather than a cylinder: radius and pitch both grow with height, so
   later generations are visibly bigger and cover more ground per pass. */
const HELIX = {
  centerX: 402,
  bottomY: 338,
  radiusStart: 116,
  radiusEnd: 168,
  pitchStart: 44,
  pitchEnd: 72,
  depthRatio: 0.105,
} as const

const RAIL_ORIGIN = { x: 120, y: 210 } as const

function helixRadius(theta: number) {
  const u = (theta - THETA_START) / THETA_SPAN
  return HELIX.radiusStart + (HELIX.radiusEnd - HELIX.radiusStart) * u
}

/* Height climbed since the first hand-off — the integral of a pitch that
   itself grows, which is why the turns spread further apart as they rise. */
function helixRise(theta: number) {
  const swept = theta - THETA_START
  const u = swept / THETA_SPAN
  return (
    (swept / TAU) *
    (HELIX.pitchStart + ((HELIX.pitchEnd - HELIX.pitchStart) * u) / 2)
  )
}

function helixPoint(theta: number): Point {
  const radius = helixRadius(theta)
  return {
    x: HELIX.centerX + radius * Math.cos(theta),
    y:
      HELIX.bottomY -
      helixRise(theta) +
      radius * HELIX.depthRatio * Math.sin(theta),
  }
}

function helixTangent(theta: number): Point {
  const radius = helixRadius(theta)
  const radiusRate = (HELIX.radiusEnd - HELIX.radiusStart) / THETA_SPAN
  const u = (theta - THETA_START) / THETA_SPAN
  const pitch = HELIX.pitchStart + (HELIX.pitchEnd - HELIX.pitchStart) * u
  return {
    x: radiusRate * Math.cos(theta) - radius * Math.sin(theta),
    y:
      -pitch / TAU +
      HELIX.depthRatio * (radiusRate * Math.sin(theta) + radius * Math.cos(theta)),
  }
}

function svgNumber(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, '')
}

function svgPoint(point: Point) {
  return `${svgNumber(point.x)} ${svgNumber(point.y)}`
}

/* A quarter-turn at a time keeps the projected helix faithful to its ellipse.
   Each cubic handle follows the analytic tangent at its anchor point. */
function helixPath(start: number, end: number) {
  const commands = [`M${svgPoint(helixPoint(start))}`]
  let theta = start

  while (end - theta > 0.0001) {
    const next = Math.min(theta + Math.PI / 2, end)
    const handle = (4 / 3) * Math.tan((next - theta) / 4)
    const from = helixPoint(theta)
    const to = helixPoint(next)
    const fromTangent = helixTangent(theta)
    const toTangent = helixTangent(next)

    commands.push(
      `C${svgPoint({
        x: from.x + fromTangent.x * handle,
        y: from.y + fromTangent.y * handle,
      })} ${svgPoint({
        x: to.x - toTangent.x * handle,
        y: to.y - toTangent.y * handle,
      })} ${svgPoint(to)}`,
    )
    theta = next
  }

  return commands.join('')
}

const SUMMIT = helixPoint(THETA_END)

/* The one colour ramp the whole drawing runs on, bottom to top. Kept as data
   because flat marks have to sample it themselves — a zero-height bounding box
   never paints a gradient stroke. */
const RAMP = [
  { offset: 0, rgb: [255, 79, 163] },
  { offset: 0.4, rgb: [95, 140, 255] },
  { offset: 0.76, rgb: [207, 255, 61] },
  { offset: 1, rgb: [255, 243, 203] },
] as const

function rampColor(y: number) {
  const at = Math.min(
    Math.max((HELIX.bottomY - y) / (HELIX.bottomY - SUMMIT.y), 0),
    1,
  )
  const upper = RAMP.findIndex((stop) => stop.offset >= at)
  if (upper <= 0) return `rgb(${RAMP[0].rgb.join(' ')})`

  const low = RAMP[upper - 1]
  const high = RAMP[upper]
  const t = (at - low.offset) / (high.offset - low.offset)
  const mix = low.rgb.map((channel, i) => Math.round(channel + (high.rgb[i] - channel) * t))
  return `rgb(${mix.join(' ')})`
}

/* Cycle k starts at the left edge of its own turn, sweeps the far side to the
   right edge, then the near side up to the next left edge. */
const CYCLE_GEOMETRY = Array.from({ length: CYCLES }, (_, index) => {
  const base = THETA_START + TAU * index
  const anchor = helixPoint(base)
  const crest = helixPoint(base + Math.PI)
  const railDelta = (anchor.x - RAIL_ORIGIN.x) * 0.45

  return {
    base,
    anchor,
    crest,
    tone: rampColor(crest.y),
    tickStart: { x: crest.x + 12, y: crest.y },
    tickLength: 10 + index * 12,
    trackWidth: 2.1 + index * 0.42,
    liveWidth: 4.4 + index * 1.15,
    farPath: helixPath(base, base + Math.PI),
    nearPath: helixPath(base + Math.PI, base + TAU),
    railPath:
      `M${svgPoint(RAIL_ORIGIN)}` +
      `C${svgNumber(RAIL_ORIGIN.x + railDelta)} ${svgNumber(RAIL_ORIGIN.y)} ` +
      `${svgNumber(anchor.x - railDelta)} ${svgNumber(anchor.y)} ${svgPoint(anchor)}`,
  }
})

/* Beat lengths in seconds. Each generation runs a little quicker than the one
   before it — the compounding is in the timing as well as the geometry. */
const BEAT = { charge: 0.2, handoff: 0.4, sweep: 0.5, feedback: 0.32 } as const
const SPEEDUP = 0.055
const FINALE = { flare: 0.34, hold: 0.78, fade: 0.5, rest: 0.28 } as const

/* How much of the lit colour survives on the far side of a turn. */
const FAR_DIM = 0.4

const TIMELINE = (() => {
  const cycles: {
    chargeStart: number
    handoffStart: number
    sweepStart: number
    crestAt: number
    sweepEnd: number
    feedbackStart: number
    feedbackEnd: number
  }[] = []
  let cursor = 0

  for (let index = 0; index < CYCLES; index += 1) {
    const scale = 1 - SPEEDUP * index
    const last = index === CYCLES - 1
    const chargeStart = cursor
    const handoffStart = chargeStart + BEAT.charge * scale
    const sweepStart = handoffStart + BEAT.handoff * scale
    const sweepEnd = sweepStart + BEAT.sweep * 2 * scale
    const feedbackEnd = sweepEnd + BEAT.feedback * scale

    cycles.push({
      chargeStart,
      handoffStart,
      sweepStart,
      crestAt: (sweepStart + sweepEnd) / 2,
      sweepEnd,
      feedbackStart: last ? -1 : sweepEnd,
      feedbackEnd: last ? -1 : feedbackEnd,
    })
    cursor = last ? sweepEnd : feedbackEnd
  }

  const flareEnd = cursor + FINALE.flare
  const holdEnd = flareEnd + FINALE.hold
  const fadeEnd = holdEnd + FINALE.fade

  return {
    cycles,
    sweepEnd: cursor,
    flareEnd,
    holdEnd,
    fadeEnd,
    loop: fadeEnd + FINALE.rest,
  }
})()

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - (2 - 2 * value) ** 2 / 2
}

export default function HeroFeedbackLoop() {
  const rootRef = useRef<SVGSVGElement>(null)
  const nearLit = useRef<(SVGPathElement | null)[]>([])
  const farLit = useRef<(SVGPathElement | null)[]>([])
  const railBase = useRef<(SVGPathElement | null)[]>([])
  const railOut = useRef<(SVGPathElement | null)[]>([])
  const railBack = useRef<(SVGPathElement | null)[]>([])
  const railJoin = useRef<(SVGCircleElement | null)[]>([])
  const tickGroup = useRef<(SVGGElement | null)[]>([])
  const tickLine = useRef<(SVGPathElement | null)[]>([])
  const nearHead = useRef<SVGCircleElement>(null)
  const farHead = useRef<SVGCircleElement>(null)
  const sourceGlow = useRef<SVGCircleElement>(null)
  const sourceCore = useRef<SVGCircleElement>(null)
  const summit = useRef<SVGGElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)')

    const paint = (time: number) => {
      const { cycles } = TIMELINE
      const trail =
        time <= TIMELINE.holdEnd
          ? 1
          : 1 - clamp01((time - TIMELINE.holdEnd) / FINALE.fade)

      let headTheta: number | null = null
      let charge = 0.1

      for (let index = 0; index < CYCLES; index += 1) {
        const cycle = cycles[index]
        const turn = easeInOut(
          clamp01((time - cycle.sweepStart) / (cycle.sweepEnd - cycle.sweepStart)),
        )

        const far = farLit.current[index]
        if (far) {
          far.style.strokeDashoffset = `${100 - clamp01(turn * 2) * 100}`
          far.style.opacity = `${trail * FAR_DIM}`
        }

        const near = nearLit.current[index]
        if (near) {
          near.style.strokeDashoffset = `${100 - clamp01(turn * 2 - 1) * 100}`
          near.style.opacity = `${trail}`
        }

        if (time > cycle.sweepStart && time < cycle.sweepEnd) {
          headTheta = CYCLE_GEOMETRY[index].base + turn * TAU
        }

        const tick = clamp01((time - cycle.crestAt) / 0.34)
        const tickBox = tickGroup.current[index]
        if (tickBox) tickBox.style.opacity = `${tick * trail}`
        const tickPath = tickLine.current[index]
        if (tickPath) tickPath.style.strokeDashoffset = `${100 - tick * 100}`

        /* The person sends on this rail, and the previous generation's result
           comes home on it — one line carrying the round trip. */
        const sending =
          time >= cycle.handoffStart && time <= cycle.sweepStart
            ? clamp01((time - cycle.handoffStart) / (cycle.sweepStart - cycle.handoffStart))
            : -1
        const previous = index > 0 ? cycles[index - 1] : null
        const returning =
          previous && previous.feedbackStart >= 0 && time >= previous.feedbackStart && time <= previous.feedbackEnd
            ? clamp01(
                (time - previous.feedbackStart) /
                  (previous.feedbackEnd - previous.feedbackStart),
              )
            : -1

        const out = railOut.current[index]
        if (out) {
          out.style.opacity = sending < 0 ? '0' : `${Math.sin(sending * Math.PI) * 0.4 + 0.6}`
          out.style.strokeDashoffset = `${-100 * Math.max(sending, 0)}`
        }

        const back = railBack.current[index]
        if (back) {
          back.style.opacity = returning < 0 ? '0' : `${Math.sin(returning * Math.PI) * 0.35 + 0.55}`
          back.style.strokeDashoffset = `${-100 * (1 - Math.max(returning, 0))}`
        }

        const rail = railBase.current[index]
        if (rail) {
          const live = Math.max(sending, returning, 0)
          rail.style.opacity = `${0.14 + live * 0.45}`
        }

        /* Where the feedback landed. Flashes on arrival, then stays as a mark
           on the left edge of every turn the person started. */
        const join = railJoin.current[index]
        if (join) {
          const started = time >= cycle.handoffStart
          const arrival = Math.max(
            sending >= 0 ? sending ** 3 : 0,
            started ? 1 - clamp01((time - cycle.sweepStart) / 0.35) : 0,
          )
          join.style.opacity = `${(started ? 0.4 + arrival * 0.6 : 0) * trail}`
        }

        if (time >= cycle.chargeStart && time < cycle.handoffStart) {
          charge = Math.max(
            charge,
            clamp01((time - cycle.chargeStart) / (cycle.handoffStart - cycle.chargeStart)),
          )
        }
        if (sending >= 0) charge = Math.max(charge, 1 - sending * 0.78)
        if (returning >= 0) charge = Math.max(charge, 0.15 + returning * 0.55)
      }

      const near = nearHead.current
      const far = farHead.current
      if (near && far) {
        const onNear = headTheta !== null && Math.sin(headTheta) > 0
        const head = headTheta === null ? null : helixPoint(headTheta)
        for (const [node, active, dim] of [
          [near, onNear, 1],
          [far, headTheta !== null && !onNear, FAR_DIM],
        ] as const) {
          node.style.opacity = active ? `${trail * dim}` : '0'
          if (head && active) {
            node.setAttribute('cx', svgNumber(head.x))
            node.setAttribute('cy', svgNumber(head.y))
          }
        }
      }

      if (sourceGlow.current) sourceGlow.current.style.opacity = `${0.06 + charge * 0.5}`
      if (sourceCore.current) sourceCore.current.style.opacity = `${0.45 + charge * 0.55}`

      if (summit.current) {
        const flare = clamp01((time - TIMELINE.sweepEnd) / FINALE.flare)
        summit.current.style.opacity = `${(0.18 + flare * 0.82) * trail}`
        summit.current.style.transform = `scale(${0.9 + flare * 0.1})`
      }
    }

    if (stillness.matches) {
      /* No loop: show the finished state, five generations deep. */
      paint(TIMELINE.holdEnd)
      return
    }

    let frame = 0
    let origin = 0
    let running = false

    const tick = (now: number) => {
      if (!origin) origin = now
      paint(((now - origin) / 1000) % TIMELINE.loop)
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return
        running = entry.isIntersecting
        if (running) {
          origin = 0
          frame = requestAnimationFrame(tick)
        } else {
          cancelAnimationFrame(frame)
        }
      },
      { threshold: 0 },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={styles.heroOrchestration} aria-hidden="true">
      <svg ref={rootRef} viewBox="0 0 650 360" focusable="false">
        <defs>
          <linearGradient
            id="hero-loop-gradient"
            x1="0"
            y1={HELIX.bottomY}
            x2="0"
            y2={SUMMIT.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff4fa3" />
            <stop offset="40%" stopColor="#5f8cff" />
            <stop offset="76%" stopColor="#cfff3d" />
            <stop offset="100%" stopColor="#fff3cb" />
          </linearGradient>
          <radialGradient id="hero-loop-source-glow">
            <stop offset="0%" stopColor="#fff3cb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff3cb" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          className={styles.heroLoopAxis}
          d={`M${HELIX.centerX} 348V${svgNumber(SUMMIT.y - 30)}`}
        />

        {/* Far side of every turn, behind the human's rails. */}
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <g key={index}>
              <path
                className={styles.heroLoopFarShell}
                strokeWidth={cycle.liveWidth * 0.72 + 5}
                d={cycle.farPath}
              />
              <path
                className={styles.heroLoopFarTrack}
                stroke="url(#hero-loop-gradient)"
                strokeWidth={cycle.trackWidth}
                d={cycle.farPath}
              />
              <path
                className={styles.heroLoopFarLit}
                ref={(node) => {
                  farLit.current[index] = node
                }}
                pathLength="100"
                stroke="url(#hero-loop-gradient)"
                strokeWidth={cycle.liveWidth * 0.72}
                d={cycle.farPath}
              />
            </g>
          ))}
        </g>
        <circle
          className={styles.heroLoopHead}
          ref={farHead}
          r="3.6"
          fill="url(#hero-loop-gradient)"
          opacity="0"
        />

        {/* The human's channel: one fan of rails, used in both directions. */}
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <path
              key={index}
              className={styles.heroLoopRail}
              ref={(node) => {
                railBase.current[index] = node
              }}
              d={cycle.railPath}
            />
          ))}
        </g>
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <path
              key={index}
              className={styles.heroLoopRailReturn}
              ref={(node) => {
                railBack.current[index] = node
              }}
              pathLength="100"
              stroke="url(#hero-loop-gradient)"
              opacity="0"
              d={cycle.railPath}
            />
          ))}
        </g>
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <path
              key={index}
              className={styles.heroLoopRailSend}
              ref={(node) => {
                railOut.current[index] = node
              }}
              pathLength="100"
              opacity="0"
              d={cycle.railPath}
            />
          ))}
        </g>

        {/* The source every rail runs from: a glow that charges before each
           hand-off and empties into the line. */}
        <circle
          ref={sourceGlow}
          cx={RAIL_ORIGIN.x}
          cy={RAIL_ORIGIN.y}
          r="30"
          fill="url(#hero-loop-source-glow)"
          opacity="0.06"
        />
        <circle
          className={styles.heroLoopSource}
          ref={sourceCore}
          cx={RAIL_ORIGIN.x}
          cy={RAIL_ORIGIN.y}
          r="4.4"
        />
        <text className={styles.heroLoopLabel} x={RAIL_ORIGIN.x} y="252" textAnchor="middle">
          human feedback
        </text>

        {/* Near side of every turn, in front of the rails. */}
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <g key={index}>
              <path
                className={styles.heroLoopNearShell}
                strokeWidth={cycle.liveWidth + 6}
                d={cycle.nearPath}
              />
              <path
                className={styles.heroLoopNearTrack}
                stroke="url(#hero-loop-gradient)"
                strokeWidth={cycle.trackWidth}
                d={cycle.nearPath}
              />
              <path
                className={styles.heroLoopNearLit}
                ref={(node) => {
                  nearLit.current[index] = node
                }}
                pathLength="100"
                stroke="url(#hero-loop-gradient)"
                strokeWidth={cycle.liveWidth}
                d={cycle.nearPath}
              />
            </g>
          ))}
        </g>
        <circle
          className={styles.heroLoopHead}
          ref={nearHead}
          r="4.6"
          fill="url(#hero-loop-gradient)"
          opacity="0"
        />

        <g className={styles.heroLoopJoin}>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <circle
              key={index}
              ref={(node) => {
                railJoin.current[index] = node
              }}
              cx={svgNumber(cycle.anchor.x)}
              cy={svgNumber(cycle.anchor.y)}
              r="3.4"
              fill={cycle.tone}
              opacity="0"
            />
          ))}
        </g>

        {/* One tick per finished generation, each one longer than the last. */}
        <g>
          {CYCLE_GEOMETRY.map((cycle, index) => (
            <g
              key={index}
              className={styles.heroLoopTick}
              ref={(node) => {
                tickGroup.current[index] = node
              }}
              opacity="0"
            >
              <path
                ref={(node) => {
                  tickLine.current[index] = node
                }}
                pathLength="100"
                stroke={cycle.tone}
                d={`M${svgPoint(cycle.tickStart)}h${cycle.tickLength}`}
              />
              <circle
                cx={svgNumber(cycle.tickStart.x + cycle.tickLength)}
                cy={svgNumber(cycle.tickStart.y)}
                r="3"
                fill={cycle.tone}
              />
            </g>
          ))}
        </g>
        <text className={styles.heroLoopLabel} x="646" y="54" textAnchor="end">
          better every pass
        </text>

        <g className={styles.heroLoopSummit} ref={summit} opacity="0.18">
          <path d={`M${svgPoint(SUMMIT)}V${svgNumber(SUMMIT.y - 26)}`} />
          <path
            d={`M${svgNumber(SUMMIT.x - 8)} ${svgNumber(
              SUMMIT.y - 15,
            )}L${svgNumber(SUMMIT.x)} ${svgNumber(SUMMIT.y - 26)}L${svgNumber(
              SUMMIT.x + 8,
            )} ${svgNumber(SUMMIT.y - 15)}`}
          />
        </g>
      </svg>
    </div>
  )
}
