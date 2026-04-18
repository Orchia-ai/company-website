import { ArrowRight } from '../../icons'

const TAGS = [
  'AR Try-On',         'React Native',       'Next.js',            'Shopify Integration',
  'AI Recommendations','Personalization',    '3D Visualization',   'Loyalty Systems',
  'Gamification',      'Real-time Sync',     'Edge Delivery',      'Push Notifications',
  'Voice Search',      'A/B Testing',        'PWA',                'Analytics',
]

export default function Hero() {
  return (
    <section className="hero" id="who-we-are">
      <div className="hero-copy">
        <p className="hero-lead" style={{ animationDelay: '0.05s' }}>
          <span className="hero-lead-word">Orchestrating</span>
          <span className="hero-lead-rest">design, infrastructure, and advanced technology</span>
        </p>

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
          <a className="button-primary" href="#contact">Start a conversation</a>
          <a className="text-link" href="#what-we-build">
            See our work <ArrowRight />
          </a>
        </div>
      </div>

      <aside className="hero-card">
        <p className="card-kicker">Design + infrastructure — built around your use case</p>
        <h2>A customized interface shaped by what your users actually need</h2>
        <ul>
          <li>
            Good design and stable infrastructure are not a trade-off — we bring both together so your product holds up and feels right at the same time.
          </li>
          <li>
            Every interface we build is specific to the use case. We take the time to understand your users before writing a single line of code.
          </li>
          <li>
            We build for your users, not for a template. The result is a product that fits the way people actually use it.
          </li>
        </ul>
      </aside>
    </section>
  )
}
