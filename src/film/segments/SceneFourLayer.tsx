import gsap from "gsap";
import {
  Aperture,
  BarChart3,
  Bot,
  Check,
  FileImage,
  FilePenLine,
  FileSpreadsheet,
  FileText,
  Film,
  GitBranch,
  Image as ImageIcon,
  Layers3,
  LineChart,
  MousePointer2,
  Palette,
  ScanLine,
  Send,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import Image from "../FillImage";
import type { CSSProperties, ComponentType, SVGProps } from "react";

import {
  productionBuildPhase,
  productionEdgeBuildPhase,
  productionEdgePath,
  productionNodePosition,
  productionWorkflowEdges,
  productionWorkflowNodes as sharedWorkflowNodes,
} from "../shared/production-workflow-graph";
import styles from "./scene-four-layer.module.css";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type SceneFourRole = "maya" | "nora" | "eli" | "owen";

type WorkflowNode = {
  id: string;
  title: string;
  meta: string;
  x: number;
  y: number;
  icon: IconComponent;
  roles: readonly SceneFourRole[];
};

type WorkflowEdge = {
  from: string;
  to: string;
};

type ReviewCycle = {
  role: SceneFourRole;
  request: string;
  response: string;
  proposal: string;
  affected: readonly string[];
  transformOrigin: string;
  cursor: {
    startX: number;
    startY: number;
    composerX: number;
    composerY: number;
    approveX: number;
    approveY: number;
  };
};

type Person = {
  role: SceneFourRole;
  name: string;
  discipline: string;
  avatar: string;
  side: "left" | "right";
};

export type SceneFourQuery = ReturnType<typeof gsap.utils.selector>;

export type SceneFourTimelineOptions = {
  /**
   * Scene 3 can build this same workspace and hand it directly to Scene 4.
   * When true, the review sequence leaves the visible workspace and graph
   * untouched instead of replaying Scene 4's standalone entrance.
   */
  workspaceAlreadyVisible?: boolean;
};

export const SCENE_FOUR_DURATION_SECONDS = 13.5;

const roleColors: Record<SceneFourRole, string> = {
  maya: "#FF5A36",
  nora: "#CFFF3D",
  eli: "#2864FF",
  owen: "#FF4FA3",
};

const nodeBaseBorder = "#161613";
const nodeBaseBackground = "#FFFDF0";
const nodeFocusBackground = "#FFD83D";
const nodeAppliedBackground = "#CFFF3D";
const personBaseBorder = "#161613";
const personBaseBackground = "#161613";
const personFocusBackground = "#2B2B26";

const people: readonly Person[] = [
  {
    role: "maya",
    name: "Maya",
    discipline: "Writer",
    avatar: "/demo/living-production-v5/avatars/writer.png",
    side: "left",
  },
  {
    role: "nora",
    name: "Nora",
    discipline: "Art",
    avatar: "/demo/living-production-v5/avatars/art.png",
    side: "right",
  },
  {
    role: "eli",
    name: "Eli",
    discipline: "Camera",
    avatar: "/demo/living-production-v5/avatars/camera.png",
    side: "left",
  },
  {
    role: "owen",
    name: "Owen",
    discipline: "Data analysis",
    avatar: "/demo/living-production-v5/avatars/data-analysis.png",
    side: "right",
  },
] as const;

const workflowNodes: readonly WorkflowNode[] = [
  {
    id: "creative-brief",
    title: "Creative brief",
    meta: "Production context",
    x: 60,
    y: 18,
    icon: FileText,
    roles: ["maya"],
  },
  {
    id: "art-uploads",
    title: "Art uploads",
    meta: "Sketches and references",
    x: 330,
    y: 18,
    icon: Upload,
    roles: ["nora"],
  },
  {
    id: "scene-references",
    title: "Scene references",
    meta: "Stills and movement",
    x: 600,
    y: 18,
    icon: ImageIcon,
    roles: ["eli", "nora"],
  },
  {
    id: "platform-data",
    title: "Platform data",
    meta: "Audience exports",
    x: 860,
    y: 18,
    icon: FileSpreadsheet,
    roles: ["owen"],
  },
  {
    id: "story-research",
    title: "Story research",
    meta: "Sources and interviews",
    x: 110,
    y: 96,
    icon: ScanLine,
    roles: ["maya", "owen"],
  },
  {
    id: "visual-research",
    title: "Visual research",
    meta: "Style language",
    x: 380,
    y: 96,
    icon: ImageIcon,
    roles: ["nora", "maya"],
  },
  {
    id: "camera-research",
    title: "Camera research",
    meta: "Movement references",
    x: 650,
    y: 96,
    icon: Aperture,
    roles: ["eli", "nora"],
  },
  {
    id: "metrics",
    title: "Metrics",
    meta: "Normalized performance",
    x: 850,
    y: 96,
    icon: BarChart3,
    roles: ["owen"],
  },
  {
    id: "social-signals",
    title: "Social signals",
    meta: "Retention and response",
    x: 40,
    y: 174,
    icon: LineChart,
    roles: ["owen", "maya"],
  },
  {
    id: "audience-signals",
    title: "Audience signals",
    meta: "Hook evidence",
    x: 300,
    y: 174,
    icon: BarChart3,
    roles: ["owen", "maya"],
  },
  {
    id: "art-direction",
    title: "Art direction",
    meta: "Character and world",
    x: 570,
    y: 174,
    icon: Palette,
    roles: ["nora", "maya"],
  },
  {
    id: "shot-list",
    title: "Shot list",
    meta: "Required coverage",
    x: 840,
    y: 174,
    icon: FileText,
    roles: ["eli", "maya"],
  },
  {
    id: "story-structure",
    title: "Story structure",
    meta: "Narrative arc",
    x: 120,
    y: 252,
    icon: GitBranch,
    roles: ["maya", "owen"],
  },
  {
    id: "trend-charts",
    title: "Trend charts",
    meta: "Cross-platform patterns",
    x: 380,
    y: 252,
    icon: LineChart,
    roles: ["owen", "nora"],
  },
  {
    id: "reference-images",
    title: "Reference images",
    meta: "Identity anchors",
    x: 650,
    y: 252,
    icon: FileImage,
    roles: ["nora", "eli"],
  },
  {
    id: "camera-previs",
    title: "3D camera previs",
    meta: "Reveal path",
    x: 850,
    y: 252,
    icon: Layers3,
    roles: ["eli", "nora"],
  },
  {
    id: "script-draft",
    title: "Script draft",
    meta: "Scene-ready copy",
    x: 30,
    y: 330,
    icon: FilePenLine,
    roles: ["maya"],
  },
  {
    id: "creative-scoring",
    title: "Creative scoring",
    meta: "Element evidence",
    x: 280,
    y: 330,
    icon: BarChart3,
    roles: ["owen", "maya", "nora"],
  },
  {
    id: "scene-image-groups",
    title: "Scene image groups",
    meta: "Production frames",
    x: 560,
    y: 330,
    icon: ImageIcon,
    roles: ["nora", "eli"],
  },
  {
    id: "movement-coverage",
    title: "Movement + coverage",
    meta: "Lens and blocking",
    x: 820,
    y: 330,
    icon: Aperture,
    roles: ["eli", "maya"],
  },
  {
    id: "section-beats",
    title: "Section beats",
    meta: "Timed structure",
    x: 170,
    y: 408,
    icon: GitBranch,
    roles: ["maya", "eli"],
  },
  {
    id: "outcome-forecast",
    title: "Outcome forecast",
    meta: "Expected response",
    x: 470,
    y: 408,
    icon: BarChart3,
    roles: ["owen", "maya"],
  },
  {
    id: "script-revision",
    title: "Script revision",
    meta: "Approved changes",
    x: 760,
    y: 408,
    icon: FilePenLine,
    roles: ["maya", "nora", "owen"],
  },
  {
    id: "video-prompt",
    title: "Video prompt",
    meta: "Connected direction",
    x: 280,
    y: 486,
    icon: Video,
    roles: ["maya", "nora", "eli"],
  },
  {
    id: "production-plan",
    title: "Production plan",
    meta: "Selective execution",
    x: 690,
    y: 486,
    icon: GitBranch,
    roles: ["maya", "nora", "eli", "owen"],
  },
  {
    id: "video-generation",
    title: "Video generation",
    meta: "Agent execution",
    x: 470,
    y: 566,
    icon: Sparkles,
    roles: ["maya", "nora", "eli", "owen"],
  },
  {
    id: "video-output",
    title: "Video output",
    meta: "Review-ready result",
    x: 470,
    y: 646,
    icon: Film,
    roles: ["maya", "nora", "eli", "owen"],
  },
] as const;

const workflowEdges: readonly WorkflowEdge[] = productionWorkflowEdges;

const reviewCycles: readonly ReviewCycle[] = [
  {
    role: "maya",
    request: "Give the opening a stronger hook.",
    response: "Five story decisions shape the opening.",
    proposal: "Tighten the hook from audience signal through final prompt.",
    affected: [
      "audience-signals",
      "story-structure",
      "script-revision",
      "section-beats",
      "video-prompt",
    ],
    transformOrigin: "35% 47%",
    cursor: {
      startX: 92,
      startY: 64,
      composerX: 370,
      composerY: 640,
      approveX: 350,
      approveY: 570,
    },
  },
  {
    role: "nora",
    request: "Keep the character silhouette consistent across every scene.",
    response: "Five visual decisions carry the silhouette.",
    proposal: "Lock the silhouette from visual research through video prompt.",
    affected: [
      "visual-research",
      "art-direction",
      "reference-images",
      "scene-image-groups",
      "video-prompt",
    ],
    transformOrigin: "54% 46%",
    cursor: {
      startX: 92,
      startY: 64,
      composerX: 305,
      composerY: 194,
      approveX: 321,
      approveY: 159,
    },
  },
  {
    role: "eli",
    request: "Make the reveal feel deliberate, not handheld.",
    response: "Five shot decisions control the reveal.",
    proposal: "Replace handheld motion with one deliberate camera path.",
    affected: [
      "shot-list",
      "camera-previs",
      "movement-coverage",
      "section-beats",
      "video-prompt",
    ],
    transformOrigin: "68% 48%",
    cursor: {
      startX: 308,
      startY: 64,
      composerX: 112,
      composerY: 194,
      approveX: 128,
      approveY: 159,
    },
  },
  {
    role: "owen",
    request: "Which opening is most likely to hold attention?",
    response: "Six evidence nodes can compare the openings.",
    proposal: "Score both openings and feed the result into story structure.",
    affected: [
      "metrics",
      "social-signals",
      "trend-charts",
      "audience-signals",
      "story-structure",
      "outcome-forecast",
    ],
    transformOrigin: "49% 38%",
    cursor: {
      startX: 308,
      startY: 64,
      composerX: 112,
      composerY: 194,
      approveX: 128,
      approveY: 159,
    },
  },
] as const;

const sceneThreeConversation: Record<
  SceneFourRole,
  { request: string; response: string }
> = {
  maya: {
    request: "Organize my writing workflow with the rest of the team.",
    response:
      "Got it. I’ll arrange the existing work and connect the handoffs.",
  },
  nora: {
    request:
      "Can we keep character identity consistent across every generated scene?",
    response:
      "Yes. I’ll add visual continuity steps and connect them across production.",
  },
  eli: {
    request: "Why does the final reveal still feel too handheld?",
    response:
      "The issue points to camera research, shot planning, and movement direction.",
  },
  owen: {
    request: "Which opening direction has the strongest audience evidence?",
    response:
      "The audience data favors the faster hook and earlier character reveal.",
  },
};

const nodeById = new Map(workflowNodes.map((node) => [node.id, node]));

function edgePath(edge: WorkflowEdge) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  if (!source || !target) {
    return "";
  }

  return productionEdgePath(edge, workflowEdges.indexOf(edge));
}

