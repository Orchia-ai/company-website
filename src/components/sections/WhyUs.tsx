import { whyUs } from '../../data'

interface Props {
  showFullContent: boolean
}

export default function WhyUs({ showFullContent }: Props) {
  if (!showFullContent) {
    return (
      <section className="why-section" id="why-us">
        <div className="why-header">
          <div className="section-meta">
            <span className="mono-label">S / 05 — Why Us</span>
          </div>
          <h2>Information coming soon.</h2>
          <p className="why-intro">This section is still in construction.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="why-section" id="why-us">
      <div className="why-header">
        <div className="section-meta">
          <span className="mono-label">S / 05 — Why Us</span>
          <span className="mono-label">04 Principles</span>
        </div>
        <h2>
          Design systems, retention thinking, and <em>advanced features</em> used with restraint.
        </h2>
        <p className="why-intro">
          We build mobile commerce products with operational depth: coherent systems, clear delivery
          phases, and features that serve the product instead of distracting from it. The result is
          a product that can launch cleanly and keep improving after release.
        </p>
      </div>
      <div className="why-grid">
        {whyUs.map((item) => (
          <article key={item.num} className="why-card">
            <div className="why-card-top">
              <span className="why-num">{item.num}</span>
              <span className="why-card-label">Principle</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
