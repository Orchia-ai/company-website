import {
  Aperture,
  BarChart3,
  FileImage,
  FilePenLine,
  FileSpreadsheet,
  FileText,
  Film,
  GitBranch,
  Image as ImageIcon,
  Layers3,
  LineChart,
  Palette,
  ScanLine,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type ProductionRole = "maya" | "nora" | "eli" | "owen";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type ProductionWorkflowNode = {
  id: string;
  title: string;
  meta: string;
  column: number;
  row: number;
  icon: IconComponent;
  roles: readonly ProductionRole[];
};

export type ProductionWorkflowEdge = {
  from: string;
  to: string;
};

export const PRODUCTION_GRAPH_WIDTH = 1060;
export const PRODUCTION_GRAPH_HEIGHT = 720;
export const PRODUCTION_NODE_WIDTH = 148;
export const PRODUCTION_NODE_HEIGHT = 50;

const COLUMN_X = [20, 238, 456, 674, 892] as const;
const ROW_Y = [10, 88, 166, 244, 322, 400, 478, 556, 634] as const;

export const productionRoleColors: Record<ProductionRole, string> = {
  maya: "#ff5a36",
  nora: "#cfff3d",
  eli: "#2864ff",
  owen: "#ff4fa3",
};

/**
 * The shared Scene 3/4 workflow. Positions are a strict five-column,
 * nine-row system so the build state and review state can use the exact same
 * graph without a visual swap.
 */
export const productionWorkflowNodes: readonly ProductionWorkflowNode[] = [
  {
    id: "creative-brief",
    title: "Creative brief",
    meta: "Production context",
    column: 0,
    row: 0,
    icon: FileText,
    roles: ["maya"],
  },
  {
    id: "art-uploads",
    title: "Art uploads",
    meta: "Sketches and references",
    column: 1,
    row: 0,
    icon: Upload,
    roles: ["nora"],
  },
  {
    id: "scene-references",
    title: "Scene references",
    meta: "Stills and movement",
    column: 3,
    row: 0,
    icon: ImageIcon,
    roles: ["eli", "nora"],
  },
  {
    id: "platform-data",
    title: "Platform data",
    meta: "Audience exports",
    column: 4,
    row: 0,
    icon: FileSpreadsheet,
    roles: ["owen"],
  },
  {
    id: "story-research",
    title: "Story research",
    meta: "Sources and interviews",
    column: 0,
    row: 1,
    icon: ScanLine,
    roles: ["maya", "owen"],
  },
  {
    id: "visual-research",
    title: "Visual research",
    meta: "Style language",
    column: 1,
    row: 1,
    icon: ImageIcon,
    roles: ["nora", "maya"],
  },
  {
    id: "camera-research",
    title: "Camera research",
    meta: "Movement references",
    column: 3,
    row: 1,
    icon: Aperture,
    roles: ["eli", "nora"],
  },
  {
    id: "metrics",
    title: "Metrics",
    meta: "Normalized performance",
    column: 4,
    row: 1,
    icon: BarChart3,
    roles: ["owen"],
  },
  {
    id: "social-signals",
    title: "Social signals",
    meta: "Retention and response",
    column: 0,
    row: 2,
    icon: LineChart,
    roles: ["owen", "maya"],
  },
  {
    id: "audience-signals",
    title: "Audience signals",
    meta: "Hook evidence",
    column: 1,
    row: 2,
    icon: BarChart3,
    roles: ["owen", "maya"],
  },
  {
    id: "art-direction",
    title: "Art direction",
    meta: "Character and world",
    column: 3,
    row: 2,
    icon: Palette,
    roles: ["nora", "maya"],
  },
  {
    id: "shot-list",
    title: "Shot list",
    meta: "Required coverage",
    column: 4,
    row: 2,
    icon: FileText,
    roles: ["eli", "maya"],
  },
  {
    id: "story-structure",
    title: "Story structure",
    meta: "Narrative arc",
    column: 0,
    row: 3,
    icon: GitBranch,
    roles: ["maya", "owen"],
  },
  {
    id: "trend-charts",
    title: "Trend charts",
    meta: "Cross-platform patterns",
    column: 1,
    row: 3,
    icon: LineChart,
    roles: ["owen", "nora"],
  },
  {
    id: "reference-images",
    title: "Reference images",
    meta: "Identity anchors",
    column: 3,
    row: 3,
    icon: FileImage,
    roles: ["nora", "eli"],
  },
  {
    id: "camera-previs",
    title: "3D camera previs",
    meta: "Reveal path",
    column: 4,
    row: 3,
    icon: Layers3,
    roles: ["eli", "nora"],
  },
  {
    id: "script-draft",
    title: "Script draft",
    meta: "Scene-ready copy",
    column: 0,
    row: 4,
    icon: FilePenLine,
    roles: ["maya"],
  },
  {
    id: "creative-scoring",
    title: "Creative scoring",
    meta: "Element evidence",
    column: 1,
    row: 4,
    icon: BarChart3,
    roles: ["owen", "maya", "nora"],
  },
  {
    id: "scene-image-groups",
    title: "Scene image groups",
    meta: "Production frames",
    column: 3,
    row: 4,
    icon: ImageIcon,
    roles: ["nora", "eli"],
  },
  {
    id: "movement-coverage",
    title: "Movement and coverage",
    meta: "Lens and blocking",
    column: 4,
    row: 4,
    icon: Aperture,
    roles: ["eli", "maya"],
  },
  {
    id: "section-beats",
    title: "Section beats",
    meta: "Timed structure",
    column: 1,
    row: 5,
    icon: GitBranch,
    roles: ["maya", "eli"],
  },
  {
    id: "outcome-forecast",
    title: "Outcome forecast",
    meta: "Expected response",
    column: 2,
    row: 5,
    icon: BarChart3,
    roles: ["owen", "maya"],
  },
  {
    id: "script-revision",
    title: "Script revision",
    meta: "Approved changes",
    column: 3,
    row: 5,
    icon: FilePenLine,
    roles: ["maya", "nora", "owen"],
  },
  {
    id: "video-prompt",
    title: "Video prompt",
    meta: "Connected direction",
    column: 1,
    row: 6,
    icon: Video,
    roles: ["maya", "nora", "eli"],
  },
  {
    id: "production-plan",
    title: "Production plan",
    meta: "Selective execution",
    column: 3,
    row: 6,
    icon: GitBranch,
    roles: ["maya", "nora", "eli", "owen"],
  },
  {
    id: "video-generation",
    title: "Video generation",
    meta: "Agent execution",
    column: 2,
    row: 7,
    icon: Sparkles,
    roles: ["maya", "nora", "eli", "owen"],
  },
  {
    id: "video-output",
    title: "Video output",
    meta: "Review-ready result",
    column: 2,
    row: 8,
    icon: Film,
    roles: ["maya", "nora", "eli", "owen"],
  },
] as const;

export const productionWorkflowEdges: readonly ProductionWorkflowEdge[] = [
  { from: "creative-brief", to: "story-research" },
  { from: "art-uploads", to: "visual-research" },
  { from: "scene-references", to: "camera-research" },
  { from: "platform-data", to: "metrics" },
  { from: "story-research", to: "story-structure" },
  { from: "visual-research", to: "art-direction" },
  { from: "camera-research", to: "shot-list" },
  { from: "metrics", to: "social-signals" },
  { from: "social-signals", to: "audience-signals" },
  { from: "social-signals", to: "trend-charts" },
  { from: "audience-signals", to: "creative-scoring" },
  { from: "audience-signals", to: "outcome-forecast" },
  { from: "art-direction", to: "reference-images" },
  { from: "shot-list", to: "camera-previs" },
  { from: "story-structure", to: "script-draft" },
  { from: "trend-charts", to: "creative-scoring" },
  { from: "reference-images", to: "scene-image-groups" },
  { from: "camera-previs", to: "movement-coverage" },
  { from: "script-draft", to: "section-beats" },
  { from: "creative-scoring", to: "script-revision" },
  { from: "scene-image-groups", to: "video-prompt" },
  { from: "movement-coverage", to: "section-beats" },
  { from: "section-beats", to: "video-prompt" },
  { from: "outcome-forecast", to: "script-revision" },
  { from: "script-revision", to: "production-plan" },
  { from: "video-prompt", to: "production-plan" },
  { from: "production-plan", to: "video-generation" },
  { from: "video-generation", to: "video-output" },
] as const;

export function productionNodePosition(node: ProductionWorkflowNode) {
  return {
    x: COLUMN_X[node.column],
    y: ROW_Y[node.row],
  };
}

export function productionBuildPhase(node: ProductionWorkflowNode) {
  return Math.min(4, Math.floor(node.row / 2));
}

const nodeById = new Map(
  productionWorkflowNodes.map((node) => [node.id, node]),
);

type Point = {
  x: number;
  y: number;
};

type EdgeDirection = "incoming" | "outgoing";

const COLUMN_GUTTER_X = COLUMN_X.slice(0, -1).map(
  (columnX, index) =>
    (columnX + PRODUCTION_NODE_WIDTH + COLUMN_X[index + 1]) / 2,
);

const edgeKey = (edge: ProductionWorkflowEdge) =>
  `${edge.from}->${edge.to}`;

const edgeByKey = new Map(
  productionWorkflowEdges.map((edge) => [edgeKey(edge), edge]),
);

const outgoingEdgesByNode = new Map<string, ProductionWorkflowEdge[]>();
const incomingEdgesByNode = new Map<string, ProductionWorkflowEdge[]>();

for (const edge of productionWorkflowEdges) {
  const outgoing = outgoingEdgesByNode.get(edge.from) ?? [];
  outgoing.push(edge);
  outgoingEdgesByNode.set(edge.from, outgoing);

  const incoming = incomingEdgesByNode.get(edge.to) ?? [];
  incoming.push(edge);
  incomingEdgesByNode.set(edge.to, incoming);
}

function compareConnectedEdges(
  direction: EdgeDirection,
  left: ProductionWorkflowEdge,
  right: ProductionWorkflowEdge,
) {
  const leftNode = nodeById.get(
    direction === "outgoing" ? left.to : left.from,
  );
  const rightNode = nodeById.get(
    direction === "outgoing" ? right.to : right.from,
  );

  if (!leftNode || !rightNode) {
    return edgeKey(left).localeCompare(edgeKey(right));
  }

  return (
    leftNode.column - rightNode.column ||
    leftNode.row - rightNode.row ||
    edgeKey(left).localeCompare(edgeKey(right))
  );
}

for (const edges of outgoingEdgesByNode.values()) {
  edges.sort((left, right) =>
    compareConnectedEdges("outgoing", left, right),
  );
}

for (const edges of incomingEdgesByNode.values()) {
  edges.sort((left, right) =>
    compareConnectedEdges("incoming", left, right),
  );
}

function edgePortX(
  node: ProductionWorkflowNode,
  edge: ProductionWorkflowEdge,
  direction: EdgeDirection,
) {
  const connectedEdges =
    direction === "outgoing"
      ? outgoingEdgesByNode.get(node.id)
      : incomingEdgesByNode.get(node.id);
  const edges = connectedEdges ?? [];
  const index = Math.max(
    0,
    edges.findIndex((candidate) => edgeKey(candidate) === edgeKey(edge)),
  );
  const availableWidth = PRODUCTION_NODE_WIDTH - 54;
  const spacing =
    edges.length > 1
      ? Math.min(18, availableWidth / (edges.length - 1))
      : 0;
  const offset = (index - (edges.length - 1) / 2) * spacing;
  const position = productionNodePosition(node);

  return position.x + PRODUCTION_NODE_WIDTH / 2 + offset;
}

/**
 * Every long connection travels through one of the four vertical gutters
 * between node columns. Choosing the gutter beside the destination keeps the
 * final approach short and makes the overall flow read top-to-bottom.
 */
function edgeGutterIndex(edge: ProductionWorkflowEdge) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  if (!source || !target) {
    return 0;
  }

  if (source.column < target.column) {
    return Math.max(0, target.column - 1);
  }

  if (source.column > target.column) {
    return Math.min(COLUMN_GUTTER_X.length - 1, target.column);
  }

  return source.column === COLUMN_X.length - 1
    ? COLUMN_GUTTER_X.length - 1
    : source.column;
}

