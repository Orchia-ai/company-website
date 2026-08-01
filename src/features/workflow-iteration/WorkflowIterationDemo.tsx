import { useCallback, useEffect, useReducer, useRef } from 'react'

import FeedbackPanel from './FeedbackPanel'
import WorkflowGraph from './WorkflowGraph'
import {
  AGENT_RESPONSE_ONE,
  AGENT_RESPONSE_TWO,
  REVISION_TREATMENTS,
  WORKFLOW_VERSIONS,
  type BatchId,
  type NodeStatus,
  type WorkflowNodeId,
} from './workflowIterationData'
import {
  createInitialDemoState,
  demoReducer,
  readyBatchForPhase,
  type DemoMachineState,
} from './workflowIterationMachine'
import styles from './workflow-iteration.module.css'

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

function stageCopy(state: DemoMachineState) {
  if (state.runProgress) return `Building version ${state.runProgress.batch}`
  if (state.phase === 'batch_1_ready_to_run') return 'Ready to generate version 1'
  if (state.selectedBatch === 1) return 'Review version 1'
  if (state.selectedBatch === 2) return 'Version 2 ready'
  return 'Version 3 ready'
}

function versionState(state: DemoMachineState, batch: BatchId) {
  if (state.runProgress?.batch === batch) return `Running ${state.runProgress.step} / ${state.runProgress.total}`
  if (state.completedBatches.includes(batch)) return 'Complete'
  if (readyBatchForPhase(state.phase) === batch) return batch === 1 ? 'Ready to run' : 'Ready to rerun'
  return 'Locked'
}

