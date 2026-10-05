import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import StudioSiteHeader from './StudioSiteHeader'
import styles from './video-page-shell.module.css'

export default function VideoPageShell({ title }: { title: string }) {
  useEffect(() => {
    document.body.classList.add('film-mode')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('film-mode')
  }, [title])

  return (
    <div className={styles.page}>
      <Helmet><title>{title} — Orchia Studio</title></Helmet>
      <StudioSiteHeader sticky />
      <main className={styles.content}>
        <h1>{title}</h1>
        <p className={styles.comingSoon}>Coming soon.</p>
      </main>
    </div>
  )
}
