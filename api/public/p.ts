import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Readable } from 'stream'

/** vercel.json rewrites every public API path onto this single function
 *  (Hobby plan caps deployments at 12 serverless functions). The proxy core
 *  is inlined because underscore-prefixed api/ modules are not bundled. */
const KIND_PATHS: Record<string, (id: string, op: string, artifact: string) => string> = {
  openapi: () => '/api/public/agent/openapi',
  projects: () => '/api/public/agent/projects',
  project: (id) => `/api/public/agent/projects/${id}`,
  media: (id) => `/api/public/agent/projects/${id}/media`,
  'completion-email': (id) => `/api/public/agent/projects/${id}/completion-email`,
  feedback: (id) => `/api/public/agent/projects/${id}/feedback`,
  'feedback-status': (id, op) => `/api/public/agent/projects/${id}/feedback/${op}`,
  reference: (id, _op, artifact) => `/api/public/agent/projects/${id}/references/${artifact}`,
  batch: (id) => `/api/public/video-batches/${id}`,
  'batch-media': (id) => `/api/public/video-batches/${id}/media`,
  'batch-feedback': (id) => `/api/public/video-batches/${id}/feedback`,
}

const SAFE_SEGMENT = /^[A-Za-z0-9_-]{1,128}$/
const BACKEND_URL = (process.env.VSA_BACKEND_URL ?? 'https://alpha.lingyizhou.com').replace(/\/$/, '')

/** Hop-by-hop headers must never be forwarded in either direction. */
const REQUEST_HEADER_DENY = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding', 'origin',
  'referer', 'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest',
  'accept-encoding', 'cookie', 'authorization',
])

const RESPONSE_HEADER_DENY = new Set([
  'connection', 'keep-alive', 'transfer-encoding', 'content-encoding', 'set-cookie',
])

export const maxDuration = 60

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const kind = String(req.query.kind ?? '')
  const id = String(req.query.id ?? '')
  const op = String(req.query.op ?? '')
  const artifact = String(req.query.artifact ?? '')
  const build = KIND_PATHS[kind]
  const needsOp = kind === 'feedback-status' || kind === 'reference'
  if (
    !build ||
    (kind !== 'openapi' && kind !== 'projects' && !SAFE_SEGMENT.test(id)) ||
    (needsOp && !SAFE_SEGMENT.test(kind === 'feedback-status' ? op : artifact))
  ) {
    return res.status(404).json({ error: { message: 'Unknown public endpoint.' } })
  }

  // Forward every original query parameter except the routing controls so
  // capability tokens and download flags keep working.
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'kind' || key === 'id' || key === 'op' || key === 'artifact') continue
    if (Array.isArray(value)) { for (const item of value) search.append(key, String(item)) }
    else search.append(key, String(value))
  }
  const query = search.toString()
  const target = `${BACKEND_URL}${build(id, op, artifact)}${query ? `?${query}` : ''}`

  const headers = new Headers()
  for (const [name, value] of Object.entries(req.headers)) {
    if (!value || REQUEST_HEADER_DENY.has(name.toLowerCase())) continue
    if (Array.isArray(value)) { for (const item of value) headers.append(name, item) }
    else headers.set(name, value)
  }
  // Canonical links in responses (player, status, media) are derived from the
  // forwarded host, so they keep pointing at this site instead of the backend.
  const forwardedHost = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '').split(',')[0].trim()
  if (forwardedHost) headers.set('x-forwarded-host', forwardedHost)
  headers.set('x-forwarded-proto', String(req.headers['x-forwarded-proto'] ?? 'https').split(',')[0].trim() || 'https')

  const method = (req.method ?? 'GET').toUpperCase()
  const init: RequestInit & { duplex?: 'half' } = { method, headers }
  if (method !== 'GET' && method !== 'HEAD') {
    const rawBody = (req as VercelRequest & { rawBody?: Buffer }).rawBody
    if (Buffer.isBuffer(rawBody) && rawBody.length > 0) {
      // Buffer is a Uint8Array at runtime; the lib types disagree under strict.
      init.body = new Blob([rawBody as unknown as BlobPart])
    } else if (req.body && typeof req.body === 'object' && Object.keys(req.body as object).length > 0) {
      init.body = JSON.stringify(req.body)
      if (!headers.has('content-type')) headers.set('content-type', 'application/json')
    } else {
      // Multipart uploads (reference images) are never parsed by the platform,
      // so the raw request stream still carries the full body.
      init.body = Readable.toWeb(req as Readable) as ReadableStream
      init.duplex = 'half'
    }
  }

  let upstream: Response
  try {
    upstream = await fetch(target, init)
  } catch (error) {
    res.status(502).json({
      error: { message: 'The video backend could not be reached.', detail: error instanceof Error ? error.message : undefined },
    })
    return
  }

  res.status(upstream.status)
  upstream.headers.forEach((value, name) => {
    if (!RESPONSE_HEADER_DENY.has(name.toLowerCase())) res.setHeader(name, value)
  })
  if (!upstream.body) {
    res.end()
    return
  }
  const nodeStream = Readable.fromWeb(upstream.body as import('stream/web').ReadableStream)
  nodeStream.on('error', () => { if (!res.writableEnded) res.end() })
  nodeStream.pipe(res)
}
