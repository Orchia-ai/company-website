import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SpecialistWorkflowsFilm from '../film/SpecialistWorkflowsFilm'
import styles from './home-film-page.module.css'

/**
 * The landing page is the demo film framed by a brand bar and a single call to
 * action. Neither links anywhere yet — there is no navigation off this page.
 */
export default function HomeFilmPage() {
  useEffect(() => {
    // The shell owns the whole viewport: suppress the site chrome that
    // index.css applies globally (grain overlay, page scrolling).
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

      <div className={styles.shell}>
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
      </div>
    </>
  )
}
