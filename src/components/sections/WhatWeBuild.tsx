import { tracks } from '../../data'

export default function WhatWeBuild() {
  return (
    <section className="section-block" id="what-we-build">
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 03 — What We Build</span>
          <span className="mono-label">Two Tracks</span>
        </div>
        <h2>
          Two tracks, <em>one studio</em>.
        </h2>
      </div>
      <div className="tracks">
        {tracks.map((track, i) => (
          <article key={track.tag} className="track-card">
            <div className={`track-image track-image--${i === 0 ? 'commerce' : 'robotics'}`}>
              <span className="track-image-num mono-label">0{i + 1} / 02</span>
              <span className="track-image-placeholder mono-label" aria-hidden="true">
                {i === 0 ? 'Mobile UI' : 'Control Surface'}
              </span>
            </div>
            <div className="track-content">
              <div className="track-header">
                <span className="track-icon">{track.icon}</span>
                <span className="track-tag">{track.tag}</span>
              </div>
              <h3 className="track-headline">{track.headline}</h3>
              <ul className="track-list">
                {track.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
