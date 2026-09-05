import { useEffect, useRef, useState } from 'react'

import { PublicResultView } from './PublicExperience'
import { PublicVideoActions } from './PublicVideoActions'

type BatchStatus = {
  publicId: string
  title: string
  batchLabel: string
  state: 'queued' | 'running' | 'completed' | 'failed'
  progress: { percent: number; completedClips: number; totalClips: number }
  phase: { code: string; label: string }
  error: { message: string } | null
  result: null | {
    ready: true
    mediaUrl: string
    contentType: 'video/mp4'
    clipCount: number
    durationSeconds: number | null
    providerModels: string[]
  }
  retryAfterSeconds: number | null
  updatedAt: string
  links: { feedback: string }
}

export function PublicVideoBatchPlayer({ publicId }: { publicId: string }) {
  const [status, setStatus] = useState<BatchStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const lastPayload = useRef('')

  useEffect(() => {
    let stopped = false
    let timer: number | undefined
    const poll = async () => {
      try {
        const response = await fetch(`/api/public/video-batches/${encodeURIComponent(publicId)}`, {
          cache: 'no-store',
        })
        const payload = await response.json() as BatchStatus | { error?: { message?: string } }
        if (!response.ok) throw new Error('error' in payload ? payload.error?.message : 'Public video not found.')
        const next = payload as BatchStatus
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
          setLoadError(error instanceof Error ? error.message : 'Public video could not be loaded.')
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

  return <PublicResultView title={status?.title || 'Shared video'} subtitle={status?.batchLabel} loadError={loadError} status={status ? {
    state: status.state,
    percent: Math.max(0, Math.min(100, Math.round(status.progress.percent) || 0)),
    phase: status.phase.label,
    completedCount: status.progress.completedClips,
    totalCount: status.progress.totalClips,
    unit: 'clips',
    updatedAt: status.updatedAt,
    error: status.error?.message,
    mediaUrl: status.result?.mediaUrl,
    durationSeconds: status.result?.durationSeconds,
    clipCount: status.result?.clipCount,
  } : null} actions={status?.state === 'completed' && status.result ? <PublicVideoActions feedbackUrl={status.links.feedback} mediaUrl={status.result.mediaUrl} /> : null} />
}
