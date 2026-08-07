import { useEffect, useLayoutEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'

import IntegratedDemoFilm from '../features/demo2/IntegratedDemoFilm'
import styles from './demo2-page.module.css'
import StudioSiteHeader from './StudioSiteHeader'

const STAGE_WIDTH = 1920
const STAGE_HEIGHT = 1080

export default function Demo2Page() {
  const mountRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('demo2-mode')
    return () => document.body.classList.remove('demo2-mode')
  }, [])

  useLayoutEffect(() => {
    const mount = mountRef.current
    const stage = stageRef.current
    if (!mount || !stage) return

    const fitStage = () => {
      const scale = Math.min(
        mount.clientWidth / STAGE_WIDTH,
        mount.clientHeight / STAGE_HEIGHT,
      )
      stage.style.setProperty('--demo2-scale', String(scale))
    }

    fitStage()
    const observer = new ResizeObserver(fitStage)
    observer.observe(mount)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Helmet>
        <title>Orchia Demo 2 — A self-evolving production workflow</title>
        <meta
          name="description"
          content="A local Orchia prototype showing end-to-end video generation, a human-feedback workflow revision, performance growth, and a team working beside one shared production."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className={styles.page}>
        <StudioSiteHeader sticky />

        <main className={styles.stageFrame}>
          <div className={styles.stageMount} ref={mountRef}>
            <div className={styles.stageScale} ref={stageRef}>
              <IntegratedDemoFilm />
            </div>
          </div>
        </main>

        <footer className={styles.pageFooter}>
          <span>42-second deterministic HTML motion system</span>
          <span>Production post metrics · Version 1 and Version 2 playback</span>
        </footer>
      </div>
    </>
  )
}
