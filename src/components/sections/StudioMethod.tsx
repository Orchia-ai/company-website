const PROOF_NOTES = [
  'Seattle studio',
  'Founded 2022',
  'Roots at Parsons and Snap Inc.',
  'AR · AI · Robotics · Commerce',
]

export default function StudioMethod() {
  return (
    <section className="studio-section" id="studio-method">
      <div className="studio-corner studio-corner-tl" aria-hidden="true" />
      <div className="studio-corner studio-corner-tr" aria-hidden="true" />
      <div className="studio-corner studio-corner-bl" aria-hidden="true" />
      <div className="studio-corner studio-corner-br" aria-hidden="true" />

      <div className="studio-header studio-header--centered">
        <div className="section-meta">
          <span className="mono-label">S / 08 — Studio</span>
          <span className="mono-label">Est. 2022 · Seattle</span>
        </div>
        <h2 className="studio-headline">
          The people <em>shaping</em> the product are the people <em>building</em> it.
        </h2>
        <p className="studio-standfirst">
          We work as a small product and engineering studio, moving from strategy to interface
          to production without handing the work across disconnected teams.
        </p>
      </div>

      <div className="studio-rule" aria-hidden="true" />

      <ul className="studio-proof-grid" aria-label="Studio proof points">
        {PROOF_NOTES.map((note) => (
          <li key={note} className="studio-proof-item">
            <span className="studio-proof-tick" aria-hidden="true" />
            <span className="studio-proof-text">{note}</span>
          </li>
        ))}
      </ul>

      <div className="studio-plate" aria-hidden="true">
        <span className="mono-label">Pl. V</span>
      </div>

      <span id="who-we-are" className="studio-anchor" aria-hidden="true" />
      <span id="why-us" className="studio-anchor" aria-hidden="true" />
    </section>
  )
}
