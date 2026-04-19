import { useState, type UIEventHandler } from 'react'
import { PhoneIcon, StoreIcon, SparkleIcon } from '../../icons'

// ── Tab screens ──────────────────────────────────────────────

type ScrollScreenProps = {
  onScroll?: UIEventHandler<HTMLDivElement>
}

function ShopScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area" onScroll={onScroll}>
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
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="mock-product">
            <div className="mock-img" />
            <div className="mock-name" />
            <div className="mock-price" />
          </div>
        ))}
      </div>
      <div className="mock-section-title" style={{ marginTop: 8 }}>
        <div className="mock-section-line" style={{ width: 48 }} />
      </div>
      <div className="mock-grid" style={{ paddingBottom: 14 }}>
        {[7, 8].map((n) => (
          <div key={n} className="mock-product">
            <div className="mock-img" />
            <div className="mock-name" />
            <div className="mock-price" />
          </div>
        ))}
      </div>
    </div>
  )
}

function LoyaltyScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area" onScroll={onScroll}>
      <div className="mock-loyalty-card">
        <div className="mock-loyalty-label" />
        <div className="mock-loyalty-points" />
        <div className="mock-progress-track">
          <div className="mock-progress-fill" />
        </div>
        <div className="mock-loyalty-tier" />
      </div>
      <div className="mock-section-title">
        <div className="mock-section-line" />
      </div>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="mock-activity-row">
          <div className="mock-activity-dot" />
          <div style={{ flex: 1 }}>
            <div className="mock-name" style={{ width: '60%', marginBottom: 4 }} />
            <div className="mock-price" style={{ width: '38%' }} />
          </div>
          <div className="mock-points-badge" />
        </div>
      ))}
    </div>
  )
}

function ScanScreen() {
  return (
    <div className="mock-scan-screen">
      <div className="mock-scan-label-top" />
      <div className="mock-qr-box">
        <div className="mock-qr-corner mock-qr-tl" />
        <div className="mock-qr-corner mock-qr-tr" />
        <div className="mock-qr-corner mock-qr-bl" />
        <div className="mock-qr-corner mock-qr-br" />
        <div className="mock-qr-grid">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="mock-qr-cell" style={{ opacity: (i * 7) % 11 > 4 ? 1 : 0 }} />
          ))}
        </div>
      </div>
      <div className="mock-scan-label" />
      <div className="mock-scan-sub" />
    </div>
  )
}

function ProfileScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area" onScroll={onScroll}>
      <div className="mock-profile-header">
        <div className="mock-avatar" />
        <div className="mock-profile-name" />
        <div className="mock-profile-sub" />
      </div>
      <div className="mock-section-title">
        <div className="mock-section-line" />
      </div>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="mock-settings-row">
          <div className="mock-settings-icon" />
          <div className="mock-name" style={{ flex: 1, width: 'auto' }} />
          <div className="mock-settings-chevron" />
        </div>
      ))}
    </div>
  )
}

// ── Tab definitions ──────────────────────────────────────────

const TABS = ['Shop', 'Points', 'Scan', 'Profile'] as const

// ── Phone mockup ─────────────────────────────────────────────

function PhoneMockup() {
  const [active, setActive] = useState(0)
  const [hasScrolledInsidePhone, setHasScrolledInsidePhone] = useState(false)

  const handleMockScroll: UIEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.scrollTop > 4) {
      setHasScrolledInsidePhone(true)
    }
  }

  const showScrollHint = !hasScrolledInsidePhone && active !== 2

  const renderActiveScreen = () => {
    switch (active) {
      case 0:
        return <ShopScreen onScroll={handleMockScroll} />
      case 1:
        return <LoyaltyScreen onScroll={handleMockScroll} />
      case 2:
        return <ScanScreen />
      case 3:
        return <ProfileScreen onScroll={handleMockScroll} />
      default:
        return null
    }
  }

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

        {renderActiveScreen()}

        <div key={`scroll-hint-${active}`} className={`mock-scroll-hint ${showScrollHint ? 'visible' : ''}`} aria-hidden="true">
          <span className="mock-scroll-hint-label">Scroll</span>
          <span className="mock-scroll-hint-chevrons">
            <span />
            <span />
          </span>
        </div>

        <div className="mock-bottom-nav">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`mock-tab ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={tab}
            >
              <div className="mock-tab-icon" />
              <span className="mock-tab-label">{tab}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Callout list ─────────────────────────────────────────────

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
