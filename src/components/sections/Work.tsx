import { useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    client: 'Artly AI',
    track: 'AI & Robotics',
    slug: 'artly-ai',
    year: '2024',
    location: 'Seattle',
    desc: 'Human-machine interface for an AI-powered robotic bar. Interaction model, real-time order status, and system-state visualization for a fully automated environment.',
  },
  {
    num: '02',
    client: 'Realhand',
    track: 'AI & Robotics',
    slug: 'realhand',
    year: '2024',
    location: 'NYC',
    desc: 'Control and configuration interface for a prosthetic limb platform. Safety-critical UX with real-time sensor feedback, calibration flows, and device management.',
  },
  {
    num: '03',
    client: 'Really AR',
    track: 'E-Commerce & Mobile',
    slug: 'really-ar',
    year: '2024',
    location: 'Brooklyn',
    desc: 'Augmented reality product experience within a mobile shopping flow. Customers preview objects in physical space before completing a purchase.',
  },
]

export default function Work() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="work-section section-block" id="work">
      <div className="section-heading work-heading">
        <div className="section-meta">
          <span className="mono-label">S / 03 — Selected Work</span>
          <span className="mono-label">03 Projects · 2024</span>
        </div>
        <h2>
          Built <em>end&nbsp;to&nbsp;end</em>,<br />
          for real use.
        </h2>
      </div>
      <div className="work-list">
        {PROJECTS.map((p, i) => (
          <article
            key={p.num}
            className={`work-item${active === i ? ' work-item--active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="work-num" aria-hidden="true">{p.num}</span>
            <div className="work-meta">
              <h3 className="work-client">{p.client}</h3>
              <div className="work-tags">
                <span className="work-track">{p.track}</span>
                <span className="work-dot">·</span>
                <span className="work-loc mono-label">{p.location}</span>
              </div>
              <p className="work-desc">{p.desc}</p>
            </div>
            <time className="work-year mono-label">{p.year}</time>
            <div className={`work-thumb work-thumb--${p.slug}`} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}
