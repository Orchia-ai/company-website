import { useEffect, useState } from 'react'
import OrchiaBackground from './OrchiaBackground'
import OrchiaLogo from './OrchiaLogo'

interface Props {
  onEnter: () => void
}

export default function SplashScreen({ onEnter }: Props) {
  const [leaving, setLeaving] = useState(false)
  const [logoSize, setLogoSize] = useState(() => Math.min(window.innerWidth, window.innerHeight))

  useEffect(() => {
    const onResize = () => setLogoSize(Math.min(window.innerWidth, window.innerHeight))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleEnter = () => {
    setLeaving(true)
    setTimeout(onEnter, 700)
  }

  return (
    <div className={`splash${leaving ? ' splash-leave' : ''}`}>
      <OrchiaBackground />
      <div className="splash-content">
        <OrchiaLogo size={logoSize} className="splash-emblem" />
        <div className="splash-overlay">
          <div className="splash-logo">
            <span className="splash-wordmark">Orchia</span>
            <span className="splash-suffix">.Studio</span>
          </div>
          <button className="splash-enter" onClick={handleEnter} aria-label="Enter site">
            Enter
            <span className="splash-enter-line" />
          </button>
        </div>
      </div>
    </div>
  )
}
