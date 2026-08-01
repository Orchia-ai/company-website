import styles from './home-film-page.module.css'

/**
 * Holds the 9:16 data deck. The slides themselves are authored in a separate
 * project and will be dropped into the mount below; until then the mount
 * stands on its own so the section reads as finished rather than broken.
 */
export default function DataSection() {
  return (
    <section className={styles.dataSection} id="data" aria-labelledby="data-title">
      <article className={styles.slideMount}>
        <span className={styles.label}>Production data</span>

        <div className={styles.slideBody}>
          <h2 className={styles.slideTitle} id="data-title">
            Our Data
          </h2>
          <p className={styles.slideNote}>
            What a production actually produces — measured across every
            specialist working in one shared workspace.
          </p>
        </div>

        <div className={styles.slideRail} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </article>
    </section>
  )
}
