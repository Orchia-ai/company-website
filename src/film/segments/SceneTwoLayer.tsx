import {
  FileText,
  Hash,
  MousePointer2,
  Paperclip,
  Send,
} from "lucide-react";
import Image from "../FillImage";

import styles from "./scene-two-layer.module.css";

export const SCENE_TWO_DURATION_SECONDS = 11;
const RECOMPOSITION_LEAD_SECONDS = 1.6;
const MERGE_ALIGNMENT_LEAD_SECONDS = 0.28;

type SceneTwoSelector = gsap.utils.SelectorFunc;
type SceneTwoRole = "writer" | "camera" | "art" | "data";

type Participant = {
  name: string;
  role: string;
  avatar: string;
};

const participants: readonly Participant[] = [
  {
    name: "Maya",
    role: "Writer",
    avatar: "/demo/living-production-v5/avatars/writer.png",
  },
  {
    name: "Eli",
    role: "Camera",
    avatar: "/demo/living-production-v5/avatars/camera.png",
  },
  {
    name: "Nora",
    role: "Art",
    avatar: "/demo/living-production-v5/avatars/art.png",
  },
  {
    name: "Owen",
    role: "Data",
    avatar: "/demo/living-production-v5/avatars/data-analysis.png",
  },
] as const;

const typedMessage =
  "The opening still feels slow. Can we tighten the first beat?";

/**
 * Adds the manual-collaboration beat to the existing Feature 5 master timeline.
 *
 * The host owns the 1920 × 1080 stage, people/tool clusters, narration, and
 * controls. This segment owns only its group-chat prop and human interaction.
 */
