import { useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../features/manager/api'
import styles from './manager.module.css'

export default function ManagerLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const result = await login(email.trim(), password)
    if (!result.ok) {
      setError(result.error ?? 'Sign-in failed.')
      setSubmitting(false)
      return
    }
    if (!result.authorized) {
      setError('Your account is not active yet. Ask an administrator to approve access.')
      setSubmitting(false)
      return
    }
    navigate('/manager')
  }

  return (
    <div className={styles.loginWrap}>
      <Helmet>
        <title>Manager sign-in · Orchia</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <form className={styles.loginCard} onSubmit={submit}>
        <h1>Manager sign-in</h1>
        <p>Video funnel leads dashboard. Uses your Orchia workspace account.</p>
        <div className={styles.field}>
          <label htmlFor="manager-email">Email</label>
          <input
            id="manager-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="manager-password">Password</label>
          <input
            id="manager-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className={styles.button} type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <p className={styles.muted} style={{ marginTop: 24, fontSize: 13 }}>
          <Link className={styles.link} to="/">
            ← Back to orchia.studio
          </Link>
        </p>
      </form>
    </div>
  )
}
