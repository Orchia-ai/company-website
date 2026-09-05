import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { fetchLeads, getSession, logout, type ManagerUser, type PublicLead } from '../features/manager/api'
import styles from './manager.module.css'

const STATE_FILTERS = ['all', 'completed', 'running', 'starting', 'accepted', 'failed', 'rejected'] as const

function stateClass(state: string) {
  if (state === 'completed') return styles.stateCompleted
  if (state === 'failed' || state === 'rejected') return styles.stateFailed
  if (state === 'running' || state === 'starting' || state === 'accepted') return styles.stateRunning
  return styles.stateBadge
}

function formatTime(value: string | null) {
  if (!value) return '—'
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? new Date(parsed).toLocaleString() : value
}

export default function ManagerDashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<ManagerUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [leads, setLeads] = useState<PublicLead[]>([])
  const [leadsError, setLeadsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [stateFilter, setStateFilter] = useState<string>('all')

  const load = useCallback(async (state: string) => {
    setLoading(true)
    setLeadsError(null)
    const result = await fetchLeads(state === 'all' ? undefined : state)
    if (result.error === 'unauthorized') {
      navigate('/manager/login')
      return
    }
    setLeadsError(result.error ?? null)
    setLeads(result.items)
    setLoading(false)
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const session = await getSession()
      if (cancelled) return
      if (!session.authenticated) {
        navigate('/manager/login')
        return
      }
      if (!session.authorized || session.user.role !== 'admin') {
        if (cancelled) return
        setChecking(false)
        setLeadsError('Administrator access required.')
        setUser(session.user)
        return
      }
      setUser(session.user)
      setChecking(false)
      void load(stateFilter)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signOut() {
    await logout()
    navigate('/manager/login')
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Video leads · Orchia Manager</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Video funnel leads</h1>
            <p className={styles.subtitle}>
              {user ? `Signed in as ${user.email} (${user.role})` : 'Public video projects created without an account.'}
            </p>
          </div>
          <div className={styles.controls}>
            <select
              className={styles.select}
              value={stateFilter}
              onChange={(event) => {
                setStateFilter(event.target.value)
                void load(event.target.value)
              }}
            >
              {STATE_FILTERS.map((value) => (
                <option key={value} value={value}>
                  {value === 'all' ? 'All states' : value}
                </option>
              ))}
            </select>
            <button className={styles.buttonQuiet} type="button" disabled={loading} onClick={() => void load(stateFilter)}>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button className={styles.button} type="button" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </div>

        {checking ? (
          <div className={styles.empty}>Checking your session…</div>
        ) : leadsError ? (
          <div className={styles.empty} role="alert">
            {leadsError}
          </div>
        ) : leads.length === 0 ? (
          <div className={styles.empty}>No public video projects yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Created</th>
                <th>Title</th>
                <th>Email</th>
                <th>Format</th>
                <th>State</th>
                <th>Progress</th>
                <th>Phase</th>
                <th>Player</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.publicId}>
                  <td className={styles.muted} style={{ whiteSpace: 'nowrap' }}>
                    {formatTime(lead.createdAt)}
                  </td>
                  <td className={styles.leadTitle}>{lead.title || <span className={styles.muted}>(untitled)</span>}</td>
                  <td>
                    {lead.email ? (
                      <a className={styles.link} href={`mailto:${lead.email}`}>
                        {lead.email}
                      </a>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                  <td className={styles.muted} style={{ whiteSpace: 'nowrap' }}>
                    {[lead.aspectRatio, lead.resolution?.toLowerCase()].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td>
                    <span className={stateClass(lead.state)}>{lead.state}</span>
                  </td>
                  <td>{lead.percent != null ? `${lead.percent}%` : '—'}</td>
                  <td>
                    {lead.phase || <span className={styles.muted}>—</span>}
                    {lead.error ? <div className={styles.muted} style={{ color: '#a33c2a' }}>{lead.error}</div> : null}
                  </td>
                  <td>
                    {lead.links?.player ? (
                      <a className={styles.link} href={lead.links.player} target="_blank" rel="noreferrer">
                        Open ↗
                      </a>
                    ) : (
                      <a className={styles.link} href={`/agent/results/${lead.publicId}`} target="_blank" rel="noreferrer">
                        Open ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
