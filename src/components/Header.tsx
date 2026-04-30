import { Link, useLocation, useNavigate } from 'react-router-dom'
import OrchiaLogo from './OrchiaLogo'

interface Props {
  scrolled: boolean
}

export default function Header({ scrolled }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleHome = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.history.replaceState(null, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      e.preventDefault()
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <>
      <div className="topbar-wrapper">
        <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
          <Link className="brand" to="/" aria-label="Orchia home" onClick={handleHome}>
            <span className="brand-wordmark">
              <span className="brand-name">Orchia</span>
              <span className="brand-suffix">.Studio</span>
            </span>
          </Link>
          <Link className="brand-emblem-link" to="/" aria-hidden="true" tabIndex={-1} onClick={handleHome}>
            <OrchiaLogo size={48} className="brand-emblem" />
          </Link>
          <nav className="nav nav-desktop" aria-label="Main navigation">
            <a href="/#work">Work</a>
            <a href="/#why-us">Why&nbsp;us</a>
            <a href="/#who-we-are">About</a>
            <a href="/#what-we-build">Capabilities</a>
            <a href="/blog">Journal</a>
            <a href="/#contact">Contact</a>
          </nav>
        </header>
      </div>

      <nav className="nav-mobile" aria-label="Mobile navigation">
        <a href="/#work">Work</a>
        <a href="/#why-us">Why&nbsp;us</a>
        <a href="/blog">Journal</a>
        <a href="/#contact">Contact</a>
      </nav>
    </>
  )
}
