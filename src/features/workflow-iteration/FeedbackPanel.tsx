import { useEffect, useRef } from 'react'

import type { DemoMachineState } from './workflowIterationMachine'
import type { BatchId } from './workflowIterationData'
import styles from './workflow-iteration.module.css'

export default function FeedbackPanel({
  state,
  readyRunBatch,
  onDraftChange,
  onSendFeedback,
  onAcceptAndRerun,
}: {
  state: DemoMachineState
  readyRunBatch: BatchId | null
  onDraftChange: (batch: BatchId, value: string) => void
  onSendFeedback: (batch: 1 | 2, text: string) => void
  onAcceptAndRerun: (batch: 2 | 3) => void
}) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const selectedBatch = state.selectedBatch
  const feedbackBatch = selectedBatch === 1 || selectedBatch === 2 ? selectedBatch : null
  const alreadySent = feedbackBatch ? state.feedbackSent[feedbackBatch] : true
  const batchReadyForReview = feedbackBatch ? state.completedBatches.includes(feedbackBatch) : false
  const draft = state.drafts[selectedBatch]
  const canSend = Boolean(
    feedbackBatch &&
    batchReadyForReview &&
    !alreadySent &&
    !state.runProgress &&
    draft.trim(),
  )

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    timeline.scrollTo({
      top: timeline.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [state.events.length, state.analyzingBatch])

  return (
    <aside className={styles.feedbackPanel} aria-label="Feedback history and input">
      <header className={styles.feedbackHeader}>
        <div>
          <span className={styles.feedbackKicker}>Human review</span>
          <h2>Feedback history</h2>
        </div>
        <span className={styles.feedbackCount}>{state.events.length} events</span>
      </header>

      <div className={styles.feedbackTimeline} ref={timelineRef} aria-live="polite">
        {state.events.length === 0 ? (
          <div className={styles.feedbackEmpty}>
            <span className={styles.feedbackEmptyIcon} aria-hidden="true">✦</span>
            <strong>
              {state.phase === 'batch_1_ready_to_run'
                ? 'Run Batch 1 to begin'
                : state.phase === 'running_batch_1'
                  ? 'Batch 1 is running'
                  : 'Waiting for your feedback'}
            </strong>
            <p>
              {state.phase === 'batch_1_ready_to_run'
                ? 'The output video and feedback controls appear after the workflow finishes.'
                : state.phase === 'running_batch_1'
                  ? 'The output video appears when the final node completes.'
                  : 'Nothing is analyzed until you click “Send feedback.”'}
            </p>
          </div>
        ) : null}

        {state.events.map((event) => {
          const nextBatch = (event.batch + 1) as 2 | 3
          const nextBatchRunning = state.runProgress?.batch === nextBatch
          const nextBatchComplete = state.completedBatches.includes(nextBatch)
          const canAccept = event.kind === 'agent_plan' && readyRunBatch === nextBatch && !state.runProgress

          return (
            <article
              className={`${styles.feedbackCard} ${event.author === 'human' ? styles.feedbackCardHuman : styles.feedbackCardAgent}`}
              key={event.id}
            >
              <header>
                <span className={styles.feedbackAvatar} aria-hidden="true">
                  {event.author === 'human' ? 'You' : 'O'}
                </span>
                <div>
                  <strong>{event.author === 'human' ? 'Human feedback' : 'Workflow agent'}</strong>
                  <span>
                    {event.kind === 'prompt'
                      ? 'Batch 1 complete'
                      : `Batch ${event.batch} → Batch ${nextBatch}`}
                  </span>
                </div>
              </header>
              <p>{event.text}</p>
              {event.kind === 'agent_plan' ? (
                <div className={styles.feedbackAgentAction}>
                  <button
                    className={styles.feedbackAcceptButton}
                    type="button"
                    disabled={!canAccept}
                    onClick={() => onAcceptAndRerun(nextBatch)}
                  >
                    {nextBatchRunning ? 'Running…' : nextBatchComplete ? 'Accepted' : 'Accept & rerun'}
                  </button>
                </div>
              ) : null}
            </article>
          )
        })}

        {state.analyzingBatch ? (
          <div className={styles.agentThinking} role="status">
            <span className={styles.agentThinkingDots} aria-hidden="true"><i /><i /><i /></span>
            Preparing the next workflow update
          </div>
        ) : null}
      </div>

      <form
        className={styles.feedbackComposer}
        onSubmit={(event) => {
          event.preventDefault()
          if (feedbackBatch && canSend) onSendFeedback(feedbackBatch, draft.trim())
        }}
      >
        <div className={styles.feedbackComposerLabelRow}>
          <label htmlFor="workflow-feedback">What would you change?</label>
          <span>{selectedBatch === 3 ? 'Latest version' : `Batch ${selectedBatch}`}</span>
        </div>
        <textarea
          id="workflow-feedback"
          value={draft}
          disabled={!feedbackBatch || !batchReadyForReview || alreadySent || Boolean(state.runProgress)}
          onChange={(event) => onDraftChange(selectedBatch, event.target.value)}
          rows={4}
          aria-describedby="workflow-feedback-help"
        />
        <div className={styles.feedbackComposerActions}>
          <p id="workflow-feedback-help">
            {selectedBatch === 3
              ? 'The latest version is complete.'
              : !batchReadyForReview
                ? state.runProgress?.batch === 1
                  ? 'Batch 1 is generating its first result.'
                  : 'Run Batch 1 before leaving feedback.'
              : alreadySent
                ? 'Feedback saved in the history above.'
                : 'The workflow waits for your explicit review.'}
          </p>
          <button type="submit" disabled={!canSend}>
            {alreadySent ? 'Feedback sent' : 'Send feedback'}
          </button>
        </div>
      </form>
    </aside>
  )
}