function roleStyle(role: SceneFourRole) {
  return {
    "--role": roleColors[role],
  } as CSSProperties;
}

function NodeMediaPreview({ nodeId }: { nodeId: string }) {
  if (nodeId === "reference-images") {
    return (
      <span
        className={styles.nodeMediaPreview}
        data-scene4-media-preview
        aria-hidden="true"
      >
        <Image
          src="/demo/feature-4/reference/character-lineup.jpg"
          alt=""
          fill
          sizes="29px"
        />
      </span>
    );
  }

  if (nodeId === "scene-image-groups") {
    return (
      <span
        className={`${styles.nodeMediaPreview} ${styles.nodeMediaGrid}`}
        data-scene4-media-preview
        aria-hidden="true"
      >
        {["shot-1.jpg", "shot-4.jpg", "shot-6.jpg", "shot-8.jpg"].map(
          (filename) => (
            <span className={styles.nodeMediaFrame} key={filename}>
              <Image
                src={`/demo/feature-4/shots/${filename}`}
                alt=""
                fill
                sizes="15px"
              />
            </span>
          ),
        )}
      </span>
    );
  }

  if (nodeId === "video-output") {
    return (
      <span
        className={styles.nodeMediaPreview}
        data-scene4-media-preview
        aria-hidden="true"
      >
        <video
          src="/demo/feature-4/after.mp4"
          poster="/demo/feature-4/after-poster.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
        />
      </span>
    );
  }

  return null;
}

