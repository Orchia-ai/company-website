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
        <p className="card-kicker">Active engagement — lifestyle retail, North America</p>
        <h2>Loyalty + commerce app for a premium retail brand</h2>
        <ul>
          <li>
            Cloud-synced loyalty balance stored in Shopify Customer Metafields — the architecture Shopify recommends for loyalty programs.
          </li>
          <li>
            In-store QR code merging point-of-sale and online order history into a single unified customer record.
          </li>
          <li>
            Real-time push alerts for restock events, wired directly to inventory webhooks — no polling, instant delivery.
          </li>
        </ul>
      </aside>
    </section>
  )
}
