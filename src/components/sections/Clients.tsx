export default function Clients() {
  return (
    <section className="clients-section">
      <p className="eyebrow" style={{ marginBottom: 32 }}>Current clients</p>
      <div className="clients-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="client-logo-slot">
            <div className="client-logo-placeholder" />
          </div>
        ))}
      </div>
    </section>
  )
}
