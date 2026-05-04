import { whyUs, tracks, steps } from '../data'

const WORK = [
  {
    num: '01',
    client: 'Artly',
    track: 'AI & Robotics',
    year: '2025',
    location: 'Seattle',
    desc: "Human-machine interface for an AI-powered robotic barista platform. Designed the interaction model, real-time drink status, and queue management for Artly's café robots deployed across café locations in North America.",
  },
  {
    num: '02',
    client: 'Realhand',
    track: 'AI & Robotics',
    year: '2025',
    location: 'Palo Alto',
    desc: "Browser-based 3D vision demo and operational interface for Realhand's dexterous robotic hand platform. Real-time hand-mirroring via computer vision, tele-operation controls, and calibration flows for humanoid and industrial manipulation.",
  },
  {
    num: '03',
    client: 'Really AR',
    track: 'Mobile & AR',
    year: '2025',
    location: 'Los Angeles',
    desc: "Mobile AR platform for Marvel and Regal Cinema. Shipped the Marvels Flerken AR campaign — a camera-based character filter deployed across iOS and Android. Interactive 3D characters, collectible props, and portal experiences distributed with Regal across US and APAC markets.",
  },
]

const CLIENTS = [
  { name: 'Artly AI',                src: '/logos/artly-ai.png'      },
  { name: 'Realhand',                src: '/logos/realhand.webp'     },
  { name: 'Really AR',               src: '/logos/really-ar.png'     },
  { name: 'Artly Coffee',            src: '/logos/artly-coffee.png'  },
  { name: 'NYU',                     src: '/logos/nyu.svg'           },
  { name: 'NYU Urban Systems Lab',   src: '/logos/usl.webp'          },
  { name: 'Parsons School of Design',src: '/logos/parsons.svg'       },
  { name: 'TC Games Research Lab',   src: '/logos/tc-games-lab.png'  },
]

function PageCorners() {
  return (
    <>
      <span className="page-corner page-corner-tl" aria-hidden="true" />
      <span className="page-corner page-corner-tr" aria-hidden="true" />
      <span className="page-corner page-corner-bl" aria-hidden="true" />
      <span className="page-corner page-corner-br" aria-hidden="true" />
    </>
  )
}

function PageMeta({ left, right }: { left: string; right: string }) {
  return (
    <div className="page-meta">
      <span className="mono-label">{left}</span>
      <span className="mono-label">{right}</span>
    </div>
  )
}

function PageFoot({ left, page }: { left: string; page: string }) {
  return (
    <div className="page-foot">
      <span className="mono-label">{left}</span>
      <span className="mono-label">Orchia.Studio</span>
      <span className="mono-label">{page}</span>
    </div>
  )
}