function SpecialistConversationOverlay({
  person,
  cycle,
}: {
  person: Person;
  cycle: ReviewCycle;
}) {
  return (
    <article
      className={`${styles.messageStation} ${styles[person.role]} ${
        person.side === "right" ? styles.stationRight : styles.stationLeft
      }`}
      style={roleStyle(person.role)}
    >
      <div
        className={styles.chat}
        data-scene4-chat={person.role}
        aria-label={`${person.name} working through the production agent`}
      >
        <div className={styles.composer} data-scene4-composer={person.role}>
          <span
            className={styles.composerInput}
            data-scene3-composer-input={person.role}
          >
            <span data-scene3-composer-placeholder={person.role}>
              Ask about this production…
            </span>
            <span
              className={styles.composerDraft}
              data-scene3-composer-draft={person.role}
              aria-hidden="true"
            />
            <i
              className={styles.composerCaret}
              data-scene3-composer-caret={person.role}
              aria-hidden="true"
            />
          </span>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Send"
            data-scene3-composer-send={person.role}
          >
            <Send aria-hidden="true" />
          </button>
        </div>
        <p
          className={styles.humanMessage}
          data-scene3-human-message={person.role}
          data-message-copy={sceneThreeConversation[person.role].request}
        >
          <span>{person.name}</span>
          <strong>{sceneThreeConversation[person.role].request}</strong>
        </p>
        <p
          className={styles.agentMessage}
          data-scene3-agent-reply={person.role}
        >
          <span>
            <Bot aria-hidden="true" />
            Orchia agent
          </span>
          <strong>{sceneThreeConversation[person.role].response}</strong>
        </p>

        <p
          className={styles.humanMessage}
          data-scene4-human-message={person.role}
        >
          <span>{person.name}</span>
          <strong>{cycle.request}</strong>
        </p>
        <p
          className={styles.agentMessage}
          data-scene4-agent-reply={person.role}
        >
          <span>
            <Bot aria-hidden="true" />
            Orchia agent
          </span>
          <strong>{cycle.response}</strong>
        </p>
        <div className={styles.proposal} data-scene4-proposal={person.role}>
          <span>Proposed change</span>
          <strong>{cycle.proposal}</strong>
          <button
            type="button"
            tabIndex={-1}
            data-scene4-approve={person.role}
          >
            <Check aria-hidden="true" />
            Approve
          </button>
        </div>
        <p className={styles.applied} data-scene4-applied={person.role}>
          <Sparkles aria-hidden="true" />
          Agent applied the approved change
        </p>
      </div>

      <span
        className={styles.cursor}
        data-scene4-cursor={person.role}
        aria-hidden="true"
      >
        <MousePointer2 />
        <small>{person.name}</small>
      </span>
    </article>
  );
}

