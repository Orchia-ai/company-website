import type { VercelRequest, VercelResponse } from '@vercel/node'

/** vercel.json rewrites /api/auth/{login,logout,session} onto this single
 *  function (Hobby plan caps deployments at 12 serverless functions). The
 *  relay core is inlined because underscore-prefixed api/ modules are not
 *  bundled into serverless functions. */
const BACKEND_URL = (process.env.VSA_BACKEND_URL ?? 'https://alpha.lingyizhou.com').replace(/\/$/, '')

/** The backend trusts a fixed list of browser origins (AUTH_BRAND_ORIGINS)
 *  for CSRF checks. This site's apex origin is not in that list, so the BFF
 *  presents the backend's own origin for server-to-server mutations. The
 *  session itself is still validated purely from the HttpOnly cookie. */
function backendOrigin() {
  return new URL(BACKEND_URL).origin
}

function rewriteSetCookie(value: string, secure: boolean) {
  const parts = value.split(';').map(part => part.trim()).filter(Boolean)
  const kept = parts.filter(part => {
    const lower = part.toLowerCase()
    return !lower.startsWith('domain=') && !lower.startsWith('samesite=') && lower !== 'secure'
  })
  kept.push('Path=/', 'SameSite=Lax')
  if (secure) kept.push('Secure')
  return kept.join('; ')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = String(req.query.action ?? '')
  if (action !== 'login' && action !== 'logout' && action !== 'session') {
    return res.status(404).json({ error: { message: 'Unknown auth endpoint.' } })
  }

  const method = (req.method ?? 'GET').toUpperCase()
  if (action === 'session' && method !== 'GET') return void res.status(405).end()
  if ((action === 'login' || action === 'logout') && method !== 'POST') return void res.status(405).end()

  const headers = new Headers()
  const cookie = req.headers.cookie
  if (cookie) headers.set('cookie', cookie)
  headers.set('content-type', 'application/json')
  headers.set('accept', 'application/json')
  if (method === 'POST') {
    // Browsers send Origin + Sec-Fetch-Site on mutations; a BFF relay is
    // server-to-server, so the backend sees its own trusted origin and no
    // browser cross-site markers.
    headers.set('origin', backendOrigin())
  }

  const body = action === 'login' && req.body ? JSON.stringify(req.body) : undefined
  let upstream: Response
  try {
    upstream = await fetch(`${BACKEND_URL}/api/auth/${action}`, {
      method,
      headers,
      body,
    })
  } catch (error) {
    res.status(502).json({ error: { message: 'The account service could not be reached.', detail: error instanceof Error ? error.message : undefined } })
    return
  }

  const secure = String(req.headers['x-forwarded-proto'] ?? 'https').split(',')[0].trim() === 'https'
  const setCookies = typeof upstream.headers.getSetCookie === 'function'
    ? upstream.headers.getSetCookie()
    : upstream.headers.get('set-cookie') ? [upstream.headers.get('set-cookie') as string] : []
  for (const value of setCookies) {
    res.appendHeader('set-cookie', rewriteSetCookie(value, secure))
  }

  res.status(upstream.status)
  const contentType = upstream.headers.get('content-type')
  if (contentType) res.setHeader('content-type', contentType)
  res.setHeader('cache-control', 'no-store')
  const text = await upstream.text()
  res.send(text)
}
