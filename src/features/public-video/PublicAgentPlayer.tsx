import { useEffect, useRef, useState } from 'react'

import { Mail } from 'lucide-react'
import { PublicButton, PublicCard, PublicResultView } from './PublicExperience'
import { PublicVideoActions } from './PublicVideoActions'

/** Mirrors the backend PublicAgentProjectStatus contract (public agent API). */
type PublicProjectStatus = {
  operationId: string
  publicId: string
  projectId: string
  batchId: string
  workflowVersion: string
  workflowRunId: string | null
  state: 'accepted' | 'queued' | 'running' | 'completed' | 'failed'
  progress: {
    percent: number
    completedNodes: number
    totalNodes: number
  }
  phase: {
    code: string
    label: string
    activeNodes: string[]
  }
  error: { code: string; message: string } | null
  result: null | {
    ready: true
    mediaUrl: string
    contentType: 'video/mp4'
    clipCount: number
    durationSeconds: number | null
    providerModels: string[]
    referenceSets: Array<{
      cutNumber: number
      references: Array<{
        artifactId: string
        displayName: string
        category: string
        description: string
        mediaUrl: string
      }>
    }>
  }
  links: {
    status: string
    player: string
    feedback: string
    documentation: string
    openapi: string
    completionEmail: string
  }
  completionEmail: {
    configured: boolean
    maskedAddress: string | null
    state: 'pending' | 'sent' | 'failed' | null
    sentAt: string | null
  }
  retryAfterSeconds: number | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

type PublicError = { error?: { code?: string; message?: string; retryAfterSeconds?: number | null } }

export function PublicAgentPlayer({ publicId }: { publicId: string }) {
  const [status, setStatus] = useState<PublicProjectStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState<string | null>(null)
  const [savingEmail, setSavingEmail] = useState(false)
  const lastPayload = useRef('')
  const loggedWorkflowVersion = useRef<string | null>(null)
  const terminal = status?.state === 'completed' || status?.state === 'failed'

  useEffect(() => {
    let stopped = false
    let timer: number | undefined
    const poll = async () => {
      try {
        const response = await fetch(`/api/public/agent/projects/${encodeURIComponent(publicId)}`, {
          cache: 'no-store',
        })
        const payload = await response.json() as PublicProjectStatus | PublicError
        if (!response.ok) {
          const failure = payload as PublicError
          throw new Error(failure.error?.message || 'This public project could not be loaded.')
        }
        const next = payload as PublicProjectStatus
        if (next.workflowVersion && next.workflowVersion !== loggedWorkflowVersion.current) {
          loggedWorkflowVersion.current = next.workflowVersion
          console.info('[orchia-final-player] Workflow version', next.workflowVersion)
        }
        const serialized = JSON.stringify(next)
        if (!stopped && serialized !== lastPayload.current) {
          lastPayload.current = serialized
          setStatus(next)
        }
        if (!stopped) setLoadError(null)
        if (!stopped && next.state !== 'completed' && next.state !== 'failed') {
          timer = window.setTimeout(poll, Math.max(2, next.retryAfterSeconds ?? 5) * 1_000)
        }
      } catch (error) {
        if (!stopped) {
          setLoadError(error instanceof Error ? error.message : 'This public project could not be loaded.')
          timer = window.setTimeout(poll, 10_000)
        }
      }
    }
    void poll()
    return () => {
      stopped = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [publicId])

  useEffect(() => {
    if (terminal) return
    const timer = window.setInterval(() => setNow(Date.now()), 1_000)
    return () => window.clearInterval(timer)
  }, [terminal])

  const runningTime = formatElapsedTime(status?.createdAt, status?.completedAt, now)
  const progress = clampProgress(status?.progress.percent)

  async function saveCompletionEmail() {
    if (!status?.links.completionEmail || savingEmail) return
    setSavingEmail(true)
    setEmailMessage(null)
    try {
      const response = await fetch(status.links.completionEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const result = await response.json() as PublicProjectStatus['completionEmail'] & { error?: { message?: string } }
      if (!response.ok) throw new Error(result.error?.message || 'The completion email could not be saved.')
      setStatus((current) => current ? { ...current, completionEmail: result } : current)
      setEmail('')
      setEmailMessage(result.state === 'sent' ? 'The completion reminder was already sent.' : 'Completion reminder saved.')
    } catch (error) {
      setEmailMessage(error instanceof Error ? error.message : 'The completion email could not be saved.')
    } finally {
      setSavingEmail(false)
    }
  }

  const notification = <PublicCard className="notify-card"><span className="icon-tile"><Mail size={21} /></span><h3>No need to wait around.</h3><p>Save an optional completion email for this video.</p>
    <form onSubmit={event => { event.preventDefault(); void saveCompletionEmail() }}><label className="sr-only" htmlFor="public-completion-email">Completion email</label><input autoComplete="email" id="public-completion-email" maxLength={254} onChange={event => setEmail(event.target.value)} placeholder={status?.completionEmail?.maskedAddress || 'you@example.com'} type="email" value={email} required disabled={savingEmail} /><PublicButton type="submit" variant="secondary" className="full-width" disabled={savingEmail || !email.trim() || !status?.links.completionEmail}>{savingEmail ? 'Saving…' : 'Email me when ready'}</PublicButton></form>
    <small role="status">{emailMessage || (status?.completionEmail?.state === 'sent' ? 'Completion reminder sent.' : status?.completionEmail?.state === 'failed' ? 'Your reminder could not be sent. Keep this link to return.' : status?.completionEmail?.configured ? `Reminder saved for ${status.completionEmail.maskedAddress}.` : 'Optional. At most one completion reminder.')}</small>
  </PublicCard>
  return <PublicResultView title="Your video project" loadError={loadError} status={status ? {
    state: status.state,
    percent: progress,
    phase: status.phase.label,
    activeNodes: status.phase.activeNodes,
    completedCount: status.progress.completedNodes,
    totalCount: status.progress.totalNodes,
    unit: 'steps',
    updatedAt: status.updatedAt,
    elapsed: runningTime,
    error: status.error?.message,
    mediaUrl: status.result?.mediaUrl,
    durationSeconds: status.result?.durationSeconds,
    clipCount: status.result?.clipCount,
    references: status.result?.referenceSets,
  } : null} notification={notification} actions={status?.state === 'completed' && status.result ? <PublicVideoActions feedbackUrl={status.links.feedback} mediaUrl={status.result.mediaUrl} /> : null} />
}

function clampProgress(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.round(value)))
    : 0
}

function formatElapsedTime(createdAt: string | undefined, completedAt: string | null | undefined, now: number) {
  if (!createdAt) return 'Waiting'
  const started = new Date(createdAt).getTime()
  const ended = completedAt ? new Date(completedAt).getTime() : now
  if (!Number.isFinite(started) || !Number.isFinite(ended)) return 'Waiting'
  const totalSeconds = Math.max(0, Math.floor((ended - started) / 1_000))
  const hours = Math.floor(totalSeconds / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`
}