export function SceneFourLayer() {
  return (
    <>
      <section
        className={styles.layer}
        data-scene4-layer
        aria-label="Four specialists reviewing one connected production"
      >
        <div className={styles.workspace} data-scene4-workspace>
          <header
            className={styles.workspaceHeader}
            data-scene4-workspace-header
          >
            <span className={styles.workspaceIcon}>
              <GitBranch aria-hidden="true" />
            </span>
            <span>
              <strong>Production workspace</strong>
              <small>One connected source of production truth</small>
            </span>
            <span className={styles.workspaceState}>
              <i aria-hidden="true" />
              Live
            </span>
          </header>

          <div className={styles.graphViewport}>
            <div className={styles.graph} data-scene4-graph>
              <svg
                className={styles.graphEdges}
                viewBox="0 0 1060 720"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="scene-four-arrow"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M 0 0 L 6 3 L 0 6 Z" />
                  </marker>
                </defs>
                {workflowEdges.map((edge) => (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={edgePath(edge)}
                    pathLength="1"
                    markerEnd="url(#scene-four-arrow)"
                    data-scene4-edge
                    data-scene4-edge-from={edge.from}
                    data-scene4-edge-to={edge.to}
                    data-scene4-edge-phase={productionEdgeBuildPhase(edge)}
                  />
                ))}
              </svg>

              {workflowNodes.map((node) => {
                const Icon = node.icon;
                const sharedNode = sharedWorkflowNodes.find(
                  (candidate) => candidate.id === node.id,
                );
                const position = sharedNode
                  ? productionNodePosition(sharedNode)
                  : { x: node.x, y: node.y };
                return (
                  <article
                    key={node.id}
                    className={styles.workflowNode}
                    style={
                      {
                        left: position.x,
                        top: position.y,
                        "--node-accent": roleColors[node.roles[0]],
                      } as CSSProperties
                    }
                    data-scene4-node
                    data-scene4-node-id={node.id}
                    data-scene4-build-phase={
                      sharedNode ? productionBuildPhase(sharedNode) : 0
                    }
                  >
                    <span
                      className={styles.nodeScan}
                      data-scene4-node-scan
                      aria-hidden="true"
                    />
                    <span className={styles.nodeIcon}>
                      <Icon aria-hidden="true" />
                      <NodeMediaPreview nodeId={node.id} />
                    </span>
                    <span className={styles.nodeCopy}>
                      <strong>{node.title}</strong>
                      <small>{node.meta}</small>
                    </span>
                    <span className={styles.roleMarks} aria-hidden="true">
                      {node.roles.map((role) => (
                        <i key={role} style={{ background: roleColors[role] }} />
                      ))}
                    </span>
                  </article>
                );
              })}

            </div>
          </div>
        </div>

        {people.map((person) => {
          const cycle = reviewCycles.find((item) => item.role === person.role);
          if (!cycle) {
            return null;
          }
          return (
            <article
              key={person.role}
              className={`${styles.station} ${styles[person.role]} ${
                person.side === "right" ? styles.stationRight : styles.stationLeft
              }`}
              style={roleStyle(person.role)}
              data-scene4-station={person.role}
            >
              <div className={styles.personCard} data-scene4-person={person.role}>
                <span className={styles.avatar}>
                  <Image
                    src={person.avatar}
                    alt=""
                    fill
                    sizes="66px"
                    priority
                    unoptimized
                  />
                </span>
                <span className={styles.personCopy}>
                  <strong>{person.name}</strong>
                  <small>{person.discipline}</small>
                </span>
                <span className={styles.presence} aria-hidden="true" />
              </div>
            </article>
          );
        })}

        <div className={styles.scanStatus} data-scene4-scan-status>
          <ScanLine aria-hidden="true" />
          <span>
            <small>Production agent</small>
            <strong>Reviewing the connected workflow</strong>
          </span>
        </div>

        <aside
          className={styles.nodeInspector}
          data-scene4-node-inspector
          aria-label="Movement and coverage node details"
        >
          <header>
            <span className={styles.nodeInspectorIcon}>
              <Aperture aria-hidden="true" />
            </span>
            <span className={styles.nodeInspectorHeading}>
              <small>Camera agent</small>
              <strong>Movement and coverage</strong>
            </span>
          </header>
          <div className={styles.nodeInspectorBody}>
            <span className={styles.nodeInspectorPrimary}>
              <small>Reveal path</small>
              <strong data-scene4-inspector-before>
                Handheld fragments across three shots
              </strong>
              <strong data-scene4-inspector-after>
                One deliberate reveal path
              </strong>
            </span>
            <span className={styles.nodeInspectorDetail}>
              <small>Camera motion</small>
              <strong>Locked dolly with a slow rise</strong>
            </span>
            <span className={styles.nodeInspectorDetail}>
              <small>Continuity</small>
              <strong>Preserve screen direction</strong>
            </span>
          </div>
          <footer data-scene4-inspector-status>
            <Sparkles aria-hidden="true" />
            Camera direction updated
          </footer>
        </aside>
      </section>

      <div
        className={styles.foregroundOverlay}
        data-scene4-foreground-overlay
      >
        {people.map((person) => {
          const cycle = reviewCycles.find((item) => item.role === person.role);
          return cycle ? (
            <SpecialistConversationOverlay
              key={person.role}
              person={person}
              cycle={cycle}
            />
          ) : null;
        })}
      </div>
    </>
  );
}

