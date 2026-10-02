import { useSyncExternalStore } from 'react'

let ready = false
let initialization: Promise<void> | undefined
const listeners = new Set<() => void>()

async function initialize() {
  if ('serviceWorker' in navigator && window.isSecureContext) {
    try {
      await navigator.serviceWorker.register('/video-cache-sw.js', { scope: '/' })
      await Promise.race([
        new Promise<void>((resolve) => {
          if (navigator.serviceWorker.controller) { resolve(); return }
          const onChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onChange)
            resolve()
          }
          navigator.serviceWorker.addEventListener('controllerchange', onChange, { once: true })
          window.setTimeout(onChange, 3000)
        }),
        new Promise<void>((resolve) => window.setTimeout(resolve, 4000)),
      ])
    } catch {
      // Native streaming remains available in private mode or unsupported browsers.
    }
  }
  ready = true
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  initialization ??= initialize()
  return () => { listeners.delete(listener) }
}

// Hold the initial request until the shared browser cache controls the page.
export function useCachedVideoSource(src: string | undefined) {
  const cacheReady = useSyncExternalStore(subscribe, () => ready, () => false)
  return cacheReady ? src : undefined
}

export function invalidateCachedVideoSource(src: string) {
  navigator.serviceWorker?.controller?.postMessage({ type: 'INVALIDATE_VIDEO', url: src })
}
