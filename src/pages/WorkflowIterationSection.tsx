import { useLayoutEffect, useRef } from 'react'

import WorkflowIterationDemo from '../features/workflow-iteration/WorkflowIterationDemo'
import styles from '../features/workflow-iteration/workflow-iteration.module.css'

const STAGE_WIDTH = 1920
const STAGE_HEIGHT = 1080

export default function WorkflowIterationSection() {
  const stageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const host = stage?.parentElement
    if (!stage || !host) return

    const fitStage = () => {
      const scale = Math.min(
        host.clientWidth / STAGE_WIDTH,
        host.clientHeight / STAGE_HEIGHT,
      )
      stage.style.setProperty('--workflow-scale', String(scale))
    }

    fitStage()
    const observer = new ResizeObserver(fitStage)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.workflowSection} id="workflow-iteration" aria-label="Workflow iteration demo">
      <div className={styles.demoMount}>
        <div className={styles.demoCanvas} ref={stageRef}>
          <WorkflowIterationDemo />
        </div>
      </div>
    </section>
  )
}
