export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wordmark" aria-hidden="true">
        <span>Orchia</span>
        <span className="footer-wordmark-suffix">.Studio</span>
      </div>

      <div className="footer-download-bar">
        <div className="footer-download-info">
          <span className="mono-label footer-download-label">Studio Monograph · Ed. I · 14 pp.</span>
          <p className="footer-download-title">The Orchia <em>Capability</em> Document.</p>
        </div>
        <a className="footer-download-link" href="/print.html" target="_blank" rel="noopener">
          Download ↗
        </a>
      </div>

      <div className="footer-meta">
        <span className="mono-label">© 2026 Orchia Studio</span>
        <span className="mono-label">Seattle · 47.6062° N, 122.3321° W · 53 m</span>
        <a className="mono-label footer-print-link" href="/blog">
          Journal →
        </a>
      </div>
    </footer>
  )
}
