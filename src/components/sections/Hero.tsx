import { useState } from 'react'
import { ArrowRight } from '../../icons'
import PhoneMockup from '../PhoneMockup'

const CAPABILITY_GROUPS = [
  {
    label: 'Commerce',
    items: ['Shopify', 'Checkout', 'Loyalty', 'Account'],
    phoneIndex: 0,
    previewLabel: 'Shop',
  },
  {
    label: 'Advanced UX',
    items: ['AR Try-On', '3D Visualization', 'AI Recommendation'],
    phoneIndex: 2,
    previewLabel: 'Scan',
  },
  {
    label: 'Infrastructure',
    items: ['Real-time Sync', 'Analytics', 'Edge Delivery'],
    phoneIndex: 3,
    previewLabel: 'Profile',
  },
  {
    label: 'Engagement',
    items: ['Personalization', 'Push', 'Gamification'],
    phoneIndex: 1,
    previewLabel: 'Points',
  },
]

export default function Hero() {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const phoneOverride = hoveredGroup !== null ? CAPABILITY_GROUPS[hoveredGroup].phoneIndex : null
  const previewLabel =
    hoveredGroup !== null ? CAPABILITY_GROUPS[hoveredGroup].previewLabel : 'Live'

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
              Orchia Studio builds mobile commerce apps, AI tools, and human-machine
              interfaces where polished user experience and technical depth both matter.
            </p>

            <div className="hero-capability-matrix" aria-label="Capability groups">
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
              <span className="mono-label hero-specimen-tag">Mobile · {previewLabel}</span>
            </div>
            <div className="hero-specimen-stage">
              <PhoneMockup activeOverride={phoneOverride} />
            </div>
            <div className="hero-specimen-caption">
              <span className="mono-label">Plate i</span>
              <span className="hero-specimen-caption-text">
                Commerce · loyalty · scan · profile — one product, four surfaces.
              </span>
            </div>
          </aside>
        </div>

        <div className="hero-stamp" style={{ animationDelay: '0.82s' }}>
          <span className="hero-stamp-awards">Red Dot · DNA Paris · MUSE Gold</span>
        </div>
      </div>
    </section>
  )
}
