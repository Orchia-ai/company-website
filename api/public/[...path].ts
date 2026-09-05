import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Readable } from 'stream'

/** Media downloads and multipart uploads stream through this proxy; video
 *  responses can outlast the default function budget. */
export const maxDuration = 60

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const suffix = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path ?? '')
  const searchIndex = req.url?.indexOf('?') ?? -1
  const search = searchIndex >= 0 ? (req.url as string).slice(searchIndex) : ''
  const target = `${BACKEND_URL}/api/public/${suffix}${search}`

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
  let body: ReadableStream | string | undefined
  const init: RequestInit & { duplex?: 'half' } = { method, headers }
  if (method !== 'GET' && method !== 'HEAD') {
    if (Buffer.isBuffer(req.rawBody) && req.rawBody.length > 0) {
      body = new Uint8Array(req.rawBody)
    } else if (req.body && typeof req.body === 'object') {
      body = JSON.stringify(req.body)
      if (!headers.has('content-type')) headers.set('content-type', 'application/json')
    } else {
      // Multipart uploads (reference images) are never parsed by the platform,
      // so the raw request stream still carries the full body.
      body = Readable.toWeb(req as Readable) as ReadableStream
      init.duplex = 'half'
    }
    init.body = body
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
