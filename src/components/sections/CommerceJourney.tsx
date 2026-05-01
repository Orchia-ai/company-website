const STEPS = [
  { num: '01', label: 'Discover',       desc: 'Search, browse, and editorial surfaces tuned for mobile.' },
  { num: '02', label: 'Product Detail', desc: 'Rich PDP with media, variants, and recommendations.' },
  { num: '03', label: 'Cart',           desc: 'Native checkout backed by Shopify Storefront API.' },
  { num: '04', label: 'Loyalty',        desc: 'Points, tiers, and rewards built into the core flow.' },
  { num: '05', label: 'Account',        desc: 'Order history, payment, and member benefits in one place.' },
  { num: '06', label: 'Reorder',        desc: 'Push, scan, and account depth that pull users back.' },
]

export default function CommerceJourney() {
  return (
    <section className="section-block journey-section" id="commerce-journey">
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 05 — Commerce Journey</span>
          <span className="mono-label">Mobile · Retention</span>
        </div>
        <h2>
          One product, <em>six surfaces</em>.
        </h2>
      </div>
      <ol className="journey-track" aria-label="Mobile commerce journey">
        {STEPS.map((s, i) => (
          <li key={s.num} className="journey-step">
            <div className="journey-step-marker">
              <span className="mono-label">{s.num}</span>
            </div>
            <div className="journey-step-body">
              <h3 className="journey-step-label">{s.label}</h3>
              <p className="journey-step-desc">{s.desc}</p>
            </div>
            {i < STEPS.length - 1 && <span className="journey-arrow" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
