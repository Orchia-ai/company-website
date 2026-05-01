const COLUMNS = [
  {
    label: 'AI & Robotics',
    items: [
      'Robot control dashboards',
      'Real-time 3D visualization',
      'Teleoperation interfaces',
      'Operator workflow tools',
      'Hardware state monitoring',
    ],
  },
  {
    label: 'E-Commerce & Mobile',
    items: [
      'Shopify-native mobile apps',
      'Product discovery interfaces',
      'Loyalty and membership systems',
      'Account and reorder flows',
      'Personalization and analytics dashboards',
    ],
  },
]

export default function Capabilities() {
  return (
    <section className="section-block capability-section" id="capabilities">
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 08 — Capabilities</span>
          <span className="mono-label">Matrix</span>
        </div>
        <h2>
          Where the work <em>actually</em> lives.
        </h2>
      </div>
      <div className="capability-matrix">
        {COLUMNS.map((col) => (
          <div key={col.label} className="capability-col">
            <div className="capability-col-head">
              <span className="mono-label">{col.label}</span>
            </div>
            <ul className="capability-list">
              {col.items.map((item) => (
                <li key={item} className="capability-row">
                  <span className="capability-dot" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
