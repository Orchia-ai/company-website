export type ManagerUser = {
  id: string
  email: string
  name: string
  accessStatus: 'pending' | 'active' | 'revoked'
  role: 'member' | 'admin'
}

export type ManagerSession =
  | { authenticated: false; authorized: false; user?: undefined }
  | { authenticated: true; authorized: boolean; user: ManagerUser }

export type PublicLead = {
  publicId: string
  title: string | null
  email: string | null
  aspectRatio: string | null
  resolution: string | null
  state: string
  percent: number | null
  phase: string | null
  workflowVersion: string
  error: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  links: { player: string; status: string } | null
}

export async function getSession(): Promise<ManagerSession> {
  const response = await fetch('/api/auth/session', { cache: 'no-store' })
  if (!response.ok) return { authenticated: false, authorized: false }
  return (await response.json()) as ManagerSession
}

export async function login(email: string, password: string): Promise<{
  ok: boolean
  authorized?: boolean
  user?: ManagerUser
  error?: string
}> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; authorized?: boolean; user?: ManagerUser; error?: string }
    | null
  if (!response.ok || !payload?.ok) {
    return { ok: false, error: payload?.error || 'Invalid email or password.' }
  }
  return { ok: true, authorized: payload.authorized, user: payload.user }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' })
}

export async function fetchLeads(state?: string): Promise<{ items: PublicLead[]; error?: string }> {
  const search = state ? `?state=${encodeURIComponent(state)}` : ''
  const response = await fetch(`/api/manager/public-projects${search}`, { cache: 'no-store' })
  if (response.status === 401) return { items: [], error: 'unauthorized' }
  if (response.status === 403) return { items: [], error: 'Administrator access required.' }
  if (response.status === 404) {
    return { items: [], error: 'The leads endpoint is not deployed on this backend yet. Update the video backend and retry.' }
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
    return { items: [], error: payload?.error?.message || `The leads request failed (${response.status}).` }
  }
  const payload = (await response.json()) as { items?: PublicLead[] }
  return { items: payload.items ?? [] }
}
