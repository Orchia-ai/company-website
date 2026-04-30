import { ArrowRight } from '../../icons'
import PhoneMockup from '../PhoneMockup'

const TAGS = [
  'AR Try-On',         'React Native',       'Next.js',            'Shopify Integration',
  'AI Recommendations','Personalization',    '3D Visualization',   'Loyalty Systems',
  'Gamification',      'Real-time Sync',     'Edge Delivery',      'Push Notifications',
  'Voice Search',      'A/B Testing',        'PWA',                'Analytics',
]

const MARQUEE = [
  'Mobile Commerce', 'Loyalty Systems', 'AR · Spatial', 'AI Interfaces',
  'Human-Machine UX', 'Shopify Storefront', 'Design Systems', 'Retention Analytics',
]

export default function Hero() {
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

        <h1 className="hero-lead" style={{ animationDelay: '0.05s' }}>
          <span className="hero-lead-word">Orchestra<span className="hero-lead-stroke">t</span>ing</span>
          <span className="hero-lead-rest">
            <em>design</em>, infrastructure,
            <br /> and advanced technology.
          </span>
        </h1>

        <div className="hero-rule" aria-hidden="true" />

        <ul className="hero-tags" aria-label="Technology capabilities">
          {TAGS.map((tag, i) => (
            <li
              key={tag}
              className="hero-tag"
              style={{ animationDelay: `${0.12 + i * 0.03}s` }}
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="hero-close" style={{ animationDelay: '0.65s' }}>
          Into a single, cohesive product — customer-facing, user-friendly.
        </p>

        <div className="hero-actions" style={{ animationDelay: '0.72s' }}>
          <a className="button-primary" href="#contact">
            <span>Start a conversation</span>
            <ArrowRight />
          </a>
          <a className="text-link" href="#work">
            Selected work <ArrowRight />
          </a>
        </div>

        <div className="hero-stamp" style={{ animationDelay: '0.82s' }}>
          <span className="hero-stamp-awards">Red Dot · DNA Paris · MUSE Gold</span>
        </div>
      </div>

      <div className="hero-mockup">
        <PhoneMockup />
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="hero-marquee-item">
              {item}
              <span className="hero-marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      <aside className="hero-card">
        <div className="hero-card-meta">
          <span className="mono-label">Thesis / 001</span>
        </div>
        <p className="card-kicker">Design + infrastructure — built around your use case</p>
        <h2>A customized interface shaped by what your users actually need.</h2>
        <ul>
          <li>
            <span className="hero-card-li-num">01</span>
            <span>
              Good design and stable infrastructure are not a trade-off — we bring both together so your product holds up and feels right at the same time.
            </span>
          </li>
          <li>
            <span className="hero-card-li-num">02</span>
            <span>
              Every interface we build is specific to the use case. We take the time to understand your users before writing a single line of code.
            </span>
          </li>
          <li>
            <span className="hero-card-li-num">03</span>
            <span>
              We build for your users, not for a template. The result is a product that fits the way people actually use it.
            </span>
          </li>
        </ul>
      </aside>
    </section>
  )
}
