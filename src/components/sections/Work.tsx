import { useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    client: 'Artly AI',
    track: 'AI & Robotics',
    slug: 'artly-ai',
    year: '2024',
    location: 'Seattle',
    desc: 'Robotics deployment and control interface for configuring, previewing, and validating robot behavior across store environments.',
    tags: ['React', 'Three.js', 'Real-time Visualization', 'Robotics UI'],
  },
  {
    num: '02',
    client: 'Realhand',
    track: 'AI & Robotics',
    slug: 'realhand',
    year: '2024',
    location: 'Palo Alto',
    desc: 'Real-time hand-tracking and teleoperation tooling for robotic hand workflows.',
    tags: ['Python', 'MediaPipe', 'MuJoCo', 'Teleoperation'],
  },
  {
    num: '03',
    client: 'Really AR',
    track: 'Mobile & AR',
    slug: 'really-ar',
    year: '2023',
    location: 'Los Angeles',
    desc: 'Camera-based mobile AR campaigns and interactive entertainment experiences.',
    tags: ['Unity', 'AR', 'Mobile Interaction', 'Campaign UX'],
  },
]

export default function Work() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="work-section section-block" id="work">
      <div className="section-heading work-heading">
        <div className="section-meta">
          <span className="mono-label">S / 04 — Selected Work</span>
          <span className="mono-label">Projects · 2023&thinsp;—&thinsp;2024</span>
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
            <div className={`work-thumb work-thumb--${p.slug}`} aria-hidden="true">
              <div className="work-thumb-screen">
                <span className="work-thumb-kicker mono-label">{p.track}</span>
                <span className="work-thumb-line work-thumb-line--wide" />
                <span className="work-thumb-line" />
              </div>
            </div>
            <div className="work-meta">
              <h3 className="work-client">{p.client}</h3>
              <div className="work-tags">
                <span className="work-track">{p.track}</span>
                <span className="work-dot">·</span>
                <span className="work-loc mono-label">{p.location}</span>
                <span className="work-dot">·</span>
                <time className="work-loc mono-label">{p.year}</time>
              </div>
              <p className="work-desc">{p.desc}</p>
              <ul className="work-tag-chips" aria-label="Stack and tags">
                {p.tags.map((t) => (
                  <li key={t} className="work-tag-chip mono-label">{t}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <a className="work-cta" href="#contact">
        <span>Have a product that needs both interface design and engineering depth?</span>
        <strong>Start a conversation →</strong>
      </a>
    </section>
  )
}
