import type { VercelRequest, VercelResponse } from '@vercel/node'

const BACKEND_URL = (process.env.VSA_BACKEND_URL ?? 'https://alpha.lingyizhou.com').replace(/\/$/, '')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  if (!req.headers.cookie) {
    return res.status(401).json({ error: { message: 'Authentication required.' } })
  }

  const searchIndex = req.url?.indexOf('?') ?? -1
  const search = searchIndex >= 0 ? (req.url as string).slice(searchIndex) : ''

  let upstream: Response
  try {
    upstream = await fetch(`${BACKEND_URL}/api/admin/public-agent-projects${search}`, {
      method: 'GET',
      headers: {
        cookie: req.headers.cookie,
        accept: 'application/json',
      },
      cache: 'no-store',
    })
  } catch (error) {
    return res.status(502).json({ error: { message: 'The video backend could not be reached.', detail: error instanceof Error ? error.message : undefined } })
  }

  res.status(upstream.status)
  res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json')
  res.setHeader('cache-control', 'no-store')
  res.send(await upstream.text())
}
