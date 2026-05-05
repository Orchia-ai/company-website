import { useRef } from 'react'
import OrchiaLogo, { type OrchiaLogoHandle } from '../components/OrchiaLogo'

export default function LogoPage() {
  const logoRef = useRef<OrchiaLogoHandle>(null)

  return (
    <>
      <OrchiaLogo ref={logoRef} fullscreen showText />
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
