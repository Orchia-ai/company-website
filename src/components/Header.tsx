import { Link } from 'react-router-dom'
import OrchiaLogo from './OrchiaLogo'

interface Props {
  scrolled: boolean
}

export default function Header({ scrolled }: Props) {
  return (
    <>
      <div className="topbar-wrapper">
        <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
          <Link className="brand" to="/" aria-label="Orchia home">
            <span className="brand-wordmark">
              <span className="brand-name">Orchia</span>
              <span className="brand-suffix">.Studio</span>
            </span>
          </Link>
          <Link className="brand-emblem-link" to="/" aria-hidden="true" tabIndex={-1}>
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
