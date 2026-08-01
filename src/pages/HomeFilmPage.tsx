import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SpecialistWorkflowsFilm from '../film/SpecialistWorkflowsFilm'
import DataSection from './DataSection'
import SiteFooter from './SiteFooter'
import styles from './home-film-page.module.css'

/**
 * The landing page: the demo film, the data deck, then the footer. The only
 * links off the page go to the app itself.
 */
export default function HomeFilmPage() {
  useEffect(() => {
    // Suppress the paper-grain overlay index.css applies site-wide; it belongs
    // to the linen marketing pages, not this dark one.
    document.body.classList.add('film-mode')
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <>
      <Helmet>
        <title>Orchia Studio — Every specialist. One shared production.</title>
        <meta
          name="description"
          content="Orchia connects writing, art, camera, and audience decisions so every specialist keeps control of their craft while the production stays in sync."
        />
        <meta property="og:title" content="Orchia Studio — Every specialist. One shared production." />
        <meta
          property="og:description"
          content="Orchia connects writing, art, camera, and audience decisions so every specialist keeps control of their craft while the production stays in sync."
        />
      </Helmet>

      <div className={styles.page}>
        <section className={styles.filmSection} aria-label="Product film">
          <header className={styles.bar}>
            <span className={styles.brand}>
              Orchia
              <span className={styles.brandSuffix}>Studio</span>
            </span>
          </header>

          <div className={styles.stageArea}>
            <SpecialistWorkflowsFilm />
          </div>

          <div className={styles.bar}>
            <a className={styles.cta} href="https://app.orchia.studio">
              Use App
            </a>
          </div>

          <a className={styles.scrollHint} href="#data">
            <span className={styles.label}>Scroll</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path
                d="M1 1L8 8L15 1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </section>

        <DataSection />
        <SiteFooter />
      </div>
    </>
  )
}
