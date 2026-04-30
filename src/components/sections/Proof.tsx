import { PhoneIcon, StoreIcon, SparkleIcon } from '../../icons'
import PhoneMockup from '../PhoneMockup'

const callouts = [
  { icon: <PhoneIcon />, title: 'Connected Mobile Journeys', desc: 'Discovery, cart, checkout, and account flows designed as one coherent product instead of separate screens.' },
  { icon: <StoreIcon />, title: 'Loyalty-Native Commerce', desc: 'Rewards, purchase history, account value, and repeat-use behavior designed directly into the app experience.' },
  { icon: <SparkleIcon />, title: 'Selective Advanced Features', desc: 'AI assistance, previews, and smarter engagement loops introduced only when they improve the product in a measurable way.' },
]

export default function Proof() {
  return (
    <section className="proof-section proof-section--dark">
      <div className="proof-corner proof-corner-tl" aria-hidden="true" />
      <div className="proof-corner proof-corner-tr" aria-hidden="true" />
      <div className="proof-corner proof-corner-bl" aria-hidden="true" />
      <div className="proof-corner proof-corner-br" aria-hidden="true" />
      <div className="proof-inner">
        <div className="proof-mockup-col">
          <PhoneMockup />
        </div>
        <div className="proof-content-col">
          <div className="section-meta proof-meta">
            <span className="mono-label">S / 04 — E-commerce Track</span>
            <span className="mono-label">Live Prototype</span>
          </div>
          <h2>
            Commerce apps that <em>connect</em> discovery,<br />loyalty, and repeat purchase.
          </h2>
          <p className="proof-body">
            We design mobile retail products that do more than mirror a website. Product discovery,
            membership value, account state, and post-purchase touchpoints all live in one coherent
            experience built for long-term use.
          </p>
          <div className="proof-callouts">
            {callouts.map((c, i) => (
              <div key={c.title} className="proof-callout">
                <span className="proof-callout-icon">{c.icon}</span>
                <div>
                  <h3>
                    <span className="proof-callout-num mono-label">0{i + 1}</span>
                    {c.title}
                  </h3>
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
