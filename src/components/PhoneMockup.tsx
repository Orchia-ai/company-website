import { useState, type UIEventHandler } from 'react'

type ScrollScreenProps = {
  onScroll?: UIEventHandler<HTMLDivElement>
}

/* ────────── 0 · Commerce: Shop + Reviews + Checkout ────────── */
function ShopScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area mock-shop" onScroll={onScroll}>
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
            <div className="mock-product-meta">
              <div className="mock-price" />
              <div className="mock-stars" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <span
                    key={s}
                    className={`mock-star${s < (n % 5 === 0 ? 5 : 4) ? ' mock-star--filled' : ''}`}
                  />
                ))}
                <span className="mock-review-count">({(n * 37) % 250 + 12})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mock-checkout-bar" aria-hidden="true">
        <span className="mock-checkout-pay">Pay</span>
        <span className="mock-checkout-divider" />
        <span className="mock-checkout-total">$48.00</span>
        <span className="mock-checkout-loyalty">−10% Tier II</span>
      </div>
    </div>
  )
}

/* ────────── 1 · Advanced Technologies: AR Try-On ────────── */
function ARScreen() {
  return (
    <div className="mock-ar-screen" aria-hidden="true">
      <div className="mock-ar-status">
        <span className="mock-ar-dot" />
        <span className="mock-ar-status-label">Tracking · 94% match</span>
      </div>

      <div className="mock-ar-viewfinder">
        <div className="mock-ar-corner mock-ar-tl" />
        <div className="mock-ar-corner mock-ar-tr" />
        <div className="mock-ar-corner mock-ar-bl" />
        <div className="mock-ar-corner mock-ar-br" />
        <div className="mock-ar-mesh">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className="mock-ar-mesh-dot" style={{ animationDelay: `${(i % 6) * 0.08}s` }} />
          ))}
        </div>
        <div className="mock-ar-silhouette" />
        <div className="mock-ar-reticle" />
      </div>

      <div className="mock-ar-chips">
        <span className="mock-ar-chip mock-ar-chip-active">Try in 3D</span>
        <span className="mock-ar-chip">Your size</span>
        <span className="mock-ar-chip">Pair with…</span>
      </div>
    </div>
  )
}

/* ────────── 2 · Membership: Tier + Streak + Rewards ────────── */
function MembershipScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area mock-engage" onScroll={onScroll}>
      <div className="mock-engage-hero">
        <div className="mock-engage-greeting">
          <div className="mock-engage-name" />
          <div className="mock-engage-tier" />
        </div>
        <div className="mock-streak">
          <svg viewBox="0 0 80 80" className="mock-streak-ring" aria-hidden="true">
            <circle cx="40" cy="40" r="32" className="mock-streak-track" />
            <circle cx="40" cy="40" r="32" className="mock-streak-fill" />
          </svg>
          <div className="mock-streak-label">
            <span className="mock-streak-num">5</span>
            <span className="mock-streak-of">/ 7</span>
          </div>
        </div>
      </div>

      <div className="mock-section-title">
        <div className="mock-section-line" />
      </div>

      <div className="mock-rewards-list">
        {[
          { label: 'Free shipping', pts: '0' },
          { label: 'Birthday gift', pts: '200' },
          { label: 'Members-only drop', pts: '500' },
        ].map((r) => (
          <div key={r.label} className="mock-reward-row">
            <span className="mock-reward-tick" />
            <span className="mock-reward-label">{r.label}</span>
            <span className="mock-reward-pts">{r.pts} pts</span>
          </div>
        ))}
      </div>

      <div className="mock-section-title">
        <div className="mock-section-line" />
      </div>
      <div className="mock-badges">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className={`mock-badge mock-badge-${n}`} aria-hidden="true">
            <span className="mock-badge-core" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ────────── 3 · Engagement: Drops + Push + Personalized Feed ────────── */
function DropsScreen({ onScroll }: ScrollScreenProps) {
  return (
    <div className="mock-scroll-area mock-drops" onScroll={onScroll}>
      <div className="mock-push-banner" aria-hidden="true">
        <span className="mock-push-dot" />
        <div className="mock-push-text">
          <div className="mock-push-title" />
          <div className="mock-push-sub" />
        </div>
        <span className="mock-push-pts">NEW</span>
      </div>

      <div className="mock-drop-card">
        <div className="mock-drop-art" />
        <div className="mock-drop-meta">
          <span className="mock-drop-label mono-label">Drop · 002</span>
          <div className="mock-drop-title" />
          <div className="mock-drop-countdown">
            <div className="mock-drop-counter"><span>02</span><em>D</em></div>
            <div className="mock-drop-counter"><span>14</span><em>H</em></div>
            <div className="mock-drop-counter"><span>37</span><em>M</em></div>
          </div>
        </div>
      </div>

      <div className="mock-section-title">
        <div className="mock-section-line" />
        <span className="mock-feed-pill mono-label">For you</span>
      </div>

      <div className="mock-feed">
        {[0, 1, 2].map((n) => (
          <div key={n} className="mock-feed-row">
            <div className="mock-feed-thumb" />
            <div className="mock-feed-body">
              <div className="mock-name" style={{ width: '70%' }} />
              <div className="mock-price" style={{ width: '40%' }} />
            </div>
            <span className="mock-feed-tag mono-label">{['Picked', 'Trending', 'Match'][n]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TABS = ['Shop', 'AR', 'Member', 'Drops'] as const

interface PhoneMockupProps {
  activeOverride?: number | null
}

export default function PhoneMockup({ activeOverride = null }: PhoneMockupProps = {}) {
  const [internalActive, setActive] = useState(0)
  const active = activeOverride ?? internalActive
  const [hasScrolledInsidePhone, setHasScrolledInsidePhone] = useState(false)

  const handleMockScroll: UIEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.scrollTop > 4) {
      setHasScrolledInsidePhone(true)
    }
  }

  const showScrollHint = !hasScrolledInsidePhone && active !== 1

  const renderActiveScreen = () => {
    switch (active) {
      case 0: return <ShopScreen onScroll={handleMockScroll} />
      case 1: return <ARScreen />
      case 2: return <MembershipScreen onScroll={handleMockScroll} />
      case 3: return <DropsScreen onScroll={handleMockScroll} />
      default: return null
    }
  }

  return (
    <div className="phone-frame" role="img" aria-label="Mobile commerce app concept">
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

        <div key={`screen-${active}`} className="mock-screen-anim">
          {renderActiveScreen()}
        </div>

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
