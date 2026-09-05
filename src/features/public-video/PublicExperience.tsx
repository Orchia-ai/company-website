import { ArrowUpRight, Asterisk, Check, Clock3, Film, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { PublicShareButton } from './PublicShareButton'
import '@fontsource-variable/space-grotesk/index.css'
import './public-experience.css'

export function PublicShell({ step, children, onView, ready = false }: {
  step: 0 | 1 | 2
  children: ReactNode
  onView?: (view: 'progress' | 'watch') => void
  ready?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let disposed = false
    let motion: { revert: () => void } | undefined
    // The page renders immediately; motion is an optional, deferred enhancement.
    void import('gsap').then(({ gsap }) => {
      if (disposed || !root.current) return
      const media = gsap.matchMedia()
      motion = media
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-pop-reveal]', { y: 18, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' })
        if (root.current?.querySelector('.pop-sticker')) gsap.from('.pop-sticker', { scale: 0.75, rotation: -8, duration: 0.7, ease: 'back.out(1.8)', clearProps: 'transform' })
        if (root.current?.querySelector('.pop-asterisk')) gsap.from('.pop-asterisk', { rotation: -90, duration: 0.9, ease: 'power3.out', clearProps: 'transform' })
      }, root.current)
    }).catch(() => { /* Motion failure must never hide content or block creation. */ })
    return () => { disposed = true; motion?.revert() }
  }, [step])
  return <div ref={root} className="orchia-public" data-public-design="pop-v1">
    <a className="skip-link" href="#public-main">Skip to content</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="/new-project" aria-label="Orchia home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>orchia<span className="brand-dot">.</span></a>
      <nav className="journey" aria-label="Video journey">
        <a href="/new-project" aria-current={step === 0 ? 'page' : undefined}><span className="step-number">{step > 0 ? <Check size={12} /> : '01'}</span>Create</a>
        <button type="button" disabled={!onView} aria-current={step === 1 ? 'page' : undefined} onClick={() => onView?.('progress')}><span className="step-number">{ready ? <Check size={12} /> : '02'}</span>Progress</button>
        <button type="button" disabled={!onView || !ready} aria-current={step === 2 ? 'page' : undefined} onClick={() => onView?.('watch')}><span className="step-number">03</span>Result</button>
      </nav>
      <span className="preview-label"><ShieldCheck size={15} />No account needed</span>
    </div></header>
    <main className="page-container" id="public-main">{children}</main>
    <footer className="site-footer"><p><Asterisk size={19} />Small input. Big creative energy.</p><p>Made with Orchia<span className="footer-dot">·</span>Made for your feed.</p></footer>
  </div>
}

