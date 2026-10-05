import { Link, useLocation } from 'react-router-dom'

import styles from './studio-site-header.module.css'

const NAV_ITEMS = [
  { label: 'House Tour', path: '/house-tour-video' },
  { label: 'Vertical Drama', path: '/vertical-drama-video' },
  { label: 'Company Promotion', path: '/company-promotion-video' },
  { label: 'Tools', path: '/about-us' },
] as const

export default function StudioSiteHeader({
  sticky = true,
  homePath = '/',
}: {
  sticky?: boolean
  homePath?: string
}) {
  const { pathname } = useLocation()

  return (
    <div className={sticky ? styles.stickySlot : undefined}>
      <header className={`${styles.siteHeader} ${sticky ? styles.sticky : ''}`}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} to={homePath} aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>

          <nav className={styles.headerNav} aria-label="Primary navigation">
            <div className={styles.videoLinks}>
              {NAV_ITEMS.slice(0, 3).map(({ label, path }) => (
                <Link
                  key={path}
                  className={styles.headerLink}
                  to={path}
                  aria-current={pathname === path ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link
              className={`${styles.headerLink} ${styles.toolsLink}`}
              to="/about-us"
              aria-current={pathname === '/about-us' ? 'page' : undefined}
            >
              Tools
            </Link>
          </nav>
        </div>
      </header>
    </div>
  )
}
