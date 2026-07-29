import gsap from "gsap";
import {
  BarChart3,
  Camera,
  Check,
  FileImage,
  FilePenLine,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  NotebookTabs,
  Pause,
  Play,
  RotateCcw,
  Search,
  Table2,
  Video,
} from "lucide-react";
import Image from "./FillImage";
import {
  type ChangeEvent,
  type ComponentType,
  type SVGProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  appendSceneTwoTimeline,
  SceneTwoLayer,
} from "./segments/SceneTwoLayer";
import {
  appendSceneThreeTimeline,
  SCENE_TWO_EXIT_DURATION_SECONDS,
  SceneThreeLayer,
} from "./segments/SceneThreeLayer";
import { SceneFourLayer } from "./segments/SceneFourLayer";
import {
  TypographyInterstitial,
  type TypographyInterstitialKey,
} from "./shared/TypographyInterstitial";
import styles from "./specialist-workflows.module.css";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const INTRO_DURATION_SECONDS = 2.9;
const BRIDGE_INTERSTITIAL_DURATION_SECONDS = 2.7;
const ENDING_DURATION_SECONDS = 3;
const SCENE_ONE_DURATION_SECONDS = 18;
const MAYA_EXPANDED_WIDTH = 1380;
const MAYA_EXPANDED_HEIGHT = 860;
const MAYA_EXPANDED_LEFT = 470;
const MAYA_EXPANDED_TOP = 64;

const FILM_COPY = {
  intro: "Video production is a complex teamwork",
  bridge: "Now, let Orchia bring the work together.",
  endingBrand: "Orchia",
  ending: "Every specialist. One shared production.",
} as const;

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type RoleKey = "writer" | "camera" | "art" | "data";

type Specialist = {
  key: RoleKey;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
};

type WorkCard = {
  title: string;
  kind: string;
  icon: IconComponent;
  lines: readonly string[];
  artifact: string;
};

type ExpandedCardDetail = {
  label: string;
  items: readonly string[];
  signals: readonly string[];
};

const specialists: readonly Specialist[] = [
  {
    key: "writer",
    name: "Maya",
    role: "Writer",
    specialty: "Research and story",
    avatar: "/demo/living-production-v5/avatars/writer.png",
  },
  {
    key: "camera",
    name: "Eli",
    role: "Camera",
    specialty: "Visual direction",
    avatar: "/demo/living-production-v5/avatars/camera.png",
  },
  {
    key: "art",
    name: "Nora",
    role: "Art",
    specialty: "World and character",
    avatar: "/demo/living-production-v5/avatars/art.png",
  },
  {
    key: "data",
    name: "Owen",
    role: "Data analysis",
    specialty: "Audience signals",
    avatar: "/demo/living-production-v5/avatars/data-analysis.png",
  },
] as const;

const roleCards: Record<RoleKey, readonly WorkCard[]> = {
  writer: [
    {
      title: "Research",
      kind: "Research chat",
      icon: Search,
      lines: ["Web and archive sources", "Interview transcripts"],
      artifact: "Research_brief.md",
    },
    {
      title: "References",
      kind: "Reference library",
      icon: FolderOpen,
      lines: ["Creative brief and audience", "Reference scripts and tone"],
      artifact: "References/",
    },
    {
      title: "Story plan",
      kind: "Planning document",
      icon: NotebookTabs,
      lines: ["Character arcs and theme", "Scene beats and ending"],
      artifact: "Beat_sheet.md",
    },
    {
      title: "Drafts and revisions",
      kind: "Screenplay",
      icon: FilePenLine,
      lines: ["Screenplay drafts", "Comments and revision pass"],
      artifact: "Script_v03.fdx",
    },
  ],
  camera: [
    {
      title: "Shot references",
      kind: "Reference board",
      icon: ImageIcon,
      lines: ["Location stills", "Lens references and scene clips"],
      artifact: "Shot_refs/",
    },
    {
      title: "Camera plan",
      kind: "Shot table",
      icon: Camera,
      lines: ["Shot size and lens", "Movement and timing"],
      artifact: "Camera_plan.pdf",
    },
    {
      title: "Previs and coverage",
      kind: "3D preview",
      icon: Video,
      lines: ["Blocking and camera path", "Shot order"],
      artifact: "Previs.mov",
    },
    {
      title: "Shoot files",
      kind: "Production files",
      icon: Check,
      lines: ["Shot list and setup notes", "Coverage map"],
      artifact: "Shot_list.csv",
    },
  ],
  art: [
    {
      title: "Moodboard",
      kind: "Reference board",
      icon: ImageIcon,
      lines: ["Reference frames and palette", "Materials"],
      artifact: "Moodboard.pdf",
    },
    {
      title: "Asset library",
      kind: "Image files",
      icon: FileImage,
      lines: ["Sketches and textures", "Costume references"],
      artifact: "Art_refs/",
    },
    {
      title: "Visual direction",
      kind: "Direction document",
      icon: FileText,
      lines: ["World and lighting rules", "Character look"],
      artifact: "Art_direction.pdf",
    },
    {
      title: "Concept delivery",
      kind: "Concept frames",
      icon: FilePenLine,
      lines: ["Key and style frames", "Review notes"],
      artifact: "Concept_frames/",
    },
  ],
  data: [
    {
      title: "Platform exports",
      kind: "Spreadsheet",
      icon: Table2,
      lines: ["TikTok and Instagram", "Audience retention"],
      artifact: "Metrics.csv",
    },
    {
      title: "Clean and compare",
      kind: "Data notebook",
      icon: Search,
      lines: ["Normalize metrics", "Benchmarks and segments"],
      artifact: "Clean_metrics.csv",
    },
    {
      title: "Trends and insights",
      kind: "Analysis charts",
      icon: BarChart3,
      lines: ["Hooks and retention", "Topics"],
      artifact: "Insights.md",
    },
    {
      title: "Performance report",
      kind: "Report document",
      icon: FileText,
      lines: ["Charts and findings", "Recommendations"],
      artifact: "Performance_report.pdf",
    },
  ],
};

