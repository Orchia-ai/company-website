import { whyUs } from '../../data'

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-header">
        <p className="eyebrow">Why Orchia</p>
        <h2>Stable infrastructure. Considered design. Features that make people look twice.</h2>
        <p className="why-intro">
          We build e-commerce products that hold up under real conditions — reliable architecture,
          clean interfaces, and experimental capabilities layered in deliberately. The result
          is a balanced product: solid enough to trust, distinctive enough to stand out.
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
