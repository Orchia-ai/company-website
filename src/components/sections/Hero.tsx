import { useRef, useState } from 'react'
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
  const [scrolledGroup, setScrolledGroup] = useState(0)
  const matrixRef = useRef<HTMLDivElement>(null)

  const activeGroup = hoveredGroup ?? scrolledGroup
  const phoneOverride = CAPABILITY_GROUPS[activeGroup].phoneIndex

  const handleMatrixScroll = () => {
    const el = matrixRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    const cardWidth = card.offsetWidth
    const idx = Math.round(el.scrollLeft / cardWidth)
    setScrolledGroup(Math.min(Math.max(0, idx), CAPABILITY_GROUPS.length - 1))
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

            {/* Inline phone — mobile only, responds to horizontal card scroll */}
            <div className="hero-mobile-phone" aria-hidden="true">
              <PhoneMockup activeOverride={phoneOverride} />
            </div>

            <div
              className="hero-capability-matrix"
              aria-label="Capability groups"
              ref={matrixRef}
              onScroll={handleMatrixScroll}
            >
              {CAPABILITY_GROUPS.map((group, i) => (
                <div
                  key={group.label}
                  className={`hero-capability-group${activeGroup === i ? ' hero-capability-group--active' : ''}`}
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
