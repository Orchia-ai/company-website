import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Helmet } from 'react-helmet-async'

import HeroFeedbackLoop from './HeroFeedbackLoop'
import styles from './demo3-page.module.css'
import StudioSiteHeader from './StudioSiteHeader'

const outputMedia = {
  src: '/workflow-iteration-demo/batch-1.mp4',
  poster: '/workflow-iteration-demo/batch-1-poster.jpg',
} as const

const feedbackText = 'Make the opening hook faster and give the final reveal more contrast.'

const promptBeforeLines = [
  'Role — You are the Story Agent for a one-minute vertical short drama.',
  'Objective — Turn the creative brief into a complete narrative with a clear emotional turn.',
  'Audience — Write for mobile viewers who decide whether to continue within the opening seconds.',
  'Format — Return ordered beats with purpose, action, dialogue intent, and visual emphasis.',
  'Duration — Keep the final story between 45 and 60 seconds.',
  'Structure — Use setup, escalation, reversal, reveal, and a concise ending image.',
  'Opening — Open by establishing the world and building tension gradually, then land the reveal.',
  'Setup — Introduce only the information required to understand the central conflict.',
  'Escalation — Make each beat add a new obstacle, discovery, or emotional consequence.',
  'Reversal — Place the decisive change before the final quarter of the story.',
  'Reveal — Pay off the planted detail without adding a new unresolved idea.',
  'Characters — Preserve identity, motivation, wardrobe, and relationship continuity.',
  'Visual intent — Describe the dominant action and focal subject for every beat.',
  'Pacing — Avoid repeated setup, redundant exposition, and beats without visible change.',
  'Dialogue — Keep spoken lines short, performable, and distinct from visual direction.',
  'Output — Return valid beat objects for Character, Shot, Prompt, and Video agents.',
  'Handoff — Preserve approved facts so downstream agents can work without reinterpretation.',
  'Quality check — Confirm the hook, escalation, reveal, runtime, and continuity before sending.',
] as const

const promptAfterLines = promptBeforeLines.map((line, index) => (
  index === 6
    ? 'Opening — Open on conflict in the first 2 seconds, compress setup into two beats, then land the reveal on a high-contrast visual beat.'
    : line
))

const BASE_STORY_SCROLL_UNITS = 5.2
const TOTAL_STORY_SCROLL_UNITS = 13.6
const SEND_GATE_UNITS = 8.24
const NODE_REVIEW_GATE_UNITS = 10.08
const MODAL_OPEN_UNITS = 10.62
const APPROVE_GATE_UNITS = 11.56
const WORKFLOW_VERSION_END_UNITS = 13.42

type VideoFocusMetrics = {
  startLeft: number
  startTop: number
  targetTop: number
  dockLeft: number
  dockTop: number
  startWidth: number
  targetWidth: number
  dockWidth: number
  sceneWidth: number
  sceneHeight: number
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function revealBetween(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start))
}

function easeOutBack(value: number) {
  const amount = 1.45
  const shifted = value - 1
  return 1 + (amount + 1) * shifted ** 3 + amount * shifted ** 2
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value)
}

function getWorkflowFocusLayout(sceneWidth: number, sceneHeight: number) {
  const compact = sceneWidth < 900
  return {
    shiftX: compact ? 0 : -Math.min(sceneWidth * 0.31, 430),
    shiftY: -sceneHeight * (compact ? 0.14 : 0.05),
    scale: compact ? 0.46 : 0.5,
    opacity: compact ? 0.06 : 0.27,
  }
}

function getWorkflowComparisonLayout(sceneWidth: number, sceneHeight: number) {
  const chatWidth = clamp(sceneWidth * 0.3, 360, 420)
  const chatRight = clamp(sceneWidth * 0.024, 24, 40)
  const workspaceRight = Math.max(sceneWidth - chatWidth - chatRight - 24, 480)
  const pairCenter = workspaceRight / 2
  const pairGap = clamp(workspaceRight * 0.36, 250, 380)

  return {
    previousShiftX: pairCenter - pairGap / 2 - sceneWidth / 2,
    nextShiftX: pairCenter + pairGap / 2 - sceneWidth / 2,
    shiftY: -sceneHeight * 0.04,
    scale: clamp(workspaceRight / 2100, 0.28, 0.42),
  }
}

function revealStyle(progress: number, overshoot = true): CSSProperties {
  const eased = overshoot ? easeOutBack(progress) : progress
  return {
    opacity: progress,
    filter: `blur(${(1 - progress) * 5}px)`,
    transform: `translate(-50%, -50%) translate3d(0, ${(1 - progress) * 24}px, 0) scale(${0.88 + eased * 0.12})`,
  }
}

function revealContentStyle(progress: number): CSSProperties {
  const eased = easeOutBack(progress)
  return {
    opacity: progress,
    filter: `blur(${(1 - progress) * 5}px)`,
    transform: `translate3d(0, ${(1 - progress) * 24}px, 0) scale(${0.88 + eased * 0.12})`,
  }
}

function popInStyle(progress: number, offsetX = 0, offsetY = 16): CSSProperties {
  const eased = easeOutBack(progress)
  return {
    opacity: progress,
    filter: `blur(${(1 - progress) * 5}px)`,
    transform: `translate3d(${(1 - progress) * offsetX}px, ${(1 - progress) * offsetY}px, 0) scale(${0.92 + eased * 0.08})`,
  }
}

