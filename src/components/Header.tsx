interface Props {
  scrolled: boolean
}

export default function Header({ scrolled }: Props) {
  return (
    <>
      <div className="topbar-wrapper">
        <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
          <a className="brand" href="#hero" aria-label="Orchia home">
            <span className="brand-wordmark">
              <span className="brand-name">Orchia</span>
              <span className="brand-suffix">.Studio</span>
            </span>
          </a>
          <nav className="nav nav-desktop" aria-label="Main navigation">
            <a href="#who-we-are">About</a>
            <a href="#why-us">Why us</a>
            <a href="#what-we-build">Work</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>
      </div>

      <nav className="nav-mobile" aria-label="Mobile navigation">
        <a href="#who-we-are">About</a>
        <a href="#why-us">Why us</a>
        <a href="#what-we-build">Work</a>
        <a href="#contact">Contact</a>
      </nav>
    </>
  )
}
