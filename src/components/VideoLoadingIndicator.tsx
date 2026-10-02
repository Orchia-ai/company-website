import styles from './video-loading-indicator.module.css'

export default function VideoLoadingIndicator() {
  return (
    <div className={styles.loading} role="status" aria-label="Loading video">
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  )
}
