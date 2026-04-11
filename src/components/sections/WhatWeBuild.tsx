import { tracks } from '../../data'

export default function WhatWeBuild() {
  return (
    <section className="section-block" id="what-we-build">
      <div className="section-heading">
        <p className="eyebrow">What we build</p>
        <h2>Two disciplines. One standard of quality.</h2>
      </div>
      <div className="tracks">
        {tracks.map((track) => (
          <article key={track.tag} className="track-card">
            <div className="track-image" />
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
