import { ArrowRight, ArrowUpRight, Asterisk, Check, ChevronDown, ImagePlus, Monitor, Plus, ShieldCheck, Smartphone, Sparkles, Zap } from 'lucide-react'
import { PublicBadge, PublicButton, PublicCard, PublicShell } from './PublicExperience'
import { buildSocialVideoBrief, socialGoals, socialPlatforms, type SocialGoal, type SocialPlatform } from './social-video-brief'
import { type FormEvent, type ReactNode, useRef, useState } from 'react'

type AspectRatio = '16:9' | '9:16'
type Resolution = '720P' | '1080P'

type CreateProjectResponse = {
  item?: {
    links?: {
      player?: string
    }
  }
  error?: {
    message?: string
  }
}

type RetryIdentity = {
  payload: string
  idempotencyKey: string
}

export function PublicProjectCreator() {
  const [goal, setGoal] = useState<SocialGoal>('audience')
  const [platform, setPlatform] = useState<SocialPlatform>('Reels')
  const selectedGoal = socialGoals.find(item => item.value === goal)!
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [resolution, setResolution] = useState<Resolution>('1080P')
  const [characterReference, setCharacterReference] = useState<File | null>(null)
  const [sceneReference, setSceneReference] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const retryIdentity = useRef<RetryIdentity | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (!description.trim()) { setError('Tell us what you want to create first.'); return }
    const brief = buildSocialVideoBrief(description, title, goal, platform)

    const referenceMetadata = [
      characterReference ? {
        role: 'character-sheet',
        name: characterReference.name,
        size: characterReference.size,
        type: characterReference.type,
        lastModified: characterReference.lastModified,
      } : null,
      sceneReference ? {
        role: 'scene-reference',
        name: sceneReference.name,
        size: sceneReference.size,
        type: sceneReference.type,
        lastModified: sceneReference.lastModified,
      } : null,
    ].filter(Boolean)
    const payload = JSON.stringify({
      title: brief.title,
      context: brief.context,
      email: email.trim(),
      aspectRatio,
      resolution,
      referenceImages: referenceMetadata,
    })
    const existingIdentity = retryIdentity.current
    const idempotencyKey = existingIdentity?.payload === payload
      ? existingIdentity.idempotencyKey
      : createIdempotencyKey()
    retryIdentity.current = { payload, idempotencyKey }

    setSubmitting(true)
    setError(null)
    try {
      const requestBody = characterReference || sceneReference
        ? (() => {
            const form = new FormData()
            form.set('title', brief.title)
            form.set('context', brief.context)
            if (email.trim()) form.set('email', email.trim())
            form.set('aspectRatio', aspectRatio)
            form.set('resolution', resolution)
            if (characterReference) form.set('characterReference', characterReference)
            if (sceneReference) form.set('sceneReference', sceneReference)
            return form
          })()
        : payload
      const headers: Record<string, string> = { 'Idempotency-Key': idempotencyKey }
      if (typeof requestBody === 'string') headers['Content-Type'] = 'application/json'
      const response = await fetch('/api/public/agent/projects', {
        method: 'POST',
        headers,
        body: requestBody,
      })
      const result = await readCreateResponse(response)
      if (!response.ok) {
        throw new Error(result.error?.message || 'Your video project could not be created.')
      }
      const playerUrl = safePlayerUrl(result.item?.links?.player)
      if (!playerUrl) {
        throw new Error('Your project was created, but its player link was unavailable. Retry to recover the same project.')
      }
      window.location.assign(playerUrl.href)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Your video project could not be created.')
      setSubmitting(false)
    }
  }

  return <PublicShell step={0}>
    <div className="create-layout">
      <section className="create-intro">
        <PublicBadge><Zap size={14} />Your idea. Automatically in motion.</PublicBadge>
        <h1 data-pop-reveal>Make them<br />stop<br /><span className="headline-sticker">scrolling.</span></h1>
        <p className="intro-copy" data-pop-reveal>Your point of view. Your next big product.<br />A video that makes people want the next second.</p>
        <div className="creator-signature"><Asterisk className="pop-asterisk" size={100} strokeWidth={2.5} aria-hidden="true" /><p>For creators.<br />For brands with personality.</p></div>
        <div className="how-it-works" aria-label="How it works">
          <div><span>01</span><strong>Drop your idea.</strong></div><ArrowRight size={18} aria-hidden="true" />
          <div><span>02</span><strong>We make it move.</strong></div><ArrowRight size={18} aria-hidden="true" />
          <div><span>03</span><strong>Take it to your feed.</strong></div>
        </div>
      </section>
      <div className="create-form-wrap">
        <span className="pop-sticker round-sticker" aria-hidden="true">Made to<br />be shared.<ArrowUpRight size={22} /></span>
        <PublicCard className="create-card">
          <form onSubmit={submit} onInvalidCapture={event => { const details = (event.target as HTMLElement).closest('details'); if (details) details.open = true }}><fieldset className="form-busy" disabled={submitting}>
            <fieldset className="goal-field"><legend>What’s the goal?</legend><div className="goal-choices">{socialGoals.map(item => <label className={`goal-choice ${goal === item.value ? 'selected' : ''}`} key={item.value}><input type="radio" name="social-goal" value={item.value} checked={goal === item.value} onChange={() => setGoal(item.value)} /><span>{item.label}</span></label>)}</div></fieldset>
            <fieldset className="platform-field"><legend>Made for</legend><div className="platform-choices">{socialPlatforms.map(item => <label className={`platform-choice ${platform === item ? 'selected' : ''}`} key={item}><input type="radio" name="social-platform" value={item} checked={platform === item} onChange={() => setPlatform(item)} /><span>{item}</span>{platform === item && <Check size={13} />}</label>)}</div></fieldset>
            <div className="field idea-field"><label className="field-label" htmlFor="project-description">{selectedGoal.prompt}</label><div className="story-field"><textarea id="project-description" maxLength={64000} onChange={event => setDescription(event.target.value)} placeholder={selectedGoal.placeholder} required value={description} /><div className="story-tools"><span>A few lines or a full script. You direct.</span><Sparkles size={16} aria-hidden="true" /></div></div></div>
            <details className="create-options"><summary><ImagePlus size={17} />Add reference images <span>Optional</span><ChevronDown size={16} /></summary><div className="options-content"><div className="upload-grid"><ReferenceUploadField file={characterReference} id="character-reference" label="Character" onChange={setCharacterReference} /><ReferenceUploadField file={sceneReference} id="scene-reference" label="Scene" onChange={setSceneReference} /></div><p className="field-hint">Guide the characters and setting. JPEG, PNG, or WebP · up to 8 MB each.</p></div></details>
            <details className="create-options"><summary><span>Fine-tune your video</span><span>{aspectRatio} · {resolution === '1080P' ? '1080p' : '720p'}</span><ChevronDown size={16} /></summary><div className="options-content">
              <div className="field"><label className="field-label" htmlFor="project-title">Give it a title <span>Optional</span></label><input id="project-title" maxLength={200} onChange={event => setTitle(event.target.value)} placeholder="We’ll use your opening line if you leave this blank" value={title} /></div>
              <div className="format-row"><ChoiceGroup label="Format" name="aspect-ratio" onChange={value => setAspectRatio(value as AspectRatio)} options={[{ value: '9:16', title: 'Portrait', detail: '9:16', icon: <Smartphone size={18} /> }, { value: '16:9', title: 'Landscape', detail: '16:9', icon: <Monitor size={18} /> }]} value={aspectRatio} /><ChoiceGroup label="Quality" name="quality" onChange={value => setResolution(value as Resolution)} options={[{ value: '1080P', title: '1080p', detail: 'Full HD' }, { value: '720P', title: '720p', detail: 'HD' }]} value={resolution} /></div>
              <div className="field"><label className="field-label" htmlFor="completion-email">Email me when it’s ready <span>Optional</span></label><input autoComplete="email" id="completion-email" maxLength={254} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" type="email" value={email} /></div>
            </div></details>
            {error && <p className="connection-notice" role="alert">{error}</p>}
            <PublicButton className="create-submit full-width" disabled={submitting} type="submit">{submitting ? 'Creating your project…' : 'Create my post'}{submitting ? <span className="little-spinner" /> : <ArrowUpRight size={22} />}</PublicButton>
            <p className="privacy-note"><ShieldCheck size={15} />No signup. Save your public link to come back.</p>
          </fieldset></form>
        </PublicCard>
      </div>
    </div>
  </PublicShell>
}

