import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Download, ShieldCheck, WandSparkles, X } from 'lucide-react'
import { PublicBadge, PublicButton, PublicCard, PublicPrice } from './PublicExperience'

type RevisionResponse = {
  item?: {
    state?: string
    links?: { player?: string; status?: string }
  }
  error?: { message?: string }
}

export function PublicVideoActions(input: {
  mediaUrl: string
  feedbackUrl: string
  fileName?: string
}) {
  const [stage, setStage] = useState<'closed' | 'describe' | 'review' | 'submitting' | 'started'>('closed')
  const [draft, setDraft] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [newPlayerUrl, setNewPlayerUrl] = useState<string | null>(null)
  const idempotencyKey = useRef<string | null>(null)
  const downloadUrl = withDownloadFlag(input.mediaUrl)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (stage === 'closed') dialog.current?.close()
    else if (!dialog.current?.open) dialog.current?.showModal()
  }, [stage])

  function prepareReview() {
    const changes = organizeChanges(draft)
    if (changes.length === 0) {
      setMessage('Describe at least one change you want in the next video.')
      return
    }
    idempotencyKey.current = crypto.randomUUID()
    setReviewText(changes.join('\n'))
    setMessage(null)
    setStage('review')
  }

  async function confirmRevision() {
    if (stage === 'submitting') return
    const changes = organizeChanges(reviewText)
    if (changes.length === 0) {
      setMessage('Keep at least one change in the confirmed plan.')
      return
    }
    const stableKey = idempotencyKey.current ?? crypto.randomUUID()
    idempotencyKey.current = stableKey
    setStage('submitting')
    setMessage(null)
    try {
      const response = await fetch(input.feedbackUrl, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': stableKey,
        },
        body: JSON.stringify({ changes }),
      })
      const payload = await response.json() as RevisionResponse
      if (!response.ok) {
        throw new Error(payload.error?.message || 'The new video iteration could not be started.')
      }
      const playerUrl = payload.item?.links?.player
      if (!playerUrl) throw new Error('The new iteration started without a public player link.')
      setNewPlayerUrl(playerUrl)
      setStage('started')
      setMessage('Your new video iteration has started. This current video remains available.')
    } catch (error) {
      setStage('review')
      setMessage(error instanceof Error ? error.message : 'The new video iteration could not be started.')
    }
  }

  return <section aria-label="Free video actions">
    <PublicCard className="action-card download-card"><div className="section-title"><span className="icon-tile"><Download size={20} /></span><PublicBadge tone="green">On us, for now</PublicBadge></div><h2>Take it to your feed.</h2><p>Download your finished video. Add your caption and share it on your favorite platform.</p><PublicPrice original={30} /><a className="button button-primary full-width" download={input.fileName ?? 'orchia-final-video.mp4'} href={downloadUrl}><Download size={16} />Download for free</a><small>MP4 video · No payment needed</small></PublicCard>
    <PublicCard className="action-card iteration-card"><span className="icon-tile"><WandSparkles size={20} /></span><h2>Turn up the impact.</h2><p>A stronger hook? More product focus? Shape the next take with a few creative notes.</p><div className="revision-presets" aria-label="Ideas for your next take">{[
      { label: 'Stronger hook', note: 'Strengthen the opening hook so the first seconds give viewers a clear reason to keep watching.' },
      { label: 'Product focus', note: 'Put more emphasis on the product and the benefits already described. Keep all product claims accurate to the original brief.' },
      { label: 'Tighter edit', note: 'Make the pacing tighter and the message more concise while preserving the core story.' },
    ].map(preset => <button key={preset.label} type="button" onClick={() => { setDraft(preset.note); setMessage(null); setStage('describe') }}>{preset.label}</button>)}</div><PublicPrice original={15} /><PublicButton variant="secondary" className="full-width" onClick={() => { setStage(current => current === 'closed' ? 'describe' : current); setMessage(null) }}>What would you change?<ArrowUpRight size={16} /></PublicButton><small>Your original video is always preserved.</small>{newPlayerUrl && <a className="button button-quiet full-width" href={newPlayerUrl}>Open new video player<ArrowUpRight size={16} /></a>}</PublicCard>
    <dialog ref={dialog} className="revision-dialog" aria-labelledby="revision-title" onCancel={event => { if (stage === 'submitting') event.preventDefault(); else setStage('closed') }}>
      <div className="dialog-content">
        <div className="dialog-top"><PublicBadge><WandSparkles size={13} />A new take</PublicBadge><PublicButton variant="icon" aria-label="Close change plan" disabled={stage === 'submitting'} onClick={() => setStage('closed')}><X size={19} /></PublicButton></div>
        <h2 id="revision-title">{stage === 'describe' ? 'What would you change?' : stage === 'started' ? 'Your next take is on its way.' : 'Here’s what will change.'}</h2>
        <p className="dialog-description">{stage === 'describe' ? 'A brighter opening? A different mood? Describe how you’d like to shape the next version. Nothing is generated until you confirm.' : stage === 'started' ? 'The confirmed changes are running as a separate video. Your current version stays available.' : 'Review and edit the plan below. One line becomes one instruction for your new video iteration.'}</p>
        {stage === 'started' ? <div className="dialog-bottom">{newPlayerUrl && <a className="button button-primary full-width" href={newPlayerUrl}>Open new video player<ArrowRight size={16} /></a>}</div> : <>
          <div className="dialog-steps"><span className={stage === 'describe' ? 'current' : ''}>1. Describe</span><ArrowRight size={14} /><span className={stage !== 'describe' ? 'current' : ''}>2. Review & confirm</span></div>
          <label className="field-label" htmlFor="revision-notes">{stage === 'describe' ? 'Your creative notes' : 'Your change plan'}</label>
          <textarea id="revision-notes" disabled={stage === 'submitting'} maxLength={16_384} value={stage === 'describe' ? draft : reviewText} onChange={event => { if (stage === 'describe') setDraft(event.target.value); else { setReviewText(event.target.value); idempotencyKey.current = crypto.randomUUID() } setMessage(null) }} placeholder="Make the opening warmer. Move the camera a little slower. Keep the quiet ending." />
          <p className="safe-note"><ShieldCheck size={16} />Your current video stays exactly as it is.</p>
          <div className="dialog-bottom"><PublicPrice original={15} /><div>{stage !== 'describe' && <PublicButton variant="quiet" disabled={stage === 'submitting'} onClick={() => setStage('describe')}>Back</PublicButton>}<PublicButton disabled={stage === 'submitting'} onClick={stage === 'describe' ? prepareReview : () => void confirmRevision()}>{stage === 'describe' ? 'Review proposed changes' : stage === 'submitting' ? 'Starting new iteration…' : 'Confirm and start free iteration'}<ArrowRight size={16} /></PublicButton></div></div>
        </>}
        {message && <p className={stage === 'started' ? 'safe-note' : 'field-error'} role={stage === 'started' ? 'status' : 'alert'}>{message}</p>}
      </div>
    </dialog>
  </section>
}

function organizeChanges(value: string) {
  return value
    .replace(/([.!?。！？])\s+/gu, '$1\n')
    .split(/\r?\n+/u)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)、])\s*/u, '').trim())
    .filter(Boolean)
    .slice(0, 20)
}

function withDownloadFlag(mediaUrl: string) {
  const separator = mediaUrl.includes('?') ? '&' : '?'
  return `${mediaUrl}${separator}download=1`
}
