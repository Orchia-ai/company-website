const clients = [
  { name: 'Artly AI',     src: '/logos/artly-ai.png',     showName: false },
  { name: 'Realhand',     src: '/logos/realhand.webp',    showName: false },
  { name: 'Really AR',    src: '/logos/really-ar.png',    showName: true  },
  { name: 'Artly Coffee', src: '/logos/artly-coffee.png', showName: false },
]

export default function Clients() {
  return (
    <div className="clients-wrapper">
      <p className="eyebrow clients-eyebrow">Clients we have served</p>
      <section className="clients-section">
        <div className="clients-grid">
          {clients.map((c) => (
            <div key={c.name} className="client-logo-slot">
              <img src={c.src} alt={c.name} className="client-logo" />
              {c.showName && <span className="client-name">{c.name}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