export function appendSceneTwoTimeline(
  timeline: gsap.core.Timeline,
  query: SceneTwoSelector,
  startTime: number,
) {
  const layer = query<HTMLElement>("[data-scene2-layer]");
  const panel = query<HTMLElement>("[data-scene2-chat]");
  const cursor = query<HTMLElement>("[data-scene2-cursor]");
  const clickRing = query<HTMLElement>("[data-scene2-click-ring]");
  const composer = query<HTMLElement>("[data-scene2-composer]");
  const sendButton = query<HTMLElement>("[data-scene2-send]");
  const characters = query<HTMLElement>("[data-scene2-character]");
  const placeholder = query<HTMLElement>("[data-scene2-placeholder]");
  const messages = Array.from(
    query<HTMLElement>("[data-scene2-message]"),
  );
  const toolGrids = Array.from(
    query<HTMLElement>("[data-master-ensemble] [data-role]"),
  );
  const sourceArtifacts = Array.from(
    query<HTMLElement>(
      "[data-master-ensemble] [data-personal-artifact]",
    ),
  );
  const mergeArtifacts = Array.from(
    query<HTMLElement>("[data-merge-artifact]"),
  );
  const sourceArtifactById = new Map(
    sourceArtifacts.map((artifact) => [
      artifact.dataset.personalArtifact ?? "",
      artifact,
    ]),
  );
  const toolGridsByRole = new Map(
    toolGrids.map((grid) => [
      (grid.dataset.role ?? "writer") as SceneTwoRole,
      grid,
    ]),
  );
  const clustersByRole = new Map(
    Array.from(toolGridsByRole.entries()).flatMap(([role, grid]) => {
      const cluster = grid.closest<HTMLElement>(
        "[data-master-ensemble] > section",
      );
      return cluster ? [[role, cluster] as const] : [];
    }),
  );
  const leftToolGrids = [
    toolGridsByRole.get("writer"),
    toolGridsByRole.get("camera"),
  ].filter((grid): grid is HTMLElement => Boolean(grid));
  const rightToolGrids = [
    toolGridsByRole.get("art"),
    toolGridsByRole.get("data"),
  ].filter((grid): grid is HTMLElement => Boolean(grid));
  const cursorElement = cursor[0];
  const composerElement = composer[0];
  const sendButtonElement = sendButton[0];
  const stage = layer[0]?.parentElement;
  const cursorTipOffset = { x: 3, y: 3 };
  const pointInStage = (
    element: HTMLElement | undefined,
    anchor: "text-start" | "center",
  ) => {
    if (!element || !stage || !cursorElement) {
      return { x: 0, y: 0 };
    }

    const stageBounds = stage.getBoundingClientRect();
    const elementBounds = element.getBoundingClientRect();
    const stageScale = stageBounds.width / 1920 || 1;
    const targetX =
      anchor === "text-start"
        ? elementBounds.left + 44 * stageScale
        : elementBounds.left + elementBounds.width / 2;
    const targetY = elementBounds.top + elementBounds.height / 2;

    return {
      x:
        (targetX - stageBounds.left) / stageScale -
        cursorElement.offsetLeft -
        cursorTipOffset.x,
      y:
        (targetY - stageBounds.top) / stageScale -
        cursorElement.offsetTop -
        cursorTipOffset.y,
    };
  };
  const composerPoint = () => pointInStage(composerElement, "text-start");
  const sendPoint = () => pointInStage(sendButtonElement, "center");

  // Keep the overview's familiar quadrants: Maya + Eli stay on the left,
  // Nora + Owen stay on the right. The complete groups move farther toward
  // the frame edges so the Slack-like conversation can sit in the middle
  // without obscuring any of the four people.
  const clusterTargets: Record<
    SceneTwoRole,
    { x: number; y: number }
  > = {
    writer: { x: 187, y: 18 },
    camera: { x: 187, y: -18 },
    art: { x: 350, y: 18 },
    data: { x: 350, y: -18 },
  };
  const preparationStart = startTime - RECOMPOSITION_LEAD_SECONDS;

  timeline
    .set(layer, { autoAlpha: 0 }, 0)
    .set(
      panel,
      {
        autoAlpha: 0,
        top: 148,
        width: 890,
        height: 642,
        scale: 0.94,
        backgroundColor: "#ffffff",
        borderColor: "#b7b7b7",
        boxShadow:
          "0 32px 68px rgba(28, 21, 28, 0.24), 0 3px 10px rgba(28, 21, 28, 0.16)",
      },
      0,
    )
    .set(
      cursor,
      {
        autoAlpha: 0,
        x: () => composerPoint().x - 118,
        y: () => composerPoint().y + 54,
        scale: 1,
        transformOrigin: `${cursorTipOffset.x}px ${cursorTipOffset.y}px`,
      },
      0,
    )
    .set(clickRing, { autoAlpha: 0, scale: 0.25 }, 0)
    .set(characters, { autoAlpha: 0 }, 0)
    .set(placeholder, { autoAlpha: 0 }, 0)
    .set(messages, { autoAlpha: 0, y: 10 }, 0)

    // Scene 1 has already returned to the four-person overview. During the
    // final 1.6 seconds before Slack arrives, mirror the private systems around
    // their owners: the two left-side systems move left, while the right-side
    // systems move right. Then recompose the four complete groups around an
    // empty center so the movement flows directly into the conversation.
    .set(leftToolGrids, { transformOrigin: "100% 50%" }, preparationStart)
    .set(rightToolGrids, { transformOrigin: "0% 50%" }, preparationStart)
    .to(
      toolGrids,
      {
        scale: 0.6,
        opacity: 0.56,
        duration: 0.66,
        ease: "power3.inOut",
      },
      preparationStart,
    )
    .to(
      leftToolGrids,
      {
        x: -780,
        duration: 0.66,
        ease: "power3.inOut",
      },
      preparationStart,
    )
    .to(
      rightToolGrids,
      {
        x: 130,
        duration: 0.66,
        ease: "power3.inOut",
      },
      preparationStart,
    );

  Array.from(clustersByRole.entries()).forEach(([role, cluster]) => {
    const target = clusterTargets[role];
    timeline.to(
      cluster,
      {
        x: target.x,
        y: target.y,
        scale: 0.72,
        opacity: 0.88,
        transformOrigin: "0% 0%",
        duration: 0.86,
        ease: "power4.inOut",
      },
      preparationStart,
    );
  });

  timeline
    // The merge copies were captured before this composition changed. Align
    // each hidden copy with its visible source immediately before the next
    // scene gathers them, preventing a jump back to the original positions.
    .set(
      mergeArtifacts,
      {
        left: (_index, element) => {
          const clone = element as HTMLElement;
          const source = sourceArtifactById.get(
            clone.dataset.mergeArtifact ?? "",
          );
          const stage = clone.parentElement?.parentElement;
          if (!source || !stage) {
            return clone.offsetLeft;
          }
          const sourceBounds = source.getBoundingClientRect();
          const stageBounds = stage.getBoundingClientRect();
          const stageScale = stageBounds.width / 1920 || 1;
          const sourceCenter =
            (sourceBounds.left + sourceBounds.width / 2 - stageBounds.left) /
            stageScale;
          return sourceCenter - clone.offsetWidth / 2;
        },
        top: (_index, element) => {
          const clone = element as HTMLElement;
          const source = sourceArtifactById.get(
            clone.dataset.mergeArtifact ?? "",
          );
          const stage = clone.parentElement?.parentElement;
          if (!source || !stage) {
            return clone.offsetTop;
          }
          const sourceBounds = source.getBoundingClientRect();
          const stageBounds = stage.getBoundingClientRect();
          const stageScale = stageBounds.width / 1920 || 1;
          const sourceCenter =
            (sourceBounds.top + sourceBounds.height / 2 - stageBounds.top) /
            stageScale;
          return sourceCenter - clone.offsetHeight / 2;
        },
        scale: (_index, element) => {
          const clone = element as HTMLElement;
          const source = sourceArtifactById.get(
            clone.dataset.mergeArtifact ?? "",
          );
          const stage = clone.parentElement?.parentElement;
          if (!source || !stage || clone.offsetWidth === 0) {
            return 1;
          }
          const sourceBounds = source.getBoundingClientRect();
          const stageBounds = stage.getBoundingClientRect();
          const stageScale = stageBounds.width / 1920 || 1;
          return sourceBounds.width / stageScale / clone.offsetWidth;
        },
        transformOrigin: "50% 50%",
      },
      startTime +
        SCENE_TWO_DURATION_SECONDS -
        MERGE_ALIGNMENT_LEAD_SECONDS,
    )
    .set(layer, { autoAlpha: 1 }, startTime)
    .to(
      panel,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.38,
        ease: "power3.out",
      },
      startTime,
    )
    .to(
      cursor,
      {
        autoAlpha: 1,
        x: () => composerPoint().x,
        y: () => composerPoint().y,
        duration: 0.38,
        ease: "power3.out",
      },
      startTime + 0.42,
    )
    .to(
      composer,
      {
        borderColor: "#b56243",
        boxShadow: "0 0 0 2px rgba(181, 98, 67, 0.14)",
        duration: 0.2,
        ease: "power2.out",
      },
      startTime + 0.8,
    )
    .to(
      clickRing,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
      },
      startTime + 0.8,
    )
    .to(
      cursor,
      {
        scale: 0.78,
        duration: 0.08,
        ease: "power2.in",
      },
      startTime + 0.8,
    )
    .to(
      cursor,
      {
        scale: 1,
        duration: 0.1,
        ease: "power2.out",
      },
      startTime + 0.88,
    )
    .to(
      clickRing,
      {
        autoAlpha: 0,
        scale: 1.45,
        duration: 0.28,
        ease: "power2.in",
      },
      startTime + 1.02,
    )
    .to(
      cursor,
      {
        autoAlpha: 0,
        duration: 0.12,
        ease: "power2.in",
      },
      startTime + 1.06,
    )
    .to(
      characters,
      {
        autoAlpha: 1,
        duration: 0.012,
        stagger: 0.014,
        ease: "none",
      },
      startTime + 1.08,
    )
    .to(
      cursor,
      {
        autoAlpha: 1,
        duration: 0.08,
        ease: "power2.out",
      },
      startTime + 1.88,
    )
    .to(
      cursor,
      {
        x: () => sendPoint().x,
        y: () => sendPoint().y,
        duration: 0.36,
        ease: "power3.inOut",
      },
      startTime + 1.94,
    )
    .to(
      cursor,
      {
        scale: 0.78,
        duration: 0.08,
        ease: "power2.in",
      },
      startTime + 2.3,
    )
    .to(
      sendButton,
      {
        scale: 0.9,
        duration: 0.11,
        ease: "power2.in",
      },
      startTime + 2.3,
    )
    .to(
      cursor,
      {
        scale: 1,
        duration: 0.1,
        ease: "power2.out",
      },
      startTime + 2.38,
    )
    .to(
      sendButton,
      {
        scale: 1,
        duration: 0.17,
        ease: "back.out(2.2)",
      },
      startTime + 2.41,
    )
    .set(characters, { autoAlpha: 0 }, startTime + 2.42)
    .set(placeholder, { autoAlpha: 1 }, startTime + 2.42)
    .to(
      composer,
      {
        borderColor: "#cfc8bc",
        boxShadow: "0 0 0 0 rgba(181, 98, 67, 0)",
        duration: 0.18,
        ease: "power2.inOut",
      },
      startTime + 2.5,
    )
    .to(
      cursor,
      {
        autoAlpha: 0,
        y: -12,
        duration: 0.3,
        ease: "power2.in",
      },
      startTime + 2.6,
    )
    .to(
      messages,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.24,
        stagger: 0.82,
        ease: "power3.out",
      },
      startTime + 2.6,
    )
    .to({}, { duration: 1.6 }, startTime + 9.4);

  return startTime + SCENE_TWO_DURATION_SECONDS;
}

