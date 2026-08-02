import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './home-film-page.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function PrivateAccessModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const emailId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const closeModal = useCallback(() => {
    setEmail('')
    setStatus('idle')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => emailRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
        ),
      )
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [closeModal, open])

  useEffect(() => {
    if (status !== 'sent') return
    window.requestAnimationFrame(() => confirmationRef.current?.focus())
  }, [status])

  if (!open) return null

  const sending = status === 'sending'

  return createPortal(
    <div
      className={styles.privateAccessOverlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div
        className={styles.privateAccessDialog}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="private-access-title"
        aria-describedby="private-access-description"
      >
        <button
          className={styles.privateAccessClose}
          type="button"
          aria-label="Close private access form"
          onClick={closeModal}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5 19 19M19 5 5 19" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div
            className={styles.privateAccessConfirmation}
            ref={confirmationRef}
            role="status"
            tabIndex={-1}
          >
            <span className={styles.privateAccessSignal} aria-hidden="true">✓</span>
            <p className={styles.privateAccessEyebrow}>Request received</p>
            <h2 id="private-access-title">You’re on the private alpha list.</h2>
            <p id="private-access-description">
              Please wait for your alpha access email. We’ll send it to <strong>{email}</strong> when your invitation is ready.
            </p>
            <button className={styles.privateAccessPrimary} type="button" onClick={closeModal}>
              Done
            </button>
          </div>
        ) : (
          <form
            className={styles.privateAccessForm}
            onSubmit={async (event) => {
              event.preventDefault()
              const normalizedEmail = email.trim()
              setEmail(normalizedEmail)
              setStatus('sending')

              try {
                const response = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: 'Private alpha access request',
                    email: normalizedEmail,
                    message: 'Please add this email to the Orchia Studio private alpha access list.',
                    source: 'alpha-access',
                  }),
                })
                const payload = await response.json().catch(() => null)
                setStatus(response.ok && payload?.success === true ? 'sent' : 'error')
              } catch {
                setStatus('error')
              }
            }}
          >
            <p className={styles.privateAccessEyebrow}>Invite-only alpha</p>
            <h2 id="private-access-title">Contact us for private access</h2>
            <p className={styles.privateAccessIntro} id="private-access-description">
              Leave your email below. We’ll send you a private alpha access email when your invitation is ready.
            </p>

            <label className={styles.privateAccessLabel} htmlFor={emailId}>Email address</label>
            <input
              className={styles.privateAccessInput}
              id={emailId}
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              value={email}
              disabled={sending}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status === 'error') setStatus('idle')
              }}
            />

            {status === 'error' ? (
              <p className={styles.privateAccessError} role="alert">
                Your request didn’t send. Please try again in a moment.
              </p>
            ) : null}

            <button className={styles.privateAccessPrimary} type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Request private access'}
            </button>
            <p className={styles.privateAccessFinePrint}>
              Access is released in small groups. Please wait for your invitation email before signing in.
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
