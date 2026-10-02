import {
  type CSSProperties,
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { SHOWCASE_VIDEOS } from '../lib/showcaseVideos'
import { useCachedVideoSource } from '../lib/useCachedVideoSource'

import PrivateAccessModal from './PrivateAccessModal'
import SiteFooter from './SiteFooter'
import SocialVideoScroller, { type SocialVideoItem } from './SocialVideoScroller'
import StudioSiteHeader from './StudioSiteHeader'
import VideoBetaPricing from './VideoBetaPricing'
import { VIDEO_PACKAGES } from './videoPackages'
import filmStyles from './home-film-page.module.css'
import styles from './home-v2-page.module.css'

const COMPANY_URL = 'https://succulent.co'
const LOOP_DURATION_MS = 28_000
const FINAL_VIDEO_URL = SHOWCASE_VIDEOS.flowerpot.preview

// Add hero videos here with a unique id, name, full URL, and poster image.
const HERO_VIDEOS: readonly (SocialVideoItem & { name: string })[] = [
  {
    id: 'orchia-promotion-video-37-1',
    name: 'Orchia Promotional Video',
    src: SHOWCASE_VIDEOS.promotion.preview,
    fullSrc: SHOWCASE_VIDEOS.promotion.full,
    poster: '/videos/orchia-promotion-video-37-1.jpg',
    handle: '@orchia.studio',
    caption: 'Orchia Promotional Video · one idea becomes a vertical world.',
  },
  {
    id: '07-14-import',
    name: 'Your brother wants an imported flowerpot',
    src: SHOWCASE_VIDEOS.flowerpot.preview,
    fullSrc: SHOWCASE_VIDEOS.flowerpot.full,
    poster: '/data-slides/thumbnails/07-14-import.jpg',
    handle: '@orchia.studio',
    caption: '1.45M views · 67% watched to the end.',
  },
  {
    id: '07-23-returned-with-99-doubles',
    name: 'I returned with 99 doubles to reclaim my home',
    src: SHOWCASE_VIDEOS.doubles.preview,
    fullSrc: SHOWCASE_VIDEOS.doubles.full,
    poster: '/data-slides/thumbnails/07-23.jpg',
    handle: '@orchia.studio',
    caption: '633K views · 40% watched to the end.',
  },
  {
    id: 'BrotherNeedBetterPot',
    name: 'BrotherNeedBetterPot',
    src: 'https://media.lingyizhou.com/Compressed/BrotherNeedBetterPot-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/BrotherNeedBetterPot.MOV',
    poster: '/videos/BrotherNeedBetterPot-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'ForYou',
    name: 'ForYou',
    src: 'https://media.lingyizhou.com/Compressed/ForYou-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/ForYou.MOV',
    poster: '/videos/ForYou-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'GardenMaster',
    name: 'GardenMaster',
    src: SHOWCASE_VIDEOS.doubles.preview,
    fullSrc: SHOWCASE_VIDEOS.doubles.full,
    poster: '/videos/GardenMaster-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'LoveWho',
    name: 'LoveWho',
    src: 'https://media.lingyizhou.com/Compressed/LoveWho-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/LoveWho.MP4',
    poster: '/videos/LoveWho-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'NameBook',
    name: 'NameBook',
    src: 'https://media.lingyizhou.com/Compressed/NameBook-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/NameBook.MP4',
    poster: '/videos/NameBook-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'Yuna-Day-One-clean',
    name: 'Yuna · Day One',
    src: SHOWCASE_VIDEOS.yuna.preview,
    fullSrc: SHOWCASE_VIDEOS.yuna.full,
    poster: SHOWCASE_VIDEOS.yuna.poster,
    handle: '@orchia.studio',
    caption: 'Yuna · Day One.',
  },
  {
    id: 'seattle-home-tour',
    name: 'Seattle Home Tour',
    src: SHOWCASE_VIDEOS.seattleHomeTour.preview,
    fullSrc: SHOWCASE_VIDEOS.seattleHomeTour.full,
    poster: SHOWCASE_VIDEOS.seattleHomeTour.poster,
    handle: '@orchia.studio',
    caption: 'A Seattle home tour.',
  },
]

type LeadDetails = {
  website: string
}

type LeadSubmitStatus = 'idle' | 'sending' | 'error'

type NodeState = 'queued' | 'running' | 'done'

const WORKFLOW_NODES = [
  {
    id: 'research',
    label: 'Company research',
    detail: 'Business, audience, and offer',
    positionClass: 'nodeResearch',
    start: 2_000,
    complete: 7_000,
  },
  {
    id: 'visuals',
    label: 'Visual concepts',
    detail: 'Looks, characters, and worlds',
    positionClass: 'nodeVisuals',
    start: 7_300,
    complete: 10_200,
  },
  {
    id: 'ideas',
    label: 'Creative ideas',
    detail: 'Culture shifts and social hooks',
    positionClass: 'nodeIdeas',
    start: 10_500,
    complete: 13_200,
  },
  {
    id: 'story',
    label: 'Story plan',
    detail: 'Hook, scenes, and payoff',
    positionClass: 'nodeStory',
    start: 13_500,
    complete: 15_900,
  },
  {
    id: 'video',
    label: 'Final video',
    detail: 'Custom promotion video',
    positionClass: 'nodeOutput',
    start: 16_200,
    complete: 17_400,
  },
] as const

const EDGE_PATHS = [
  'M 142 286 C 210 286, 220 150, 292 150',
  'M 354 150 C 416 150, 416 364, 484 364',
  'M 546 364 C 610 364, 610 150, 674 150',
  'M 736 150 C 804 150, 810 286, 876 286',
] as const

function getNodeState(index: number, elapsed: number): NodeState {
  const node = WORKFLOW_NODES[index]
  if (elapsed >= node.complete) return 'done'
  if (elapsed >= node.start) return 'running'
  return 'queued'
}

function stateClass(state: NodeState) {
  if (state === 'running') return styles.nodeRunning
  if (state === 'done') return styles.nodeDone
  return styles.nodeQueued
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m15.6 15.6 4.2 4.2" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8c.8 5.1 4 8.3 9.1 9.2-5.1.8-8.3 4-9.1 9.1-.9-5.1-4-8.3-9.2-9.1 5.2-.9 8.3-4.1 9.2-9.2Z" />
    </svg>
  )
}

