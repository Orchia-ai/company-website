import { PhoneIcon, StoreIcon, SparkleIcon } from '../../icons'

function PhoneMockup() {
  return (
    <div className="phone-frame" role="img" aria-label="Mobile e-commerce app concept">
      <div className="phone-screen">
        <div className="mock-status">
          <span className="mock-time">9:41</span>
          <div className="mock-status-icons">
            <div className="mock-bar" style={{ width: 14, height: 7 }} />
            <div className="mock-bar" style={{ width: 8, height: 7 }} />
          </div>
        </div>
        <div className="mock-topbar">
          <div className="mock-icon-btn" />
          <span className="mock-brand-text">BRAND</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="mock-icon-btn" />
            <div className="mock-icon-btn" />
          </div>
        </div>
        <div className="mock-banner">
          <div className="mock-tag" />
          <div className="mock-headline-line wide" />
          <div className="mock-headline-line medium" />
          <div className="mock-cta-line" />
        </div>
        <div className="mock-section-title">
          <div className="mock-section-line" />
        </div>
        <div className="mock-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="mock-product">
              <div className="mock-img" />
              <div className="mock-name" />
              <div className="mock-price" />
            </div>
          ))}
        </div>
        <div className="mock-bottom-nav">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`mock-tab ${i === 0 ? 'active' : ''}`}>
              <div className="mock-tab-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const callouts = [
  { icon: <PhoneIcon />, title: 'Native iOS & Android', desc: 'React Native across both platforms. Real device QA. App Store-ready in weeks.' },
  { icon: <StoreIcon />, title: 'Shopify-Native Architecture', desc: 'Storefront API, POS, Metafields, Webhooks — your existing commerce stack is the backend.' },
  { icon: <SparkleIcon />, title: 'AI-Powered Personalization', desc: 'Restock alerts, reorder predictions, and on-device recommendations.' },
]

export default function Proof() {
  return (
    <section className="proof-section">
      <div className="proof-inner">
        <div className="proof-mockup-col">
          <PhoneMockup />
        </div>
        <div className="proof-content-col">
          <p className="eyebrow">E-commerce track</p>
          <h2>Designed to your brand's visual language. Built on your existing stack.</h2>
          <p className="proof-body">
            A native mobile experience that reflects how your brand presents itself in-store —
            clean, unhurried, and product-first. No new backend. No fragmented data.
            Full Shopify admin visibility from day one.
          </p>
          <div className="proof-callouts">
            {callouts.map((c) => (
              <div key={c.title} className="proof-callout">
                <span className="proof-callout-icon">{c.icon}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