function WorkflowNode({
  className,
  progress,
  index,
  label,
  title,
  detail,
  accent,
  active = false,
  scanProgress = 0,
  issueProgress = 0,
  dimProgress = 0,
  editProgress = 0,
  editPulse = 0,
  updatedProgress = 0,
  reviewReady = false,
  onReview,
}: {
  className: string
  progress: number
  index: string
  label: string
  title: string
  detail: string
  accent: string
  active?: boolean
  scanProgress?: number
  issueProgress?: number
  dimProgress?: number
  editProgress?: number
  editPulse?: number
  updatedProgress?: number
  reviewReady?: boolean
  onReview?: () => void
}) {
  const nodeRevealStyle = revealStyle(progress)
  const scanOpacity = revealBetween(scanProgress, 0, 0.08)
    * (1 - revealBetween(scanProgress, 0.92, 1))
  const scanGlow = scanOpacity * (0.58 + Math.sin(scanProgress * Math.PI) * 0.42)

  return (
    <article
      className={`${styles.workflowNode} ${className} ${active ? styles.workflowNodeActive : ''} ${reviewReady ? styles.workflowNodeReviewReady : ''}`}
      aria-hidden={progress === 0}
      style={{
        ...nodeRevealStyle,
        opacity: progress * (1 - dimProgress * 0.42),
        filter: `${nodeRevealStyle.filter} brightness(${1 + scanGlow * 0.58 - dimProgress * 0.34}) saturate(${1 + scanGlow * 0.34 - dimProgress * 0.28})`,
        borderColor: updatedProgress > 0
          ? `rgb(207 255 61 / ${0.3 + updatedProgress * 0.62})`
          : issueProgress > 0
            ? `rgb(244 81 54 / ${0.2 + issueProgress * 0.72})`
            : undefined,
        background: updatedProgress > 0
          ? `rgb(207 255 61 / ${0.04 + updatedProgress * 0.1})`
          : issueProgress > 0
            ? `rgb(244 81 54 / ${0.06 + issueProgress * 0.11})`
            : undefined,
        boxShadow: editPulse > 0
          ? `0 0 ${14 + editPulse * 34}px rgb(95 140 255 / ${0.28 + editPulse * 0.42}), 5px 5px 0 rgb(95 140 255 / 24%)`
          : updatedProgress > 0
            ? `0 0 ${10 + updatedProgress * 24}px rgb(207 255 61 / ${updatedProgress * 0.38}), 5px 5px 0 rgb(207 255 61 / 18%)`
            : issueProgress > 0
          ? `0 0 ${10 + issueProgress * 22}px rgb(244 81 54 / ${issueProgress * 0.42}), 5px 5px 0 rgb(244 81 54 / 18%)`
          : scanGlow > 0
            ? `0 0 ${8 + scanGlow * 20}px rgb(207 255 61 / ${scanGlow * 0.42}), 5px 5px 0 rgb(0 0 0 / 28%)`
            : undefined,
        '--node-accent': accent,
      } as CSSProperties}
    >
      <span className={styles.nodeIndex}>{index}</span>
      <div>
        <span className={styles.nodeLabel}>{label}</span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      {issueProgress > 0 ? (
        <span
          className={`${styles.nodeIssueBadge} ${reviewReady ? styles.nodeIssueBadgeReview : ''} ${editProgress > 0.45 ? styles.nodeIssueBadgeEditing : ''} ${updatedProgress > 0.45 ? styles.nodeIssueBadgeUpdated : ''}`}
          style={popInStyle(issueProgress, 0, 8)}
        >
          {updatedProgress > 0.45
            ? 'Updated'
            : editProgress > 0.45
              ? 'Reviewing change'
              : reviewReady
                ? 'Click to review'
                : 'Pacing issue'}
        </span>
      ) : null}
      {reviewReady && onReview ? (
        <button
          className={styles.nodeReviewTarget}
          type="button"
          onClick={onReview}
          aria-label="Open the proposed Story Agent direction update"
        >
          <span className={styles.visuallyHidden}>Review Story Agent change</span>
        </button>
      ) : null}
      <span className={styles.nodeScanLayer} aria-hidden="true">
        <span
          className={styles.nodeScanner}
          style={{
            top: `${-28 + scanProgress * 156}%`,
            opacity: scanOpacity,
          }}
        />
      </span>
    </article>
  )
}

function Connector({
  path,
  progress,
  arrowX,
  arrowY,
}: {
  path: string
  progress: number
  arrowX: number
  arrowY: number
}) {
  const arrowProgress = revealBetween(progress, 0.78, 1)

  return (
    <g>
      <path
        className={styles.workflowConnector}
        d={path}
        pathLength="1"
        style={{
          opacity: revealBetween(progress, 0, 0.18),
          strokeDashoffset: 1 - progress,
        }}
      />
      <path
        className={styles.workflowArrow}
        d={`M${arrowX - 8} ${arrowY - 10}L${arrowX} ${arrowY}L${arrowX + 8} ${arrowY - 10}`}
        style={{ opacity: arrowProgress }}
      />
    </g>
  )
}

