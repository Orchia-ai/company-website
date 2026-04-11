import { ArrowRight } from '../../icons'

export default function Hero() {
  return (
    <section className="hero" id="who-we-are">
      <div className="hero-copy">
        <p className="eyebrow">Product studio</p>
        <h1>Precise engineering. Considered design.</h1>
        <p className="lede">
          Orchia is a product studio working at two frontiers: AI-powered robotics systems
          and premium e-commerce mobile experiences. We bring the same rigor, the same
          aesthetic sensibility, and the same standard of craft to both.
        </p>
        <p className="lede" style={{ marginTop: 16 }}>
          We don't separate design from engineering. Here, they are the same discipline —
          and every product we ship is evidence of that.
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