const longEdgesByGutter = new Map<number, ProductionWorkflowEdge[]>();

for (const edge of productionWorkflowEdges) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  if (!source || !target || target.row - source.row <= 1) {
    continue;
  }

  const gutterIndex = edgeGutterIndex(edge);
  const gutterEdges = longEdgesByGutter.get(gutterIndex) ?? [];
  gutterEdges.push(edge);
  longEdgesByGutter.set(gutterIndex, gutterEdges);
}

for (const edges of longEdgesByGutter.values()) {
  edges.sort((left, right) => {
    const leftSource = nodeById.get(left.from);
    const rightSource = nodeById.get(right.from);
    const leftTarget = nodeById.get(left.to);
    const rightTarget = nodeById.get(right.to);

    return (
      (leftSource?.row ?? 0) - (rightSource?.row ?? 0) ||
      (leftTarget?.row ?? 0) - (rightTarget?.row ?? 0) ||
      edgeKey(left).localeCompare(edgeKey(right))
    );
  });
}

function edgeGutterX(edge: ProductionWorkflowEdge) {
  const gutterIndex = edgeGutterIndex(edge);
  const gutterEdges = longEdgesByGutter.get(gutterIndex) ?? [];
  const index = Math.max(
    0,
    gutterEdges.findIndex(
      (candidate) => edgeKey(candidate) === edgeKey(edge),
    ),
  );
  const spacing =
    gutterEdges.length > 1
      ? Math.min(7, 42 / (gutterEdges.length - 1))
      : 0;
  const offset = (index - (gutterEdges.length - 1) / 2) * spacing;

  return COLUMN_GUTTER_X[gutterIndex] + offset;
}

