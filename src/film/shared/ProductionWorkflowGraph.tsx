import type { CSSProperties } from "react";

import {
  productionBuildPhase,
  productionEdgeBuildPhase,
  productionEdgePath,
  PRODUCTION_GRAPH_HEIGHT,
  PRODUCTION_GRAPH_WIDTH,
  productionNodePosition,
  productionRoleColors,
  productionWorkflowEdges,
  productionWorkflowNodes,
} from "./production-workflow-graph";
import styles from "./production-workflow-graph.module.css";

export type ProductionWorkflowGraphInstance = "build" | "review";

export function ProductionWorkflowGraph({
  instance,
  className,
}: {
  instance: ProductionWorkflowGraphInstance;
  className?: string;
}) {
  const markerId = `production-workflow-arrow-${instance}`;

  return (
    <div
      className={`${styles.graph} ${className ?? ""}`}
      data-production-graph
      data-production-graph-instance={instance}
      data-scene4-graph={instance === "review" ? "" : undefined}
    >
      <span
        className={styles.mergeTarget}
        data-production-merge-target
        aria-hidden="true"
      />

      <svg
        className={styles.edges}
        viewBox={`0 0 ${PRODUCTION_GRAPH_WIDTH} ${PRODUCTION_GRAPH_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M 0 0 L 6 3 L 0 6 Z" />
          </marker>
        </defs>

        {productionWorkflowEdges.map((edge, edgeIndex) => {
          const source = productionWorkflowNodes.find(
            (node) => node.id === edge.from,
          );
          const primaryRole = source?.roles[0] ?? "maya";
          const phase = productionEdgeBuildPhase(edge);
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={productionEdgePath(edge, edgeIndex)}
              pathLength="1"
              markerEnd={`url(#${markerId})`}
              style={
                {
                  "--edge-accent": productionRoleColors[primaryRole],
                } as CSSProperties
              }
              data-production-edge
              data-production-edge-from={edge.from}
              data-production-edge-to={edge.to}
              data-production-edge-phase={phase}
            />
          );
        })}
      </svg>

      {productionWorkflowNodes.map((node) => {
        const Icon = node.icon;
        const position = productionNodePosition(node);
        const primaryRole = node.roles[0];
        const phase = productionBuildPhase(node);
        const reviewCompatibility =
          instance === "review"
            ? {
                "data-scene4-node": "",
                "data-scene4-node-id": node.id,
              }
            : {};

        return (
          <article
            key={node.id}
            className={styles.node}
            style={
              {
                left: position.x,
                top: position.y,
                "--node-accent": productionRoleColors[primaryRole],
              } as CSSProperties
            }
            data-production-node
            data-production-node-id={node.id}
            data-production-node-phase={phase}
            data-production-node-primary-role={primaryRole}
            data-production-node-roles={node.roles.join(" ")}
            {...reviewCompatibility}
          >
            <span
              className={styles.nodeScan}
              data-production-node-scan
              data-scene4-node-scan={instance === "review" ? "" : undefined}
              aria-hidden="true"
            />
            <span className={styles.nodeIcon}>
              <Icon aria-hidden="true" />
            </span>
            <span className={styles.nodeCopy}>
              <strong>{node.title}</strong>
              <small>{node.meta}</small>
            </span>
            <span className={styles.roleMarks} aria-hidden="true">
              {node.roles.map((role) => (
                <i
                  key={role}
                  style={{ backgroundColor: productionRoleColors[role] }}
                />
              ))}
            </span>
          </article>
        );
      })}
    </div>
  );
}
