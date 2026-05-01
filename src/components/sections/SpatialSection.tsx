import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const MODEL_GLB = 'https://modelviewer.dev/shared-assets/models/Chair.glb'
const MODEL_USDZ = 'https://modelviewer.dev/shared-assets/models/Chair.usdz'
const POSTER = 'https://modelviewer.dev/assets/poster-chair.webp'

type ModelViewerEl = HTMLElement & {
  canActivateAR?: boolean
  activateAR?: () => Promise<void>
}

export default function SpatialSection() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<ModelViewerEl | null>(null)
  const [inView, setInView] = useState(false)
  const [moduleReady, setModuleReady] = useState(false)
  const [canAR, setCanAR] = useState(false)
  const [qrSrc, setQrSrc] = useState<string>('')

  // 1) Load model-viewer only when section scrolls into view
  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    import('@google/model-viewer')
      .then(() => {
        if (!cancelled) setModuleReady(true)
      })
      .catch(() => {
        if (!cancelled) setModuleReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [inView])

  // 2) Generate QR on mount — encodes the same page with #try-ar so phone arrives ready
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}${window.location.pathname}#try-ar`
    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: { dark: '#1e1812', light: '#0000' },
    })
      .then(setQrSrc)
      .catch(() => setQrSrc(''))
  }, [])

  // 3) Detect AR capability + auto-activate when arriving via #try-ar
  useEffect(() => {
    if (!moduleReady) return
    const el = viewerRef.current
    if (!el) return

    const onLoad = () => {
      setCanAR(Boolean(el.canActivateAR))
      if (window.location.hash === '#try-ar' && el.canActivateAR) {
        el.activateAR?.().catch(() => {})
        history.replaceState(null, '', window.location.pathname)
      }
    }
    el.addEventListener('load', onLoad)
    return () => el.removeEventListener('load', onLoad)
  }, [moduleReady])

  return (
    <section className="section-block spatial-section" id="spatial" ref={wrapperRef}>
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 04 — Spatial</span>
          <span className="mono-label">Live AR Demo</span>
        </div>
        <h2>
          See the piece in <em>your room</em> before you commit.
        </h2>
      </div>

      <div className="spatial-grid">
        <div className="spatial-copy">
          <p className="spatial-body">
            This isn’t a render. Point your phone at the floor and place a real-scale chair in your
            space — the same AR commerce layer we ship for furniture and lifestyle brands.
          </p>
          <ul className="spatial-bullets" aria-label="Spatial capabilities">
            <li><span className="spatial-bullet-dot" />Real-world scale</li>
            <li><span className="spatial-bullet-dot" />Native iOS &amp; Android</li>
            <li><span className="spatial-bullet-dot" />Zero app install</li>
          </ul>
          <p className="spatial-foot mono-label">
            Powered by Google &lt;model-viewer&gt; · ARKit Quick Look · ARCore Scene Viewer
          </p>
        </div>

        <div className="spatial-stage">
          <div className="spatial-viewer-frame">
            <div className="spatial-corner spatial-corner-tl" aria-hidden="true" />
            <div className="spatial-corner spatial-corner-tr" aria-hidden="true" />
            <div className="spatial-corner spatial-corner-bl" aria-hidden="true" />
            <div className="spatial-corner spatial-corner-br" aria-hidden="true" />

            {moduleReady ? (
              <model-viewer
                ref={viewerRef as never}
                src={MODEL_GLB}
                ios-src={MODEL_USDZ}
                alt="A chair you can place in your room"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="0.95"
                poster={POSTER}
                reveal="auto"
                loading="lazy"
                touch-action="pan-y"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
              >
                <button slot="ar-button" className="spatial-ar-btn">
                  View in your space
                </button>
              </model-viewer>
            ) : (
              <div className="spatial-viewer-placeholder" aria-hidden="true">
                <img src={POSTER} alt="" />
              </div>
            )}
          </div>

          <div className={`spatial-handoff${canAR ? ' spatial-handoff--mobile' : ''}`}>
            {canAR ? (
              <p className="spatial-handoff-text">
                Tap <strong>View in your space</strong> to launch AR.
              </p>
            ) : (
              <>
                <div className="spatial-qr">
                  {qrSrc ? <img src={qrSrc} alt="QR code to open this demo on your phone" /> : null}
                </div>
                <div className="spatial-handoff-text">
                  <span className="mono-label">On a desktop?</span>
                  <p>
                    Scan to continue on your phone — the AR session opens automatically when you
                    land.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="spatial-plate" aria-hidden="true">
        <span className="mono-label">Pl. AR-001</span>
      </div>
    </section>
  )
}
