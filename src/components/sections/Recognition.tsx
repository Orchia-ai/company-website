const AWARDS = [
  { name: 'Red Dot Award', detail: 'Product Design', year: '2025' },
  { name: 'DNA Paris', detail: 'Design Award', year: '2025' },
  { name: 'MUSE Design Awards', detail: 'Gold', year: '2025' },
]

export default function Recognition() {
  return (
    <section className="recognition-band" aria-label="Awards and recognition">
      <div className="recognition-corner recognition-corner-tl" aria-hidden="true" />
      <div className="recognition-corner recognition-corner-tr" aria-hidden="true" />
      <div className="recognition-corner recognition-corner-bl" aria-hidden="true" />
      <div className="recognition-corner recognition-corner-br" aria-hidden="true" />

      <div className="recognition-header">
        <span className="mono-label">S / 07 — Recognition</span>
        <span className="recognition-seal" aria-hidden="true">◈</span>
        <span className="mono-label">2025</span>
      </div>

      <div className="recognition-grid">
        {AWARDS.map((a, i) => (
          <div key={a.name} className="recognition-item">
            <span className="recognition-num mono-label">{String(i + 1).padStart(2, '0')}</span>
            <span className="recognition-name">{a.name}</span>
            <span className="recognition-detail">{a.detail} · {a.year}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
