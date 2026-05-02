import { useState } from 'react'
import { Link } from 'react-router-dom'

type Project = {
  num: string
  client: string
  track: string
  slug: string
  year: string
  location: string
  desc: string
  tags: string[]
  caseStudy?: string
  tryout?: { href: string; label: string }
  media?: { type: 'image' | 'video'; src: string; poster?: string }
}

const PROJECTS: Project[] = [
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
    caseStudy: '/blog/realhand-vision-pipeline',
    tryout: { href: 'https://www.realhand.com/demo', label: 'realhand.com/demo' },
    media: {
      type: 'image',
      src: 'https://img.youtube.com/vi/xwrGzC8Z14s/maxresdefault.jpg',
    },
  },
  {
    num: '03',
    client: 'Really AR × Regal Cinema',
    track: 'Mobile & AR',
    slug: 'really-ar',
    year: '2023',
    location: 'Los Angeles',
    desc: 'Camera-based mobile AR campaigns and interactive entertainment experiences — including the official AR marketing campaign for Marvel’s The Marvels.',
    tags: ['Lens Studio', 'Effect House', 'Object Detection', 'HLSL'],
    caseStudy: '/blog/marvels-flerken-ar-campaign',
    media: {
      type: 'video',
      src: 'https://www.lingyizhou.com/assets/cargo-import/marvel-s-flerken-ar-filter-commercial-ar-campaign/1697673358881.mp4',
    },
  },
]

export default function Work() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="work-section section-block" id="work">
      <div className="section-heading work-heading">
        <div className="section-meta">
          <span className="mono-label">S / 02 — Selected Work</span>
          <span className="mono-label">Projects · 2023&thinsp;—&thinsp;2024</span>
        </div>
        <h2>
          Built <em>end&nbsp;to&nbsp;end</em>,<br />
          for real use.
        </h2>
      </div>
      <div className="work-list">
        {PROJECTS.map((p, i) => {
          const inner = (
            <>
              <span className="work-num" aria-hidden="true">{p.num}</span>
              <div className={`work-thumb work-thumb--${p.slug}${p.media ? ' work-thumb--media' : ''}`} aria-hidden="true">
                {p.media ? (
                  p.media.type === 'video' ? (
                    <video
                      className="work-thumb-media"
                      src={p.media.src}
                      poster={p.media.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img className="work-thumb-media" src={p.media.src} alt="" />
                  )
                ) : (
                  <div className="work-thumb-screen">
                    <span className="work-thumb-kicker mono-label">{p.track}</span>
                    <span className="work-thumb-line work-thumb-line--wide" />
                    <span className="work-thumb-line" />
                  </div>
                )}
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
                {(p.caseStudy || p.tryout) && (
                  <div className="work-links">
                    {p.caseStudy && (
                      <span className="work-link mono-label">Read case study →</span>
                    )}
                    {p.tryout && (
                      <a
                        href={p.tryout.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="work-link work-link--tryout mono-label"
                      >
                        Try it live · {p.tryout.label} ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )

          const sharedProps = {
            className: `work-item${active === i ? ' work-item--active' : ''}${p.caseStudy ? ' work-item--linked' : ''}`,
            onMouseEnter: () => setActive(i),
            onMouseLeave: () => setActive(null),
          }

          return p.caseStudy ? (
            <Link key={p.num} to={p.caseStudy} {...sharedProps}>
              {inner}
            </Link>
          ) : (
            <article key={p.num} {...sharedProps}>
              {inner}
            </article>
          )
        })}
      </div>
      <a className="work-cta" href="#contact">
        <span>Have a product that needs both interface design and engineering depth?</span>
        <strong>Start a conversation →</strong>
      </a>
    </section>
  )
}
