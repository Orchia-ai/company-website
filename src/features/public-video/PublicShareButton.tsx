import { Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function PublicShareButton({ className = '' }: { className?: string }) {
  const [state, setState] = useState<'idle' | 'shared' | 'error'>('idle')
  const resetRef = useRef<number | null>(null)
  useEffect(() => () => { if (resetRef.current !== null) window.clearTimeout(resetRef.current) }, [])

  async function share() {
    if (resetRef.current !== null) window.clearTimeout(resetRef.current)
    const url = window.location.href
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Orchia video', url })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        throw new Error('sharing is unavailable')
      }
      setState('shared')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setState('error')
    }
    resetRef.current = window.setTimeout(() => setState('idle'), 2_000)
  }

  return (
    <button
      className={className || 'button button-secondary'}
      onClick={() => void share()}
      type="button"
    >
      <Share2 className="h-4 w-4" />
      <span aria-live="polite">{state === 'shared' ? 'Link shared' : state === 'error' ? 'Copy the browser address to share' : 'Share'}</span>
    </button>
  )
}
