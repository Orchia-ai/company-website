import { techStack } from '../../data'

export default function Tech() {
  return (
    <div className="tech-band">
      <p className="eyebrow" style={{ marginBottom: 18 }}>Technology</p>
      <div className="tech-list">
        {techStack.map((t) => (
          <span key={t} className="tech-pill">{t}</span>
        ))}
      </div>
      <p className="tech-note">
        No proprietary lock-in. Clean architecture your team can own and extend.
      </p>
    </div>
  )
}
