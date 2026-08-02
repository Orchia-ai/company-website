import { useId, useState } from 'react'

import styles from './home-film-page.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Pages that do not exist yet. Rendered as pending rather than as links so a
 *  dead destination never looks like a working one. */
const PENDING_PAGES = ['About us', 'Work', 'Careers'] as const

export default function SiteFooter({ onRequestAccess }: { onRequestAccess: () => void }) {
  const fieldId = useId()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The server maps this to the subject line, so these land in the inbox
        // tagged as coming from the new site rather than the studio pages.
        body: JSON.stringify({ ...form, source: 'workspace-request' }),
      })
      // Only a JSON body saying so counts as sent. An SPA fallback or a proxy
      // error page can answer 200 with HTML, and reporting that as delivered
      // would lose the message silently.
      const payload = await response.json().catch(() => null)
      setStatus(response.ok && payload?.success === true ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerGrid}>
        <div>
          <p className={styles.footerBrand}>
            Orchia
            <span className={styles.brandSuffix}>Studio</span>
          </p>
          <p className={styles.footerTagline}>
            One shared production for every specialist — writing, art, camera,
            and audience decisions in the same workspace.
          </p>

          <nav className={styles.footerNav} aria-label="Footer">
            {PENDING_PAGES.map((page) => (
              <span key={page} className={styles.footerLinkPending}>
                {page}
              </span>
            ))}
            <button className={styles.footerLink} type="button" onClick={onRequestAccess}>
              Contact Us for Private Access
            </button>
          </nav>
        </div>

        <div>
          <span className={`${styles.label} ${styles.contactHeading}`}>
            Contact us
          </span>

          {status === 'sent' ? (
            <div className={styles.sent} role="status">
              <p className={styles.sentTitle}>Message sent.</p>
              <p className={styles.sentNote}>
                We read every one. Expect a reply at {form.email}.
              </p>
            </div>
          ) : (
            <form className={styles.contact} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${fieldId}-name`}>
                  Name
                </label>
                <input
                  id={`${fieldId}-name`}
                  className={styles.input}
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${fieldId}-email`}>
                  Email
                </label>
                <input
                  id={`${fieldId}-email`}
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${fieldId}-message`}>
                  Message
                </label>
                <textarea
                  id={`${fieldId}-message`}
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  rows={4}
                  required
                  placeholder="What are you producing?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {status === 'error' ? (
                <p className={`${styles.formNote} ${styles.formError}`} role="alert">
                  Message didn't send. Try again in a moment.
                </p>
              ) : null}

              <button
                type="submit"
                className={`${styles.cta} ${styles.send}`}
                disabled={sending}
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.footerBase}>
        <span className={styles.label}>
          © {new Date().getFullYear()} Orchia Studio
        </span>
        <span className={styles.label}>Seattle, WA</span>
      </div>
    </footer>
  )
}
