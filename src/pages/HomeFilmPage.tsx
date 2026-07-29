import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SpecialistWorkflowsFilm from '../film/SpecialistWorkflowsFilm'

/**
 * The landing page is the demo film and nothing else — no header, footer, or
 * navigation. The other routes still exist, they are just not linked from here.
 */
export default function HomeFilmPage() {
  useEffect(() => {
    // The film is a fixed, full-viewport stage: suppress the site chrome that
    // index.css applies globally (grain overlay, page scrolling).
    document.body.classList.add('film-mode')
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <>
      <Helmet>
        <title>Orchia — Every specialist. One shared production.</title>
        <meta
          name="description"
          content="Orchia connects writing, art, camera, and audience decisions so every specialist keeps control of their craft while the production stays in sync."
        />
        <meta property="og:title" content="Orchia — Every specialist. One shared production." />
        <meta
          property="og:description"
          content="Orchia connects writing, art, camera, and audience decisions so every specialist keeps control of their craft while the production stays in sync."
        />
      </Helmet>
      <SpecialistWorkflowsFilm />
    </>
  )
}
