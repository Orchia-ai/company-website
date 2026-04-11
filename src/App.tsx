import { useEffect, useState } from 'react'
import './App.css'

/* ── Inline thin SVG icons ── */
const PhoneIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

const StoreIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9l1-5h16l1 5" />
    <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
    <path d="M5 9v11h14V9" />
    <rect x="9" y="14" width="6" height="6" rx="0.5" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

const ArrowRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const RobotIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 8V4" />
    <circle cx="12" cy="3" r="1" />
    <circle cx="8.5" cy="14" r="1.5" />
    <circle cx="15.5" cy="14" r="1.5" />
    <path d="M10 17h4" />
  </svg>
)

/* ── Phone Mockup ── */
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

/* ── Data ── */
const whyUs = [
  {
    num: '01',
    title: 'Design × Engineering',
    description:
      'Aesthetic intuition and engineering precision are the same discipline here. Every product decision is both visual and structural — neither compromised for the other.',
  },
  {
    num: '02',
    title: 'Strong Technical Foundation',
    description:
      'Clean architecture from the first commit. We write for the engineer who inherits this codebase — not just for the demo. Scalable, documented, and production-ready.',
  },
  {
    num: '03',
    title: 'Version-First Development',
    description:
      'Full versioning from day one. Structured release cycles, clear changelogs, and a codebase that grows cleanly across every iteration without accumulating debt.',
  },
  {
    num: '04',
    title: 'Details That Matter',
    description:
      'Micro-interactions, animation curves, transition timing — the craft that separates a product people use from one they remember. We treat these as first-class concerns, not afterthoughts.',
  },
]

const tracks = [
  {
    icon: <RobotIcon />,
    tag: 'AI & Robotics',
    headline: 'Intelligent systems that interact with the physical world.',
    points: [
      'Human-machine interface design for robotic platforms',
      'AI-driven perception and decision logic',
      'Real-time control systems with safety-critical UX',
      'Hardware-software co-design from prototype to production',
    ],
  },
  {
    icon: <PhoneIcon />,
    tag: 'E-Commerce & Mobile',
    headline: 'Native apps that make buying feel effortless.',
    points: [
      'iOS & Android apps built on React Native',
      'Shopify-native commerce: Storefront API, Customer Accounts, POS',
      'Loyalty and membership programs, cloud-synced via Metafields',
      'Push engagement wired directly to inventory and order webhooks',
    ],
  },
]

const steps = [
  {
    step: '01',
    title: 'Audit',
    description:
      'We map your existing systems, data model, and every user touchpoint before writing a line of code. No assumptions.',
  },
  {
    step: '02',
    title: 'Build',
    description:
      'Design and engineering in parallel — not sequenced. Interfaces are built the way they will be used, and code is structured for the version that comes after this one.',
  },
  {
    step: '03',
    title: 'Launch',
    description:
      "Deployment, analytics instrumentation, and a 90-day iteration sprint post go-live. We stay engaged — we don't disappear at handoff.",
  },
]

const techStack = [
  'React Native',
  'Shopify Storefront API',
  'Expo',
  'TypeScript',
  'GraphQL',
  'ROS 2',
  'Python',
  'Three.js',
]

/* ── Page ── */
function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="site-shell">

      {/* ── Header ── */}
      <div className="topbar-wrapper">
        <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
          <a className="brand" href="#hero" aria-label="Orchia home">
            <span className="brand-wordmark">
              <span className="brand-name">Orchia</span><span className="brand-suffix">.Studio</span>
            </span>
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#who-we-are">About</a>
            <a href="#why-us">Why us</a>
            <a href="#what-we-build">Work</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>
      </div>

      <main>

        {/* ── 01 · Who We Are ── */}
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
              <a className="button-primary" href="#contact">
                Start a conversation
              </a>
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

        {/* ── 02 · Why Choose Us ── */}
        <section className="why-section" id="why-us">
          <div className="why-header">
            <p className="eyebrow">Why Orchia</p>
            <h2>A rare combination of craft and technical precision.</h2>
            <p className="why-intro">
              Most studios are strong on one side. Either the design is exceptional and the
              engineering is fragile, or the engineering is solid and the design is sterile.
              We built Orchia specifically to close that gap.
            </p>
          </div>

          <div className="why-grid">
            {whyUs.map((item) => (
              <article key={item.num} className="why-card">
                <div className="why-card-top">
                  <span className="why-num">{item.num}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03 · What We Build ── */}
        <section className="section-block" id="what-we-build">
          <div className="section-heading">
            <p className="eyebrow">What we build</p>
            <h2>Two disciplines. One standard of quality.</h2>
          </div>

          <div className="tracks">
            {tracks.map((track) => (
              <article key={track.tag} className="track-card">
                <div className="track-image" />
                <div className="track-content">
                  <div className="track-header">
                    <span className="track-icon">{track.icon}</span>
                    <span className="track-tag">{track.tag}</span>
                  </div>
                  <h3 className="track-headline">{track.headline}</h3>
                  <ul className="track-list">
                    {track.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 04 · E-Commerce Proof ── */}
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
                {[
                  { icon: <PhoneIcon />, title: 'Native iOS & Android', desc: 'React Native across both platforms. Real device QA. App Store-ready in weeks.' },
                  { icon: <StoreIcon />, title: 'Shopify-Native Architecture', desc: 'Storefront API, POS, Metafields, Webhooks — your existing commerce stack is the backend.' },
                  { icon: <SparkleIcon />, title: 'AI-Powered Personalization', desc: 'Restock alerts, reorder predictions, and on-device recommendations.' },
                ].map((c) => (
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

        {/* ── 05 · Process ── */}
        <section className="section-block" id="process">
          <div className="section-heading">
            <p className="eyebrow">How we work</p>
            <h2>A focused process. No theater.</h2>
          </div>
          <div className="workflow">
            {steps.map((s) => (
              <article key={s.step} className="workflow-card">
                <div className="step-header">
                  <span className="step-num">{s.step}</span>
                  <span className="step-title">{s.title}</span>
                </div>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 06 · Tech ── */}
        <div className="tech-band">
          <p className="eyebrow" style={{ marginBottom: 18 }}>Technology</p>
          <div className="tech-list">
            {techStack.map((t) => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
          <p className="tech-note">
            No proprietary lock-in. Clean architecture your team can own and extend.
          </p>
        </div>

        {/* ── 07 · CTA ── */}
        <section className="cta" id="contact">
          <div className="cta-copy">
            <p className="eyebrow">Ready to move</p>
            <h2>Let's talk about what you're building.</h2>
            <p className="cta-sub">
              We respond within one business day. We don't send proposals — we start with a conversation.
            </p>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="contact-input" placeholder="Name" required />
            <input type="email" className="contact-input" placeholder="Email" required />
            <textarea className="contact-input contact-textarea" placeholder="Tell us about your project..." rows={5} />
            <button type="submit" className="button-primary">Send message</button>
          </form>
        </section>

      </main>

      <footer className="site-footer">
        <span>© 2026 Orchia</span>
        <span>Seattle, WA</span>
      </footer>
    </div>
  )
}

export default App
