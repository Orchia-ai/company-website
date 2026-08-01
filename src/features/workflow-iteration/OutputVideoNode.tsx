import { useRef, useState } from 'react'

import type { NodeStatus, WorkflowVersion } from './workflowIterationData'
import styles from './workflow-iteration.module.css'

export default function OutputVideoNode({
  version,
  status,
}: {
  version: WorkflowVersion
  status: NodeStatus
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const unmute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setMuted(false)
    void video.play().catch(() => undefined)
  }

  if (status === 'waiting' || status === 'skipped') {
    return (
      <div className={styles.outputEmpty} aria-live="polite">
        <span className={styles.outputEmptyMark} aria-hidden="true">＋</span>
        <strong>No result yet</strong>
        <span>
          {version.id === 1
            ? 'Run Batch 1 to generate the first video'
            : 'The result appears after this batch runs'}
        </span>
      </div>
    )
  }

  if (status === 'running') {
    return (
      <div className={styles.outputPending} aria-live="polite">
        <div className={styles.outputSkeleton} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <strong>Generating video</strong>
        <span>Assembling the final output node</span>
      </div>
    )
  }

  return (
    <div className={styles.outputReady}>
      <div className={styles.outputVideoFrame}>
        <video
          key={version.media.src}
          ref={videoRef}
          src={version.media.src}
          poster={version.media.poster}
          controls
          muted={muted}
          autoPlay
          loop
          playsInline
          preload="metadata"
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          aria-label={`${version.label} result video`}
        />
        {muted ? (
          <button className={styles.outputUnmute} type="button" onClick={unmute}>
            Unmute
          </button>
        ) : null}
      </div>
      <div className={styles.outputReadyMeta}>
        <span className={styles.outputReadyDot} aria-hidden="true" />
        <strong>Video ready</strong>
        <span>{version.media.note}</span>
      </div>
    </div>
  )
}
