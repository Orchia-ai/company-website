import { useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    client: 'Artly',
    track: 'AI & Robotics',
    slug: 'artly-ai',
    year: '2024',
    location: 'Seattle',
    desc: 'Human-machine interface for an AI-powered robotic barista platform. Designed the interaction model, real-time drink status, and queue management for Artly’s café robots deployed across North America.',
  },
  {
    num: '02',
    client: 'Realhand',
    track: 'AI & Robotics',
    slug: 'realhand',
    year: '2024',
    location: 'Palo Alto',
    desc: 'Interface design for HandOS, an AI-driven dexterous robotic hand platform. Real-time sensor feedback, tele-operation controls, and calibration flows for humanoid and industrial manipulation.',
  },
  {
    num: '03',
    client: 'Really',
    track: 'Mobile & AR',
    slug: 'really-ar',
    year: '2023',
    location: 'Los Angeles',
    desc: 'Mobile AR platform for blockbuster cinema, rebranded from Moviebill. Interactive 3D characters, collectible props, and portal experiences distributed with Regal across US and APAC markets.',
  },
]

export default function Work() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="work-section section-block" id="work">
      <div className="section-heading work-heading">
        <div className="section-meta">
          <span className="mono-label">S / 03 — Selected Work</span>
          <span className="mono-label">03 Projects · 2023&thinsp;—&thinsp;2024</span>
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
