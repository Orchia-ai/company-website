import { whyUs } from '../../data'

const ROMAN = ['I', 'II', 'III']

const FIELD_NOTES = [
  'Orchia is a digital product studio in Seattle, founded in 2022 by designers and engineers trained at Parsons School of Design and Snap Inc., with backgrounds in award-winning consumer product work.',
  'The people making design, engineering, and product decisions are the people shipping the code. The loop between decision and delivery stays tight; timelines are measured in weeks.',
  'We work natively on Shopify’s Storefront API, Metafields, Webhooks, and POS, and build mobile-first interfaces that hold up in production. AR, AI-driven personalization, and camera-based interaction are core capabilities, not add-ons.',
]

export default function StudioMethod() {
  return (
    <section className="studio-section" id="studio-method">
      <div className="studio-corner studio-corner-tl" aria-hidden="true" />
      <div className="studio-corner studio-corner-tr" aria-hidden="true" />
      <div className="studio-corner studio-corner-bl" aria-hidden="true" />
      <div className="studio-corner studio-corner-br" aria-hidden="true" />

      <div className="studio-header">
        <div className="section-meta">
          <span className="mono-label">S / 05 — Studio &amp; Method</span>
          <span className="mono-label">Est. 2022 · Seattle</span>
        </div>
        <h2 className="studio-headline">
          The people <em>deciding</em> are the people <em>building</em>.
        </h2>
        <p className="studio-standfirst">
          A Seattle studio of Parsons- and Snap-trained product designers and engineers, working
          directly on the surfaces — mobile, commerce, AR, AI — that ship to customers.
        </p>
      </div>

      <div className="studio-rule" aria-hidden="true" />

      <div className="studio-spread">
        <aside className="studio-notes" aria-label="Field notes — the studio">
          <div className="studio-notes-running">
            <span className="mono-label">Field Notes — The Studio</span>
          </div>
          <ol className="studio-notes-list">
            {FIELD_NOTES.map((note, i) => (
              <li key={i} className={`studio-note${i === 0 ? ' studio-note-lede' : ''}`}>
                <span className="studio-note-numeral mono-label">{ROMAN[i]}</span>
                <p>{note}</p>
              </li>
            ))}
          </ol>
          <div className="studio-signature" aria-hidden="true">
            <span className="studio-signature-rule" />
            <span className="studio-signature-line">Orchia.studio · Est. 2022 · Seattle, WA</span>
          </div>
        </aside>

        <div className="studio-ledger-col">
          <div className="studio-ledger-running">
            <span className="mono-label">The Principles</span>
            <span className="mono-label">01 — 04</span>
          </div>
          <ol className="studio-ledger" id="why-us">
            {whyUs.map((item) => (
              <li key={item.num} className="studio-ledger-row">
                <span className="studio-ledger-num">{item.num}</span>
                <div className="studio-ledger-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="studio-plate" aria-hidden="true">
        <span className="mono-label">Pl. V</span>
      </div>

      <span id="who-we-are" className="studio-anchor" aria-hidden="true" />
    </section>
  )
}
