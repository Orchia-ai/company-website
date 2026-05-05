import { useRef, useState } from 'react'
import OrchiaLogo, {
  DEFAULT_TUNING,
  type OrchiaLogoHandle,
  type OrchiaLogoTuning,
} from '../components/OrchiaLogo'

interface SliderDef {
  key: keyof OrchiaLogoTuning
  label: string
  min: number
  max: number
  step: number
}

const SLIDERS: SliderDef[] = [
  { key: 'markScale',         label: 'Mark scale',        min: 0.30, max: 1.80, step: 0.01 },
  { key: 'orchiaScale',       label: 'ORCHIA size',       min: 0.40, max: 3.00, step: 0.01 },
  { key: 'studioScale',       label: 'STUDIO size',       min: 0.40, max: 3.00, step: 0.01 },
  { key: 'textOffset',        label: 'Text Y offset',     min: 0.40, max: 2.00, step: 0.01 },
  { key: 'geometryAlpha',     label: 'Geometry opacity',  min: 0.00, max: 2.50, step: 0.01 },
  { key: 'slimeAlpha',        label: 'Slime opacity',     min: 0.00, max: 2.50, step: 0.01 },
  { key: 'harmonographAlpha', label: 'Harmonograph opacity', min: 0.00, max: 2.50, step: 0.01 },
  { key: 'flowAlpha',         label: 'Flow opacity',      min: 0.00, max: 2.50, step: 0.01 },
  { key: 'neuralAlpha',       label: 'Neural opacity',    min: 0.00, max: 2.50, step: 0.01 },
  { key: 'speed',             label: 'Speed',             min: 0.00, max: 3.00, step: 0.01 },
]

export default function LogoPage() {
  const logoRef = useRef<OrchiaLogoHandle>(null)
  const [tuning, setTuning] = useState<OrchiaLogoTuning>({ ...DEFAULT_TUNING })
  const [showText, setShowText] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)

  const update = (key: keyof OrchiaLogoTuning, value: number) =>
    setTuning(prev => ({ ...prev, [key]: value }))

  const reset = () => setTuning({ ...DEFAULT_TUNING })

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: '"Josefin Sans", sans-serif',
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(48,46,44,0.75)',
    marginBottom: 4,
  }

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: 'rgba(48,46,44,0.06)',
    border: '1px solid rgba(48,46,44,0.20)',
    borderRadius: 4,
    color: 'rgba(48,46,44,0.75)',
    fontSize: 11,
    letterSpacing: '0.08em',
    fontFamily: '"Josefin Sans", sans-serif',
    fontWeight: 300,
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
  }

  return (
    <>
      <OrchiaLogo ref={logoRef} fullscreen showText={showText} tuning={tuning} />

      {/* Tuning panel — HTML overlay, NOT rendered into saved PNG */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          width: panelOpen ? 280 : 'auto',
          padding: panelOpen ? 16 : '8px 12px',
          background: 'rgba(245,240,232,0.85)',
          border: '1px solid rgba(48,46,44,0.14)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: panelOpen ? 12 : 0 }}>
          <span style={{
            fontFamily: '"Josefin Sans", sans-serif',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(48,46,44,0.75)',
          }}>
            Tuning
          </span>
          <button onClick={() => setPanelOpen(o => !o)} style={{ ...buttonStyle, padding: '2px 8px', fontSize: 10 }}>
            {panelOpen ? '−' : '+'}
          </button>
        </div>

        {panelOpen && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontFamily: '"Josefin Sans", sans-serif', fontSize: 11, color: 'rgba(48,46,44,0.75)' }}>
              <input
                type="checkbox"
                checked={showText}
                onChange={e => setShowText(e.target.checked)}
                style={{ accentColor: 'rgba(48,46,44,0.6)' }}
              />
              Show wordmark
            </label>

            {SLIDERS.map(s => (
              <div key={s.key} style={{ marginBottom: 10 }}>
                <div style={labelStyle}>
                  <span>{s.label}</span>
                  <span style={{ opacity: 0.55 }}>{tuning[s.key].toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={tuning[s.key]}
                  onChange={e => update(s.key, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'rgba(48,46,44,0.6)' }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={reset} style={{ ...buttonStyle, flex: 1 }}>RESET</button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => logoRef.current?.save('orchia-logo')}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
          padding: '8px 18px',
          background: 'rgba(48,46,44,0.08)',
          border: '1px solid rgba(48,46,44,0.22)',
          borderRadius: 6,
          color: 'rgba(48,46,44,0.7)',
          fontSize: 12,
          letterSpacing: '0.08em',
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: 300,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        SAVE PNG
      </button>
    </>
  )
}
