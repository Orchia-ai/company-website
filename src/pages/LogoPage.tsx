import { useEffect, useState } from 'react'
import OrchiaLogo from '../components/OrchiaLogo'

export default function LogoPage() {
  const [size, setSize] = useState(() => Math.min(window.innerWidth, window.innerHeight))

  useEffect(() => {
    const onResize = () => setSize(Math.min(window.innerWidth, window.innerHeight))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      <OrchiaLogo size={size} />
    </div>
  )
}
