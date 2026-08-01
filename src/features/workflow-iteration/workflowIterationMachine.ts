import {
  FEEDBACK_ONE,
  FEEDBACK_TWO,
  type BatchId,
  type WorkflowNodeId,
} from './workflowIterationData'

export type DemoPhase =
  | 'batch_1_ready_to_run'
  | 'running_batch_1'
  | 'review_batch_1'
  | 'feedback_1_sent'
  | 'batch_2_ready_to_run'
  | 'running_batch_2'
  | 'review_batch_2'
  | 'feedback_2_sent'
  | 'batch_3_ready_to_run'
  | 'running_batch_3'
  | 'complete'

export type FeedbackEvent = {
  id: string
  batch: 1 | 2
  author: 'human' | 'agent'
  text: string
}

export type RunProgress = {
  batch: BatchId
  currentNode: WorkflowNodeId | null
  activeEdgeTarget: WorkflowNodeId | null
  completedNodes: readonly WorkflowNodeId[]
  step: number
  total: number
}

export type DemoMachineState = {
  phase: DemoPhase
  selectedBatch: BatchId
  completedBatches: readonly BatchId[]
  drafts: Record<BatchId, string>
  feedbackSent: Record<1 | 2, boolean>
  agentResponseReady: Record<1 | 2, boolean>
  analyzingBatch: 1 | 2 | null
  events: readonly FeedbackEvent[]
  runProgress: RunProgress | null
}

export type DemoAction =
  | { type: 'select_batch'; batch: BatchId }
  | { type: 'edit_draft'; batch: BatchId; value: string }
  | { type: 'send_feedback'; batch: 1 | 2; text: string }
  | { type: 'show_agent_response'; batch: 1 | 2; text: string }
  | { type: 'start_run'; batch: BatchId; total: number }
  | {
      type: 'advance_run'
      batch: BatchId
      currentNode: WorkflowNodeId
      activeEdgeTarget?: null
      completedNodes: readonly WorkflowNodeId[]
      step: number
      total: number
    }
  | {
      type: 'advance_edge'
      batch: BatchId
      target: WorkflowNodeId
      completedNodes: readonly WorkflowNodeId[]
      step: number
      total: number
    }
  | { type: 'complete_run'; batch: BatchId }
  | { type: 'reset' }

export function readyBatchForPhase(phase: DemoPhase): BatchId | null {
  if (phase === 'batch_1_ready_to_run') return 1
  if (phase === 'batch_2_ready_to_run') return 2
  if (phase === 'batch_3_ready_to_run') return 3
  return null
}

export function createInitialDemoState(): DemoMachineState {
  return {
    phase: 'batch_1_ready_to_run',
    selectedBatch: 1,
    completedBatches: [],
    drafts: { 1: FEEDBACK_ONE, 2: FEEDBACK_TWO, 3: '' },
    feedbackSent: { 1: false, 2: false },
    agentResponseReady: { 1: false, 2: false },
    analyzingBatch: null,
    events: [],
    runProgress: null,
  }
}

export function demoReducer(state: DemoMachineState, action: DemoAction): DemoMachineState {
  switch (action.type) {
    case 'select_batch':
      if (!state.completedBatches.includes(action.batch) || state.runProgress) return state
      return { ...state, selectedBatch: action.batch }

    case 'edit_draft':
      return { ...state, drafts: { ...state.drafts, [action.batch]: action.value } }

    case 'send_feedback':
      if (
        state.feedbackSent[action.batch] ||
        !state.completedBatches.includes(action.batch) ||
        state.runProgress
      ) return state
      return {
        ...state,
        phase: action.batch === 1 ? 'feedback_1_sent' : 'feedback_2_sent',
        feedbackSent: { ...state.feedbackSent, [action.batch]: true },
        analyzingBatch: action.batch,
        events: [
          ...state.events,
          { id: `human-${action.batch}`, batch: action.batch, author: 'human', text: action.text },
        ],
      }

    case 'show_agent_response':
      return {
        ...state,
        phase: action.batch === 1 ? 'batch_2_ready_to_run' : 'batch_3_ready_to_run',
        agentResponseReady: { ...state.agentResponseReady, [action.batch]: true },
        analyzingBatch: null,
        events: [
          ...state.events,
          { id: `agent-${action.batch}`, batch: action.batch, author: 'agent', text: action.text },
        ],
      }

    case 'start_run':
      if (readyBatchForPhase(state.phase) !== action.batch || state.runProgress) return state
      return {
        ...state,
        phase: action.batch === 1
          ? 'running_batch_1'
          : action.batch === 2
            ? 'running_batch_2'
            : 'running_batch_3',
        selectedBatch: action.batch,
        runProgress: {
          batch: action.batch,
          currentNode: null,
          activeEdgeTarget: null,
          completedNodes: [],
          step: 0,
          total: action.total,
        },
      }

    case 'advance_run':
      if (state.runProgress?.batch !== action.batch) return state
      return {
        ...state,
        runProgress: {
          batch: action.batch,
          currentNode: action.currentNode,
          activeEdgeTarget: null,
          completedNodes: action.completedNodes,
          step: action.step,
          total: action.total,
        },
      }

    case 'advance_edge':
      if (state.runProgress?.batch !== action.batch) return state
      return {
        ...state,
        runProgress: {
          batch: action.batch,
          currentNode: null,
          activeEdgeTarget: action.target,
          completedNodes: action.completedNodes,
          step: action.step,
          total: action.total,
        },
      }

    case 'complete_run':
      if (state.runProgress?.batch !== action.batch) return state
      return {
        ...state,
        phase: action.batch === 1
          ? 'review_batch_1'
          : action.batch === 2
            ? 'review_batch_2'
            : 'complete',
        selectedBatch: action.batch,
        completedBatches: state.completedBatches.includes(action.batch)
          ? state.completedBatches
          : [...state.completedBatches, action.batch],
        runProgress: null,
      }

    case 'reset':
      return createInitialDemoState()

    default:
      return state
  }
}
