import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import styles from './social-video-scroller.module.css'

export type SocialVideoItem = {
  id: string
  src: string
  poster: string
  handle: string
  caption: string
}

type SocialUiVariant = 'tiktok' | 'instagram' | 'x'

type SpawnedVideo = SocialVideoItem & {
  instanceId: string
  loopIndex: number
  videoIndex: number
  ui: SocialUiVariant
  likes: string
  shares: string
  startFraction: number
}

type SocialVideoScrollerProps = {
  videos: readonly SocialVideoItem[]
  pixelsPerSecond?: number
  ariaLabel?: string
  className?: string
}

const UI_VARIANTS: readonly SocialUiVariant[] = ['tiktok', 'instagram', 'x']
const LOOP_COPIES = 3
const START_FRACTION_MIN = 0.08
const START_FRACTION_MAX = 0.82

function shuffledVariants() {
  const variants = [...UI_VARIANTS]

  for (let index = variants.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = variants[index]
    variants[index] = variants[swapIndex]
    variants[swapIndex] = current
  }

  return variants
}

function createSpawnedVideos(videos: readonly SocialVideoItem[]): SpawnedVideo[] {
  return Array.from({ length: LOOP_COPIES }, (_, loopIndex) => {
    const variants = shuffledVariants()

    return videos.map((video, videoIndex) => {
      const popularitySeed = Math.floor(Math.random() * 74) + 18
      const shareSeed = Math.floor(Math.random() * 820) + 120
      /* Put repeated copies in separate parts of the timeline, then add
         randomness inside each part so they never open on the same shot. */
      const startBandPosition = (loopIndex + Math.random()) / LOOP_COPIES

      return {
        ...video,
        instanceId: `${loopIndex}-${video.id}`,
        loopIndex,
        videoIndex,
        ui: variants[videoIndex % variants.length],
        likes: `${Math.floor(popularitySeed / 10)}.${popularitySeed % 10}K`,
        shares: shareSeed.toLocaleString('en-US'),
        startFraction:
          START_FRACTION_MIN +
          startBandPosition * (START_FRACTION_MAX - START_FRACTION_MIN),
      }
    })
  }).flat()
}

function cueSpawnedStart(video: HTMLVideoElement, startFraction: number) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return

  const latestSafeStart = Math.max(0, video.duration - 2)
  video.currentTime = Math.min(latestSafeStart, video.duration * startFraction)
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 3.5h11v17L12 17l-5.5 3.5v-17Z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14 5 5 5-5 5" />
      <path d="M19 10H9.5C6.5 10 4 12.5 4 15.5V19" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9.2 9.2 0 0 1-3.6-.8L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  )
}

function RepeatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m17 3 4 4-4 4" />
      <path d="M3 11V9a2 2 0 0 1 2-2h16" />
      <path d="m7 21-4-4 4-4" />
      <path d="M21 13v2a2 2 0 0 1-2 2H3" />
    </svg>
  )
}

function Action({
  icon,
  label,
  delay,
  accent,
}: {
  icon: 'heart' | 'bookmark' | 'share' | 'comment' | 'repeat'
  label?: string
  delay: number
  accent?: boolean
}) {
  const style = { '--reaction-delay': `${delay}s` } as CSSProperties
  const renderedIcon =
    icon === 'heart' ? (
      <HeartIcon />
    ) : icon === 'bookmark' ? (
      <BookmarkIcon />
    ) : icon === 'share' ? (
      <ShareIcon />
    ) : icon === 'repeat' ? (
      <RepeatIcon />
    ) : (
      <CommentIcon />
    )

  return (
    <span className={`${styles.action} ${accent ? styles.actionAccent : ''}`} style={style}>
      <i>{renderedIcon}</i>
      {label ? <small>{label}</small> : null}
    </span>
  )
}

function TikTokOverlay({ video }: { video: SpawnedVideo }) {
  return (
    <div className={`${styles.socialUi} ${styles.tiktokUi}`} aria-hidden="true">
      <div className={styles.tiktokTabs}>
        <span>Following</span>
        <strong>For you</strong>
      </div>
      <div className={styles.sideActions}>
        <span className={styles.avatar}>{video.handle.slice(1, 2).toUpperCase()}</span>
        <Action icon="heart" label={video.likes} delay={0.1} accent />
        <Action icon="comment" label="418" delay={1.4} />
        <Action icon="bookmark" label="Save" delay={2.5} />
        <Action icon="share" label={video.shares} delay={3.3} />
      </div>
      <div className={styles.videoCaption}>
        <strong>{video.handle}</strong>
        <span>{video.caption}</span>
        <small>♫ Original sound</small>
      </div>
      <span className={styles.videoProgress} />
    </div>
  )
}