export default function WorkflowIterationDemo() {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialDemoState)
  const feedbackTimerRef = useRef<number | null>(null)
  const runTokenRef = useRef(0)
  const version = WORKFLOW_VERSIONS[state.selectedBatch]

  const statusForNode = useCallback((id: WorkflowNodeId): NodeStatus => {
    if (state.runProgress?.batch === state.selectedBatch) {
      if (state.runProgress.completedNodes.includes(id)) return 'done'
      if (state.runProgress.currentNode === id) return 'running'
      return 'waiting'
    }
    return state.completedBatches.includes(state.selectedBatch) ? 'done' : 'waiting'
  }, [state.completedBatches, state.runProgress, state.selectedBatch])

  const treatments = state.selectedBatch === 1 && state.agentResponseReady[1]
    ? REVISION_TREATMENTS[1]
    : state.selectedBatch === 2 && state.agentResponseReady[2]
      ? REVISION_TREATMENTS[2]
      : state.selectedBatch === 3
        ? REVISION_TREATMENTS[3]
        : {}

  const completeRun = useCallback((batch: BatchId) => {
    dispatch({ type: 'complete_run', batch })
  }, [])

  const runBatch = useCallback(async (batch: BatchId) => {
    const workflow = WORKFLOW_VERSIONS[batch]
    const order = workflow.runOrder
    const token = ++runTokenRef.current
    const nodeDuration = batch === 3 ? 850 : 520
    const edgeDuration = batch === 3 ? 200 : 180
    const completed: WorkflowNodeId[] = []

    dispatch({ type: 'start_run', batch, total: order.length })
    await wait(240)

    for (let index = 0; index < order.length; index += 1) {
      if (token !== runTokenRef.current) return
      const nodeId = order[index]

      if (index > 0) {
        dispatch({
          type: 'advance_edge',
          batch,
          target: nodeId,
          completedNodes: [...completed],
          step: index,
          total: order.length,
        })
        await wait(edgeDuration)
        if (token !== runTokenRef.current) return
      }

      dispatch({
        type: 'advance_run',
        batch,
        currentNode: nodeId,
        completedNodes: [...completed],
        step: index + 1,
        total: order.length,
      })
      await wait(nodeDuration)
      completed.push(nodeId)
    }

    if (token === runTokenRef.current) completeRun(batch)
  }, [completeRun])

  const startReadyRun = (requestedBatch?: BatchId) => {
    const readyBatch = readyBatchForPhase(state.phase)
    if (!readyBatch || (requestedBatch && requestedBatch !== readyBatch)) return
    void runBatch(readyBatch)
  }

  const sendFeedback = (batch: 1 | 2, text: string) => {
    dispatch({ type: 'send_feedback', batch, text })
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = window.setTimeout(() => {
      dispatch({
        type: 'show_agent_response',
        batch,
        text: batch === 1 ? AGENT_RESPONSE_ONE : AGENT_RESPONSE_TWO,
      })
      feedbackTimerRef.current = null
    }, 900)
  }

  const resetDemo = () => {
    runTokenRef.current += 1
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = null
    dispatch({ type: 'reset' })
  }

  const skipAnimation = () => {
    const batch = state.runProgress?.batch
    if (!batch) return
    runTokenRef.current += 1
    completeRun(batch)
  }

  useEffect(() => () => {
    runTokenRef.current += 1
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current)
  }, [])

  const readyRunBatch = readyBatchForPhase(state.phase)
  const latestVersion = state.phase === 'complete'
  const runActionLabel = latestVersion
    ? 'Latest version'
    : state.runProgress
      ? state.runProgress.batch === 1 ? 'Running…' : 'Rerunning…'
      : readyRunBatch === 1 ? 'Run' : 'Rerun'

  return (
    <div className={styles.demoStage} data-demo-state={state.phase}>
      <header className={styles.demoTopbar}>
        <div className={styles.demoHeading}>
          <span className={styles.demoHeadingSignal} aria-hidden="true" />
          <div>
            <h2>From feedback to a better video</h2>
            <p>{stageCopy(state)}</p>
          </div>
        </div>

        <nav className={styles.versionSelector} aria-label="Workflow versions">
          {([1, 2, 3] as const).map((batch) => {
            const active = state.selectedBatch === batch
            const available = state.completedBatches.includes(batch)
            return (
              <button
                className={active ? styles.versionButtonActive : undefined}
                key={batch}
                type="button"
                disabled={Boolean(state.runProgress) || !available}
                aria-current={active ? 'step' : undefined}
                onClick={() => dispatch({ type: 'select_batch', batch })}
              >
                <span>Batch {batch}</span>
                <small>{versionState(state, batch)}</small>
              </button>
            )
          })}
        </nav>

        <div className={styles.demoActions}>
          {state.runProgress ? (
            <button className={styles.skipButton} type="button" onClick={skipAnimation}>
              Skip animation
            </button>
          ) : null}
          <button
            className={styles.rerunButton}
            type="button"
            disabled={!readyRunBatch}
            onClick={() => startReadyRun()}
          >
            {runActionLabel}
          </button>
          <button className={styles.resetButton} type="button" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </header>

      <div className={styles.demoMain}>
        <section className={styles.workflowCanvas} aria-label={`${version.label} workflow`}>
          <header className={styles.workflowCanvasHeader}>
            <div>
              <span>Workflow canvas</span>
              <strong>{version.label}</strong>
            </div>
            <p>{version.description}</p>
            <span className={styles.workflowCanvasState}>{versionState(state, version.id)}</span>
          </header>
          <div className={styles.workflowGraphViewport} key={version.id}>
            <WorkflowGraph
              version={version}
              statusForNode={statusForNode}
              treatments={treatments}
              activeEdgeTarget={state.runProgress?.batch === version.id ? state.runProgress.activeEdgeTarget : null}
            />
          </div>
        </section>

        <FeedbackPanel
          state={state}
          readyRunBatch={readyRunBatch}
          onDraftChange={(batch, value) => dispatch({ type: 'edit_draft', batch, value })}
          onSendFeedback={sendFeedback}
          onAcceptAndRerun={(batch) => startReadyRun(batch)}
        />
      </div>
    </div>
  )
}