/**
 * Adds Scene 4 to the master film timeline.
 *
 * The caller supplies its stage-scoped GSAP selector. This helper owns only
 * `[data-scene4-*]` elements and returns the absolute end time so the master can
 * append the next scene without duplicating duration arithmetic.
 */
export function appendSceneFourTimeline(
  timeline: gsap.core.Timeline,
  query: SceneFourQuery,
  startTime: number,
  options: SceneFourTimelineOptions = {},
) {
  const select = (selector: string) =>
    Array.from(query(selector)) as HTMLElement[];
  const layer = select("[data-scene4-layer]");
  const workspace = select("[data-scene4-workspace]");
  const graph = select("[data-scene4-graph]");
  const allStations = select("[data-scene4-station]");
  const allChats = select("[data-scene4-chat]");
  const allPeople = select("[data-scene4-person]");
  const allNodes = select("[data-scene4-node]");
  const allCursors = select("[data-scene4-cursor]");
  const allFocusLabels = select("[data-scene4-focus]");
  const scanLines = select("[data-scene4-node-scan]");
  const scanStatus = select("[data-scene4-scan-status]");
  const transientReviewUi = [
    ...select("[data-scene4-human-message]"),
    ...select("[data-scene4-agent-reply]"),
    ...select("[data-scene4-proposal]"),
    ...select("[data-scene4-applied]"),
  ];
  const workspaceAlreadyVisible = options.workspaceAlreadyVisible ?? false;
  const initializeAt = workspaceAlreadyVisible ? startTime : 0;

  timeline
    .set(
      [
        ...transientReviewUi,
        ...select("[data-scene4-cursor]"),
        ...select("[data-scene4-focus]"),
        ...scanStatus,
      ],
      { autoAlpha: 0 },
      initializeAt,
    )
    .set(scanLines, { autoAlpha: 0, yPercent: -130 }, initializeAt)
    .set(allStations, { autoAlpha: 1, opacity: 0.34 }, initializeAt)
    .set(allChats, { autoAlpha: 0 }, startTime);

  if (workspaceAlreadyVisible) {
    timeline.set([layer, workspace], { autoAlpha: 1 }, startTime);
  } else {
    timeline
      .set(layer, { autoAlpha: 0 }, 0)
      .set(allNodes, {
        opacity: 1,
        scale: 1,
        borderColor: nodeBaseBorder,
        backgroundColor: nodeBaseBackground,
      }, 0)
      .set(graph, { scale: 1, x: 0, y: 0 }, 0)
      .to(
        layer,
        {
          autoAlpha: 1,
          duration: 0.46,
          ease: "power2.inOut",
        },
        startTime,
      )
      .fromTo(
        workspace,
        { autoAlpha: 0, scale: 0.975 },
        { autoAlpha: 1, scale: 1, duration: 0.62, ease: "power2.out" },
        startTime + 0.18,
      );
  }

  const mayaCycleStart = startTime + 0.9;
  const mayaCycleDuration = 8.7;
  const quickCycleSpacing = 0.9;
  const quickCycleStart = mayaCycleStart + mayaCycleDuration;

  reviewCycles.forEach((cycle, cycleIndex) => {
    const at =
      cycle.role === "maya"
        ? mayaCycleStart
        : quickCycleStart + (cycleIndex - 1) * quickCycleSpacing;
    const station = select(`[data-scene4-station="${cycle.role}"]`);
    const otherStations = allStations.filter(
      (element) => element.dataset.scene4Station !== cycle.role,
    );
    const chat = select(`[data-scene4-chat="${cycle.role}"]`);
    const otherChats = allChats.filter(
      (element) => element.dataset.scene4Chat !== cycle.role,
    );
    const person = select(`[data-scene4-person="${cycle.role}"]`);
    const cursor = select(`[data-scene4-cursor="${cycle.role}"]`);
    const humanMessage = select(
      `[data-scene4-human-message="${cycle.role}"]`,
    );
    const agentReply = select(`[data-scene4-agent-reply="${cycle.role}"]`);
    const proposal = select(`[data-scene4-proposal="${cycle.role}"]`);
    const approve = select(`[data-scene4-approve="${cycle.role}"]`);
    const applied = select(`[data-scene4-applied="${cycle.role}"]`);
    const focus = select(`[data-scene4-focus="${cycle.role}"]`);
    const affected = cycle.affected.flatMap((nodeId) =>
      select(`[data-scene4-node-id="${nodeId}"]`),
    );
    const affectedSet = new Set(affected);
    const unaffected = allNodes.filter((node) => !affectedSet.has(node));

    timeline
      .set(otherChats, { autoAlpha: 0 }, at)
      .fromTo(
        chat,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" },
        at,
      );

    if (cycle.role !== "maya") {
      timeline
        .set(transientReviewUi, { autoAlpha: 0 }, at)
        .set(scanStatus, { autoAlpha: 0 }, at)
        .set(scanLines, { autoAlpha: 0, yPercent: -130 }, at)
        .set([...allCursors, ...allFocusLabels], { autoAlpha: 0 }, at)
        .to(allStations, { opacity: 0.18, duration: 0.2 }, at)
        .to(station, { opacity: 1, duration: 0.2 }, at + 0.02)
        .to(
          allPeople,
          {
            borderColor: personBaseBorder,
            backgroundColor: personBaseBackground,
            duration: 0.22,
            ease: "power2.inOut",
          },
          at,
        )
        .to(
          person,
          {
            borderColor: roleColors[cycle.role],
            backgroundColor: personFocusBackground,
            duration: 0.22,
          },
          at + 0.02,
        )
        .to(
          allNodes,
          {
            opacity: 0.18,
            scale: 1,
            borderColor: nodeBaseBorder,
            backgroundColor: nodeBaseBackground,
            duration: 0.26,
            ease: "power2.inOut",
          },
          at,
        )
        .to(
          affected,
          {
            opacity: 1,
            scale: 1.045,
            borderColor: roleColors[cycle.role],
            backgroundColor: nodeFocusBackground,
            duration: 0.24,
            stagger: 0.012,
            ease: "power2.out",
          },
          at + 0.06,
        )
        .to(
          affected,
          {
            scale: 1.025,
            duration: 0.16,
            stagger: 0.01,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          at + 0.42,
        );
      return;
    }

    timeline
      .set(
        [
          ...humanMessage,
          ...agentReply,
          ...proposal,
          ...applied,
          ...focus,
          ...scanStatus,
        ],
        { autoAlpha: 0 },
        at,
      )
      .set(scanLines, { autoAlpha: 0, yPercent: -130 }, at)
      .to(otherStations, { opacity: 0.32, duration: 0.24 }, at)
      .to(station, { opacity: 1, duration: 0.24 }, at)
      .to(
        person,
        {
          borderColor: roleColors[cycle.role],
          backgroundColor: personFocusBackground,
          duration: 0.28,
        },
        at,
      )
      .set(
        cursor,
        {
          autoAlpha: 1,
          x: cycle.cursor.startX,
          y: cycle.cursor.startY,
          scale: 1,
        },
        at + 0.18,
      )
      .to(
        cursor,
        {
          x: cycle.cursor.composerX,
          y: cycle.cursor.composerY,
          duration: 0.52,
          ease: "power2.inOut",
        },
        at + 0.42,
      )
      .to(cursor, { scale: 0.78, duration: 0.1 }, at + 0.96)
      .to(cursor, { scale: 1, duration: 0.12 }, at + 1.06)
      .fromTo(
        humanMessage,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        at + 1.14,
      )
      .fromTo(
        agentReply,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        at + 1.64,
      )
      .fromTo(
        scanStatus,
        { autoAlpha: 0, x: 14 },
        { autoAlpha: 1, x: 0, duration: 0.28, ease: "power2.out" },
        at + 2.12,
      )
      .set(scanLines, { autoAlpha: 0.72, yPercent: -130 }, at + 2.28)
      .to(
        scanLines,
        {
          yPercent: 230,
          duration: 0.86,
          ease: "none",
        },
        at + 2.28,
      )
      .set(scanLines, { autoAlpha: 0 }, at + 3.16)
      .to(scanStatus, { autoAlpha: 0, duration: 0.2 }, at + 3.18)
      .to(
        unaffected,
        {
          opacity: 0.22,
          duration: 0.34,
          ease: "power2.out",
        },
        at + 3.28,
      )
      .to(
        affected,
        {
          opacity: 1,
          scale: 1.035,
          borderColor: roleColors[cycle.role],
          backgroundColor: nodeFocusBackground,
          duration: 0.36,
          stagger: 0.035,
          ease: "power2.out",
        },
        at + 3.28,
      )
      .fromTo(
        focus,
        { autoAlpha: 0, scale: 0.98 },
        { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        at + 3.34,
      )
      .to(
        graph,
        {
          scale: 1.055,
          transformOrigin: cycle.transformOrigin,
          duration: 0.54,
          ease: "power3.inOut",
        },
        at + 3.58,
      )
      .fromTo(
        proposal,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" },
        at + 4.18,
      )
      .to(
        cursor,
        {
          x: cycle.cursor.approveX,
          y: cycle.cursor.approveY,
          duration: 0.48,
          ease: "power2.inOut",
        },
        at + 4.66,
      )
      .to(cursor, { scale: 0.76, duration: 0.1 }, at + 5.18)
      .to(approve, { scale: 0.95, duration: 0.1 }, at + 5.18)
      .to(cursor, { scale: 1, duration: 0.12 }, at + 5.28)
      .to(approve, { scale: 1, duration: 0.12 }, at + 5.28)
      .fromTo(
        applied,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
        at + 5.46,
      )
      .to(
        affected,
        {
          backgroundColor: nodeAppliedBackground,
          duration: 0.28,
          stagger: 0.04,
          ease: "power2.out",
        },
        at + 5.78,
      )
      .to(cursor, { autoAlpha: 0, duration: 0.2 }, at + 6.24)
      .to(
        graph,
        {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.48,
          ease: "power3.inOut",
        },
        at + 6.34,
      )
      .to(focus, { autoAlpha: 0, duration: 0.25 }, at + 6.38)
      .to(
        allNodes,
        {
          opacity: 1,
          scale: 1,
          borderColor: nodeBaseBorder,
          backgroundColor: nodeBaseBackground,
          duration: 0.38,
          ease: "power2.inOut",
        },
        at + 6.72,
      )
      .to(
        person,
        {
          borderColor: personBaseBorder,
          backgroundColor: personBaseBackground,
          duration: 0.3,
        },
        at + 7.02,
      )
      .to(station, { opacity: 0.34, duration: 0.28 }, at + 7.18);
  });

  const quickCycleRestoreAt =
    quickCycleStart +
    (reviewCycles.length - 2) * quickCycleSpacing +
    quickCycleSpacing;
  timeline
    .to(
      allNodes,
      {
        opacity: 1,
        scale: 1,
        borderColor: nodeBaseBorder,
        backgroundColor: nodeBaseBackground,
        duration: 0.32,
        ease: "power2.inOut",
      },
      quickCycleRestoreAt,
    )
    .to(
      allPeople,
      {
        borderColor: personBaseBorder,
        backgroundColor: personBaseBackground,
        duration: 0.28,
        ease: "power2.inOut",
      },
      quickCycleRestoreAt,
    )
    .to(allStations, { opacity: 0.34, duration: 0.28 }, quickCycleRestoreAt)
    .to(
      allStations,
      { opacity: 0.46, duration: 0.24 },
      quickCycleRestoreAt + 0.34,
    )
    .to({}, { duration: 0.5 }, quickCycleRestoreAt + 0.58);

  return startTime + SCENE_FOUR_DURATION_SECONDS;
}

export default SceneFourLayer;
