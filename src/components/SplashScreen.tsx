import { useState } from 'react'

interface Props {
  onEnter: () => void
}

export default function SplashScreen({ onEnter }: Props) {
  const [leaving, setLeaving] = useState(false)

  const handleEnter = () => {
    setLeaving(true)
    setTimeout(onEnter, 700)
  }

  return (
    <div className={`splash${leaving ? ' splash-leave' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <span className="splash-wordmark">Orchia</span>
          <span className="splash-suffix">.Studio</span>
        </div>
        <p className="splash-tagline">
          Orchestrating design, infrastructure, and advanced technology — AR, 3D, and AI — into a single, cohesive product.
        </p>
        <button className="splash-enter" onClick={handleEnter} aria-label="Enter site">
          Enter
          <span className="splash-enter-line" />
        </button>
      </div>
    </div>
  )
}
