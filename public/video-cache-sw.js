/* global self, caches, fetch */
/* Shared media cache only: no HTML, API, authentication, or app-shell caching. */
// Bump the version if a configured file is replaced at the same URL.
const CACHE_NAME = 'orchia-video-previews-v2'
const pending = new Map()
const writes = new Map()
const invalidations = new Map()
const reloadUrls = new Set()
const previewUrls = new Set([
  'https://media.lingyizhou.com/Compressed/house-tour-listing-20261005-540p.mp4?v=20261005',
  'https://media.lingyizhou.com/Compressed/orchia-promotion-video-37-1-540p.mp4',
  'https://media.lingyizhou.com/Compressed/07-14-import-540p.mp4',
  'https://media.lingyizhou.com/Compressed/BrotherNeedBetterPot-540p.mp4',
  'https://media.lingyizhou.com/Compressed/ForYou-540p.mp4',
  'https://media.lingyizhou.com/Compressed/GardenMaster-540p.mp4',
  'https://media.lingyizhou.com/Compressed/LoveWho-540p.mp4',
  'https://media.lingyizhou.com/Compressed/NameBook-540p.mp4',
  'https://media.lingyizhou.com/Compressed/Yuna-Day-One-clean-540p.mp4',
  'https://media.lingyizhou.com/Compressed/final-540p.mp4',
])

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const names = await caches.keys()
  await Promise.all(names.filter((name) => name.startsWith('orchia-video-previews-') && name !== CACHE_NAME).map((name) => caches.delete(name)))
  await self.clients.claim()
})()))

async function sharedPreview(url, event) {
  await invalidations.get(url)
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(url)
  if (cached) return cached

  let download = pending.get(url)
  if (!download) {
    const needsReload = reloadUrls.delete(url)
    download = fetch(url, { mode: 'no-cors', credentials: 'omit', cache: needsReload ? 'reload' : 'force-cache' })
    pending.set(url, download)
    // Cache a separate stream without delaying initial video playback.
    const persistence = download.then(async (response) => {
      if (response.type !== 'opaque' && !response.ok) throw new Error('Video download failed')
      await cache.put(url, response.clone())
    }).catch(() => undefined).finally(() => {
      if (pending.get(url) === download) pending.delete(url)
      if (writes.get(url) === persistence) writes.delete(url)
    })
    writes.set(url, persistence)
    event.waitUntil(persistence)
  }
  return (await download).clone()
}

// Opaque responses hide HTTP errors. A player error evicts the corresponding
// entry so a repaired object can load on the next attempt.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'INVALIDATE_VIDEO') return
  const url = event.data.url
  if (!previewUrls.has(url)) return
  pending.delete(url)
  reloadUrls.add(url)
  const eviction = Promise.resolve(writes.get(url)).then(() => caches.open(CACHE_NAME)).then((cache) => cache.delete(url))
  invalidations.set(url, eviction)
  event.waitUntil(eviction.finally(() => {
    if (invalidations.get(url) === eviction) invalidations.delete(url)
  }))
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url
  if (event.request.method !== 'GET' || event.request.destination !== 'video' || !previewUrls.has(url)) return
  event.respondWith(sharedPreview(url, event).catch(() => fetch(event.request)))
})
