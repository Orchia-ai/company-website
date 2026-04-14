import { ArrowRight } from '../../icons'

export default function Hero() {
  return (
    <section className="hero" id="who-we-are">
      <div className="hero-copy">
        <p className="eyebrow">Craft and technical precision, unified</p>
        <h1>Orchestrating design and technology.</h1>
        <p className="lede">
          Orchia orchestrates design and technology into products that are both considered
          and capable. We work at the intersection of intelligent systems and human experience
          — where reliable, advanced technology meets craft that endures.
        </p>
        <p className="lede" style={{ marginTop: 16 }}>
          Every product we ship is evidence of a single conviction: that engineering and
          design are not separate disciplines, but one and the same.
        </p>
        <div className="hero-actions">
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