function ResearchBrowser({ visible, runKey }: { visible: boolean; runKey: number }) {
  return (
    <div
      className={`${styles.researchBrowser} ${visible ? styles.popupVisible : ''}`}
      aria-hidden={!visible}
      key={`browser-${runKey}`}
    >
      <div className={styles.popupToolbar}>
        <span className={styles.windowDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>Research browser</span>
        <span className={styles.liveChip}>Reading</span>
      </div>

      <div className={styles.browserViewport}>
        <div className={styles.browserScroll}>
          <div className={styles.searchAddress}>
            <SearchIcon />
            <span>Succulent Workshop company audience products</span>
          </div>

          <div className={styles.searchResult}>
            <small>succulent.co</small>
            <strong>Succulent Workshop — Living sculptures for small spaces.</strong>
            <p>Hand-arranged succulent worlds, plant workshops, and thoughtful living gifts.</p>
          </div>

          <div className={styles.searchResult}>
            <small>Home and culture journal</small>
            <strong>Why tiny indoor gardens are becoming a calming daily ritual</strong>
            <p>Small-space gardening brings nature, craft, and personality into everyday rooms.</p>
          </div>

          <div className={styles.fakeCompanySite}>
            <div className={styles.fakeSiteNav}>
              <strong>Succulent Workshop</strong>
              <span>Shop · Workshops · Care notes</span>
            </div>
            <div className={styles.fakeSiteHero}>
              <div>
                <span>Made by hand</span>
                <h4>A little desert world for your space.</h4>
                <p>Sculptural succulent arrangements made for desks, gifts, and small homes.</p>
              </div>
              <div className={styles.fakeCharacter} aria-hidden="true">
                <img src="/brand/orchia-succulent-mascot-concept-v1.png" alt="" />
              </div>
            </div>
            <div className={styles.fakeSiteCards}>
              <span>Hand-arranged</span>
              <span>Local workshops</span>
              <span>Simple plant care</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResearchNotes({ visible }: { visible: boolean }) {
  return (
    <aside
      className={`${styles.researchNotes} ${visible ? styles.popupVisible : ''}`}
      aria-hidden={!visible}
    >
      <div className={styles.notesHeader}>
        <span className={styles.notesIcon}>
          <SparkIcon />
        </span>
        <div>
          <strong>Research notes</strong>
          <small>Building the creative brief</small>
        </div>
      </div>
      <ul>
        <li>
          <span>Company</span>
          A plant studio creating sculptural succulent arrangements and workshops.
        </li>
        <li>
          <span>Audience</span>
          Plant lovers, design-minded gift buyers, and small-space decorators.
        </li>
        <li>
          <span>Creative opening</span>
          Reveal one handmade pot as a tiny living world with its own character.
        </li>
        <li>
          <span>Culture signals</span>
          Biophilic design, calming craft, cozy hobbies, and desk-sized nature.
        </li>
      </ul>
      <div className={styles.notesCursor} aria-hidden="true" />
    </aside>
  )
}

const VISUAL_CONCEPTS = [
  {
    src: '/demo/feature-4/reference/luxury-greenhouse-layout.jpg',
    label: 'Premium greenhouse world',
  },
  {
    src: '/demo/feature-4/reference/character-lineup.jpg',
    label: 'Succulent character family',
  },
  {
    src: '/brand/orchia-succulent-mascot-concept-v1.png',
    label: 'Living brand symbol',
  },
] as const

const STORY_FRAMES = [
  { src: '/demo/feature-4/shots/shot-1.jpg', label: 'Hook' },
  { src: '/demo/feature-4/shots/shot-4.jpg', label: 'Reveal' },
  { src: '/demo/feature-4/shots/shot-6.jpg', label: 'Turn' },
  { src: '/demo/feature-4/shots/shot-8.jpg', label: 'Payoff' },
] as const

function ArtifactHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className={styles.artifactHeader}>
      <span>{step}</span>
      <strong>{title}</strong>
      <small>Working…</small>
    </div>
  )
}

function VisualConcepts({ visible }: { visible: boolean }) {
  return (
    <div
      className={`${styles.stageArtifact} ${styles.visualArtifact} ${
        visible ? styles.stageArtifactVisible : ''
      }`}
      data-stage-panel="visual-concepts"
      aria-hidden={!visible}
    >
      <ArtifactHeader step="02" title="Visual concepts" />
      <div className={styles.conceptGrid}>
        {VISUAL_CONCEPTS.map((concept, index) => (
          <figure key={concept.label} style={{ '--concept-index': index } as CSSProperties}>
            <img src={concept.src} alt="" />
            <figcaption>{concept.label}</figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.artifactDecision}>
        Selected direction: <strong>tiny succulent worlds with cinematic stakes</strong>
      </p>
    </div>
  )
}

function CreativeIdeas({ visible }: { visible: boolean }) {
  return (
    <div
      className={`${styles.stageArtifact} ${styles.ideasArtifact} ${
        visible ? styles.stageArtifactVisible : ''
      }`}
      data-stage-panel="creative-ideas"
      aria-hidden={!visible}
    >
      <ArtifactHeader step="03" title="Creative ideas and culture shifts" />
      <div className={styles.ideaGrid}>
        <article>
          <span>Idea 01</span>
          <strong>Tiny world reveal</strong>
          <p>A handmade pot opens into a cinematic succulent universe.</p>
        </article>
        <article>
          <span>Idea 02</span>
          <strong>Calm craft ritual</strong>
          <p>Macro details turn plant-making into a satisfying social moment.</p>
        </article>
        <article>
          <span>Idea 03</span>
          <strong>Living desk companion</strong>
          <p>The arrangement becomes a character people want to follow.</p>
        </article>
      </div>
      <div className={styles.cultureTags}>
        <span>Biophilic design</span>
        <span>Cozy hobbies</span>
        <span>Miniature worlds</span>
      </div>
    </div>
  )
}

function StoryPlan({ visible }: { visible: boolean }) {
  return (
    <div
      className={`${styles.stageArtifact} ${styles.storyArtifact} ${
        visible ? styles.stageArtifactVisible : ''
      }`}
      data-stage-panel="story-plan"
      aria-hidden={!visible}
    >
      <ArtifactHeader step="04" title="Story plan" />
      <div className={styles.storyFrames}>
        {STORY_FRAMES.map((frame, index) => (
          <figure key={frame.label} style={{ '--frame-index': index } as CSSProperties}>
            <img src={frame.src} alt="" />
            <figcaption>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {frame.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.storyTimeline} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

function FinalVideoReveal({
  visible,
  videoRef,
}: {
  visible: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}) {
  const cachedSource = useCachedVideoSource(visible ? FINAL_VIDEO_URL : undefined)
  return (
    <div
      className={`${styles.finalReveal} ${visible ? styles.finalRevealVisible : ''}`}
      data-stage-panel="final-video"
      aria-hidden={!visible}
    >
      <div className={styles.finalNodeLabel}>
        <span>05</span>
        <strong>Final video</strong>
        <small><CheckIcon /> Ready</small>
      </div>
      <video
        ref={videoRef}
        src={cachedSource}
        autoPlay={visible}
        poster="/data-slides/thumbnails/07-14-import.jpg"
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className={styles.finalVideoShade} aria-hidden="true" />
      <div className={styles.finalSocialOverlay} aria-hidden="true">
        <span>♥</span>
        <span>◆</span>
      </div>
      <div className={styles.finalVideoCaption}>
        <strong>@succulent.workshop</strong>
        <span>Crafted from one company website</span>
      </div>
    </div>
  )
}

function PromotionWorkflowDemo() {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [elapsed, setElapsed] = useState(reducedMotion ? 18_000 : 0)
  const [runKey, setRunKey] = useState(0)
  const [hasEntered, setHasEntered] = useState(reducedMotion)
  const demoRef = useRef<HTMLDivElement | null>(null)
  const finalVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    const demo = demoRef.current
    if (!demo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasEntered(true)
        observer.disconnect()
      },
      { threshold: 0.28 },
    )

    observer.observe(demo)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !hasEntered) return

    const startedAt = window.performance.now()
    const timer = window.setInterval(() => {
      setElapsed((window.performance.now() - startedAt) % LOOP_DURATION_MS)
    }, 100)

    return () => window.clearInterval(timer)
  }, [hasEntered, reducedMotion, runKey])

  const outputVisible = elapsed >= 17_400

  useEffect(() => {
    const video = finalVideoRef.current
    if (!video) return

    if (outputVisible) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [outputVisible, runKey])

  const replay = () => {
    setElapsed(reducedMotion ? 18_000 : 0)
    setRunKey((current) => current + 1)
  }

  const typedLength = Math.max(
    0,
    Math.min(COMPANY_URL.length, Math.floor(((elapsed - 450) / 1_650) * COMPANY_URL.length)),
  )
  const typedUrl = COMPANY_URL.slice(0, typedLength)
  const submitted = elapsed >= 2_000
  const researchVisible = elapsed >= 2_150 && elapsed < 7_050
  const notesVisible = elapsed >= 3_750 && elapsed < 7_050
  const visualConceptsVisible = elapsed >= 7_450 && elapsed < 10_250
  const creativeIdeasVisible = elapsed >= 10_650 && elapsed < 13_250
  const storyPlanVisible = elapsed >= 13_650 && elapsed < 15_950
  const nodeStates = WORKFLOW_NODES.map((_, index) => getNodeState(index, elapsed))

  const currentStage = useMemo(() => {
    if (elapsed < 2_000) return 'website'
    if (elapsed < 7_000) return 'research'
    if (elapsed < 10_200) return 'visual-concepts'
    if (elapsed < 13_200) return 'creative-ideas'
    if (elapsed < 15_900) return 'story-plan'
    if (elapsed < 17_400) return 'final-render'
    return 'complete'
  }, [elapsed])

  const currentStatus = useMemo(() => {
    if (elapsed < 2_000) return 'Add the Succulent Workshop website'
    if (elapsed < 7_000) return 'Researching Succulent Workshop'
    if (elapsed < 10_200) return 'Exploring visual directions'
    if (elapsed < 13_200) return 'Finding cultural angles'
    if (elapsed < 15_900) return 'Planning the social story'
    if (elapsed < 17_400) return 'Rendering the custom video'
    return 'Your custom video is ready'
  }, [elapsed])

  return (
    <div
      className={styles.demoColumns}
      data-demo-active={hasEntered}
      data-demo-stage={currentStage}
      ref={demoRef}
    >
      <div className={styles.phoneColumn}>
        <div className={styles.columnLabel}>
          <span>01</span>
          <p>Provide one company link</p>
        </div>

        <div className={styles.phoneShell}>
          <div className={styles.phoneHardware} aria-hidden="true">
            <span />
          </div>
          <div className={styles.phoneScreen}>
            <div className={styles.mobileHeader}>
              <strong>Orchia</strong>
              <span>New promotion video</span>
            </div>

            <div className={styles.mobileProgress} aria-label="Three-step video order">
              <span className={styles.mobileProgressActive}>Company</span>
              <span>Direction</span>
              <span>Video</span>
            </div>

            <div className={styles.mobileCopy}>
              <span>Start with your company</span>
              <h3>What company should we promote?</h3>
              <p>Your website gives the workflow everything it needs to begin.</p>
            </div>

            <label className={styles.mobileField}>
              <span>Company URL</span>
              <div className={`${styles.urlInputShell} ${submitted ? styles.urlSubmitted : ''}`}>
                <input
                  type="url"
                  value={typedUrl}
                  placeholder="https://yourcompany.com"
                  readOnly
                  tabIndex={-1}
                  aria-label="Company URL demo input"
                />
                <i className={styles.typingCaret} aria-hidden="true" />
              </div>
            </label>

            <button
              className={`${styles.mobileSubmit} ${submitted ? styles.mobileSubmitSent : ''}`}
              type="button"
              onClick={replay}
            >
              {submitted ? (
                <>
                  <CheckIcon /> Sent to workflow
                </>
              ) : (
                <>Research company <span aria-hidden="true">→</span></>
              )}
            </button>

            <div className={styles.mobileAssurance}>
              <span aria-hidden="true">✦</span>
              <p>One link becomes the source for research, ideas, visuals, and story.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.workflowColumn}>
        <div className={styles.columnLabel}>
          <span>02</span>
          <p>Watch the orchestration work</p>
        </div>

        <div className={styles.workflowShell}>
          <div className={styles.workflowToolbar}>
            <div>
              <span className={styles.workflowSignal} aria-hidden="true" />
              <strong>{currentStatus}</strong>
            </div>
            <button type="button" onClick={replay}>
              Replay demo
            </button>
          </div>

          <div
            className={`${styles.graphCanvas} ${outputVisible ? styles.graphOutputVisible : ''}`}
            aria-label="Promotion video orchestration workflow"
          >
            <svg className={styles.edgeLayer} viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
              {EDGE_PATHS.map((path, index) => {
                const targetState = nodeStates[index + 1]
                const edgeState =
                  targetState === 'done'
                    ? styles.edgeDone
                    : targetState === 'running'
                      ? styles.edgeRunning
                      : styles.edgeQueued

                return <path className={edgeState} d={path} key={path} />
              })}
            </svg>

            {WORKFLOW_NODES.map((node, index) => {
              const state = nodeStates[index]
              return (
                <div
                  className={`${styles.workflowNode} ${styles[node.positionClass]} ${stateClass(state)}`}
                  data-node-id={node.id}
                  data-node-state={state}
                  key={node.id}
                >
                  <span className={styles.nodeNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.nodeStatusIcon} aria-hidden="true">
                    {state === 'done' ? <CheckIcon /> : state === 'running' ? <i /> : '·'}
                  </span>
                  <strong>{node.label}</strong>
                  <small>{state === 'running' ? 'Working…' : node.detail}</small>
                </div>
              )
            })}

            <ResearchBrowser visible={researchVisible} runKey={runKey} />
            <ResearchNotes visible={notesVisible} />
            <VisualConcepts visible={visualConceptsVisible} />
            <CreativeIdeas visible={creativeIdeasVisible} />
            <StoryPlan visible={storyPlanVisible} />
            <FinalVideoReveal visible={outputVisible} videoRef={finalVideoRef} />
          </div>

          <div className={styles.workflowFooter}>
            <div className={styles.workflowStageDots} aria-hidden="true">
              {WORKFLOW_NODES.map((node, index) => (
                <span className={stateClass(nodeStates[index])} key={node.id} />
              ))}
            </div>
            <p aria-live="polite">{currentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroProductModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className={styles.productModalBackdrop}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.productModal}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hero-product-modal-title"
      >
        <h2 className={filmStyles.srOnly} id="hero-product-modal-title">
          Choose your promotion video
        </h2>
        <button
          className={styles.productModalClose}
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close video options"
        >
          ×
        </button>

        <p className={styles.productModalNotice}>
          Stripe collects your email, full name, business name, and company website at checkout.
        </p>

        <div className={styles.productModalGrid}>
          {VIDEO_PACKAGES.map((videoPackage, index) => (
            <article
              className={`${styles.productModalCard} ${
                index === 1 ? styles.productModalCardPremium : ''
              }`}
              key={videoPackage.tier}
            >
              <p>{videoPackage.tier}</p>
              <h3>{videoPackage.duration}</h3>
              <div className={styles.productModalPrice}>
                <span>{videoPackage.regularPrice}</span>
                <strong>{videoPackage.betaPrice}</strong>
                <small>USD · one time</small>
              </div>
              <a
                href={videoPackage.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Choose ${videoPackage.tier} for ${videoPackage.betaPrice} and continue to Stripe`}
              >
                <span>Choose {videoPackage.tier}</span>
                <span aria-hidden="true">{videoPackage.betaPrice} ↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function HomeV2Page() {
  const [privateAccessOpen, setPrivateAccessOpen] = useState(false)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [leadSubmitStatus, setLeadSubmitStatus] = useState<LeadSubmitStatus>('idle')
  const [leadDetails, setLeadDetails] = useState<LeadDetails>({
    website: '',
  })
  const openPrivateAccess = useCallback(() => setPrivateAccessOpen(true), [])
  const closePrivateAccess = useCallback(() => setPrivateAccessOpen(false), [])
  const closeProductModal = useCallback(() => setProductModalOpen(false), [])

  const updateLeadDetail = useCallback((field: keyof LeadDetails, value: string) => {
    setLeadDetails((current) => ({ ...current, [field]: value }))
    setLeadSubmitStatus('idle')
  }, [])

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (leadSubmitStatus === 'sending') return

    const normalizedLead = {
      website: leadDetails.website.trim(),
    }
    const savedAt = new Date().toISOString()

    try {
      window.sessionStorage.setItem(
        'orchia-video-lead',
        JSON.stringify({ ...normalizedLead, savedAt }),
      )
    } catch {
      // Private browsing settings may prevent storage; checkout can still continue.
    }

    setLeadDetails(normalizedLead)
    setLeadSubmitStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...normalizedLead,
          source: 'video-lead',
          message: 'Requested access to the promotion video packages from Homepage V2.',
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok || payload?.success !== true) {
        throw new Error('Lead email was not accepted')
      }

      setLeadSubmitStatus('idle')
      setProductModalOpen(true)
    } catch {
      setLeadSubmitStatus('error')
    }
  }

  useEffect(() => {
    document.body.classList.add('film-mode')
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <>
      <Helmet>
        <title>Orchia Promotion Video — Custom social videos for your company</title>
        <meta
          name="description"
          content="Turn one company website into an affordable, custom AI-generated social video designed to bring your business more attention."
        />
        <link rel="canonical" href="https://orchia.studio/" />
      </Helmet>

      <div className={`${filmStyles.page} ${styles.v2Page}`}>
        <div className={styles.intro}>
          <StudioSiteHeader sticky />

          <section className={styles.hero} aria-labelledby="v2-hero-title">
            <div className={styles.heroSignup}>
              <h1 id="v2-hero-title">
                Custom videos are already helping companies grow revenue.
              </h1>

              <form className={styles.heroForm} onSubmit={handleLeadSubmit}>
                <label>
                  <span className={filmStyles.srOnly}>Company website</span>
                  <input
                    type="url"
                    name="website"
                    value={leadDetails.website}
                    onChange={(event) => updateLeadDetail('website', event.target.value)}
                    placeholder="Company website"
                    autoComplete="url"
                    inputMode="url"
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={leadSubmitStatus === 'sending'}
                  aria-busy={leadSubmitStatus === 'sending'}
                >
                  <span>
                    {leadSubmitStatus === 'sending'
                      ? 'Saving your website…'
                      : 'Unlock your company video'}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>

                {leadSubmitStatus === 'error' ? (
                  <p className={styles.heroFormError} role="alert">
                    We couldn’t record your company website. Please try again.
                  </p>
                ) : null}
              </form>

              <p className={styles.heroCreateAlt}>
                Or skip the wait —{' '}
                <Link to="/new-project">create a social video from your idea</Link>{' '}
                and watch the production live.
              </p>
            </div>

            <div className={styles.heroVideoWall}>
              <SocialVideoScroller
                videos={HERO_VIDEOS}
                pixelsPerSecond={26}
                ariaLabel="Looping examples of vertical promotion videos"
              />
            </div>
          </section>
        </div>

        <section className={styles.demoSection} id="demo" aria-labelledby="demo-title">
          <header className={styles.demoHeader}>
            <div>
              <p>From website to finished video</p>
              <h2 id="demo-title">Watch Succulent Workshop become a social video.</h2>
            </div>
            <p className={styles.demoIntro}>
              This fictional plant studio starts with one URL. Orchia researches the business,
              develops the look and ideas, plans the story, and produces its custom video.
            </p>
          </header>

          <PromotionWorkflowDemo />

          <div className={styles.demoOutcome}>
            <span>Ready in 30 minutes</span>
            <p>You get a promotion video crafted just for your company.</p>
            <a href="#pricing">Scroll to see pricing <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <VideoBetaPricing compact />
        <SiteFooter onRequestAccess={openPrivateAccess} />
      </div>

      <PrivateAccessModal open={privateAccessOpen} onClose={closePrivateAccess} />
      <HeroProductModal open={productModalOpen} onClose={closeProductModal} />
    </>
  )
}
