import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import SpecialistWorkflowsFilm from '../film/SpecialistWorkflowsFilm'
import DataSection from './DataSection'
import HeroFeedbackLoop from './HeroFeedbackLoop'
import PrivateAccessModal from './PrivateAccessModal'
import SiteFooter from './SiteFooter'
import WorkflowIterationSection from './WorkflowIterationSection'
import styles from './home-film-page.module.css'

/**
 * The landing page: a workflow iteration demo, the production data, the
 * product film, then the footer.
 */
export default function HomeFilmPage() {
  const [privateAccessOpen, setPrivateAccessOpen] = useState(false)
  const openPrivateAccess = useCallback(() => setPrivateAccessOpen(true), [])
  const closePrivateAccess = useCallback(() => setPrivateAccessOpen(false), [])

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
        <div className={styles.intro}>
          <header className={`${styles.bar} ${styles.siteHeader}`}>
            <span className={styles.brand}>
              Orchia
              <span className={styles.brandSuffix}>Studio</span>
            </span>
          </header>

          <section className={styles.hero} aria-labelledby="home-hero-title">
            <div className={styles.heroCopy}>
              <p className={styles.heroKicker}>Other tools automate generation.</p>
              <h1 className={styles.heroTitle} id="home-hero-title">
                Orchia automates how your content
                <span>gets better over time.</span>
              </h1>
            </div>

            <HeroFeedbackLoop />
          </section>
        </div>

        <WorkflowIterationSection />
        <DataSection />

        <section className={styles.filmSection} aria-label="Product film">
          <h2 className={styles.sectionTitle}>Our Vision</h2>

          <div className={styles.stageArea}>
            <SpecialistWorkflowsFilm />
          </div>

          <div className={styles.bar}>
            <button className={styles.dataLink} type="button" onClick={openPrivateAccess}>
              Contact Us for Private Access
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1.5 7H12.5M8 2.5L12.5 7L8 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        <SiteFooter onRequestAccess={openPrivateAccess} />
      </div>

      <PrivateAccessModal open={privateAccessOpen} onClose={closePrivateAccess} />
    </>
  )
}
