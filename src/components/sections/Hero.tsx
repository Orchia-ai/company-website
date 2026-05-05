import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '../../icons'
import PhoneMockup from '../PhoneMockup'

const CAPABILITY_GROUPS = [
  {
    label: 'Commerce',
    items: ['Shopify', 'Checkout', 'Cart', 'Reviews & Ratings', 'Wishlist'],
    phoneIndex: 0,
  },
  {
    label: 'Advanced Technologies',
    items: ['AR Try-On', 'Visual Search', 'AI Recommendation', '3D Visualization'],
    phoneIndex: 1,
  },
  {
    label: 'Membership',
    items: ['Tiers', 'Rewards', 'Birthday Perks', 'Referrals', 'Member Pricing'],
    phoneIndex: 2,
  },
  {
    label: 'Engagement',
    items: ['Drops', 'Push', 'Personalization', 'Stories', 'Gamification'],
    phoneIndex: 3,
  },
]

export default function Hero() {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const phoneOverride = hoveredGroup !== null ? CAPABILITY_GROUPS[hoveredGroup].phoneIndex : null

  const matrixRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const el = matrixRef.current
    if (!el) return
    const handleScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
    }
    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Mobile-only auto-advance every 2s; pauses on user interaction.
  useEffect(() => {
    const el = matrixRef.current
    if (!el) return
    const mq = window.matchMedia('(max-width: 768px)')
    let timer: number | undefined
    let paused = false

    const tick = () => {
      if (paused || !mq.matches) return
      const w = el.clientWidth
      if (w === 0) return
      const total = CAPABILITY_GROUPS.length
      const current = Math.round(el.scrollLeft / w)
      const next = (current + 1) % total
      el.scrollTo({ left: next * w, behavior: 'smooth' })
    }
    const start = () => {
      stop()
      if (mq.matches) timer = window.setInterval(tick, 2000)
    }
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
    const pause = () => {
      paused = true
      window.setTimeout(() => {
        paused = false
      }, 6000)
    }

    start()
    el.addEventListener('pointerdown', pause)
    el.addEventListener('wheel', pause, { passive: true })
    mq.addEventListener('change', start)
    return () => {
      stop()
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('wheel', pause)
      mq.removeEventListener('change', start)
    }
  }, [])

  const thumbWidthPct = 100 / CAPABILITY_GROUPS.length
  const thumbLeftPct = scrollProgress * (100 - thumbWidthPct)

  const jumpToIndex = (i: number) => {
    const el = matrixRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-corner hero-corner-tl" aria-hidden="true" />
        <div className="hero-corner hero-corner-tr" aria-hidden="true" />
        <div className="hero-corner hero-corner-bl" aria-hidden="true" />
        <div className="hero-corner hero-corner-br" aria-hidden="true" />

        <div className="hero-meta">
          <span className="mono-label">N° 001 — Studio Index</span>
          <span className="mono-label">Seattle · 47.6062° N, 122.3321° W · 53 m</span>
        </div>

        <div className="hero-spread">
          <div className="hero-spread-text">
            <h1 className="hero-lead" style={{ animationDelay: '0.05s' }}>
              <span className="hero-lead-headline">
                Product <em>design</em> and engineering
                <br />for <span className="hero-lead-stroke">advanced</span> interfaces.
              </span>
            </h1>

            <div className="hero-rule" aria-hidden="true" />

            <p className="hero-sub" style={{ animationDelay: '0.18s' }}>
              Orchia Studio designs and builds advanced product interfaces for mobile commerce,
              AI workflows, and robotics systems — combining polished user experience with
              serious technical execution.
            </p>

            <div className="hero-capability-wrap">
              <div
                className="hero-capability-matrix"
                aria-label="Capability groups"
                ref={matrixRef}
              >
                {CAPABILITY_GROUPS.map((group, i) => (
                  <div
                    key={group.label}
                    className={`hero-capability-group${hoveredGroup === i ? ' hero-capability-group--active' : ''}`}
                    style={{ animationDelay: `${0.28 + i * 0.06}s` }}
                    onMouseEnter={() => setHoveredGroup(i)}
                    onMouseLeave={() => setHoveredGroup(null)}
                    onFocus={() => setHoveredGroup(i)}
                    onBlur={() => setHoveredGroup(null)}
                    tabIndex={0}
                  >
                    <div className="hero-capability-label mono-label">{group.label}</div>
                    <ul className="hero-capability-items">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="hero-capability-scrollbar">
                <div className="hero-capability-track">
                  {CAPABILITY_GROUPS.map((group, i) => (
                    <button
                      key={group.label}
                      type="button"
                      className="hero-capability-track-segment"
                      style={{ left: `${i * thumbWidthPct}%`, width: `${thumbWidthPct}%` }}
                      onClick={() => jumpToIndex(i)}
                      aria-label={`Show ${group.label}`}
                    />
                  ))}
                  <div
                    className="hero-capability-thumb"
                    aria-hidden="true"
                    style={{
                      width: `${thumbWidthPct}%`,
                      transform: `translateX(${(thumbLeftPct / thumbWidthPct) * 100}%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="hero-actions" style={{ animationDelay: '0.6s' }}>
              <a className="button-primary" href="#contact">
                <span>Start a conversation</span>
                <ArrowRight />
              </a>
              <a className="text-link" href="#work">
                View selected work <ArrowRight />
              </a>
            </div>
          </div>

          <aside className="hero-spread-specimen" aria-label="Mobile commerce specimen">
            <div className="hero-specimen-header">
              <span className="mono-label">Specimen / 01</span>
              <span className="mono-label hero-specimen-tag">Mobile Commerce Prototype</span>
            </div>
            <div className="hero-specimen-stage">
              <PhoneMockup activeOverride={phoneOverride} />
            </div>
            <div className="hero-specimen-caption">
              <span className="mono-label">Plate i</span>
              <span className="hero-specimen-caption-text">
                A concept mobile commerce system connecting shopping, loyalty, scan-based
                interaction, and account surfaces.
              </span>
            </div>
          </aside>
        </div>

        <div className="hero-stamp" style={{ animationDelay: '0.82s' }}>
          <span className="hero-stamp-awards">
            Recognition from prior interactive work: Red Dot · DNA Paris · MUSE Gold
          </span>
        </div>
      </div>
    </section>
  )
}