function InstagramOverlay({ video }: { video: SpawnedVideo }) {
  return (
    <div className={`${styles.socialUi} ${styles.instagramUi}`} aria-hidden="true">
      <div className={styles.instagramTop}>
        <span className={styles.avatar}>{video.handle.slice(1, 2).toUpperCase()}</span>
        <div>
          <strong>{video.handle.replace('@', '')}</strong>
          <small>Original audio</small>
        </div>
        <i>•••</i>
      </div>
      <div className={styles.sideActions}>
        <Action icon="heart" label={video.likes} delay={0.8} accent />
        <Action icon="comment" label="327" delay={1.8} />
        <Action icon="share" label={video.shares} delay={2.8} />
        <Action icon="bookmark" delay={3.8} />
      </div>
      <div className={styles.videoCaption}>
        <strong>{video.handle}</strong>
        <span>{video.caption}</span>
      </div>
      <div className={styles.instagramNav}>
        <span>⌂</span>
        <span>⌕</span>
        <span>＋</span>
        <span>▻</span>
        <span>◉</span>
      </div>
    </div>
  )
}

function XOverlay({ video }: { video: SpawnedVideo }) {
  return (
    <div className={`${styles.socialUi} ${styles.xUi}`} aria-hidden="true">
      <div className={styles.xPostHeader}>
        <span className={styles.avatar}>{video.handle.slice(1, 2).toUpperCase()}</span>
        <div>
          <strong>Orchia Studio</strong>
          <small>{video.handle} · Now</small>
        </div>
        <i>•••</i>
      </div>
      <div className={styles.xPostCopy}>{video.caption}</div>
      <div className={styles.xActions}>
        <Action icon="comment" label="96" delay={1.1} />
        <Action icon="repeat" label={video.shares} delay={2.1} />
        <Action icon="heart" label={video.likes} delay={0.2} accent />
        <Action icon="bookmark" delay={3.1} />
        <Action icon="share" delay={4.1} />
      </div>
    </div>
  )
}

function SocialOverlay({ video }: { video: SpawnedVideo }) {
  if (video.ui === 'instagram') return <InstagramOverlay video={video} />
  if (video.ui === 'x') return <XOverlay video={video} />
  return <TikTokOverlay video={video} />
}

