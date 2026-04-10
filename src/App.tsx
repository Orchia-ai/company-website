import './App.css'

const services = [
  'Brand strategy that clarifies positioning before a single pixel gets pushed.',
  'High-conversion product marketing sites built for speed, story, and trust.',
  'Design systems that help teams launch consistently across web, sales, and ops.',
]

const metrics = [
  { value: '42%', label: 'Average lift in qualified pipeline after launch' },
  { value: '3 wks', label: 'Typical sprint to get from kickoff to live site' },
  { value: '24/7', label: 'Monitoring, iteration, and content support coverage' },
]

const workstreams = [
  {
    title: 'Position',
    description:
      'We turn messy internal language into a clear point of view customers can repeat.',
  },
  {
    title: 'Design',
    description:
      'Interfaces are shaped around credibility, momentum, and the moments that drive contact.',
  },
  {
    title: 'Scale',
    description:
      'Your site ships with reusable sections, practical governance, and a roadmap for the next release.',
  },
]

function App() {
  return (
    <div className="site-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#hero" aria-label="Company Website home">
          <span className="brand-mark">CW</span>
          <span className="brand-text">
            <strong>Company Website</strong>
            <span>Digital presence for modern teams</span>
          </span>
        </a>

        <nav className="nav">
          <a href="#services">Services</a>
          <a href="#work">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="hero-copy">
            <p className="eyebrow">Launch a sharper story</p>
            <h1>Websites that make growing companies look inevitable.</h1>
            <p className="lede">
              Company Website helps teams replace generic marketing pages with a
              brand experience built to earn trust fast and convert attention
              into active demand.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Book a discovery call
              </a>
              <a className="button button-secondary" href="#services">
                Explore capabilities
              </a>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-kicker">Featured engagement</p>
            <h2>Enterprise refresh for a B2B software launch</h2>
            <ul>
              <li>Messaging overhaul across homepage, product, and pricing.</li>
              <li>Design direction tailored for executive buyers and operators.</li>
              <li>Fast Vite-based implementation ready for iterative rollout.</li>
            </ul>
          </aside>
        </section>

        <section className="metrics" aria-label="Impact metrics">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="section-grid" id="services">
          <div className="section-heading">
            <p className="eyebrow">What we build</p>
            <h2>Strategy, copy, and interface work delivered as one system.</h2>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article key={service} className="panel">
                <p>{service}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-grid" id="work">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>A focused process for teams that need momentum, not theater.</h2>
          </div>

          <div className="workflow">
            {workstreams.map((stream) => (
              <article key={stream.title} className="workflow-card">
                <span>{stream.title}</span>
                <p>{stream.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta" id="contact">
          <div>
            <p className="eyebrow">Ready to move</p>
            <h2>Build the site your sales team wants to send prospects.</h2>
          </div>

          <a className="button button-primary" href="mailto:hello@companywebsite.com">
            hello@companywebsite.com
          </a>
        </section>
      </main>
    </div>
  )
}

export default App