export function PublicButton({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'icon' }) {
  return <button type="button" className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

export function PublicBadge({ children, tone = 'violet' }: { children: ReactNode; tone?: 'violet' | 'green' | 'red' | 'neutral' }) {
  return <span className={`badge badge-${tone}`}><span className="status-dot" />{children}</span>
}

export function PublicCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function PublicPrice({ original }: { original: 15 | 30 }) {
  return <div className="price"><s aria-label={`Previously ${original} dollars`}>${original}</s><strong>$0</strong><PublicBadge tone="green">Free now</PublicBadge></div>
}

export type PublicReferenceSet = {
  cutNumber: number
  references: Array<{ artifactId: string; displayName: string; category: string; description: string; mediaUrl: string }>
}

export type PublicResultPresentation = {
  state: 'accepted' | 'queued' | 'running' | 'completed' | 'failed'
  percent: number
  phase: string
  activeNodes?: string[]
  completedCount: number
  totalCount: number
  unit: 'steps' | 'clips'
  updatedAt: string
  elapsed?: string
  error?: string | null
  mediaUrl?: string
  durationSeconds?: number | null
  clipCount?: number
  references?: PublicReferenceSet[]
}

/** Presentation only. The route adapters own all requests and durable state. */
export function PublicResultView({ title, subtitle, status, loadError, actions, notification }: {
  title: string
  subtitle?: string
  status: PublicResultPresentation | null
  loadError: string | null
  actions: ReactNode
  notification?: ReactNode
}) {
  const [view, setView] = useState<'progress' | 'watch' | null>(null)
  const [mediaError, setMediaError] = useState(false)
  const [videoFormat, setVideoFormat] = useState<'unknown' | 'portrait' | 'landscape'>('unknown')
  const ready = status?.state === 'completed' && Boolean(status.mediaUrl)
  const missingMedia = status?.state === 'completed' && !status.mediaUrl
  const failed = status?.state === 'failed' || missingMedia
  const watch = ready && view !== 'progress'
  const label = !status ? 'Reading project status' : failed ? 'Needs attention' : ready ? 'Ready to watch' : status.state === 'queued' || status.state === 'accepted' ? 'In the queue' : 'Creation in progress'
  const updated = status?.updatedAt && Number.isFinite(Date.parse(status.updatedAt)) ? new Date(status.updatedAt).toLocaleString() : 'Waiting for status'
  return <PublicShell step={watch ? 2 : 1} ready={ready} onView={setView}>
    {loadError && <p className="connection-notice" role="status">{loadError} {status ? 'Showing the last saved status. ' : ''}Retrying automatically; no work is restarted.</p>}
    {watch ? <>
      <div className="page-heading result-heading">
        <div><PublicBadge tone="green">Ready for your feed</PublicBadge><h1 data-pop-reveal>Post-worthy.</h1></div>
        <span className="pop-sticker result-sticker">Made by your<br /> imagination.<ArrowUpRight size={28} /></span>
      </div>
      <div className="watch-layout" data-video-format={videoFormat}>
        <div className="main-column">
          <PublicCard className="watch-card">
            <div className="video-stage"><video className="real-video" src={status?.mediaUrl} controls playsInline preload="metadata" aria-label="Your completed video" onError={() => setMediaError(true)} onLoadedMetadata={event => setVideoFormat(event.currentTarget.videoHeight > event.currentTarget.videoWidth ? 'portrait' : 'landscape')} onLoadedData={() => setMediaError(false)} /></div>
            {mediaError && <p className="connection-notice" role="alert">The saved video could not be loaded in your browser. Try the download below or reload this page. No generation is restarted.</p>}
            <div className="video-meta"><div><Film size={20} /><div><strong>Your finished video</strong><p>{status?.clipCount ? `${status.clipCount} clip${status.clipCount === 1 ? '' : 's'} · ` : ''}{status?.durationSeconds != null ? `${Math.round(status.durationSeconds * 10) / 10} seconds · ` : ''}MP4 video</p></div></div><Check size={20} aria-label="Completed" /></div>
          </PublicCard>
          {status?.references?.some(set => set.references.length) && <PublicReferenceGallery sets={status.references} />}
          <div className="watch-bottom"><Asterisk size={32} /><p>Your next idea is already calling.<br /><a href="/new-project">Make another video <ArrowUpRight size={15} /></a></p></div>
        </div>
        <aside className="side-column action-column">
          <div className="result-project"><h2>{title}</h2><p>{subtitle || 'A little idea. Ready for a bigger audience.'}</p><PublicShareButton className="button button-secondary" /></div>
          {actions}
        </aside>
      </div>
    </> : <>
      <div className="progress-layout">
        <section className="progress-intro">
          <PublicBadge tone={failed ? 'red' : ready ? 'green' : 'violet'}>{label}</PublicBadge>
          <h1 data-pop-reveal>{failed ? <>Let’s get<br />you back<br /><span className="headline-sticker">on track.</span></> : ready ? <>Ready for<br />its first<br /><span className="headline-sticker">audience.</span></> : <>Your next<br /><span className="headline-sticker">scroll-stopper</span><br />is coming.</>}</h1>
          <p className="intro-copy" data-pop-reveal>{failed ? 'Your saved work and this link are still here.' : ready ? 'Play it. Share it. Put your next idea in motion.' : 'You brought the idea. We’re on the production. Keep this link and get back to your day.'}</p>
          <div className="heading-actions"><PublicShareButton className="button button-secondary" />{ready ? <PublicButton onClick={() => setView('watch')}>Watch my video<ArrowUpRight size={18} /></PublicButton> : <span className="live-caption"><Clock3 size={16} />{status?.elapsed ? `Elapsed ${status.elapsed}` : 'Updates automatically'}</span>}</div>
          <div className="creator-signature"><Asterisk className="pop-asterisk" size={76} strokeWidth={2.5} aria-hidden="true" /><p>{failed ? 'Your next take starts here.' : 'Your creativity. Our automatic production.'}</p></div>
        </section>
        <PublicCard className={`progress-card ${failed ? 'has-error' : ''}`}>
          <div className="project-strip"><span><Zap size={19} />{failed ? 'Your saved project' : ready ? 'Made with Orchia' : 'Orchia is on it'}</span><span>{failed ? 'Stopped' : ready ? 'Complete' : status?.state === 'running' ? 'Creating' : status ? 'Queued' : 'Connecting'}</span></div>
          <div className="progress-meter" role="progressbar" aria-label="Video creation progress" aria-valuenow={status ? status.percent : undefined} aria-valuemin={0} aria-valuemax={100} aria-valuetext={status ? `${status.percent}%` : 'Reading saved status'}><strong>{status ? status.percent : '—'}{status && <span>%</span>}</strong><div className="progress-track"><span style={{ width: `${status?.percent ?? 0}%` }} /></div></div>
          <h2 aria-live="polite">{status?.phase || (loadError ? 'Reconnecting to your project.' : 'Reading your project.')}</h2>
          <p className="progress-description">{failed ? status?.error || 'This run did not produce a playable final video.' : ready ? 'Your idea is ready to meet the world.' : 'Your idea is getting real.'}</p>
          <div className="phase-list">
            <div className="phase-row"><Check size={18} /><strong>{status ? `${status.completedCount} of ${status.totalCount} ${status.unit} complete` : 'Waiting for saved progress'}</strong></div>
            {status?.activeNodes?.map((node, index) => <div className="phase-row active" key={`${node}-${index}`}><span className={failed || ready ? 'status-dot' : 'little-spinner'} /><div><strong>{node}</strong><small>{failed ? 'Last reported step' : 'In progress'}</small></div></div>)}
          </div>
          <p className="progress-timestamp">Last update: {updated}</p>
        </PublicCard>
      </div>
      <div className="progress-support">
        <PublicCard className="link-card"><span className="icon-tile"><ShieldCheck size={21} /></span><div><h3>Your link is your way back.</h3><p>Save this link to find your progress and finished video. Anyone with the link can open this public page.</p></div></PublicCard>
        {notification}
      </div>
      {status?.references?.some(set => set.references.length) && <PublicReferenceGallery sets={status.references} />}
    </>}
  </PublicShell>
}

function PublicReferenceGallery({ sets }: { sets: PublicReferenceSet[] }) {
  return <PublicCard className="scene-card"><div className="section-title"><h3>Images used by each clip</h3></div><p className="field-hint">The exact reference images used in your video requests.</p>{sets.filter(set => set.references.length).map(set => <details className="reference-set" key={set.cutNumber}><summary>Clip {set.cutNumber} · {set.references.length} reference images</summary><div className="scene-grid">{set.references.map(reference => <figure key={reference.artifactId}>
    <a href={reference.mediaUrl} target="_blank" rel="noreferrer"><img src={reference.mediaUrl} alt={reference.displayName} loading="lazy" decoding="async" /></a><figcaption><strong>{reference.displayName}</strong><p>{reference.category} · {reference.description}</p></figcaption>
  </figure>)}</div></details>)}</PublicCard>
}
