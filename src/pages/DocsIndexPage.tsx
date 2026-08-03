import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import styles from './docs-index-page.module.css'

export default function DocsIndexPage() {
  useEffect(() => {
    document.body.classList.add('docs-index-mode')
    return () => document.body.classList.remove('docs-index-mode')
  }, [])

  return (
    <>
      <Helmet>
        <title>Documentation — Orchia Studio</title>
        <meta
          name="description"
          content="Guides for creating, refining, and delivering video projects with Orchia Studio."
        />
        <link rel="canonical" href="https://orchia.studio/docs" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Orchia Studio" />
        <meta property="og:title" content="Documentation — Orchia Studio" />
        <meta
          property="og:description"
          content="Guides for creating, refining, and delivering video projects with Orchia Studio."
        />
      </Helmet>

      <div className={styles.page}>
        <header className={styles.siteHeader}>
          <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>

          <nav className={styles.headerNav} aria-label="Documentation navigation">
            <span aria-current="page">Documentation</span>
            <Link to="/">Home</Link>
          </nav>
        </header>

        <main>
          <section className={styles.hero} aria-labelledby="docs-index-title">
            <p className={styles.eyebrow}>Orchia Studio / Documentation</p>
            <h1 id="docs-index-title">Documentation</h1>
            <p className={styles.intro}>
              Practical guides for running complete video workflows and improving
              each project through feedback.
            </p>
          </section>

          <section className={styles.guideSection} aria-label="Documentation guides">
            <Link className={styles.guideCard} to="/docs/discord-video-workflow">
              <div className={styles.cardMeta}>
                <span>Workflow guide</span>
                <span>Discord</span>
              </div>
              <h3>Discord video workflow</h3>
              <p>
                Create a project thread, review generated video, give feedback,
                rerun efficiently, and receive the final delivery inside Discord.
              </p>
              <div className={styles.commandList} aria-label="Commands covered">
                <code>/newproject</code>
                <code>/feedback</code>
                <code>/rerun</code>
                <code>/terminate</code>
                <code>/version</code>
              </div>
              <span className={styles.cardLink}>Open documentation →</span>
            </Link>
          </section>
        </main>

        <footer className={styles.footer}>
          <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>
          <p>Guides for the tools we are building with creators.</p>
          <Link to="/#contact">Contact us for private access →</Link>
        </footer>
      </div>
    </>
  )
}
