import OutputVideoNode from './OutputVideoNode'
import {
  BATCH_TWO_CHANGES,
  BATCH_THREE_CHANGES,
  TREATMENT_LABELS,
  type NodeStatus,
  type RevisionTreatment,
  type WorkflowEdgeSpec,
  type WorkflowNodeId,
  type WorkflowNodeSpec,
  type WorkflowVersion,
} from './workflowIterationData'
import styles from './workflow-iteration.module.css'

const DEFAULT_NODE_WIDTH = 176
const DEFAULT_NODE_HEIGHT = 82

function nodeWidth(node: WorkflowNodeSpec) {
  return node.width ?? DEFAULT_NODE_WIDTH
}

function nodeHeight(node: WorkflowNodeSpec) {
  return node.height ?? DEFAULT_NODE_HEIGHT
}

function edgePath(source: WorkflowNodeSpec, target: WorkflowNodeSpec) {
  const sourceWidth = nodeWidth(source)
  const sourceHeight = nodeHeight(source)
  const targetWidth = nodeWidth(target)
  const targetHeight = nodeHeight(target)
  const sourceCenterX = source.x + sourceWidth / 2
  const sourceCenterY = source.y + sourceHeight / 2
  const targetCenterX = target.x + targetWidth / 2
  const targetCenterY = target.y + targetHeight / 2

  if (target.x >= source.x + sourceWidth + 20) {
    const startX = source.x + sourceWidth
    const endX = target.x
    const controlX = startX + (endX - startX) / 2
    return `M ${startX} ${sourceCenterY} C ${controlX} ${sourceCenterY}, ${controlX} ${targetCenterY}, ${endX} ${targetCenterY}`
  }

  if (source.x >= target.x + targetWidth + 20) {
    const startX = source.x
    const endX = target.x + targetWidth
    const controlX = endX + (startX - endX) / 2
    return `M ${startX} ${sourceCenterY} C ${controlX} ${sourceCenterY}, ${controlX} ${targetCenterY}, ${endX} ${targetCenterY}`
  }

  const startY = source.y + sourceHeight
  const endY = target.y
  const controlY = startY + (endY - startY) / 2
  return `M ${sourceCenterX} ${startY} C ${sourceCenterX} ${controlY}, ${targetCenterX} ${controlY}, ${targetCenterX} ${endY}`
}

function edgeClassName(
  edge: WorkflowEdgeSpec,
  statusForNode: (id: WorkflowNodeId) => NodeStatus,
  active: boolean,
) {
  const sourceStatus = statusForNode(edge.source)
  const targetStatus = statusForNode(edge.target)
  return [
    styles.workflowEdge,
    sourceStatus === 'done' && targetStatus === 'done' ? styles.workflowEdgeDone : '',
    active ? styles.workflowEdgeActive : '',
    edge.kind === 'pass' ? styles.workflowEdgePass : '',
    edge.kind === 'fail' ? styles.workflowEdgeFail : '',
    edge.kind === 'loop' ? styles.workflowEdgeLoop : '',
  ].filter(Boolean).join(' ')
}

function statusLabel(status: NodeStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function nodeClassName(status: NodeStatus, treatment?: RevisionTreatment, output?: boolean) {
  return [
    styles.workflowNode,
    styles[`workflowNode${statusLabel(status)}`],
    treatment ? styles[`workflowNodeTreatment${statusLabel(treatment as NodeStatus)}`] : '',
    output ? styles.workflowOutputNode : '',
  ].filter(Boolean).join(' ')
}

export default function WorkflowGraph({
  version,
  statusForNode,
  treatments,
  activeEdgeTarget,
  showBatchTwoChanges,
}: {
  version: WorkflowVersion
  statusForNode: (id: WorkflowNodeId) => NodeStatus
  treatments: Partial<Record<WorkflowNodeId, RevisionTreatment>>
  activeEdgeTarget: WorkflowNodeId | null
  showBatchTwoChanges: boolean
}) {
  const nodesById = new Map(version.nodes.map((node) => [node.id, node]))
  const activeEdgeIndex = version.edges.findIndex((edge) => edge.target === (activeEdgeTarget ?? version.nodes.find((node) => statusForNode(node.id) === 'running')?.id))
  const markerId = `workflow-arrow-${version.id}`

  return (
    <div className={styles.workflowGraph} data-batch={version.id}>
      <div
        className={styles.planningGroup}
        style={{
          left: version.planningGroup.x,
          top: version.planningGroup.y,
          width: version.planningGroup.width,
          height: version.planningGroup.height,
        }}
      >
        <span>Planning group</span>
      </div>

      <svg className={styles.workflowEdges} viewBox="0 0 1260 820" aria-hidden="true">
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" className={styles.workflowArrow} />
          </marker>
        </defs>
        {version.edges.map((edge, index) => {
          const source = nodesById.get(edge.source)
          const target = nodesById.get(edge.target)
          if (!source || !target) return null
          return (
            <path
              key={`${edge.source}-${edge.target}-${index}`}
              className={edgeClassName(edge, statusForNode, index === activeEdgeIndex)}
              d={edgePath(source, target)}
              markerEnd={`url(#${markerId})`}
            />
          )
        })}
      </svg>

      {version.id === 2 && treatments.ideation === 'merge' ? (
        <div className={styles.mergeIndicator} aria-label="Ideation and Story Writer will merge">
          Merge into one story stage →
        </div>
      ) : null}

      {version.nodes.map((node) => {
        const status = statusForNode(node.id)
        const treatment = treatments[node.id]
        return (
          <article
            className={nodeClassName(status, treatment, node.output)}
            data-node-id={node.id}
            data-node-status={status}
            key={node.id}
            style={{
              left: node.x,
              top: node.y,
              width: nodeWidth(node),
              height: nodeHeight(node),
            }}
          >
            <header className={styles.workflowNodeHeader}>
              <span className={styles.workflowNodeStatusIcon} aria-hidden="true">
                {status === 'done' ? '✓' : status === 'running' ? <span className={styles.nodeSpinner} /> : '·'}
              </span>
              <span className={styles.workflowNodeStatus}>{statusLabel(status)}</span>
              {treatment ? <span className={styles.workflowNodeBadge}>{TREATMENT_LABELS[treatment]}</span> : null}
            </header>
            <div className={styles.workflowNodeBody}>
              <h3>{node.label}</h3>
              <p>{node.role}</p>
              {node.output ? <OutputVideoNode version={version} status={status} /> : null}
            </div>
          </article>
        )
      })}

      {showBatchTwoChanges ? (
        <aside
          className={`${styles.streamlineLedger} ${styles.batchTwoLedger}`}
          aria-label="What changed in Batch 2"
        >
          <div>
            <strong>What changed in Batch 2</strong>
            <span>The workflow shape stays the same; the shared context inside these stages changed.</span>
          </div>
          <ul>
            {BATCH_TWO_CHANGES.map((change) => <li key={change}>{change}</li>)}
          </ul>
        </aside>
      ) : version.id === 3 ? (
        <aside className={styles.streamlineLedger} aria-label="What changed in Batch 3">
          <div>
            <strong>What changed in Batch 3</strong>
            <span>Fewer handoffs, clearer conditioning, natural timing.</span>
          </div>
          <ul>
            {BATCH_THREE_CHANGES.map((change) => <li key={change}>{change}</li>)}
          </ul>
        </aside>
      ) : null}
    </div>
  )
}
