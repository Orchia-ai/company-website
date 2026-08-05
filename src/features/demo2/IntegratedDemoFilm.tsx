import {
  Check,
  FileText,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  NotebookTabs,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  UserRoundCheck,
  Video,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type SVGProps,
} from 'react'

import {
  DEMO_BEATS,
  DEMO_CHAPTERS,
  DEMO_DURATION,
  GROWTH_PROJECTS,
  VERSION_MEDIA,
  type DemoBeat,
  type GrowthProject,
} from './demo2Data'
import styles from './demo2-film.module.css'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>
type NodeId = 'brief' | 'story' | 'character' | 'frames' | 'video' | 'output'

type WorkflowNode = {
  id: NodeId
  label: string
  kind: string
  Icon: IconComponent
}

const WORKFLOW_NODES: readonly WorkflowNode[] = [
  { id: 'brief', label: 'Creative brief', kind: 'Context', Icon: FileText },
  { id: 'story', label: 'Story', kind: 'Script + beats', Icon: NotebookTabs },
  { id: 'character', label: 'Character Lock', kind: 'New in v2', Icon: UserRoundCheck },
  { id: 'frames', label: 'Scene frames', kind: 'Visual direction', Icon: ImageIcon },
  { id: 'video', label: 'Video', kind: 'Motion + edit', Icon: Video },
  { id: 'output', label: 'Output', kind: 'Final video', Icon: Play },
] as const

const POSITIONS_V1: Record<NodeId, number> = {
  brief: 70,
  story: 300,
  character: 430,
  frames: 530,
  video: 760,
  output: 990,
}

const POSITIONS_V2: Record<NodeId, number> = {
  brief: 20,
  story: 225,
  character: 430,
  frames: 635,
  video: 840,
  output: 1_045,
}

const FEEDBACK = 'Keep the same character in every shot, make the look more cinematic, and tighten the transitions.'
const numberFormatter = new Intl.NumberFormat('en-US')
const PEOPLE = [
  { name: 'Maya', role: 'Creative lead', avatar: '/demo/living-production-v5/avatars/writer.png', tone: 'pink' },
  { name: 'Nora', role: 'Art direction', avatar: '/demo/living-production-v5/avatars/art.png', tone: 'orange' },
  { name: 'Eli', role: 'Video', avatar: '/demo/living-production-v5/avatars/camera.png', tone: 'blue' },
  { name: 'Owen', role: 'Audience', avatar: '/demo/living-production-v5/avatars/data-analysis.png', tone: 'lime' },
] as const

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

function easeOutCubic(value: number) {
  return 1 - (1 - clamp01(value)) ** 3
}

