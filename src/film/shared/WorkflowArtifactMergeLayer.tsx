import type { CSSProperties } from "react";

import {
  productionRoleColors,
  type ProductionRole,
} from "./production-workflow-graph";
import styles from "./workflow-artifact-merge-layer.module.css";

const artifactNames: Record<ProductionRole, readonly string[]> = {
  maya: ["Research", "References", "Story plan", "Drafts"],
  nora: ["Moodboard", "Assets", "Direction", "Concepts"],
  eli: ["Shot references", "Camera plan", "Previs", "Shoot files"],
  owen: ["Platform exports", "Data cleanup", "Insights", "Report"],
};

const roleOrder: readonly ProductionRole[] = ["maya", "nora", "eli", "owen"];

/**
 * Sixteen lightweight visual clones for the Scene 2→3 merge. The master
 * timeline can place each clone over its matching personal artifact, move all
 * clones into `[data-production-merge-target]`, and hide this layer before the
 * first shared graph phase appears.
 */
export function WorkflowArtifactMergeLayer() {
  return (
    <div
      className={styles.layer}
      data-workflow-artifact-merge-layer
      aria-hidden="true"
    >
      {roleOrder.flatMap((role) =>
        artifactNames[role].map((name, index) => (
          <article
            key={`${role}-${index}`}
            className={styles.artifact}
            style={
              {
                "--artifact-accent": productionRoleColors[role],
              } as CSSProperties
            }
            data-workflow-merge-artifact={`${role}-${index}`}
            data-workflow-merge-role={role}
            data-workflow-merge-index={index}
          >
            <i />
            <span>{name}</span>
          </article>
        )),
      )}
    </div>
  );
}