const adjacentEdgesByRowGap = new Map<number, ProductionWorkflowEdge[]>();

for (const edge of productionWorkflowEdges) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  if (!source || !target || target.row - source.row !== 1) {
    continue;
  }

  const rowEdges = adjacentEdgesByRowGap.get(source.row) ?? [];
  rowEdges.push(edge);
  adjacentEdgesByRowGap.set(source.row, rowEdges);
}

for (const edges of adjacentEdgesByRowGap.values()) {
  edges.sort((left, right) => {
    const leftSource = nodeById.get(left.from);
    const rightSource = nodeById.get(right.from);
    const leftTarget = nodeById.get(left.to);
    const rightTarget = nodeById.get(right.to);

    return (
      (leftSource?.column ?? 0) - (rightSource?.column ?? 0) ||
      (leftTarget?.column ?? 0) - (rightTarget?.column ?? 0) ||
      edgeKey(left).localeCompare(edgeKey(right))
    );
  });
}

function adjacentEdgeLaneY(
  edge: ProductionWorkflowEdge,
  source: ProductionWorkflowNode,
) {
  const edges = adjacentEdgesByRowGap.get(source.row) ?? [];
  const index = Math.max(
    0,
    edges.findIndex((candidate) => edgeKey(candidate) === edgeKey(edge)),
  );
  const position = productionNodePosition(source);
  const sourceBottom = position.y + PRODUCTION_NODE_HEIGHT;
  const rowGap = ROW_Y[source.row + 1] - sourceBottom;
  const laneCount = Math.max(1, edges.length);
  const lane = index;

  return sourceBottom + ((lane + 1) * rowGap) / (laneCount + 1);
}

