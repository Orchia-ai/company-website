import { Link, useLocation, useNavigate } from 'react-router-dom'
import OrchiaLogo from './OrchiaLogo'

interface Props {
  scrolled: boolean
}

/**
 * `/` is the demo film now, so the marketing site — and every section anchor
 * this header points at — lives under `/studio`.
 */
const SITE_ROOT = '/studio'

export default function Header({ scrolled }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === SITE_ROOT) {
      window.history.replaceState(null, '', SITE_ROOT)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(SITE_ROOT)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <>
      <div className="topbar-wrapper">
        <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
          <Link className="brand" to={SITE_ROOT} aria-label="Orchia home" onClick={handleHome}>
            <span className="brand-wordmark">
              <span className="brand-name">Orchia</span>
              <span className="brand-suffix">.Studio</span>
            </span>
          </Link>
          <Link className="brand-emblem-link" to={SITE_ROOT} aria-hidden="true" tabIndex={-1} onClick={handleHome}>
            <OrchiaLogo size={48} className="brand-emblem" />
          </Link>
          <nav className="nav nav-desktop" aria-label="Main navigation">
            <a href={`${SITE_ROOT}#case-study`}>Case Study</a>
            <a href={`${SITE_ROOT}#services`}>Services</a>
            <a href={`${SITE_ROOT}#about`}>About</a>
          </nav>
        </header>
      </div>

      <nav className="nav-mobile" aria-label="Mobile navigation">
        <a href={`${SITE_ROOT}#case-study`}>Case Study</a>
        <a href={`${SITE_ROOT}#services`}>Services</a>
        <a href={`${SITE_ROOT}#about`}>About</a>
        <a href={`${SITE_ROOT}#contact`}>Contact</a>
      </nav>
    </>
  )
}