export default function SocialVideoScroller({
  videos,
  pixelsPerSecond = 24,
  ariaLabel = 'Social video previews',
  className,
}: SocialVideoScrollerProps) {
  const spawnedVideos = useMemo(() => createSpawnedVideos(videos), [videos])
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const dragPointerRef = useRef<number | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartScrollRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const getLoopMetrics = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return null

    const first = viewport.querySelector<HTMLElement>('[data-loop-index="0"][data-video-index="0"]')
    const middle = viewport.querySelector<HTMLElement>('[data-loop-index="1"][data-video-index="0"]')
    const third = viewport.querySelector<HTMLElement>('[data-loop-index="2"][data-video-index="0"]')
    if (!first || !middle || !third) return null

    return {
      firstStart: first.offsetLeft,
      middleStart: middle.offsetLeft,
      thirdStart: third.offsetLeft,
      cardWidth: middle.offsetWidth,
      segmentWidth: third.offsetLeft - middle.offsetLeft,
    }
  }, [])

  const normalizeScroll = useCallback(() => {
    const viewport = viewportRef.current
    const metrics = getLoopMetrics()
    if (!viewport || !metrics || metrics.segmentWidth <= 0) return 0

    const lowerBoundary = metrics.firstStart + metrics.segmentWidth * 0.32
    const upperBoundary = metrics.thirdStart - metrics.segmentWidth * 0.32

    if (viewport.scrollLeft < lowerBoundary) {
      viewport.scrollLeft += metrics.segmentWidth
      return metrics.segmentWidth
    }

    if (viewport.scrollLeft > upperBoundary) {
      viewport.scrollLeft -= metrics.segmentWidth
      return -metrics.segmentWidth
    }

    return 0
  }, [getLoopMetrics])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const alignToMiddleCopy = () => {
      const metrics = getLoopMetrics()
      if (!metrics) return

      const centeredOffset = Math.max(0, (viewport.clientWidth - metrics.cardWidth) / 2)
      viewport.scrollLeft = metrics.middleStart - centeredOffset
    }

    const frame = window.requestAnimationFrame(alignToMiddleCopy)
    const resizeObserver = new ResizeObserver(alignToMiddleCopy)
    resizeObserver.observe(viewport)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [getLoopMetrics, spawnedVideos])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const videosInTrack = [...viewport.querySelectorAll('video')]
    let syncTimer = 0

    const syncPlayback = () => {
      syncTimer = 0
      const viewportBounds = viewport.getBoundingClientRect()

      videosInTrack.forEach((video) => {
        const videoBounds = video.getBoundingClientRect()
        const horizontalOverlap =
          Math.min(videoBounds.right, viewportBounds.right) -
          Math.max(videoBounds.left, viewportBounds.left)
        const isVisible =
          document.visibilityState === 'visible' &&
          horizontalOverlap > Math.min(videoBounds.width * 0.16, 32)

        if (isVisible) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      })
    }

    const schedulePlaybackSync = () => {
      if (syncTimer) return
      syncTimer = window.setTimeout(syncPlayback, 140)
    }

    const firstFrame = window.requestAnimationFrame(syncPlayback)
    const readyTimer = window.setTimeout(syncPlayback, 280)
    viewport.addEventListener('scroll', schedulePlaybackSync, { passive: true })
    window.addEventListener('resize', schedulePlaybackSync)
    document.addEventListener('visibilitychange', syncPlayback)
    videosInTrack.forEach((video) => video.addEventListener('canplay', schedulePlaybackSync))

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.clearTimeout(readyTimer)
      window.clearTimeout(syncTimer)
      viewport.removeEventListener('scroll', schedulePlaybackSync)
      window.removeEventListener('resize', schedulePlaybackSync)
      document.removeEventListener('visibilitychange', syncPlayback)
      videosInTrack.forEach((video) => video.removeEventListener('canplay', schedulePlaybackSync))
    }
  }, [spawnedVideos])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let frame = 0
    let previousTime = window.performance.now()

    const advance = (now: number) => {
      const viewport = viewportRef.current
      const deltaSeconds = Math.min((now - previousTime) / 1000, 0.05)
      previousTime = now

      if (viewport && dragPointerRef.current === null && document.visibilityState === 'visible') {
        viewport.scrollLeft += pixelsPerSecond * deltaSeconds
        normalizeScroll()
      }

      frame = window.requestAnimationFrame(advance)
    }

    frame = window.requestAnimationFrame(advance)
    return () => window.cancelAnimationFrame(frame)
  }, [normalizeScroll, pixelsPerSecond])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport || event.button !== 0) return

    dragPointerRef.current = event.pointerId
    dragStartXRef.current = event.clientX
    dragStartScrollRef.current = viewport.scrollLeft
    viewport.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport || dragPointerRef.current !== event.pointerId) return

    viewport.scrollLeft = dragStartScrollRef.current - (event.clientX - dragStartXRef.current)
    dragStartScrollRef.current += normalizeScroll()
  }

  const endPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport || dragPointerRef.current !== event.pointerId) return

    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    dragPointerRef.current = null
    setIsDragging(false)
    normalizeScroll()
  }

  const nudge = (direction: -1 | 1) => {
    const viewport = viewportRef.current
    const firstCard = viewport?.querySelector<HTMLElement>('[data-video-index="0"]')
    if (!viewport || !firstCard) return

    viewport.scrollBy({ left: direction * (firstCard.offsetWidth + 18), behavior: 'smooth' })
  }

  return (
    <div className={`${styles.scroller} ${className ?? ''}`}>
      <div
        className={`${styles.viewport} ${isDragging ? styles.viewportDragging : ''}`}
        ref={viewportRef}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
      >
        <div className={styles.track}>
          {spawnedVideos.map((video) => (
            <article
              className={styles.videoCard}
              data-loop-index={video.loopIndex}
              data-video-index={video.videoIndex}
              data-social-ui={video.ui}
              key={video.instanceId}
              aria-hidden={video.loopIndex === 1 ? undefined : true}
              aria-label={`${
                video.ui === 'x'
                  ? 'X'
                  : video.ui === 'tiktok'
                    ? 'TikTok'
                    : 'Instagram'
              } video preview`}
            >
              <video
                className={styles.video}
                src={video.src}
                poster={video.poster}
                onLoadedMetadata={(event) =>
                  cueSpawnedStart(event.currentTarget, video.startFraction)
                }
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                draggable={false}
              />
              <div className={styles.videoShade} aria-hidden="true" />
              <SocialOverlay video={video} />
            </article>
          ))}
        </div>
      </div>

      <div className={styles.scrollerControls}>
        <button type="button" onClick={() => nudge(-1)} aria-label="Show previous video">
          ←
        </button>
        <button type="button" onClick={() => nudge(1)} aria-label="Show next video">
          →
        </button>
      </div>
    </div>
  )
}
