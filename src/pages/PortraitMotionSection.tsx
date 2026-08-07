import styles from './home-film-page.module.css'

export default function PortraitMotionSection() {
  return (
    <section className={styles.portraitMotionSection} aria-labelledby="portrait-motion-title">
      <h2 className={styles.sectionTitle} id="portrait-motion-title">
        Motion Graphic
      </h2>

      <div className={styles.portraitMotionCanvas}>
        <div className={styles.portraitMotionMarker}>16:9 canvas</div>

        <div className={styles.portraitMotionStage} aria-hidden="true">
          <span className={`${styles.portraitMotionFrame} ${styles.portraitMotionFrameOne}`} />
          <span className={`${styles.portraitMotionFrame} ${styles.portraitMotionFrameTwo}`} />
          <span className={`${styles.portraitMotionFrame} ${styles.portraitMotionFrameThree}`} />
          <span className={styles.portraitMotionCore} />
          <span className={`${styles.portraitMotionSignal} ${styles.portraitMotionSignalOne}`} />
          <span className={`${styles.portraitMotionSignal} ${styles.portraitMotionSignalTwo}`} />
          <span className={`${styles.portraitMotionSignal} ${styles.portraitMotionSignalThree}`} />
        </div>

        <div className={styles.portraitMotionCopy}>
          <strong>Motion graphic placeholder</strong>
          <span>Animation direction to be developed.</span>
        </div>
      </div>
    </section>
  )
}
