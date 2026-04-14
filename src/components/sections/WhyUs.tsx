import { whyUs } from '../../data'

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-header">
        <p className="eyebrow">Why Orchia</p>
        <h2>Advanced technology. Reliable infrastructure. Experiences that flow.</h2>
        <p className="why-intro">
          Most studios are strong on one side. Either the design is exceptional and the
          engineering is fragile, or the engineering is solid and the design is sterile.
          We built Orchia specifically to close that gap.
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
