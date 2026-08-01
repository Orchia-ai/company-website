export type BatchId = 1 | 2 | 3

export type WorkflowNodeId =
  | 'context'
  | 'ideation'
  | 'story'
  | 'reference'
  | 'splitter'
  | 'negative'
  | 'sectionGroups'
  | 'videoPrompt'
  | 'validation'
  | 'condition'
  | 'rewrite'
  | 'output'

export type NodeStatus = 'waiting' | 'running' | 'done' | 'skipped'
export type RevisionTreatment = 'update' | 'merge' | 'remove' | 'merged' | 'absorbed'

export type WorkflowNodeSpec = {
  id: WorkflowNodeId
  label: string
  role: string
  x: number
  y: number
  width?: number
  height?: number
  output?: boolean
}

export type WorkflowEdgeSpec = {
  source: WorkflowNodeId
  target: WorkflowNodeId
  kind?: 'default' | 'pass' | 'fail' | 'loop'
}

export type WorkflowVersion = {
  id: BatchId
  label: string
  description: string
  nodes: readonly WorkflowNodeSpec[]
  edges: readonly WorkflowEdgeSpec[]
  runOrder: readonly WorkflowNodeId[]
  media: {
    src: string
    poster: string
    note: string
  }
  planningGroup: { x: number; y: number; width: number; height: number }
}

const LONG_WORKFLOW_NODES: readonly WorkflowNodeSpec[] = [
  { id: 'context', label: 'Context', role: 'Project context', x: 40, y: 56, width: 150 },
  { id: 'ideation', label: 'Ideation', role: 'Ideation writer', x: 232, y: 56, width: 160 },
  { id: 'story', label: 'Story Writer', role: 'Story writer', x: 434, y: 56, width: 190 },
  { id: 'reference', label: 'Reference Images', role: 'Identity anchors', x: 78, y: 230, width: 184 },
  { id: 'splitter', label: 'Section Splitter', role: 'Script segmenter', x: 304, y: 230, width: 184 },
  { id: 'negative', label: 'Negative Prompt', role: 'Shared constraints', x: 530, y: 230, width: 184 },
  { id: 'sectionGroups', label: 'Scene + Image Groups', role: 'Parallel section agents', x: 274, y: 410, width: 214 },
  { id: 'videoPrompt', label: 'Video Prompt Agent', role: 'Generation prompts', x: 532, y: 410, width: 194 },
  { id: 'validation', label: 'Result Validation', role: 'Quality review', x: 750, y: 410, width: 188 },
  { id: 'condition', label: 'Condition', role: 'Pass / revise', x: 778, y: 548, width: 160 },
  { id: 'rewrite', label: 'Rewrite Agent', role: 'Targeted revision', x: 532, y: 548, width: 194 },
  { id: 'output', label: 'Output', role: 'Final result', x: 958, y: 90, width: 280, height: 640, output: true },
]

const LONG_WORKFLOW_EDGES: readonly WorkflowEdgeSpec[] = [
  { source: 'context', target: 'ideation' },
  { source: 'ideation', target: 'story' },
  { source: 'story', target: 'reference' },
  { source: 'story', target: 'splitter' },
  { source: 'story', target: 'negative' },
  { source: 'story', target: 'videoPrompt' },
  { source: 'reference', target: 'sectionGroups' },
  { source: 'splitter', target: 'sectionGroups' },
  { source: 'sectionGroups', target: 'videoPrompt' },
  { source: 'videoPrompt', target: 'validation' },
  { source: 'validation', target: 'condition' },
  { source: 'condition', target: 'output', kind: 'pass' },
  { source: 'negative', target: 'output' },
  { source: 'condition', target: 'rewrite', kind: 'fail' },
  { source: 'rewrite', target: 'validation', kind: 'loop' },
]

const LONG_RUN_ORDER: readonly WorkflowNodeId[] = [
  'context',
  'ideation',
  'story',
  'reference',
  'splitter',
  'negative',
  'sectionGroups',
  'videoPrompt',
  'validation',
  'condition',
  'rewrite',
  'output',
]

const STREAMLINED_NODES: readonly WorkflowNodeSpec[] = [
  { id: 'context', label: 'Context', role: 'Project context', x: 46, y: 70, width: 160 },
  { id: 'story', label: 'Outline + Story Writer', role: 'One story decision', x: 254, y: 70, width: 236 },
  { id: 'reference', label: 'Reference Images', role: 'Identity anchors', x: 92, y: 250, width: 190 },
  { id: 'splitter', label: 'Section Splitter', role: 'Story-driven timing', x: 326, y: 250, width: 190 },
  { id: 'negative', label: 'Negative Prompt', role: 'Shared constraints', x: 560, y: 250, width: 190 },
  { id: 'sectionGroups', label: 'Section Image Groups', role: 'Four frame anchors', x: 304, y: 438, width: 232 },
  { id: 'videoPrompt', label: 'Video Prompt Agent', role: 'Frame-conditioned prompts', x: 588, y: 438, width: 214 },
  { id: 'output', label: 'Output', role: 'Final result', x: 958, y: 90, width: 280, height: 640, output: true },
]