const writerExpandedDetails: readonly ExpandedCardDetail[] = [
  {
    label: "Evidence map",
    items: [
      "Audience tension and opening question",
      "Archive footage and interview evidence",
      "Source notes linked to story opportunities",
      "Contradictions flagged for follow-up",
    ],
    signals: ["12 sources", "3 interviews", "Brief ready"],
  },
  {
    label: "Reference board",
    items: [
      "Character silhouette and visual identity",
      "Greenhouse scale, texture, and atmosphere",
      "Transformation endpoint and color arc",
      "Low-state framing for the opening scene",
    ],
    signals: ["4 selects", "2 palettes", "Tone locked"],
  },
  {
    label: "Narrative structure",
    items: [
      "Act one: establish the abandoned terrace",
      "Act two: test the restoration approach",
      "Act three: reveal the living greenhouse",
      "Ending beat returns to the human impact",
    ],
    signals: ["8 beats", "3 acts", "Arc approved"],
  },
  {
    label: "Revision pass",
    items: [
      "Opening image tightened for a faster hook",
      "Dialogue trimmed around the midpoint",
      "Visual transitions matched to story beats",
      "Final reveal prepared for production review",
    ],
    signals: ["Draft 03", "7 notes", "Review ready"],
  },
] as const;

function formatTimecode(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function appendTypographyInterstitial(
  timeline: gsap.core.Timeline,
  query: gsap.utils.SelectorFunc,
  {
    interstitialKey,
    startTime,
    duration,
    enterDuration,
    exitDuration,
    persistAtEnd = false,
  }: {
    interstitialKey: TypographyInterstitialKey;
    startTime: number;
    duration: number;
    enterDuration: number;
    exitDuration: number;
    persistAtEnd?: boolean;
  },
) {
  const layer = query<HTMLElement>(
    `[data-typography-interstitial="${interstitialKey}"]`,
  );
  const copy = query<HTMLElement>(
    `[data-typography-interstitial="${interstitialKey}"] [data-typography-interstitial-copy]`,
  );
  const exitStart = startTime + duration - exitDuration;
  const isBridge = interstitialKey === "bridge";
  const bridgeBreathingGap = isBridge ? 0.18 : 0;
  const revealStart = startTime + bridgeBreathingGap;

  if (isBridge) {
    // Let the Slack surface finish closing before the bridge treatment begins.
    // The layer starts transparent so its backdrop and graphic bars dissolve
    // over the still-present specialists instead of appearing in one frame.
    timeline
      .set(layer, { autoAlpha: 0 }, startTime)
      .set(layer, { visibility: "visible" }, startTime)
      .to(
        layer,
        {
          opacity: 1,
          duration: 0.34,
          ease: "power2.out",
        },
        revealStart,
      );
  } else {
    timeline.set(layer, { autoAlpha: 1 }, startTime);
  }

  timeline
    .fromTo(
      copy,
      {
        autoAlpha: 0,
        y: 30,
        scale: 0.985,
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: enterDuration,
        ease: "power3.out",
      },
      revealStart + (isBridge ? 0.06 : 0),
    );

  if (persistAtEnd) {
    timeline.to({}, { duration }, startTime);
    return;
  }

  timeline
    .to(
      copy,
      {
        autoAlpha: 0,
        y: -24,
        scale: 1.01,
        duration: exitDuration,
        ease: "power3.in",
      },
      exitStart,
    )
    .to(
      layer,
      {
        autoAlpha: 0,
        duration: exitDuration,
        ease: "power2.inOut",
      },
      exitStart,
    )
    .set(layer, { visibility: "hidden" }, startTime + duration);
}

export default function SpecialistWorkflowsFilm() {
  const stageRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const recordingStartTimeoutRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showRecordingStart, setShowRecordingStart] = useState(false);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    // The stage fits the box the host gives it, not the raw viewport, so the
    // page can put a header and a call to action above and below it.
    const host = stage.parentElement;
    if (!host) {
      return;
    }

    const fitStage = () => {
      const scale = Math.min(
        host.clientWidth / STAGE_WIDTH,
        host.clientHeight / STAGE_HEIGHT,
      );
      stage.style.setProperty("--stage-scale", String(scale));
    };

    fitStage();
    const observer = new ResizeObserver(fitStage);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const sourceArtifacts = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-personal-artifact]"),
    );
    const sourcePeople = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-personal-human]"),
    );
    const stageBounds = stage.getBoundingClientRect();
    // Every clone position below is a measured viewport pixel converted back
    // into stage coordinates, so this divisor has to be exactly the scale the
    // stage is drawn at. Read the value we set ourselves rather than inferring
    // it from a rect: a rect measured mid-layout (Safari collapsing its URL
    // bar, a font swap, a pending resize) yields a slightly-to-wildly wrong
    // scale, and every artifact and person then lands in the wrong place.
    const appliedScale = Number.parseFloat(
      stage.style.getPropertyValue("--stage-scale"),
    );
    const stageScale =
      (Number.isFinite(appliedScale) && appliedScale > 0
        ? appliedScale
        : stageBounds.width / STAGE_WIDTH) || 1;
    const mergeLayer = document.createElement("div");

    mergeLayer.dataset.masterMergeLayer = "";
    mergeLayer.setAttribute("aria-hidden", "true");
    Object.assign(mergeLayer.style, {
      position: "absolute",
      inset: "0",
      zIndex: "43",
      visibility: "hidden",
      opacity: "0",
      pointerEvents: "none",
    });

    // `offsetWidth`/`offsetHeight` are the layout size a clone needs, but they
    // report 0 for anything the engine has not laid out yet. A 0-sized clone
    // collapses its grid tracks, which is what turns a person card into a
    // sliver of avatar with one letter per line. Fall back to the measured rect
    // (converted out of stage scale) whenever the offset size is degenerate.
    const layoutSize = (element: HTMLElement, bounds: DOMRect) => ({
      width: element.offsetWidth || bounds.width / stageScale,
      height: element.offsetHeight || bounds.height / stageScale,
    });

    sourceArtifacts.forEach((sourceArtifact) => {
      const sourceBounds = sourceArtifact.getBoundingClientRect();
      const size = layoutSize(sourceArtifact, sourceBounds);
      const clone = sourceArtifact.cloneNode(true) as HTMLElement;
      const artifactId = sourceArtifact.dataset.personalArtifact;

      clone.removeAttribute("data-personal-artifact");
      clone.dataset.mergeArtifact = artifactId ?? "";
      Object.assign(clone.style, {
        position: "absolute",
        left: `${(sourceBounds.left - stageBounds.left) / stageScale}px`,
        top: `${(sourceBounds.top - stageBounds.top) / stageScale}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        margin: "0",
        transform: "none",
        transformOrigin: "50% 50%",
        willChange: "left, top, transform, opacity",
      });
      mergeLayer.appendChild(clone);
    });

    sourcePeople.forEach((sourcePerson) => {
      const sourceBounds = sourcePerson.getBoundingClientRect();
      const clone = sourcePerson.cloneNode(true) as HTMLElement;
      const personRole = sourcePerson.dataset.personalHuman;
      const sourceStyle = window.getComputedStyle(sourcePerson);
      const size = layoutSize(sourcePerson, sourceBounds);

      clone.removeAttribute("data-personal-human");
      clone.dataset.mergePerson = personRole ?? "";
      Object.assign(clone.style, {
        position: "absolute",
        left: `${(sourceBounds.left - stageBounds.left) / stageScale}px`,
        top: `${(sourceBounds.top - stageBounds.top) / stageScale}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        margin: "0",
        transform: "none",
        transformOrigin: "50% 50%",
        zIndex: "2",
        willChange: "left, top, transform, opacity",
      });
      clone.style.setProperty(
        "--role",
        sourceStyle.getPropertyValue("--role"),
      );
      mergeLayer.appendChild(clone);
    });

    stage.appendChild(mergeLayer);

    const query = gsap.utils.selector(stageRef);
    const context = gsap.context(() => {
      const copiedSystem = query("[data-maya-copy]");
      const mayaSourceSystem = query("[data-maya-source]");
      const otherSpecialists = query("[data-other-specialist]");
      const narration = query("[data-master-narration]");
      const ensemble = query("[data-master-ensemble]");
      const sceneThreeCursor = query("[data-scene3-system-cursor]");
      const mergeArtifacts = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-merge-artifact]"),
      );
      const mergePeople = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-merge-person]"),
      );
      const sourcePersonByRole = new Map(
        sourcePeople.map((person) => [
          person.dataset.personalHuman ?? "",
          person,
        ]),
      );
      const sceneFourRoleByPersonalRole: Record<RoleKey, string> = {
        writer: "maya",
        camera: "eli",
        art: "nora",
        data: "owen",
      };
      const expandedDetails = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-expanded-detail]"),
      );
      const mayaSourceElement = mayaSourceSystem[0] as HTMLElement | undefined;
      const mayaSourceBounds = mayaSourceElement?.getBoundingClientRect();
      const mayaSourceLeft = mayaSourceBounds
        ? (mayaSourceBounds.left - stageBounds.left) / stageScale
        : 308;
      const mayaSourceTop = mayaSourceBounds
        ? (mayaSourceBounds.top - stageBounds.top) / stageScale
        : 96;
      const mayaSourceScaleX =
        (mayaSourceElement?.offsetWidth ?? 520) / MAYA_EXPANDED_WIDTH;
      const mayaSourceScaleY =
        (mayaSourceElement?.offsetHeight ?? 280) / MAYA_EXPANDED_HEIGHT;

      gsap.set(copiedSystem, {
        autoAlpha: 0,
        left: mayaSourceLeft,
        top: mayaSourceTop,
        scaleX: mayaSourceScaleX,
        scaleY: mayaSourceScaleY,
        transformOrigin: "0 0",
      });
      gsap.set(expandedDetails, {
        autoAlpha: 0,
        clipPath: "inset(0 0 100% 0)",
        y: 10,
      });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
        onComplete: () => setPlaying(false),
        onUpdate: () => {
          const percentage = timeline.progress() * 100;
          if (progressRef.current) {
            progressRef.current.value = String(percentage);
          }
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${percentage}%`;
          }
          if (timecodeRef.current) {
            timecodeRef.current.textContent = formatTimecode(timeline.time());
          }
        },
      });

      timeline
        .to({}, { duration: 2.1 })
        .to(
          otherSpecialists,
          {
            opacity: 0.16,
            duration: 0.46,
          },
          2.1,
        )
        .set(copiedSystem, { autoAlpha: 1 }, 2.82)
        .set(mayaSourceSystem, { autoAlpha: 0 }, 2.82)
        .to(
          copiedSystem,
          {
            left: MAYA_EXPANDED_LEFT,
            top: MAYA_EXPANDED_TOP,
            scaleX: 1,
            scaleY: 1,
            duration: 1.46,
          },
          2.9,
        )
        .to(
          expandedDetails,
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.44,
            stagger: 0.11,
            ease: "power2.out",
          },
          3.62,
        );

      timeline
        .to(
          [...expandedDetails].reverse(),
          {
            autoAlpha: 0,
            clipPath: "inset(0 0 100% 0)",
            y: 8,
            duration: 0.68,
            stagger: 0.09,
            ease: "power2.in",
          },
          10.08,
        )
        .to(
          copiedSystem,
          {
            left: mayaSourceLeft,
            top: mayaSourceTop,
            scaleX: mayaSourceScaleX,
            scaleY: mayaSourceScaleY,
            duration: 2.12,
          },
          10.18,
        )
        .set(mayaSourceSystem, { autoAlpha: 1 }, 12.34)
        .set(copiedSystem, { autoAlpha: 0 }, 12.34)
        .to(
          otherSpecialists,
          {
            opacity: 1,
            duration: 0.62,
          },
          12.42,
        )
        .to({}, { duration: SCENE_ONE_DURATION_SECONDS }, 0);

      timeline.set(
        narration,
        {
          textContent:
            "But collaboration still depends on manual handoffs.",
        },
        14.68,
      );

      const sceneTwoEnd = appendSceneTwoTimeline(
        timeline,
        query,
        SCENE_ONE_DURATION_SECONDS,
      );

      timeline
        .set(
          narration,
          {
            textContent: "",
          },
          sceneTwoEnd,
        )
        .set(
          narration,
          {
            textContent:
              "Each specialist shapes the same production through their own agent.",
          },
          sceneTwoEnd + 3.68,
        );

      const sceneThreeEnd = appendSceneThreeTimeline(
        timeline,
        query,
        sceneTwoEnd,
      );

      // Let the full Slack-like handoff complete its direct exit as its own
      // shot. The extra 0.24s beat after that exit stays clean before any of
      // the 16 personal work cards begin converging.
      const mergeStart =
        sceneTwoEnd + SCENE_TWO_EXIT_DURATION_SECONDS + 0.24;
      const compactStart = sceneTwoEnd + 7.26;
      const mergeColumns = [750, 890, 1030, 1170];
      const mergeRows = [398, 466, 534, 602];
      const mergeCardWidth = 246;
      const mergeCardHeight = 128;
      const roleColumn = new Map<RoleKey, number>([
        ["writer", 0],
        ["camera", 1],
        ["art", 2],
        ["data", 3],
      ]);
      const mergeTargets: Record<RoleKey, readonly string[]> = {
        writer: [
          "creative-brief",
          "story-research",
          "story-structure",
          "script-draft",
        ],
        art: [
          "art-uploads",
          "visual-research",
          "art-direction",
          "reference-images",
        ],
        camera: [
          "scene-references",
          "camera-research",
          "shot-list",
          "camera-previs",
        ],
        data: ["platform-data", "metrics", "social-signals", "trend-charts"],
      };

      mergePeople.forEach((personClone) => {
        const personalRole = (personClone.dataset.mergePerson ??
          "writer") as RoleKey;
        const sourcePerson = sourcePersonByRole.get(personalRole);
        const sceneFourRole = sceneFourRoleByPersonalRole[personalRole];
        const targetPerson = stage.querySelector<HTMLElement>(
          `[data-scene4-person="${sceneFourRole}"]`,
        );

        timeline
          .set(
            personClone,
            {
              left: () => {
                if (!sourcePerson) {
                  return personClone.offsetLeft;
                }
                const bounds = sourcePerson.getBoundingClientRect();
                const centerX =
                  (bounds.left + bounds.width / 2 - stageBounds.left) /
                  stageScale;
                return centerX - personClone.offsetWidth / 2;
              },
              top: () => {
                if (!sourcePerson) {
                  return personClone.offsetTop;
                }
                const bounds = sourcePerson.getBoundingClientRect();
                const centerY =
                  (bounds.top + bounds.height / 2 - stageBounds.top) /
                  stageScale;
                return centerY - personClone.offsetHeight / 2;
              },
              scaleX: () => {
                if (!sourcePerson || personClone.offsetWidth === 0) {
                  return 1;
                }
                return (
                  sourcePerson.getBoundingClientRect().width /
                  stageScale /
                  personClone.offsetWidth
                );
              },
              scaleY: () => {
                if (!sourcePerson || personClone.offsetHeight === 0) {
                  return 1;
                }
                return (
                  sourcePerson.getBoundingClientRect().height /
                  stageScale /
                  personClone.offsetHeight
                );
              },
              autoAlpha: 1,
              transformOrigin: "50% 50%",
            },
            sceneTwoEnd - 0.04,
          )
          .to(
            personClone,
            {
              left: () => {
                const bounds = targetPerson?.getBoundingClientRect();
                if (!bounds) {
                  return personClone.offsetLeft;
                }
                const centerX =
                  (bounds.left + bounds.width / 2 - stageBounds.left) /
                  stageScale;
                return centerX - personClone.offsetWidth / 2;
              },
              top: () => {
                const bounds = targetPerson?.getBoundingClientRect();
                if (!bounds) {
                  return personClone.offsetTop;
                }
                const centerY =
                  (bounds.top + bounds.height / 2 - stageBounds.top) /
                  stageScale;
                return centerY - personClone.offsetHeight / 2;
              },
              scaleX: () => {
                const bounds = targetPerson?.getBoundingClientRect();
                if (!bounds || personClone.offsetWidth === 0) {
                  return 1;
                }
                return bounds.width / stageScale / personClone.offsetWidth;
              },
              scaleY: () => {
                const bounds = targetPerson?.getBoundingClientRect();
                if (!bounds || personClone.offsetHeight === 0) {
                  return 1;
                }
                return bounds.height / stageScale / personClone.offsetHeight;
              },
              duration: 0.96,
              ease: "power4.inOut",
            },
            mergeStart,
          );
      });

      mergeArtifacts.forEach((artifact, artifactIndex) => {
        const [role = "writer", rawIndex = "0"] =
          artifact.dataset.mergeArtifact?.split("-") ?? [];
        const roleKey = role as RoleKey;
        const column = roleColumn.get(roleKey) ?? 0;
        const row = Number.parseInt(rawIndex, 10) || 0;
        const targetId = mergeTargets[roleKey]?.[row];
        const targetNode = targetId
          ? stage.querySelector<HTMLElement>(
              `[data-scene4-node-id="${targetId}"]`,
            )
          : null;
        const targetBounds = targetNode?.getBoundingClientRect();
        const targetCenterX = targetBounds
          ? (targetBounds.left - stageBounds.left) / stageScale +
            targetBounds.width / stageScale / 2
          : 960;
        const targetCenterY = targetBounds
          ? (targetBounds.top - stageBounds.top) / stageScale +
            targetBounds.height / stageScale / 2
          : 486;
        const targetScaleX = targetNode
          ? targetNode.offsetWidth / mergeCardWidth
          : 0.6;
        const targetScaleY = targetNode
          ? targetNode.offsetHeight / mergeCardHeight
          : 0.4;
        const moveAt = compactStart + artifactIndex * 0.012;

        timeline
          .to(
            artifact,
            {
              left: mergeColumns[column] - mergeCardWidth / 2,
              top: mergeRows[row] - mergeCardHeight / 2,
              width: mergeCardWidth,
              height: mergeCardHeight,
              scaleX: 0.44,
              scaleY: 0.44,
              rotation: 0,
              duration: 0.66,
              ease: "power3.inOut",
            },
            mergeStart + artifactIndex * 0.02,
          )
          .to(
            artifact,
            {
              left: targetCenterX - mergeCardWidth / 2,
              top: targetCenterY - mergeCardHeight / 2,
              scaleX: 0.44,
              scaleY: 0.44,
              duration: 0.54,
              ease: "power3.inOut",
            },
            moveAt,
          )
          .to(
            artifact,
            {
              autoAlpha: 0,
              scaleX: targetScaleX,
              scaleY: targetScaleY,
              duration: 0.18,
              ease: "power2.inOut",
            },
            moveAt + 0.52,
          );

        if (targetNode) {
          timeline.fromTo(
            targetNode,
            {
              autoAlpha: 0,
              scale: 0.94,
            },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.18,
              ease: "power2.out",
            },
            moveAt + 0.52,
          );
        }
      });

      timeline
        // The visible Scene 2 cards and people swap into exact-position clones
        // without fading. The clones hold still while the full Slack panel
        // exits directly, then rise over the shared layer and begin moving
        // after the clean 0.24s beat.
        .set(mergeLayer, { autoAlpha: 1, zIndex: 41 }, sceneTwoEnd - 0.04)
        .set(ensemble, { visibility: "hidden" }, sceneTwoEnd)
        .set(
          mergeLayer,
          { zIndex: 48 },
          sceneTwoEnd + SCENE_TWO_EXIT_DURATION_SECONDS,
        )
        .set(mergePeople, { autoAlpha: 0 }, mergeStart + 0.96)
        .set(sceneThreeCursor, { display: "none" }, sceneTwoEnd + 1.94)
        .set(mergeLayer, { autoAlpha: 0 }, compactStart + 1.08);

      // Scene 3 is now the complete story. Hold the resolved shared workspace
      // briefly after Owen's review instead of replaying the same interactions
      // through the former Scene 4 timeline.
      timeline.to({}, { duration: 0.65 }, sceneThreeEnd);

      // The Slack prop closes first. Everything scheduled after that clean
      // boundary moves later as one unit, preserving every relative scene
      // timing while making room for a typography-only story turn.
      const bridgeStart =
        sceneTwoEnd + SCENE_TWO_EXIT_DURATION_SECONDS;
      timeline.shiftChildren(
        BRIDGE_INTERSTITIAL_DURATION_SECONDS,
        false,
        bridgeStart,
      );
      timeline
        .set(narration, { autoAlpha: 0 }, bridgeStart)
        .set(
          narration,
          { autoAlpha: 1 },
          bridgeStart + BRIDGE_INTERSTITIAL_DURATION_SECONDS,
        );
      appendTypographyInterstitial(timeline, query, {
        interstitialKey: "bridge",
        startTime: bridgeStart,
        duration: BRIDGE_INTERSTITIAL_DURATION_SECONDS,
        enterDuration: 0.45,
        exitDuration: 0.45,
      });

      // The ending begins only after the complete Owen beat and its existing
      // resolution hold. It covers the workflow with the same typography
      // language used by the two earlier interstitials.
      const endingStart = timeline.duration();
      appendTypographyInterstitial(timeline, query, {
        interstitialKey: "ending",
        startTime: endingStart,
        duration: ENDING_DURATION_SECONDS,
        enterDuration: 0.48,
        exitDuration: 0.48,
        persistAtEnd: true,
      });

      // Finally, shift the entire pre-existing film—including the newly added
      // bridge and ending—behind the opening title. No downstream offsets are
      // recalculated, so the original motion and interaction cadence remains
      // unchanged.
      timeline.shiftChildren(INTRO_DURATION_SECONDS, false, 0);
      appendTypographyInterstitial(timeline, query, {
        interstitialKey: "intro",
        startTime: 0,
        duration: INTRO_DURATION_SECONDS,
        enterDuration: 0.48,
        exitDuration: 0.48,
      });

      timeline.seek(0, false).pause();
      timelineRef.current = timeline;
      stage.dataset.timelineState = "ready";

      // Offline render hook: when loaded with ?render=1, expose a deterministic
      // seek/duration handle so a headless browser can capture the film
      // frame-by-frame. No effect on normal playback.
      if (
        new URLSearchParams(window.location.search).get("render") === "1"
      ) {
        (
          window as unknown as {
            __specialistFilm?: {
              durationSeconds: number;
              seekSeconds: (seconds: number) => void;
            };
          }
        ).__specialistFilm = {
          durationSeconds: timeline.duration(),
          seekSeconds: (seconds: number) => {
            timeline.seek(seconds, false);
          },
        };
      }
    }, stageRef);

    return () => {
      timelineRef.current = null;
      context.revert();
      mergeLayer.remove();
    };
  }, []);

  const play = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    if (timeline.progress() >= 0.999) {
      timeline.restart();
    } else {
      timeline.play();
    }
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
    setPlaying(false);
  }, []);

  const restart = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    timeline.restart();
    setPlaying(true);
  }, []);

  const scrub = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    timeline.progress(Number(event.currentTarget.value) / 100, false).pause();
    setPlaying(false);
    if (timecodeRef.current) {
      timecodeRef.current.textContent = formatTimecode(timeline.time());
    }
  }, []);

  const startRecordingPlayback = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }

    if (recordingStartTimeoutRef.current !== null) {
      window.clearTimeout(recordingStartTimeoutRef.current);
    }

    setShowRecordingStart(false);
    timeline.seek(0, false).pause();
    setPlaying(false);

    recordingStartTimeoutRef.current = window.setTimeout(() => {
      recordingStartTimeoutRef.current = null;
      const currentTimeline = timelineRef.current;
      if (!currentTimeline) {
        return;
      }
      currentTimeline.seek(0, false).play();
      setPlaying(true);
    }, 500);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let active = true;
    queueMicrotask(() => {
      if (!active) {
        return;
      }
      const renderMode = params.get("render") === "1";
      const cleanRecording = params.get("controls") === "0" || renderMode;
      setShowControls(!cleanRecording);
      setShowRecordingStart(false);
      // The film is the landing page, so it plays on arrival. In render mode
      // the headless capturer seeks each frame itself, so the timeline must
      // stay paused rather than autoplaying.
      if (!renderMode && params.get("autoplay") !== "0") {
        play();
      }
    });
    return () => {
      active = false;
      if (recordingStartTimeoutRef.current !== null) {
        window.clearTimeout(recordingStartTimeoutRef.current);
        recordingStartTimeoutRef.current = null;
      }
    };
  }, [play]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement ||
        showRecordingStart
      ) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        if (playing) {
          pause();
        } else {
          play();
        }
      } else if (event.key.toLowerCase() === "r") {
        restart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pause, play, playing, restart, showRecordingStart]);

  return (
    <main className={styles.page}>
      <section
        className={styles.stage}
        ref={stageRef}
        aria-label="Four specialists and their personal ways of working"
      >
        <div className={styles.paperTexture} aria-hidden="true" />

        <div className={styles.ensemble} data-master-ensemble>
          {specialists.map((specialist) => (
            <SpecialistCluster
              key={specialist.key}
              specialist={specialist}
              source={specialist.key === "writer"}
              other={specialist.key !== "writer"}
            />
          ))}
        </div>

        <div className={styles.mayaCopy} data-maya-copy aria-hidden="true">
          <PersonalSystem role="writer" expanded />
        </div>

        <TypographyInterstitial
          interstitialKey="intro"
          headline={FILM_COPY.intro}
        />
        <TypographyInterstitial
          interstitialKey="bridge"
          headline={FILM_COPY.bridge}
        />
        <TypographyInterstitial
          interstitialKey="ending"
          brand={FILM_COPY.endingBrand}
          headline={FILM_COPY.ending}
        />

        <SceneTwoLayer />
        <SceneThreeLayer />
        <SceneFourLayer />

        {/*
          The subtitle track. It was hidden inline for clean screen recordings;
          on the site it is the only narration, so it stays visible and the
          timeline swaps its text as the story turns.
        */}
        <p className={styles.narration} data-master-narration>
          Every specialist has their own way of working.
        </p>

        {showRecordingStart ? (
          <div className={styles.recordingStartOverlay}>
            <button
              type="button"
              className={styles.recordingStartButton}
              onClick={startRecordingPlayback}
              aria-label="Play demo"
            >
              <Play aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {showControls ? (
          <div className={styles.controls}>
            <button
              type="button"
              onClick={playing ? pause : play}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            <button type="button" onClick={restart} aria-label="Restart">
              <RotateCcw aria-hidden="true" />
            </button>
            <div className={styles.progressTrack}>
              <span ref={progressFillRef} />
              <input
                ref={progressRef}
                type="range"
                min="0"
                max="100"
                step="0.1"
                defaultValue="0"
                aria-label="Scene progress"
                onChange={scrub}
              />
            </div>
            <span ref={timecodeRef} className={styles.timecode}>
              00:00
            </span>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function SpecialistCluster({
  specialist,
  source,
  other,
}: {
  specialist: Specialist;
  source?: boolean;
  other?: boolean;
}) {
  return (
    <section
      className={`${styles.cluster} ${styles[specialist.key]}`}
      data-other-specialist={other ? "" : undefined}
    >
      <div
        className={styles.personalSystem}
        data-maya-source={source ? "" : undefined}
      >
        <PersonalSystem role={specialist.key} />
      </div>
      <article
        className={styles.humanNode}
        data-personal-human={specialist.key}
      >
        <div className={styles.avatar}>
          <Image
            src={specialist.avatar}
            alt=""
            fill
            sizes="94px"
            priority
            unoptimized
          />
        </div>
        <div className={styles.humanCopy}>
          <strong>{specialist.name}</strong>
          <span>{specialist.role}</span>
          <small>{specialist.specialty}</small>
        </div>
      </article>
    </section>
  );
}

function PersonalSystem({
  role,
  expanded = false,
}: {
  role: RoleKey;
  expanded?: boolean;
}) {
  return (
    <div
      className={styles.toolGrid}
      data-role={role}
      data-expanded-system={expanded ? "" : undefined}
    >
      {roleCards[role].map((card, index) => (
        <TraditionalToolCard
          key={card.title}
          card={card}
          role={role}
          index={index}
          expanded={expanded}
        />
      ))}
    </div>
  );
}

function TraditionalToolCard({
  card,
  role,
  index,
  expanded,
}: {
  card: WorkCard;
  role: RoleKey;
  index: number;
  expanded: boolean;
}) {
  const Icon = card.icon;

  return (
    <article
      className={`${styles.toolCard} ${styles[`tool${index + 1}`]} ${styles[`${role}Tool`]}`}
      data-expanded-card={expanded ? String(index) : undefined}
      data-personal-artifact={!expanded ? `${role}-${index}` : undefined}
    >
      <header>
        <span className={styles.toolIcon}>
          <Icon aria-hidden="true" />
        </span>
        <span>
          <small>{card.kind}</small>
          <strong>{card.title}</strong>
        </span>
      </header>

      {expanded ? (
        <ExpandedToolDetail role={role} index={index} />
      ) : (
        <>
          <ToolPreview role={role} index={index} expanded={false} />
          <ul>
            {card.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      <footer>
        <span>{index === 0 ? "Input" : index === 1 ? "Reference" : index === 2 ? "Work" : "Output"}</span>
        <strong>{card.artifact}</strong>
      </footer>
    </article>
  );
}

function ExpandedToolDetail({
  role,
  index,
}: {
  role: RoleKey;
  index: number;
}) {
  const detail = writerExpandedDetails[index] ?? writerExpandedDetails[0];

  return (
    <div className={styles.expandedDetail} data-expanded-detail>
      <ToolPreview role={role} index={index} expanded />
      <div className={styles.expandedInformation}>
        <div className={styles.expandedCopy}>
          <strong>{detail.label}</strong>
          <ul>
            {detail.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.expandedSignals} aria-label="Workflow status">
          {detail.signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const previewClasses: Record<RoleKey, readonly string[]> = {
  writer: ["chatVisual", "filesVisual", "outlineVisual", "draftVisual"],
  camera: ["framesVisual", "tableVisual", "pathVisual", "checkVisual"],
  art: ["moodVisual", "assetsVisual", "rulesVisual", "conceptVisual"],
  data: ["sheetVisual", "queryVisual", "barsVisual", "reportVisual"],
};

const writerReferenceThumbnails = [
  "/demo/feature-4/reference/character-lineup.jpg",
  "/demo/feature-4/reference/luxury-greenhouse-layout.jpg",
] as const;

function ToolPreview({
  role,
  index,
  expanded,
}: {
  role: RoleKey;
  index: number;
  expanded: boolean;
}) {
  const previewClass = previewClasses[role][index];

  if (expanded && role === "writer" && index === 1) {
    return (
      <div
        className={`${styles.toolVisual} ${styles.referenceThumbVisual}`}
        aria-hidden="true"
      >
        {writerReferenceThumbnails.map((src) => (
          <span key={src} className={styles.referenceThumb}>
            <Image src={src} alt="" fill sizes="640px" unoptimized />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.toolVisual} ${previewClass ? styles[previewClass] : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, itemIndex) => (
        <i key={itemIndex} />
      ))}
    </div>
  );
}
