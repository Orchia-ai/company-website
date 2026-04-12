import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('form submitted', form)
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="cta" id="contact">
      <div className="cta-copy">
        <p className="eyebrow">Ready to move</p>
        <h2>Let's talk about what you're building.</h2>
      </div>

      {status === 'sent' ? (
        <div className="contact-sent">
          <p className="contact-sent-title">Message received.</p>
          <p className="contact-sent-sub">We'll be in touch within one business day.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="contact-input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            className="contact-input"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            className="contact-input contact-textarea"
            placeholder="Tell us about your project..."
            rows={5}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {status === 'error' && (
            <p className="contact-error">Something went wrong. Please try again.</p>
          )}
          <button type="submit" className="button-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </section>
  )
}