const STREAMLINED_EDGES: readonly WorkflowEdgeSpec[] = [
  { source: 'context', target: 'story' },
  { source: 'story', target: 'reference' },
  { source: 'story', target: 'splitter' },
  { source: 'story', target: 'negative' },
  { source: 'story', target: 'videoPrompt' },
  { source: 'reference', target: 'sectionGroups' },
  { source: 'splitter', target: 'sectionGroups' },
  { source: 'sectionGroups', target: 'videoPrompt' },
  { source: 'videoPrompt', target: 'output' },
  { source: 'negative', target: 'output' },
]

export const WORKFLOW_VERSIONS: Record<BatchId, WorkflowVersion> = {
  1: {
    id: 1,
    label: 'Batch 1',
    description: 'Original full workflow',
    nodes: LONG_WORKFLOW_NODES,
    edges: LONG_WORKFLOW_EDGES,
    runOrder: LONG_RUN_ORDER,
    media: {
      src: 'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/workflow/batch-1-JQykqHAIbhOuw2t7gs0W2Aoe6psV5e.mp4',
      poster: '/workflow-iteration-demo/batch-1-poster.jpg',
      note: 'Complete first result',
    },
    planningGroup: { x: 54, y: 192, width: 684, height: 144 },
  },
  2: {
    id: 2,
    label: 'Batch 2',
    description: 'Continuity-focused revision',
    nodes: LONG_WORKFLOW_NODES,
    edges: LONG_WORKFLOW_EDGES,
    runOrder: LONG_RUN_ORDER,
    media: {
      src: 'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/workflow/batch-2-preview-4XqSpZKJ2JvvivbkD5CsLXQkQhbSRk.mp4',
      poster: '/workflow-iteration-demo/batch-2-preview-poster.jpg',
      note: 'Derived preview · Sections 1–4',
    },
    planningGroup: { x: 54, y: 192, width: 684, height: 144 },
  },
  3: {
    id: 3,
    label: 'Batch 3',
    description: 'Streamlined, story-driven workflow',
    nodes: STREAMLINED_NODES,
    edges: STREAMLINED_EDGES,
    runOrder: ['context', 'story', 'reference', 'splitter', 'negative', 'sectionGroups', 'videoPrompt', 'output'],
    media: {
      src: 'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/workflow/batch-3-h0pi0HxWYItFsJ2t1OXNxFeAViwH72.mp4',
      poster: '/workflow-iteration-demo/batch-3-poster.jpg',
      note: 'Final result · Background music',
    },
    planningGroup: { x: 68, y: 212, width: 708, height: 144 },
  },
}

export const BATCH_ONE_READY_PROMPT = 'Batch 1 is ready. Watch it and tell me what feels off — even a quick reaction is enough.'

export const FEEDBACK_ONE = 'This feels like a bunch of random clips stuck together. The characters keep changing, and it looks kind of childish. Can you make it feel more consistent?'

export const FEEDBACK_TWO = 'This one is way better, but it still feels kind of slow. Can you tighten it up and make the ending hit harder?'

export const AGENT_RESPONSE_ONE = 'Got it. I’ll keep the characters and props consistent, connect the sections more smoothly, and make the overall look less childish for Batch 2.'

export const AGENT_RESPONSE_TWO = 'Got it. I’ll shorten the story, let each part use its natural length, and use clearer frame anchors so the ending lands better.'

export const REVISION_TREATMENTS: Record<BatchId, Partial<Record<WorkflowNodeId, RevisionTreatment>>> = {
  1: {
    ideation: 'update',
    story: 'update',
    reference: 'update',
    splitter: 'update',
    sectionGroups: 'update',
    videoPrompt: 'update',
  },
  2: {
    ideation: 'merge',
    story: 'merge',
    reference: 'update',
    splitter: 'update',
    sectionGroups: 'update',
    videoPrompt: 'update',
    validation: 'remove',
    condition: 'remove',
    rewrite: 'remove',
  },
  3: {
    story: 'merged',
    sectionGroups: 'absorbed',
  },
}

export const TREATMENT_LABELS: Record<RevisionTreatment, string> = {
  update: 'Will update',
  merge: 'Will merge',
  remove: 'Will remove',
  merged: 'Merged',
  absorbed: 'Absorbed',
}

export const BATCH_TWO_CHANGES = [
  'Shared character and prop references',
  'Same visual references used across sections',
  'Transitions connect one section to the next',
  'Style guidance shifted away from a childlike look',
] as const

export const BATCH_THREE_CHANGES = [
  'Ideation and Story Writer merged',
  'Scene detail work moved into section planning',
  'Validation and rewrite loop removed',
  'Timing now follows the story',
  'Frame and video conditioning made explicit',
] as const