function ChoiceGroup({ label, name, onChange, options, value }: { label: string; name: string; onChange: (value: string) => void; options: Array<{ value: string; title: string; detail: string; icon?: ReactNode }>; value: string }) {
  return <fieldset className="choice-field"><legend>{label}</legend><div className="choices">{options.map(option => <label className={`choice ${value === option.value ? 'selected' : ''}`} key={option.value}><input checked={value === option.value} name={name} onChange={() => onChange(option.value)} type="radio" value={option.value} />{option.icon}<span><strong>{option.title}</strong><small>{option.detail}</small></span>{value === option.value && <Check className="choice-check" size={12} />}</label>)}</div></fieldset>
}

function ReferenceUploadField({ file, id, label, onChange }: { file: File | null; id: string; label: string; onChange: (file: File | null) => void }) {
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  return <div><label className={`upload ${file ? 'has-file' : ''}`} htmlFor={id}><span className="upload-icon">{file ? <Check size={19} /> : <ImagePlus size={19} />}</span><span><strong>{label}</strong><small>{file ? `${file.name} · ${formatFileSize(file.size)}` : 'Click to add an image'}</small></span><Plus size={16} /><input ref={input} accept="image/jpeg,image/png,image/webp" id={id} onChange={event => {
    const next = event.target.files?.[0] ?? null
    if (next && (next.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(next.type))) { setError('Choose a JPEG, PNG, or WebP up to 8 MB.'); event.target.value = ''; return }
    setError(''); onChange(next)
  }} type="file" /></label>{file && <button className="upload-remove" type="button" onClick={() => { onChange(null); setError(''); if (input.current) input.current.value = '' }}>Remove {label.toLowerCase()} image</button>}{error && <p className="field-error" role="alert">{error}</p>}</div>
}

async function readCreateResponse(response: Response): Promise<CreateProjectResponse> {
  try {
    return await response.json() as CreateProjectResponse
  } catch {
    return {}
  }
}

function safePlayerUrl(value: unknown) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return null
    if (!/^\/agent\/results\/agent_[A-Za-z0-9_-]{32}$/u.test(url.pathname)) return null
    return url
  } catch {
    return null
  }
}

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `public-web-${crypto.randomUUID()}`
  }
  const random = Math.random().toString(36).slice(2)
  return `public-web-${Date.now().toString(36)}-${random}`
}

function formatFileSize(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}