export function SceneTwoLayer() {
  return (
    <section
      className={styles.layer}
      data-scene2-layer
      aria-label="A manual production team conversation"
    >
      <article className={styles.chat} data-scene2-chat>
        <aside className={styles.sidebar} data-scene2-slack-shell>
          <div className={styles.workspaceIdentity}>
            <span>Production studio</span>
            <strong>Northstar</strong>
          </div>

          <div className={styles.sidebarSection}>
            <span>Channels</span>
            <div className={styles.channelRow}>
              <Hash aria-hidden="true" />
              <strong>production-team</strong>
            </div>
            <div className={styles.channelRowMuted}>
              <Hash aria-hidden="true" />
              <span>references</span>
            </div>
            <div className={styles.channelRowMuted}>
              <Hash aria-hidden="true" />
              <span>delivery</span>
            </div>
          </div>

          <div className={styles.memberList}>
            <span>People</span>
            {participants.map((participant) => (
              <div className={styles.member} key={participant.name}>
                <ChatAvatar participant={participant} size={30} />
                <span>
                  <strong>{participant.name}</strong>
                  <small>{participant.role}</small>
                </span>
              </div>
            ))}
          </div>
        </aside>

        <section className={styles.conversation} data-scene2-slack-shell>
          <header className={styles.conversationHeader}>
            <div className={styles.channelTitle}>
              <Hash aria-hidden="true" />
              <span>
                <strong>production-team</strong>
                <small>4 members</small>
              </span>
            </div>
            <div className={styles.participantStack} aria-hidden="true">
              {participants.map((participant) => (
                <ChatAvatar
                  participant={participant}
                  size={34}
                  key={participant.name}
                />
              ))}
            </div>
          </header>

          <div className={styles.messageHistory}>
            <ChatMessage
              participant={participants[0]}
              time="9:42 AM"
              text={typedMessage}
            />
            <ChatMessage
              participant={participants[1]}
              time="9:44 AM"
              text="Which script are we using—the one from this morning?"
            />
            <ChatMessage
              participant={participants[0]}
              time="9:45 AM"
              text="Latest is Script_v04. I’ll resend it."
            />
            <ChatMessage
              participant={participants[2]}
              time="9:46 AM"
              text="My boards are still linked to v03. What changed?"
            />
            <ChatMessage
              participant={participants[0]}
              time="9:47 AM"
              text="Only the hook and second beat."
            />
            <ChatMessage
              participant={participants[1]}
              time="9:48 AM"
              text="That changes two shots. I’ll update the camera plan."
            />
            <ChatMessage
              participant={participants[3]}
              time="9:49 AM"
              text="Send me the final version too—I need to rerun the retention notes."
            />
          </div>

          <div className={styles.composer} data-scene2-composer>
            <Paperclip aria-hidden="true" />
            <span
              className={styles.composerText}
              aria-label={typedMessage}
            >
              {Array.from(typedMessage).map((character, index) => (
                <i data-scene2-character aria-hidden="true" key={index}>
                  {character === " " ? "\u00A0" : character}
                </i>
              ))}
            </span>
            <span className={styles.placeholder} data-scene2-placeholder>
              Message #production-team
            </span>
            <span className={styles.sendButton} data-scene2-send>
              <Send aria-hidden="true" />
            </span>
          </div>
        </section>
      </article>

      <div className={styles.cursor} data-scene2-cursor aria-hidden="true">
        <MousePointer2 />
        <span>Maya</span>
        <i data-scene2-click-ring />
      </div>
    </section>
  );
}

function ChatAvatar({
  participant,
  size,
}: {
  participant: Participant;
  size: number;
}) {
  return (
    <span
      className={styles.chatAvatar}
      style={{ width: size, height: size }}
    >
      <Image
        src={participant.avatar}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        unoptimized
      />
    </span>
  );
}

function ChatMessage({
  participant,
  time,
  text,
  attachment,
}: {
  participant: Participant;
  time: string;
  text: string;
  attachment?: string;
}) {
  return (
    <article className={styles.message} data-scene2-message>
      <ChatAvatar participant={participant} size={38} />
      <div className={styles.messageBody}>
        <header>
          <strong>{participant.name}</strong>
          <span>{participant.role}</span>
          <time>{time}</time>
        </header>
        <p>{text}</p>
        {attachment ? (
          <div className={styles.attachment}>
            <FileText aria-hidden="true" />
            <span>
              <strong>{attachment}</strong>
              <small>18 KB · Shared file</small>
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