export default function StudioBook() {
  return (
    <div className="book">
      {/* ── COVER ──────────────────────────────────────── */}
      <section className="page page-cover">
        <PageCorners />
        <PageMeta left="Studio Monograph · Ed. I" right="Seattle · 47.6062° N, 122.3321° W" />

        <div className="cover-stack">
          <p className="mono-label cover-kicker">An Orchia.Studio Document</p>
          <h1 className="cover-wordmark">
            <span>Orchia</span>
            <span className="cover-wordmark-suffix">.Studio</span>
          </h1>
          <p className="cover-tagline">
            Orchestra<em>t</em>ing design, infrastructure,<br />
            and advanced technology.
          </p>
        </div>

        <div className="cover-seal">
          <span className="mono-label">Red Dot</span>
          <span className="cover-seal-dot">◈</span>
          <span className="mono-label">DNA Paris</span>
          <span className="cover-seal-dot">◈</span>
          <span className="mono-label">MUSE Gold</span>
        </div>

        <PageFoot left="Cover" page="—" />
      </section>

      {/* ── CONTENTS ───────────────────────────────────── */}
      <section className="page page-contents">
        <PageCorners />
        <PageMeta left="Contents" right="Ed. I · 2026" />

        <h2 className="page-title">
          What's <em>inside</em>.
        </h2>

        <ol className="contents-list">
          <li><span>I</span><span>Thesis</span><span className="contents-page">04</span></li>
          <li><span>II</span><span>Clients Served</span><span className="contents-page">05</span></li>
          <li><span>III</span><span>Selected Work</span><span className="contents-page">06</span></li>
          <li><span>IV</span><span>Why Us</span><span className="contents-page">10</span></li>
          <li><span>V</span><span>About the Studio</span><span className="contents-page">11</span></li>
          <li><span>VI</span><span>Capabilities</span><span className="contents-page">12</span></li>
          <li><span>VII</span><span>Method</span><span className="contents-page">13</span></li>
          <li><span>VIII</span><span>Contact</span><span className="contents-page">14</span></li>
        </ol>

        <PageFoot left="Contents" page="02" />
      </section>

      {/* ── THESIS ─────────────────────────────────────── */}
      <section className="page page-thesis">
        <PageCorners />
        <PageMeta left="I — Thesis" right="Design + Infrastructure" />

        <p className="mono-label page-kicker">Built around your use case</p>
        <h2 className="page-title">
          A customized interface shaped by <em>what your users actually need.</em>
        </h2>

        <ul className="thesis-list">
          <li>
            <span className="thesis-num">01</span>
            <p>
              Good design and stable infrastructure are not a trade-off — we bring both together so your product holds up and feels right at the same time.
            </p>
          </li>
          <li>
            <span className="thesis-num">02</span>
            <p>
              Every interface we build is specific to the use case. We take the time to understand your users before writing a single line of code.
            </p>
          </li>
          <li>
            <span className="thesis-num">03</span>
            <p>
              We build for your users, not for a template. The result is a product that fits the way people actually use it.
            </p>
          </li>
        </ul>

        <PageFoot left="I — Thesis" page="04" />
      </section>

      {/* ── CLIENTS ────────────────────────────────────── */}
      <section className="page page-clients">
        <PageCorners />
        <PageMeta left="II — Clients Served" right="Partners · 2022 — 2026" />

        <h2 className="page-title">
          Partners we have built <em>product</em> with.
        </h2>

        <div className="clients-print-grid">
          {CLIENTS.map((c) => (
            <div key={c.name} className="clients-print-slot">
              <img src={c.src} alt={c.name} className="clients-print-logo" />
              <span className="clients-print-name">{c.name}</span>
            </div>
          ))}
        </div>

        <PageFoot left="II — Clients Served" page="05" />
      </section>

      {/* ── SELECTED WORK overview ────────────────────── */}
      <section className="page page-work-overview">
        <PageCorners />
        <PageMeta left="III — Selected Work" right="Projects · 2023 — 2025" />

        <h2 className="page-title page-title-large">
          Built <em>end&nbsp;to&nbsp;end</em>,<br />
          for real use.
        </h2>

        <div className="work-overview-list">
          {WORK.map((p) => (
            <article key={p.num} className="work-overview-row">
              <span className="work-overview-num">{p.num}</span>
              <div>
                <h3 className="work-overview-client">{p.client}</h3>
                <span className="mono-label">{p.track} · {p.location} · {p.year}</span>
              </div>
            </article>
          ))}
        </div>

        <PageFoot left="III — Selected Work" page="06" />
      </section>

      {/* ── WORK: one page per project ─────────────────── */}
      {WORK.map((p, i) => (
        <section key={p.num} className="page page-project">
          <PageCorners />
          <PageMeta left={`III — Project ${p.num}`} right={`${p.track} · ${p.year}`} />

          <p className="mono-label page-kicker">Case · {p.location}</p>
          <h2 className="page-title page-title-huge">
            <em>{p.client}</em>
          </h2>

          <p className="project-desc">{p.desc}</p>

          <div className="project-meta-grid">
            <div>
              <span className="mono-label">Track</span>
              <p className="project-meta-value">{p.track}</p>
            </div>
            <div>
              <span className="mono-label">Location</span>
              <p className="project-meta-value">{p.location}</p>
            </div>
            <div>
              <span className="mono-label">Year</span>
              <p className="project-meta-value">{p.year}</p>
            </div>
            <div>
              <span className="mono-label">Role</span>
              <p className="project-meta-value">Design &amp; Engineering</p>
            </div>
          </div>

          <PageFoot left={`III.${p.num} — ${p.client}`} page={`0${7 + i}`} />
        </section>
      ))}

      {/* ── WHY US ─────────────────────────────────────── */}
      <section className="page page-why">
        <PageCorners />
        <PageMeta left="IV — Why Us" right="Principles" />

        <h2 className="page-title">
          Design systems, retention thinking, and <em>advanced features</em> used with restraint.
        </h2>

        <div className="why-print-grid">
          {whyUs.map((item) => (
            <article key={item.num} className="why-print-card">
              <div className="why-print-top">
                <span className="why-print-num">{item.num}</span>
                <span className="mono-label">Principle</span>
              </div>
              <h3 className="why-print-title">{item.title}</h3>
              <p className="why-print-desc">{item.description}</p>
            </article>
          ))}
        </div>

        <PageFoot left="IV — Why Us" page="10" />
      </section>

      {/* ── ABOUT ──────────────────────────────────────── */}
      <section className="page page-about">
        <PageCorners />
        <PageMeta left="V — About the Studio" right="Est. 2022 · Seattle" />

        <h2 className="page-title">
          Orchia.studio designs and builds <em>high-performance</em> mobile and web products for consumer brands.
        </h2>

        <p className="about-intro">
          Our roots are in Parsons School of Design, Snap Inc., and award-winning product design practice.
        </p>

        <div className="about-body">
          <p>
            Design, engineering, and product decisions are made by the people actually building the
            work. That keeps the loop between decision and delivery tight, with timelines measured in weeks.
          </p>
          <p>
            We engineer directly on Shopify's Storefront API, Metafields, Webhooks, and POS, and
            build mobile-first interfaces that hold up in production. AR, AI-driven personalization,
            and camera-based interaction are core capabilities, not add-ons.
          </p>
        </div>

        <PageFoot left="V — About the Studio" page="11" />
      </section>

      {/* ── CAPABILITIES ──────────────────────────────── */}
      <section className="page page-capabilities">
        <PageCorners />
        <PageMeta left="VI — Capabilities" right="Tracks" />

        <h2 className="page-title">
          Products with <em>operational depth</em>, not just polished screens.
        </h2>

        <div className="tracks-print">
          {tracks.map((t, i) => (
            <article key={t.tag} className="track-print">
              <span className="mono-label">0{i + 1} / 0{tracks.length}</span>
              <p className="mono-label track-print-tag">{t.tag}</p>
              <h3 className="track-print-headline">{t.headline}</h3>
              <ul className="track-print-list">
                {t.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <PageFoot left="VI — Capabilities" page="12" />
      </section>

      {/* ── PROCESS ────────────────────────────────────── */}
      <section className="page page-process">
        <PageCorners />
        <PageMeta left="VII — Method" right="Phases" />

        <h2 className="page-title">
          Architecture <em>first</em>. Delivery in clear phases.
        </h2>

        <ol className="process-print">
          {steps.map((s) => (
            <li key={s.step} className="process-print-step">
              <span className="mono-label process-print-num">{s.step}</span>
              <div>
                <h3 className="process-print-title">{s.title}</h3>
                <p className="process-print-desc">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <PageFoot left="VII — Method" page="13" />
      </section>

      {/* ── CONTACT / BACK COVER ──────────────────────── */}
      <section className="page page-contact">
        <PageCorners />
        <PageMeta left="VIII — Contact" right="Reply &lt; 48h" />

        <div className="contact-stack">
          <p className="mono-label page-kicker">Ready to move</p>
          <h2 className="page-title page-title-large">
            Let's talk about <em>what you're building.</em>
          </h2>

          <div className="contact-print-grid">
            <div>
              <span className="mono-label">Studio</span>
              <p className="contact-print-value">Orchia.Studio</p>
            </div>
            <div>
              <span className="mono-label">Location</span>
              <p className="contact-print-value">Seattle, WA</p>
              <p className="contact-print-sub">47.6062° N, 122.3321° W · 53 m</p>
            </div>
            <div>
              <span className="mono-label">Contact</span>
              <p className="contact-print-value">hello@orchia.studio</p>
              <p className="contact-print-sub">orchia.studio</p>
            </div>
            <div>
              <span className="mono-label">Est.</span>
              <p className="contact-print-value">2022</p>
            </div>
          </div>
        </div>

        <div className="back-colophon">
          <p className="mono-label">© 2026 Orchia Studio — Seattle · WA</p>
          <p className="mono-label">Built end to end ◈ Studio Monograph, Ed. I</p>
        </div>

        <PageFoot left="VIII — Contact" page="14" />
      </section>
    </div>
  )
}
