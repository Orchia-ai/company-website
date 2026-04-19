import { whyUs } from '../../data'

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-header">
        <p className="eyebrow">Why Orchia</p>
        <h2>Design systems, retention thinking, and advanced features used with restraint.</h2>
        <p className="why-intro">
          We build mobile commerce products with operational depth: coherent systems, clear delivery
          phases, and features that serve the product instead of distracting from it. The result is
          a product that can launch cleanly and keep improving after release.
        </p>
      </div>
      <div className="why-grid">
        {whyUs.map((item) => (
          <article key={item.num} className="why-card">
            <div className="why-card-top">
              <span className="why-num">{item.num}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
