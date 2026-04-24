import { steps } from '../../data'

export default function Process() {
  return (
    <section className="section-block" id="process">
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 09 — Method</span>
          <span className="mono-label">Phases</span>
        </div>
        <h2>
          Architecture <em>first</em>.<br />Delivery in clear phases.
        </h2>
      </div>
      <div className="workflow">
        {steps.map((s) => (
          <div key={s.step} className="workflow-step">
            <article className="workflow-card">
              <div className="step-left">
                <span className="step-num">{s.step}</span>
                <span className="step-connector" />
              </div>
              <div className="step-right">
                <div className="step-title">{s.title}</div>
                <p>{s.description}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