function longEdgeLaneY(
  edge: ProductionWorkflowEdge,
  node: ProductionWorkflowNode,
  direction: EdgeDirection,
) {
  const connectedEdges =
    direction === "outgoing"
      ? outgoingEdgesByNode.get(node.id)
      : incomingEdgesByNode.get(node.id);
  const longEdges = (connectedEdges ?? []).filter((candidate) => {
    const source = nodeById.get(candidate.from);
    const target = nodeById.get(candidate.to);
    return Boolean(source && target && target.row - source.row > 1);
  });
  const index = Math.max(
    0,
    longEdges.findIndex(
      (candidate) => edgeKey(candidate) === edgeKey(edge),
    ),
  );
  const laneCount = Math.min(3, Math.max(1, longEdges.length));
  const lane = index % laneCount;
  const position = productionNodePosition(node);

  if (direction === "outgoing") {
    return position.y + PRODUCTION_NODE_HEIGHT + 7 + lane * 5;
  }

  return position.y - 7 - lane * 5;
}

function removeRedundantPoints(points: readonly Point[]) {
  const uniquePoints = points.filter(
    (point, index) =>
      index === 0 ||
      point.x !== points[index - 1].x ||
      point.y !== points[index - 1].y,
  );

  return uniquePoints.filter((point, index) => {
    if (index === 0 || index === uniquePoints.length - 1) {
      return true;
    }

    const previous = uniquePoints[index - 1];
    const next = uniquePoints[index + 1];
    const isVertical =
      previous.x === point.x && point.x === next.x;
    const isHorizontal =
      previous.y === point.y && point.y === next.y;

    return !isVertical && !isHorizontal;
  });
}

/**
 * Produces the same restrained radius at every bend. The route remains
 * orthogonal, but the small corner treatment makes crossings and handoffs
 * easier to follow than a collection of unrelated sharp elbows.
 */