function formatMetric(value: number) {
  const rounded = Math.max(0, Math.round(value))
  if (rounded >= 1_000_000) {
    return `${(rounded / 1_000_000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}M`
  }
  if (rounded >= 100_000) return `${Math.round(rounded / 1_000)}K`
  if (rounded >= 10_000) return `${(rounded / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return numberFormatter.format(rounded)
}

function formatTime(milliseconds: number) {
  return `00:${String(Math.floor(milliseconds / 1_000)).padStart(2, '0')}`
}

function beatAtTime(time: number) {
  const found = DEMO_BEATS.findIndex((beat) => time >= beat.start && time < beat.end)
  const index = found < 0 ? DEMO_BEATS.length - 1 : found
  const beat = DEMO_BEATS[index]
  return {
    beat,
    index,
    progress: clamp01((time - beat.start) / (beat.end - beat.start)),
  }
}

function versionForBeat(beat: DemoBeat) {
  return ['evolve', 'run_v2', 'play_v2'].includes(beat.id) ? 2 : 1
}

function WorkflowScene({ beat, progress }: { beat: DemoBeat; progress: number }) {
  const version = versionForBeat(beat)
  const showCharacter = ['evolve', 'run_v2', 'play_v2'].includes(beat.id)
  const visibleNodes = WORKFLOW_NODES.filter((node) => node.id !== 'character' || showCharacter)
  const positions = showCharacter ? POSITIONS_V2 : POSITIONS_V1
  const running = beat.id === 'run_v1' || beat.id === 'run_v2'
  const runIndex = running
    ? Math.min(visibleNodes.length - 1, Math.floor(progress * visibleNodes.length))
    : -1
  const activeNode = beat.id === 'evolve' ? 'character' : running ? visibleNodes[runIndex]?.id : null
  const videoVersion = beat.id === 'play_v2' ? 2 : 1
  const playerOpen = beat.id === 'play_v1' || beat.id === 'play_v2'
  const media = VERSION_MEDIA[videoVersion]
  const feedbackDraft = beat.id === 'human_feedback'
    ? FEEDBACK.slice(0, Math.floor(clamp01((progress - 0.08) / 0.64) * FEEDBACK.length))
    : ''
  const showSentFeedback = ['feedback_sent', 'evolve', 'run_v2', 'play_v2'].includes(beat.id)
  const showAgentReply = beat.id !== 'human_feedback' && beat.id !== 'ready' && beat.id !== 'run_v1'

  const agentCopy = beat.id === 'feedback_sent'
    ? 'I’ll make character consistency an explicit part of the workflow.'
    : beat.id === 'evolve'
      ? 'Character Lock added. Workflow v2 is ready to rerun.'
      : beat.id === 'run_v2'
        ? 'Rerunning with the same identity across every downstream shot.'
        : beat.id === 'play_v2'
          ? 'Version 2 is ready. The feedback is now visible in the result.'
          : beat.id === 'play_v1'
            ? 'Version 1 is ready. Watch the result, then tell me what to change.'
            : 'The project is moving through the workflow.'

  return (
    <section className={styles.scene} key={beat.id}>
      <div className={styles.sceneCopy}>
        <span>{beat.eyebrow}</span>
        <h1>{beat.headline}</h1>
        <p>{beat.detail}</p>
      </div>

      <div className={styles.workflowPanel}>
        <header className={styles.panelHeader}>
          <div>
            <span className={styles.statusDot} />
            <strong>Short drama production</strong>
            <small>End-to-end workflow</small>
          </div>
          <div className={styles.versionChip} key={version}>v{version}</div>
        </header>

        <div className={`${styles.workflowGrid} ${playerOpen ? styles.workflowGridDimmed : ''}`}>
          {visibleNodes.slice(0, -1).map((node, index) => {
            const next = visibleNodes[index + 1]
            const left = positions[node.id] + 178
            const width = Math.max(20, positions[next.id] - left)
            return (
              <span
                className={`${styles.workflowEdge} ${running && runIndex === index + 1 ? styles.workflowEdgeRunning : ''} ${running && runIndex > index + 1 ? styles.workflowEdgeDone : ''}`}
                key={`${node.id}-${next.id}`}
                style={{ '--edge-left': `${left}px`, '--edge-width': `${width}px` } as CSSProperties}
              />
            )
          })}

          {visibleNodes.map((node, index) => {
            const active = activeNode === node.id
            const done = running && index < runIndex
            const entering = node.id === 'character' && beat.id === 'evolve'
            const output = node.id === 'output'
            const Icon = node.Icon
            return (
              <article
                className={`${styles.workflowNode} ${active ? styles.workflowNodeActive : ''} ${done ? styles.workflowNodeDone : ''} ${entering ? styles.workflowNodeEntering : ''} ${output ? styles.outputNode : ''}`}
                key={node.id}
                style={{ '--node-left': `${positions[node.id]}px` } as CSSProperties}
              >
                {output ? (
                  <div className={styles.outputPoster}>
                    <img src={media.poster} alt="" />
                    <span><Play size={15} fill="currentColor" /></span>
                    <small>{running && runIndex < visibleNodes.length - 1 ? 'Waiting' : media.label}</small>
                    <strong>{running && runIndex < visibleNodes.length - 1 ? 'Generating…' : 'Ready to play'}</strong>
                  </div>
                ) : (
                  <>
                    <div className={styles.nodeIcon}><Icon size={23} strokeWidth={1.8} /></div>
                    <span className={styles.nodeKind}>{node.kind}</span>
                    <strong>{node.label}</strong>
                    <small>{active ? node.id === 'character' ? 'Adding step…' : 'Working…' : done ? 'Complete' : 'Standing by'}</small>
                    {done ? <Check className={styles.nodeCheck} size={16} /> : null}
                  </>
                )}
              </article>
            )
          })}
        </div>

        {playerOpen ? (
          <div className={styles.videoPlayer} key={`player-${videoVersion}`}>
            <div className={styles.videoBackdrop} style={{ backgroundImage: `url(${media.poster})` }} />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={media.poster}
              src={media.src}
              aria-label={`${media.label} generated output video`}
            />
            <header>
              <span><i /> PLAYING</span>
              <strong>{media.label} · Generated output</strong>
              <small>Output node / browser preview</small>
            </header>
            <footer>
              <span><Play size={14} fill="currentColor" /> 00:0{Math.min(9, Math.floor(progress * 5))}</span>
              <i><b style={{ width: `${Math.max(6, progress * 100)}%` }} /></i>
              <strong>1080 × 1920</strong>
            </footer>
          </div>
        ) : null}
      </div>

      <aside className={styles.chatPanel}>
        <header>
          <div className={styles.chatAvatar}>M</div>
          <div><strong>Maya + Orchia</strong><small><i /> Live production chat</small></div>
        </header>

        <div className={styles.chatHistory}>
          {showSentFeedback ? <div className={styles.userBubble}>{FEEDBACK}</div> : null}
          {showAgentReply ? (
            <div className={styles.agentBubble}>
              <Sparkles size={17} />
              <span>{agentCopy}</span>
            </div>
          ) : null}
          {beat.id === 'run_v1' ? (
            <div className={styles.runStatus}><i /><span>Generating Version 1…</span><b>{Math.round(progress * 100)}%</b></div>
          ) : null}
        </div>

        <div className={`${styles.chatComposer} ${beat.id === 'human_feedback' ? styles.chatComposerActive : ''}`}>
          <span>{feedbackDraft || 'Message Orchia…'}</span>
          <button type="button" tabIndex={-1} aria-label="Send feedback">
            <Send size={18} />
          </button>
        </div>
      </aside>
    </section>
  )
}

function GrowthChart({
  title,
  unit,
  values,
  max,
  ticks,
  threshold,
  progress,
  tone,
}: {
  title: string
  unit: string
  values: readonly number[]
  max: number
  ticks: readonly { value: number; label: string }[]
  threshold: { value: number; label: string }
  progress: number
  tone: 'pink' | 'lime'
}) {
  return (
    <article className={`${styles.growthChart} ${tone === 'lime' ? styles.growthChartLime : ''}`}>
      <header>
        <div><span>{unit}</span><strong>{title}</strong></div>
        <b>{formatMetric(values[2])}</b>
      </header>
      <div className={styles.chartPlot}>
        {ticks.map((tick) => (
          <div className={styles.chartGridline} key={tick.value} style={{ bottom: `${(tick.value / max) * 100}%` }}>
            <span>{tick.label}</span>
          </div>
        ))}
        <div className={styles.chartThreshold} style={{ bottom: `${(threshold.value / max) * 100}%` }}>
          <span>{threshold.label}</span>
        </div>
        <div className={styles.chartBars}>
          {GROWTH_PROJECTS.map((project: GrowthProject, index) => {
            const reveal = easeOutCubic((progress - index * 0.18) / 0.44)
            const height = Math.max(reveal > 0 ? 3 : 0, (values[index] / max) * 100 * reveal)
            return (
              <div className={styles.chartBarColumn} key={project.id}>
                <div className={styles.chartValue}>{formatMetric(values[index] * reveal)}</div>
                <div className={styles.chartBar} style={{ height: `${height}%` }}>
                  <img src={project.thumbnail} alt="" />
                </div>
                <div className={styles.chartLabel}>
                  <strong>Project {String(project.id).padStart(2, '0')}</strong>
                  <small>{project.date}</small>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}

function GrowthScene({ beat, progress }: { beat: DemoBeat; progress: number }) {
  const chartProgress = beat.id === 'growth' ? progress : 1

  return (
    <section className={`${styles.scene} ${styles.growthScene}`} key={beat.id}>
      <div className={styles.sceneCopy}>
        <span>{beat.eyebrow}</span>
        <h1>{beat.headline}</h1>
        <p>{beat.detail}</p>
      </div>

      <div className={styles.growthStage}>
        <header className={styles.growthHeader}>
          <div><i /><strong>Performance over later projects</strong><small>Original Demo 2 data view</small></div>
          <div className={styles.growthSummary}>
            <span><Play size={15} fill="currentColor" /> Views</span>
            <span><Heart size={15} fill="currentColor" /> Likes</span>
          </div>
        </header>

        <div className={styles.growthCharts}>
          <GrowthChart
            title="Views keep climbing"
            unit="Playback growth"
            values={GROWTH_PROJECTS.map((project) => project.views)}
            max={1_500_000}
            ticks={[
              { value: 0, label: '0' },
              { value: 500_000, label: '500K' },
              { value: 1_000_000, label: '1M' },
              { value: 1_500_000, label: '1.5M' },
            ]}
            threshold={{ value: 100_000, label: '100K views' }}
            progress={chartProgress}
            tone="pink"
          />
          <GrowthChart
            title="More people choose to like"
            unit="Audience response"
            values={GROWTH_PROJECTS.map((project) => project.likes)}
            max={6_000}
            ticks={[
              { value: 0, label: '0' },
              { value: 2_000, label: '2K' },
              { value: 4_000, label: '4K' },
              { value: 6_000, label: '6K' },
            ]}
            threshold={{ value: 1_000, label: '1K likes' }}
            progress={chartProgress}
            tone="lime"
          />
        </div>

        <footer className={styles.growthFooter}>
          <span><MessageCircle size={15} /> Same production system</span>
          <strong>4.6K → 202K → 1.45M views</strong>
          <b>178 → 1,013 → 5,515 likes</b>
        </footer>

      </div>
    </section>
  )
}

function TeamScene({ beat, progress }: { beat: DemoBeat; progress: number }) {
  const positions = POSITIONS_V2
  const final = beat.id === 'final_hold'
  const joinedCount = final || beat.id === 'loop_reset'
    ? PEOPLE.length
    : Math.min(PEOPLE.length, 1 + Math.floor(clamp01(progress) * 3.6))

  return (
    <section className={`${styles.scene} ${styles.teamScene}`} key={beat.id}>
      <div className={styles.sceneCopy}>
        <span>{beat.eyebrow}</span>
        <h1>{beat.headline}</h1>
        <p>{beat.detail}</p>
      </div>

      <div className={`${styles.workflowPanel} ${styles.teamWorkflowPanel}`}>
        <header className={styles.panelHeader}>
          <div>
            <span className={styles.statusDot} />
            <strong>Short drama production</strong>
            <small>Shared workflow</small>
          </div>
          <div className={styles.versionChip}>v2</div>
        </header>
        <div className={styles.workflowGrid}>
          {WORKFLOW_NODES.slice(0, -1).map((node, index) => {
            const next = WORKFLOW_NODES[index + 1]
            const left = positions[node.id] + 178
            const width = Math.max(20, positions[next.id] - left)
            return (
              <span
                className={`${styles.workflowEdge} ${styles.workflowEdgeDone}`}
                key={`${node.id}-${next.id}`}
                style={{ '--edge-left': `${left}px`, '--edge-width': `${width}px` } as CSSProperties}
              />
            )
          })}
          {WORKFLOW_NODES.map((node) => {
            const Icon = node.Icon
            const output = node.id === 'output'
            return (
              <article
                className={`${styles.workflowNode} ${styles.workflowNodeDone} ${output ? styles.outputNode : ''}`}
                key={node.id}
                style={{ '--node-left': `${positions[node.id]}px` } as CSSProperties}
              >
                {output ? (
                  <div className={styles.outputPoster}>
                    <img src={VERSION_MEDIA[2].poster} alt="" />
                    <span><Play size={15} fill="currentColor" /></span>
                    <small>Version 2</small>
                    <strong>Shared output</strong>
                  </div>
                ) : (
                  <>
                    <div className={styles.nodeIcon}><Icon size={23} strokeWidth={1.8} /></div>
                    <span className={styles.nodeKind}>{node.kind}</span>
                    <strong>{node.label}</strong>
                    <small>Ready</small>
                    <Check className={styles.nodeCheck} size={16} />
                  </>
                )}
              </article>
            )
          })}
        </div>
      </div>

      <aside className={styles.peoplePanel}>
        <header>
          <div><strong>People</strong><small>Working on this production</small></div>
          <b>{joinedCount}</b>
        </header>
        <div className={styles.peopleList}>
          {PEOPLE.map((person, index) => (
            <div
              className={`${styles.personRow} ${styles[`person${person.tone}`]} ${index < joinedCount ? styles.personRowVisible : ''}`}
              key={person.name}
              style={{ '--person-delay': `${index * 90}ms` } as CSSProperties}
            >
              <img src={person.avatar} alt="" />
              <span><strong>{person.name}</strong><small>{person.role}</small></span>
              <i aria-label="Online" />
            </div>
          ))}
        </div>
        <button className={styles.addPeopleButton} type="button" tabIndex={-1}>
          <span>+</span>
          <div><strong>Add people</strong><small>Invite another specialist</small></div>
        </button>
      </aside>

      {final ? (
        <div className={styles.finalCard}>
          <span>ORCHIA</span>
          <strong>Generate. Improve. Grow—together.</strong>
          <p>Everyone stays visible beside one clean production workflow.</p>
        </div>
      ) : null}
    </section>
  )
}

export default function IntegratedDemoFilm() {
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [time, setTime] = useState(() => reducedMotion ? 39_200 : 0)
  const [paused, setPaused] = useState(reducedMotion)
  const timeRef = useRef(time)
  const pausedByVisibility = useRef(false)

  useEffect(() => {
    if (paused) return
    let frame = 0
    let previous = performance.now()

    const tick = (now: number) => {
      const delta = Math.min(120, now - previous)
      previous = now
      const next = (timeRef.current + delta) % DEMO_DURATION
      timeRef.current = next
      setTime(next)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [paused])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && !paused) {
        pausedByVisibility.current = true
        setPaused(true)
      } else if (!document.hidden && pausedByVisibility.current) {
        pausedByVisibility.current = false
        setPaused(false)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [paused])

  const { beat, index, progress } = beatAtTime(time)
  const chartScene = beat.id === 'growth'
  const teamScene = beat.id === 'team' || beat.id === 'final_hold' || beat.id === 'loop_reset'
  const chapter = useMemo(
    () => DEMO_CHAPTERS.find((item) => time >= item.start && time < item.end) ?? DEMO_CHAPTERS.at(-1),
    [time],
  )

  const seek = useCallback((milliseconds: number) => {
    timeRef.current = milliseconds
    setTime(milliseconds)
  }, [])

  const restart = useCallback(() => {
    seek(0)
    setPaused(false)
  }, [seek])

  const toggle = useCallback(() => setPaused((value) => !value), [])

  const coverOpacity = beat.id === 'loop_reset'
    ? progress < 0.38 ? progress / 0.38 : progress > 0.78 ? (1 - progress) / 0.22 : 1
    : 0

  return (
    <div className={styles.film} data-beat={beat.id}>
      <header className={styles.filmHeader}>
        <div className={styles.filmBrand}>
          <span className={styles.brandMark}><i /><i /><i /></span>
          <strong>Orchia</strong>
          <small>One workflow · better over time</small>
        </div>
        <div className={styles.filmStatus}>
          <span><i /> LIVE DEMO</span>
          <b>{String(index + 1).padStart(2, '0')} / {DEMO_BEATS.length}</b>
        </div>
      </header>

      <main className={styles.sceneHost}>
        {chartScene ? (
          <GrowthScene beat={beat} progress={progress} />
        ) : teamScene ? (
          <TeamScene beat={beat} progress={progress} />
        ) : (
          <WorkflowScene beat={beat} progress={progress} />
        )}
      </main>

      <footer className={styles.filmControls}>
        <nav className={styles.chapterNav} aria-label="Demo chapters">
          {DEMO_CHAPTERS.map((item) => {
            const active = chapter?.label === item.label
            const chapterProgress = clamp01((time - item.start) / (item.end - item.start))
            return (
              <button
                className={active ? styles.chapterActive : ''}
                key={item.label}
                type="button"
                aria-current={active ? 'step' : undefined}
                onClick={() => seek(item.start + 20)}
              >
                <span>{item.label}</span>
                <i><b style={{ width: `${active ? chapterProgress * 100 : time >= item.end ? 100 : 0}%` }} /></i>
              </button>
            )
          })}
        </nav>
        <div className={styles.playbackControls}>
          <span>{formatTime(time)} / {formatTime(DEMO_DURATION)}</span>
          <button type="button" onClick={toggle} aria-label={paused ? 'Play demo' : 'Pause demo'}>
            {paused ? <Play size={22} fill="currentColor" /> : <Pause size={22} fill="currentColor" />}
          </button>
          <button type="button" onClick={restart} aria-label="Restart demo"><RotateCcw size={21} /></button>
        </div>
      </footer>

      <div className={styles.masterProgress}><span style={{ width: `${(time / DEMO_DURATION) * 100}%` }} /></div>
      <div className={styles.loopCover} style={{ opacity: coverOpacity }} aria-hidden="true">
        <div><span /><strong>Orchia</strong></div>
      </div>
    </div>
  )
}