export default function Demo3Page() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoFocusMetrics, setVideoFocusMetrics] = useState<VideoFocusMetrics | null>(null)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [storyReviewOpened, setStoryReviewOpened] = useState(false)
  const [editApproved, setEditApproved] = useState(false)
  const storyRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const claimRef = useRef<HTMLParagraphElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const promptCompareRef = useRef<HTMLDivElement>(null)
  const feedbackSentRef = useRef(false)
  const storyReviewOpenedRef = useRef(false)
  const editApprovedRef = useRef(false)
  const storyAnimationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    document.body.classList.add('demo3-mode')
    document.body.classList.add('film-mode')
    storyRef.current?.scrollTo({ top: 0, behavior: 'auto' })

    return () => {
      if (storyAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(storyAnimationFrameRef.current)
      }
      document.body.classList.remove('demo3-mode')
      document.body.classList.remove('film-mode')
    }
  }, [])

  useEffect(() => {
    const story = storyRef.current
    if (!story) return

    let frame = 0

    const updateProgress = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const distance = Math.max(story.scrollHeight - story.clientHeight, 1)
        const rawProgress = clamp01(story.scrollTop / distance)
        const rawUnits = rawProgress * TOTAL_STORY_SCROLL_UNITS
        let gatedUnits = rawUnits

        if (!feedbackSentRef.current && rawUnits > SEND_GATE_UNITS) {
          gatedUnits = SEND_GATE_UNITS
        } else if (
          feedbackSentRef.current
          && !storyReviewOpenedRef.current
          && rawUnits > NODE_REVIEW_GATE_UNITS
        ) {
          gatedUnits = NODE_REVIEW_GATE_UNITS
        } else if (
          storyReviewOpenedRef.current
          && !editApprovedRef.current
          && rawUnits > APPROVE_GATE_UNITS
        ) {
          gatedUnits = APPROVE_GATE_UNITS
        }

        if (gatedUnits !== rawUnits) {
          story.scrollTop = (gatedUnits / TOTAL_STORY_SCROLL_UNITS) * distance
        }

        setScrollProgress(gatedUnits / TOTAL_STORY_SCROLL_UNITS)
      })
    }

    const preventForwardScrollAtGate = (event: WheelEvent) => {
      if (event.deltaY <= 0) return

      const distance = Math.max(story.scrollHeight - story.clientHeight, 1)
      const units = (story.scrollTop / distance) * TOTAL_STORY_SCROLL_UNITS
      const waitingForSend = !feedbackSentRef.current && units >= SEND_GATE_UNITS - 0.03
      const waitingForNode = feedbackSentRef.current
        && !storyReviewOpenedRef.current
        && units >= NODE_REVIEW_GATE_UNITS - 0.03
      const waitingForApproval = storyReviewOpenedRef.current
        && !editApprovedRef.current
        && units >= APPROVE_GATE_UNITS - 0.03

      if (waitingForSend || waitingForNode || waitingForApproval) event.preventDefault()
    }

    const preventForwardKeyAtGate = (event: KeyboardEvent) => {
      const forwardKeys = ['ArrowDown', 'PageDown', 'End', ' ']
      if (!forwardKeys.includes(event.key)) return

      const distance = Math.max(story.scrollHeight - story.clientHeight, 1)
      const units = (story.scrollTop / distance) * TOTAL_STORY_SCROLL_UNITS
      const waitingForSend = !feedbackSentRef.current && units >= SEND_GATE_UNITS - 0.03
      const waitingForNode = feedbackSentRef.current
        && !storyReviewOpenedRef.current
        && units >= NODE_REVIEW_GATE_UNITS - 0.03
      const waitingForApproval = storyReviewOpenedRef.current
        && !editApprovedRef.current
        && units >= APPROVE_GATE_UNITS - 0.03

      if (waitingForSend || waitingForNode || waitingForApproval) event.preventDefault()
    }

    updateProgress()
    story.addEventListener('scroll', updateProgress, { passive: true })
    story.addEventListener('wheel', preventForwardScrollAtGate, { passive: false })
    story.addEventListener('keydown', preventForwardKeyAtGate)
    window.addEventListener('resize', updateProgress)

    return () => {
      window.cancelAnimationFrame(frame)
      story.removeEventListener('scroll', updateProgress)
      story.removeEventListener('wheel', preventForwardScrollAtGate)
      story.removeEventListener('keydown', preventForwardKeyAtGate)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  const animateStoryToUnits = (targetUnits: number, duration: number) => {
    const story = storyRef.current
    if (!story) return

    if (storyAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(storyAnimationFrameRef.current)
    }

    const distance = Math.max(story.scrollHeight - story.clientHeight, 1)
    const startTop = story.scrollTop
    const targetTop = (targetUnits / TOTAL_STORY_SCROLL_UNITS) * distance
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      story.scrollTop = targetTop
      storyAnimationFrameRef.current = null
      return
    }

    const startTime = window.performance.now()
    const tick = (now: number) => {
      const progress = clamp01((now - startTime) / duration)
      story.scrollTop = startTop + (targetTop - startTop) * smoothStep(progress)

      if (progress < 1) {
        storyAnimationFrameRef.current = window.requestAnimationFrame(tick)
      } else {
        storyAnimationFrameRef.current = null
      }
    }

    storyAnimationFrameRef.current = window.requestAnimationFrame(tick)
  }

  useEffect(() => {
    const compare = promptCompareRef.current
    if (!compare) return

    const handlePromptWheel = (event: WheelEvent) => {
      const modeMultiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? compare.clientHeight
          : 1
      const deltaY = event.deltaY * modeMultiplier

      event.preventDefault()
      event.stopPropagation()

      const maxScrollTop = Math.max(compare.scrollHeight - compare.clientHeight, 0)
      compare.scrollTop = clamp(compare.scrollTop + deltaY, 0, maxScrollTop)
    }

    compare.addEventListener('wheel', handlePromptWheel, { passive: false })
    return () => compare.removeEventListener('wheel', handlePromptWheel)
  }, [])

  useEffect(() => {
    const measureVideoFocus = () => {
      const scene = sceneRef.current
      const diagram = diagramRef.current
      const claim = claimRef.current
      if (!scene || !diagram || !claim) return

      const sceneRect = scene.getBoundingClientRect()
      const diagramRect = diagram.getBoundingClientRect()
      const claimRect = claim.getBoundingClientRect()
      const compact = sceneRect.width <= 760
      const startWidth = compact
        ? clamp(window.innerHeight * 0.13, 82, 112)
        : clamp(window.innerHeight * 0.135, 88, 150)
      const focusTopInset = Math.max(
        claimRect.bottom - sceneRect.top + (compact ? 20 : 28),
        compact ? 64 : 76,
      )
      const focusBottomInset = compact ? 12 : 16
      const availableHeight = Math.max(
        sceneRect.height - focusTopInset - focusBottomInset,
        startWidth * (16 / 9),
      )
      const availableWidth = Math.max(sceneRect.width - 24, startWidth)
      const targetHeight = Math.min(availableHeight, availableWidth * (16 / 9))
      const focusCenter = focusTopInset + availableHeight / 2
      const startLeft = diagram.clientWidth / 2
      const startTop = diagram.clientHeight * 0.83
      const workflowLayout = getWorkflowFocusLayout(sceneRect.width, sceneRect.height)
      const workflowOriginY = diagram.clientHeight * 0.54
      const minimizedOutputCenterY = workflowOriginY
        + (startTop - workflowOriginY) * workflowLayout.scale
        + workflowLayout.shiftY
      const minimizedOutputTop = minimizedOutputCenterY
        - (startWidth * (16 / 9) * workflowLayout.scale) / 2
      const dockWidth = startWidth

      setVideoFocusMetrics({
        startLeft,
        startTop,
        targetTop: focusCenter - (diagramRect.top - sceneRect.top),
        dockLeft: startLeft + workflowLayout.shiftX,
        dockTop: minimizedOutputTop + (dockWidth * (16 / 9)) / 2,
        startWidth,
        targetWidth: targetHeight * (9 / 16),
        dockWidth,
        sceneWidth: sceneRect.width,
        sceneHeight: sceneRect.height,
      })
    }

    measureVideoFocus()
    window.addEventListener('resize', measureVideoFocus)
    return () => window.removeEventListener('resize', measureVideoFocus)
  }, [])

  const scrollUnits = scrollProgress * TOTAL_STORY_SCROLL_UNITS
  const sequenceProgress = clamp01(scrollUnits / BASE_STORY_SCROLL_UNITS)
  const videoReturn = smoothStep(revealBetween(scrollUnits, 6.1, 6.72))
  const chatPanelReveal = revealBetween(scrollUnits, 6.72, 6.94)
  const chatQuestionReveal = revealBetween(scrollUnits, 6.92, 7.1)
  const chatComposerReveal = revealBetween(scrollUnits, 7.08, 7.3)
  const nextClaimReveal = smoothStep(revealBetween(scrollUnits, 7.62, 8.02))
  const typingProgress = smoothStep(revealBetween(scrollUnits, 7.72, 8.24))
  const sendProgress = feedbackSent ? 1 : 0
  const chatFeedbackReveal = revealBetween(scrollUnits, 8.44, 8.6)
  const agentStatusIn = revealBetween(scrollUnits, 8.62, 8.76)
  const agentStatusOut = revealBetween(scrollUnits, 9.24, 9.34)
  const agentStatusReveal = agentStatusIn * (1 - agentStatusOut)
  const analysisProgress = smoothStep(revealBetween(scrollUnits, 8.84, 9.24))
  const scanProgress = smoothStep(revealBetween(scrollUnits, 8.86, 9.26))
  const issueProgress = revealBetween(scrollUnits, 9.34, 9.54)
  const agentResponseReveal = revealBetween(scrollUnits, 9.62, 9.84)
  const approveClaimReveal = smoothStep(revealBetween(scrollUnits, 9.92, 10.08))
  const storyOpenPulse = Math.sin(revealBetween(scrollUnits, 10.12, 10.26) * Math.PI)
  const promptModalIn = smoothStep(revealBetween(scrollUnits, 10.3, 10.56))
  const deletedLineProgress = revealBetween(scrollUnits, 10.86, 11.08)
  const addedLineProgress = revealBetween(scrollUnits, 11.12, 11.36)
  const approveReveal = revealBetween(scrollUnits, 11.42, 11.56)
  const approvedProgress = editApproved ? 1 : 0
  const promptModalOut = smoothStep(revealBetween(scrollUnits, 12.22, 12.42))
  const promptModalReveal = promptModalIn * (1 - promptModalOut)
  const storyUpdatedProgress = revealBetween(scrollUnits, 12.46, 12.66)
  const workflowDuplicateProgress = smoothStep(revealBetween(scrollUnits, 12.72, 13.34))
  const versionClaimReveal = smoothStep(revealBetween(scrollUnits, 12.72, 13.04))
  const chatApprovedReveal = editApproved
    ? smoothStep(revealBetween(scrollUnits, 12.44, 12.62))
    : 0
  const storyEditProgress = promptModalIn * (1 - storyUpdatedProgress)
  const sendReady = typingProgress > 0.985 && !feedbackSent
  const storyReviewReady = feedbackSent
    && !storyReviewOpened
    && scrollUnits >= NODE_REVIEW_GATE_UNITS - 0.04
  const approveReady = storyReviewOpened
    && !editApproved
    && scrollUnits >= APPROVE_GATE_UNITS - 0.04
  const typedCharacterCount = Math.floor(feedbackText.length * typingProgress)
  const typedFeedback = feedbackText.slice(0, typedCharacterCount)
  const composerPlaceholderOpacity = Math.max(
    1 - revealBetween(typingProgress, 0, 0.08),
    sendProgress,
  )
  const scanEmphasis = revealBetween(scanProgress, 0, 0.08)
    * (1 - revealBetween(scanProgress, 0.92, 1))

  const videoShouldPlay = sequenceProgress >= 0.83 && videoReturn < 0.05
  const videoShouldReset = sequenceProgress < 0.76

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (videoShouldPlay) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
      if (videoShouldReset) video.currentTime = 0
    }
  }, [videoShouldPlay, videoShouldReset])

  const heroCopyExit = revealBetween(sequenceProgress, 0.05, 0.24)
  const heroVisualExit = revealBetween(sequenceProgress, 0.08, 0.2)
  const introReveal = revealBetween(sequenceProgress, 0.25, 0.31)

  const briefReveal = revealBetween(sequenceProgress, 0.21, 0.27)
  const briefToStory = revealBetween(sequenceProgress, 0.27, 0.31)
  const storyReveal = revealBetween(sequenceProgress, 0.31, 0.36)
  const storyToCharacter = revealBetween(sequenceProgress, 0.36, 0.39)
  const characterReveal = revealBetween(sequenceProgress, 0.39, 0.43)
  const storyToShots = revealBetween(sequenceProgress, 0.42, 0.45)
  const shotsReveal = revealBetween(sequenceProgress, 0.45, 0.49)
  const characterToPrompt = revealBetween(sequenceProgress, 0.49, 0.53)
  const shotsToPrompt = revealBetween(sequenceProgress, 0.53, 0.56)
  const promptReveal = revealBetween(sequenceProgress, 0.56, 0.61)
  const promptToVideo = revealBetween(sequenceProgress, 0.61, 0.64)
  const videoReveal = revealBetween(sequenceProgress, 0.64, 0.69)
  const videoToOutput = revealBetween(sequenceProgress, 0.69, 0.73)
  const outputReveal = revealBetween(sequenceProgress, 0.73, 0.79)
  const videoFocusIn = smoothStep(revealBetween(sequenceProgress, 0.81, 0.98))
  const videoPresentationFocus = videoFocusIn * (1 - videoReturn)
  const workflowFocusLayout = getWorkflowFocusLayout(
    videoFocusMetrics?.sceneWidth ?? 0,
    videoFocusMetrics?.sceneHeight ?? 0,
  )
  const workflowShiftX = workflowFocusLayout.shiftX * videoFocusIn
  const workflowShiftY = workflowFocusLayout.shiftY * videoFocusIn
  const workflowScale = 1 + (workflowFocusLayout.scale - 1) * videoFocusIn
  const baseWorkflowOpacity = 1 + (workflowFocusLayout.opacity - 1) * videoFocusIn
  const workflowAnalysisEmphasis = Math.max(scanEmphasis, issueProgress * 0.82)
  const workflowOpacity = baseWorkflowOpacity
    + (0.78 - baseWorkflowOpacity) * workflowAnalysisEmphasis
  const workflowGrayscale = videoFocusIn * 0.86 * (1 - workflowAnalysisEmphasis * 0.9)
  const workflowBlur = videoFocusIn * 0.8 * (1 - workflowAnalysisEmphasis)
  const workflowComparisonLayout = getWorkflowComparisonLayout(
    videoFocusMetrics?.sceneWidth ?? 0,
    videoFocusMetrics?.sceneHeight ?? 0,
  )
  const previousWorkflowShiftX = workflowShiftX
    + (workflowComparisonLayout.previousShiftX - workflowShiftX) * workflowDuplicateProgress
  const previousWorkflowShiftY = workflowShiftY
    + (workflowComparisonLayout.shiftY - workflowShiftY) * workflowDuplicateProgress
  const previousWorkflowScale = workflowScale
    + (workflowComparisonLayout.scale * 0.82 - workflowScale) * workflowDuplicateProgress
  const previousWorkflowOpacity = workflowOpacity
    + (0.32 - workflowOpacity) * workflowDuplicateProgress
  const previousWorkflowGrayscale = workflowGrayscale
    + (1 - workflowGrayscale) * workflowDuplicateProgress
  const previousWorkflowBlur = workflowBlur
    + (0.35 - workflowBlur) * workflowDuplicateProgress
  const nextWorkflowShiftX = workflowComparisonLayout.previousShiftX
    + (workflowComparisonLayout.nextShiftX - workflowComparisonLayout.previousShiftX)
      * easeOutBack(workflowDuplicateProgress)
  const nextWorkflowScale = workflowComparisonLayout.scale
    * (0.9 + workflowDuplicateProgress * 0.1)
  const videoTopBeforeDock = videoFocusMetrics
    ? videoFocusMetrics.startTop + (videoFocusMetrics.targetTop - videoFocusMetrics.startTop) * videoFocusIn
    : undefined
  const videoWidthBeforeDock = videoFocusMetrics
    ? videoFocusMetrics.startWidth + (videoFocusMetrics.targetWidth - videoFocusMetrics.startWidth) * videoFocusIn
    : undefined
  const focusedVideoLeft = videoFocusMetrics
    ? videoFocusMetrics.startLeft + (videoFocusMetrics.dockLeft - videoFocusMetrics.startLeft) * videoReturn
    : undefined
  const focusedVideoTop = videoFocusMetrics
    ? (videoTopBeforeDock ?? videoFocusMetrics.startTop)
      + (videoFocusMetrics.dockTop - (videoTopBeforeDock ?? videoFocusMetrics.startTop)) * videoReturn
    : undefined
  const focusedVideoWidth = videoFocusMetrics
    ? (videoWidthBeforeDock ?? videoFocusMetrics.startWidth)
      + (videoFocusMetrics.dockWidth - (videoWidthBeforeDock ?? videoFocusMetrics.startWidth)) * videoReturn
    : undefined
  const agentStatusLabel = scrollUnits >= 8.84
    ? 'Analyzing workflow…'
    : 'Syncing feedback…'
  const chatPanelStyle = popInStyle(chatPanelReveal, 44, 0)
  const promptModalStyle = popInStyle(promptModalReveal, -90, -54)

  const handleSendFeedback = () => {
    if (!sendReady) return

    feedbackSentRef.current = true
    setFeedbackSent(true)
    animateStoryToUnits(NODE_REVIEW_GATE_UNITS, 2600)
  }

  const handleOpenStoryReview = () => {
    if (!storyReviewReady) return

    storyReviewOpenedRef.current = true
    setStoryReviewOpened(true)
    animateStoryToUnits(MODAL_OPEN_UNITS, 720)
  }

  const handleApproveEdit = () => {
    if (!approveReady) return

    editApprovedRef.current = true
    setEditApproved(true)
    animateStoryToUnits(WORKFLOW_VERSION_END_UNITS, 2800)
  }

  return (
    <>
      <Helmet>
        <title>Orchia Demo 3</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className={styles.page}>
        <StudioSiteHeader sticky />

        <main
          className={styles.story}
          ref={storyRef}
          tabIndex={0}
          aria-label="Scroll through Orchia's end-to-end workflow story"
        >
          <div className={styles.sceneViewport} ref={sceneRef}>
            <section className={styles.heroScene} aria-hidden={heroCopyExit >= 1}>
              <div
                className={styles.heroCopy}
                style={{
                  opacity: 1 - heroCopyExit,
                  transform: `translate3d(0, ${heroCopyExit * -42}vh, 0)`,
                }}
              >
                <p className={styles.heroKicker}>Other tools automate generation.</p>
                <h1 className={styles.heroTitle}>
                  Orchia automates how your content
                  <span>gets better over time.</span>
                </h1>
              </div>

              <div
                className={styles.heroVisual}
                style={{
                  opacity: 1 - heroVisualExit,
                  transform: `translate3d(0, ${heroVisualExit * -9}vh, 0) scale(${1 - heroVisualExit * 0.04})`,
                }}
              >
                {sequenceProgress < 0.25 ? <HeroFeedbackLoop /> : null}
              </div>
            </section>

            <section className={styles.workflowScene} aria-label="End-to-end agent workflow">
              <p
                className={styles.workflowClaim}
                ref={claimRef}
                style={{
                  opacity: introReveal,
                  transform: `translate3d(0, ${(1 - introReveal) * 12}px, 0)`,
                }}
              >
                <span className={styles.workflowClaimDot} aria-hidden="true">●</span>
                <span className={styles.workflowClaimCopy}>
                  <span
                    className={styles.workflowClaimText}
                    style={{
                      opacity: 1 - nextClaimReveal,
                      transform: `translate3d(0, ${nextClaimReveal * -9}px, 0)`,
                    }}
                  >
                    Orchia orchestrates specialized agents to create each video, end to end.
                  </span>
                  <span
                    className={styles.workflowClaimText}
                    style={{
                      opacity: nextClaimReveal * (1 - approveClaimReveal),
                      transform: `translate3d(0, ${(1 - nextClaimReveal) * 9 - approveClaimReveal * 9}px, 0)`,
                    }}
                  >
                    Add high-level feedback, then send it. Orchia finds the affected step automatically.
                  </span>
                  <span
                    className={styles.workflowClaimText}
                    style={{
                      opacity: approveClaimReveal * (1 - versionClaimReveal),
                      transform: `translate3d(0, ${(1 - approveClaimReveal) * 9 - versionClaimReveal * 9}px, 0)`,
                    }}
                  >
                    Open the highlighted Story Agent, review the proposed direction, then approve it.
                  </span>
                  <span
                    className={styles.workflowClaimText}
                    style={{
                      opacity: versionClaimReveal,
                      transform: `translate3d(0, ${(1 - versionClaimReveal) * 9}px, 0)`,
                    }}
                  >
                    Approved feedback creates a new workflow version while preserving the original.
                  </span>
                </span>
              </p>

              <div className={styles.workflowDiagram} ref={diagramRef}>
                <div
                  className={styles.workflowContext}
                  style={{
                    opacity: previousWorkflowOpacity,
                    filter: `grayscale(${previousWorkflowGrayscale}) blur(${previousWorkflowBlur}px)`,
                    transform: `translate3d(${previousWorkflowShiftX}px, ${previousWorkflowShiftY}px, 0) scale(${previousWorkflowScale})`,
                  }}
                >
                  <svg
                    className={styles.workflowConnections}
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <Connector path="M500 115L500 160" progress={briefToStory} arrowX={500} arrowY={160} />
                    <Connector path="M500 235C500 270 315 260 315 288" progress={storyToCharacter} arrowX={315} arrowY={288} />
                    <Connector path="M500 235C500 270 685 260 685 288" progress={storyToShots} arrowX={685} arrowY={288} />
                    <Connector path="M315 365C315 395 500 392 500 418" progress={characterToPrompt} arrowX={500} arrowY={418} />
                    <Connector path="M685 365C685 395 500 392 500 418" progress={shotsToPrompt} arrowX={500} arrowY={418} />
                    <Connector path="M500 495L500 548" progress={promptToVideo} arrowX={500} arrowY={548} />
                    <Connector path="M500 625L500 680" progress={videoToOutput} arrowX={500} arrowY={680} />
                  </svg>

                  <WorkflowNode
                    className={styles.nodeBrief}
                    progress={briefReveal}
                    index="01"
                    label="Input"
                    title="Creative Brief"
                    detail="Goal · audience · references"
                    accent="#ff4fa3"
                    scanProgress={scanProgress}
                    dimProgress={issueProgress}
                  />
                  <WorkflowNode
                    className={styles.nodeStory}
                    progress={storyReveal}
                    index="02"
                    label="Agent 01"
                    title="Story Agent"
                    detail="Narrative · beats · pacing"
                    accent="#5f8cff"
                    scanProgress={scanProgress}
                    issueProgress={issueProgress}
                    editProgress={storyEditProgress}
                    editPulse={storyOpenPulse}
                    reviewReady={storyReviewReady}
                    onReview={handleOpenStoryReview}
                  />
                  <WorkflowNode
                    className={styles.nodeCharacter}
                    progress={characterReveal}
                    index="03"
                    label="Agent 02"
                    title="Character & Style"
                    detail="Identity · continuity · look"
                    accent="#9f7aea"
                    scanProgress={scanProgress}
                    dimProgress={issueProgress}
                  />
                  <WorkflowNode
                    className={styles.nodeShots}
                    progress={shotsReveal}
                    index="04"
                    label="Agent 03"
                    title="Shot Planner"
                    detail="Frames · camera · direction"
                    accent="#f4b83f"
                    scanProgress={scanProgress}
                    dimProgress={issueProgress}
                  />
                  <WorkflowNode
                    className={styles.nodePrompt}
                    progress={promptReveal}
                    index="05"
                    label="Agent 04"
                    title="Prompt Composer"
                    detail="Production-ready prompts"
                    accent="#f45136"
                    scanProgress={scanProgress}
                    dimProgress={issueProgress}
                  />
                  <WorkflowNode
                    className={styles.nodeVideo}
                    progress={videoReveal}
                    index="06"
                    label="Agent 05"
                    title="Video Generation"
                    detail="Motion · edit · assembly"
                    accent="#cfff3d"
                    active={scrollUnits < 8.62}
                    scanProgress={scanProgress}
                    dimProgress={issueProgress}
                  />
                  <article
                    className={styles.workflowMiniOutput}
                    style={{
                      opacity: workflowDuplicateProgress,
                      filter: `blur(${(1 - workflowDuplicateProgress) * 5}px)`,
                      transform: `translateX(-50%) translate3d(0, ${(1 - workflowDuplicateProgress) * 18}px, 0) scale(${0.92 + workflowDuplicateProgress * 0.08})`,
                    }}
                    aria-hidden={workflowDuplicateProgress === 0}
                  >
                    <img src={outputMedia.poster} alt="" />
                    <span>Final video</span>
                  </article>
                </div>

                <div
                  className={`${styles.workflowContext} ${styles.workflowVersionNext}`}
                  aria-hidden={workflowDuplicateProgress === 0}
                  style={{
                    opacity: workflowDuplicateProgress,
                    filter: `brightness(${0.9 + workflowDuplicateProgress * 0.1})`,
                    transform: `translate3d(${nextWorkflowShiftX}px, ${workflowComparisonLayout.shiftY}px, 0) scale(${nextWorkflowScale})`,
                  }}
                >
                  <svg
                    className={styles.workflowConnections}
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <Connector path="M500 115L500 160" progress={1} arrowX={500} arrowY={160} />
                    <Connector path="M500 235C500 270 315 260 315 288" progress={1} arrowX={315} arrowY={288} />
                    <Connector path="M500 235C500 270 685 260 685 288" progress={1} arrowX={685} arrowY={288} />
                    <Connector path="M315 365C315 395 500 392 500 418" progress={1} arrowX={500} arrowY={418} />
                    <Connector path="M685 365C685 395 500 392 500 418" progress={1} arrowX={500} arrowY={418} />
                    <Connector path="M500 495L500 548" progress={1} arrowX={500} arrowY={548} />
                    <Connector path="M500 625L500 680" progress={1} arrowX={500} arrowY={680} />
                  </svg>

                  <WorkflowNode
                    className={styles.nodeBrief}
                    progress={1}
                    index="01"
                    label="Input"
                    title="Creative Brief"
                    detail="Goal · audience · references"
                    accent="#ff4fa3"
                  />
                  <WorkflowNode
                    className={styles.nodeStory}
                    progress={1}
                    index="02"
                    label="Agent 01"
                    title="Story Agent"
                    detail="Faster hook · two-beat setup · stronger reveal"
                    accent="#5f8cff"
                    issueProgress={1}
                    updatedProgress={1}
                  />
                  <WorkflowNode
                    className={styles.nodeCharacter}
                    progress={1}
                    index="03"
                    label="Agent 02"
                    title="Character & Style"
                    detail="Identity · continuity · look"
                    accent="#9f7aea"
                  />
                  <WorkflowNode
                    className={styles.nodeShots}
                    progress={1}
                    index="04"
                    label="Agent 03"
                    title="Shot Planner"
                    detail="Frames · camera · direction"
                    accent="#f4b83f"
                  />
                  <WorkflowNode
                    className={styles.nodePrompt}
                    progress={1}
                    index="05"
                    label="Agent 04"
                    title="Prompt Composer"
                    detail="Production-ready prompts"
                    accent="#f45136"
                  />
                  <WorkflowNode
                    className={styles.nodeVideo}
                    progress={1}
                    index="06"
                    label="Agent 05"
                    title="Video Generation"
                    detail="Motion · edit · assembly"
                    accent="#cfff3d"
                  />
                  <article className={styles.workflowMiniOutput}>
                    <img src={outputMedia.poster} alt="" />
                    <span>Final video</span>
                  </article>
                </div>

                <div
                  className={`${styles.workflowVersionTag} ${styles.workflowVersionTagPrevious}`}
                  style={{
                    left: `calc(50% + ${workflowComparisonLayout.previousShiftX}px)`,
                    opacity: workflowDuplicateProgress * 0.72,
                  }}
                  aria-hidden={workflowDuplicateProgress === 0}
                >
                  <span>Version 1</span>
                  <small>Previous</small>
                </div>
                <div
                  className={`${styles.workflowVersionTag} ${styles.workflowVersionTagNext}`}
                  style={{
                    left: `calc(50% + ${workflowComparisonLayout.nextShiftX}px)`,
                    opacity: workflowDuplicateProgress,
                  }}
                  aria-hidden={workflowDuplicateProgress === 0}
                >
                  <span>Version 2</span>
                  <small>Updated</small>
                </div>

                <div
                  className={styles.outputAnchor}
                  aria-hidden={outputReveal === 0}
                  style={{
                    left: focusedVideoLeft,
                    top: focusedVideoTop,
                    width: focusedVideoWidth,
                    opacity: 1 - workflowDuplicateProgress,
                    filter: `grayscale(${workflowDuplicateProgress})`,
                    pointerEvents: videoPresentationFocus > 0.9 && workflowDuplicateProgress < 0.05 ? 'auto' : 'none',
                  }}
                >
                  <article
                    className={styles.outputNode}
                    style={revealContentStyle(outputReveal)}
                  >
                    <div
                      className={styles.outputHeader}
                      style={{
                        opacity: 1 - videoPresentationFocus,
                        transform: `translate3d(0, ${videoPresentationFocus * -10}px, 0)`,
                      }}
                    >
                      <div>
                        <span>Output 01</span>
                        <strong>Final video</strong>
                      </div>
                      <span className={styles.outputStatus}>Ready</span>
                    </div>
                    <video
                      ref={videoRef}
                      src={outputMedia.src}
                      poster={outputMedia.poster}
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label="Orchia generated final video"
                    />
                  </article>
                </div>
              </div>

              <aside
                className={styles.chatPanel}
                aria-hidden={chatPanelReveal === 0}
                style={{
                  ...chatPanelStyle,
                  opacity: chatPanelReveal,
                  filter: `blur(${(1 - chatPanelReveal) * 5}px)`,
                  pointerEvents: chatPanelReveal > 0.94 ? 'auto' : 'none',
                }}
              >
                <header className={styles.chatHeader}>
                  <span className={styles.chatAvatar}>O</span>
                  <div>
                    <span className={styles.chatTitle}>
                      {chatApprovedReveal > 0.55 ? 'Version 2 created' : 'Review version 1'}
                    </span>
                    <span className={styles.chatSubtitle}>
                      {chatApprovedReveal > 0.55 ? 'Orchia · feedback approved' : 'Orchia · ready for feedback'}
                    </span>
                  </div>
                  <span className={styles.chatPresence} aria-label="Online" />
                </header>

                <div className={styles.chatBody}>
                  <p
                    className={styles.chatQuestion}
                    style={popInStyle(chatQuestionReveal, 0, 14)}
                  >
                    What would you change?
                  </p>

                  <div
                    className={styles.chatFeedback}
                    style={popInStyle(chatFeedbackReveal, 14, 12)}
                  >
                    <span>You</span>
                    <p>{feedbackText}</p>
                  </div>

                  <div className={styles.chatAgentActivity} aria-live="polite">
                    <div
                      className={styles.chatAgentStatus}
                      style={popInStyle(agentStatusReveal, 0, 10)}
                      aria-hidden={agentStatusReveal === 0}
                    >
                      <span
                        className={styles.chatStatusSpinner}
                        style={{ transform: `rotate(${analysisProgress * 540}deg)` }}
                        aria-hidden="true"
                      />
                      <span>{agentStatusLabel}</span>
                    </div>

                    <div
                      className={styles.chatAgentResponse}
                      style={popInStyle(agentResponseReveal, 0, 12)}
                      aria-hidden={agentResponseReveal === 0}
                    >
                      <span className={styles.chatReplyAvatar}>O</span>
                      <div className={styles.chatAgentResponseBody}>
                        <p>
                          <span className={styles.chatResponseTitle}>Found it in Story Agent.</span>
                          <span className={styles.chatResponseCopy}>
                            {chatApprovedReveal > 0
                              ? 'The approved direction is creating Version 2 beside the original.'
                              : 'Select the highlighted node to review the new opening direction before anything changes.'}
                          </span>
                        </p>
                        {chatApprovedReveal > 0 ? (
                          <button
                            className={styles.chatApprovedStatus}
                            type="button"
                            disabled
                            style={popInStyle(chatApprovedReveal, 0, 8)}
                            aria-live="polite"
                          >
                            <span aria-hidden="true">✓</span>
                            Approved
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={styles.chatComposer}
                  style={popInStyle(chatComposerReveal, 0, 12)}
                >
                  <span className={styles.chatComposerCopy}>
                    <span
                      className={styles.chatComposerPlaceholder}
                      style={{ opacity: composerPlaceholderOpacity }}
                    >
                      Reply with feedback…
                    </span>
                    <span
                      className={styles.chatComposerValue}
                      style={{ opacity: typingProgress > 0 ? 1 - sendProgress : 0 }}
                    >
                      {typedFeedback}
                      <span
                        className={styles.chatCaret}
                        style={{ opacity: typingProgress > 0 && sendProgress < 0.7 ? 1 : 0 }}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <button
                    className={`${styles.chatSend} ${sendReady ? styles.chatSendReady : ''} ${feedbackSent ? styles.chatSendSent : ''}`}
                    type="button"
                    onClick={handleSendFeedback}
                    disabled={!sendReady}
                    aria-label={feedbackSent ? 'Feedback sent' : 'Send feedback and continue'}
                    aria-live="polite"
                  >
                    {feedbackSent ? 'Sent' : 'Send'}
                  </button>
                </div>
              </aside>

              <div
                className={styles.promptModalBackdrop}
                style={{ opacity: promptModalReveal * 0.78 }}
                aria-hidden="true"
              />

              <div className={styles.promptModalLayer} aria-hidden={promptModalReveal === 0}>
                <article
                  className={styles.promptModal}
                  role="dialog"
                  aria-label="Review Story Agent direction update"
                  style={{
                    ...promptModalStyle,
                    pointerEvents: promptModalReveal > 0.94 ? 'auto' : 'none',
                  }}
                >
                  <header className={styles.promptModalHeader}>
                    <div>
                      <span className={styles.promptModalIcon} aria-hidden="true">✦</span>
                      <div>
                        <span className={styles.promptModalTitle}>Story direction update</span>
                        <span className={styles.promptModalSubtitle}>Suggested from your feedback</span>
                      </div>
                    </div>
                    <span className={styles.promptModalState}>Review</span>
                  </header>

                  <div className={styles.promptFileBar}>
                    <span>Opening direction</span>
                    <span className={styles.promptScrollHint}>Scroll here to inspect · Scroll outside to continue</span>
                    <span>One instruction updated</span>
                  </div>

                  <div
                    className={styles.promptCompareViewport}
                    ref={promptCompareRef}
                    tabIndex={promptModalReveal > 0.94 ? 0 : -1}
                    aria-label="Scrollable story direction comparison"
                  >
                    <div className={styles.promptCompare}>
                      <section className={styles.promptPane} aria-label="Current story direction">
                        <header className={styles.promptPaneHeader}>
                          <div>
                            <span className={styles.promptPaneTitle}>Before</span>
                            <span className={styles.promptPaneSubtitle}>How the opening currently works</span>
                          </div>
                          <span className={styles.promptPaneBadge}>Current</span>
                        </header>
                        <div className={styles.promptPaneBody}>
                          {promptBeforeLines.map((line, index) => {
                            const [label, ...instructionParts] = line.split(' — ')
                            const instruction = instructionParts.join(' — ')

                            return (
                              <div
                                className={`${styles.promptLine} ${index === 6 ? styles.promptLineRemoved : ''}`}
                                key={`before-${index}`}
                              >
                                <div className={styles.promptInstructionHeader}>
                                  <span>{label}</span>
                                  {index === 6 ? (
                                    <span
                                      className={styles.promptChangeLabel}
                                      style={{ opacity: deletedLineProgress }}
                                    >
                                      Needs adjustment
                                    </span>
                                  ) : null}
                                </div>
                                <p>
                                  {index === 6 ? (
                                    <>
                                      Open{' '}
                                      <mark
                                        className={styles.promptTextRemoved}
                                        style={{
                                          backgroundColor: `rgb(244 81 54 / ${deletedLineProgress * 0.2})`,
                                          textDecorationColor: `rgb(244 81 54 / ${deletedLineProgress * 0.9})`,
                                        }}
                                      >
                                        by establishing the world and building tension gradually
                                      </mark>
                                      , then land the reveal.
                                    </>
                                  ) : instruction}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </section>

                      <section className={styles.promptPane} aria-label="Suggested story direction">
                        <header className={styles.promptPaneHeader}>
                          <div>
                            <span className={styles.promptPaneTitle}>After</span>
                            <span className={styles.promptPaneSubtitle}>How Orchia will improve it</span>
                          </div>
                          <span className={`${styles.promptPaneBadge} ${styles.promptPaneBadgeAfter}`}>Suggested</span>
                        </header>
                        <div className={styles.promptPaneBody}>
                          {promptAfterLines.map((line, index) => {
                            const [label, ...instructionParts] = line.split(' — ')
                            const instruction = instructionParts.join(' — ')

                            return (
                              <div
                                className={`${styles.promptLine} ${index === 6 ? styles.promptLineAdded : ''}`}
                                key={`after-${index}`}
                              >
                                <div className={styles.promptInstructionHeader}>
                                  <span>{label}</span>
                                  {index === 6 ? (
                                    <span
                                      className={`${styles.promptChangeLabel} ${styles.promptChangeLabelAdded}`}
                                      style={{ opacity: addedLineProgress }}
                                    >
                                      Suggested improvement
                                    </span>
                                  ) : null}
                                </div>
                                <p>
                                  {index === 6 ? (
                                    <>
                                      Open{' '}
                                      <mark
                                        className={styles.promptTextAdded}
                                        style={{
                                          backgroundColor: `rgb(86 211 100 / ${addedLineProgress * 0.22})`,
                                          boxShadow: `inset 0 -1px 0 rgb(86 211 100 / ${addedLineProgress * 0.6})`,
                                        }}
                                      >
                                        on conflict in the first 2 seconds, compress setup into two beats
                                      </mark>
                                      , then land the reveal
                                      <mark
                                        className={styles.promptTextAdded}
                                        style={{
                                          backgroundColor: `rgb(86 211 100 / ${addedLineProgress * 0.22})`,
                                          boxShadow: `inset 0 -1px 0 rgb(86 211 100 / ${addedLineProgress * 0.6})`,
                                        }}
                                      >
                                        {' '}on a high-contrast visual beat
                                      </mark>
                                      .
                                    </>
                                  ) : instruction}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </section>
                    </div>
                  </div>

                  <footer className={styles.promptModalFooter}>
                    <span>Nothing changes until you approve this direction.</span>
                    <div className={styles.promptApproveActions}>
                      <button
                        className={`${styles.promptApprove} ${approveReady ? styles.promptApproveReady : ''} ${approvedProgress > 0.62 ? styles.promptApproveApproved : ''}`}
                        type="button"
                        onClick={handleApproveEdit}
                        disabled={!approveReady}
                        style={{
                          opacity: approveReveal,
                          filter: `blur(${(1 - approveReveal) * 4}px)`,
                          transform: `translate3d(0, ${(1 - approveReveal) * 8}px, 0) scale(${0.92 + approveReveal * 0.08})`,
                        }}
                        aria-label="Approve the proposed Story Agent direction"
                        aria-live="polite"
                      >
                        {approvedProgress > 0.62 ? 'Approved' : 'Approve edit'}
                      </button>
                    </div>
                  </footer>
                </article>
              </div>
            </section>
          </div>

          <div className={styles.scrollTrack} aria-hidden="true" />
        </main>
      </div>
    </>
  )
}