function orthogonalPath(points: readonly Point[], radius = 5) {
  const route = removeRedundantPoints(points);
  if (route.length < 2) {
    return "";
  }

  const commands = [`M ${route[0].x} ${route[0].y}`];

  for (let index = 1; index < route.length - 1; index += 1) {
    const previous = route[index - 1];
    const corner = route[index];
    const next = route[index + 1];
    const incomingLength =
      Math.abs(corner.x - previous.x) +
      Math.abs(corner.y - previous.y);
    const outgoingLength =
      Math.abs(next.x - corner.x) + Math.abs(next.y - corner.y);
    const cornerRadius = Math.min(
      radius,
      incomingLength / 2,
      outgoingLength / 2,
    );
    const before = {
      x:
        corner.x -
        Math.sign(corner.x - previous.x) * cornerRadius,
      y:
        corner.y -
        Math.sign(corner.y - previous.y) * cornerRadius,
    };
    const after = {
      x: corner.x + Math.sign(next.x - corner.x) * cornerRadius,
      y: corner.y + Math.sign(next.y - corner.y) * cornerRadius,
    };

    commands.push(
      `L ${before.x} ${before.y}`,
      `Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
    );
  }

  const last = route[route.length - 1];
  commands.push(`L ${last.x} ${last.y}`);

  return commands.join(" ");
}

/**
 * Orthogonal edge router shared by build and review.
 *
 * - Every edge leaves and enters a stable, ordered port.
 * - Adjacent rows connect inside their shared horizontal gutter.
 * - Longer edges use a dedicated lane in a node-free vertical gutter.
 *
 * This keeps every route outside node bounds and ensures Scene 3 constructs
 * the exact same production graph that Scene 4 reviews.
 */
export function productionEdgePath(
  edge: ProductionWorkflowEdge,
  _edgeIndex: number,
) {
  void _edgeIndex;
  const canonicalEdge = edgeByKey.get(edgeKey(edge)) ?? edge;
  const source = nodeById.get(canonicalEdge.from);
  const target = nodeById.get(canonicalEdge.to);
  if (!source || !target) {
    return "";
  }

  const sourcePosition = productionNodePosition(source);
  const targetPosition = productionNodePosition(target);
  const rowDistance = target.row - source.row;

  if (rowDistance < 0) {
    return "";
  }

  if (rowDistance === 0) {
    const travelRight = source.column < target.column;
    const sourceX = travelRight
      ? sourcePosition.x + PRODUCTION_NODE_WIDTH
      : sourcePosition.x;
    const targetX = travelRight
      ? targetPosition.x
      : targetPosition.x + PRODUCTION_NODE_WIDTH;
    const centerY = sourcePosition.y + PRODUCTION_NODE_HEIGHT / 2;
    const hasNodeBetween = productionWorkflowNodes.some(
      (node) =>
        node.row === source.row &&
        node.column > Math.min(source.column, target.column) &&
        node.column < Math.max(source.column, target.column),
    );

    if (!hasNodeBetween) {
      return orthogonalPath([
        { x: sourceX, y: centerY },
        { x: targetX, y: centerY },
      ]);
    }

    const direction = travelRight ? 1 : -1;
    const sourceGutterX = sourceX + direction * 12;
    const targetGutterX = targetX - direction * 12;
    const rowBottom = sourcePosition.y + PRODUCTION_NODE_HEIGHT;
    const nextRowTop =
      ROW_Y[source.row + 1] ?? PRODUCTION_GRAPH_HEIGHT - 8;
    const laneY = rowBottom + (nextRowTop - rowBottom) / 2;

    return orthogonalPath([
      { x: sourceX, y: centerY },
      { x: sourceGutterX, y: centerY },
      { x: sourceGutterX, y: laneY },
      { x: targetGutterX, y: laneY },
      { x: targetGutterX, y: centerY },
      { x: targetX, y: centerY },
    ]);
  }

  const sourceX = edgePortX(source, canonicalEdge, "outgoing");
  const sourceY = sourcePosition.y + PRODUCTION_NODE_HEIGHT;
  const targetX = edgePortX(target, canonicalEdge, "incoming");
  const targetY = targetPosition.y;

  if (rowDistance === 1) {
    const laneY = adjacentEdgeLaneY(canonicalEdge, source);
    return orthogonalPath([
      { x: sourceX, y: sourceY },
      { x: sourceX, y: laneY },
      { x: targetX, y: laneY },
      { x: targetX, y: targetY },
    ]);
  }

  const gutterX = edgeGutterX(canonicalEdge);
  const departureY = longEdgeLaneY(
    canonicalEdge,
    source,
    "outgoing",
  );
  const arrivalY = longEdgeLaneY(
    canonicalEdge,
    target,
    "incoming",
  );

  return orthogonalPath([
    { x: sourceX, y: sourceY },
    { x: sourceX, y: departureY },
    { x: gutterX, y: departureY },
    { x: gutterX, y: arrivalY },
    { x: targetX, y: arrivalY },
    { x: targetX, y: targetY },
  ]);
}

export function productionEdgeBuildPhase(edge: ProductionWorkflowEdge) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  if (!source || !target) {
    return 0;
  }
  return Math.max(productionBuildPhase(source), productionBuildPhase(target));
}
