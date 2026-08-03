import { Link, useLocation } from 'react-router-dom'

import styles from './studio-site-header.module.css'

const discordDocsPath = '/docs/discord-video-workflow'

export default function StudioSiteHeader({ sticky = false }: { sticky?: boolean }) {
  const { pathname } = useLocation()
  const discordDocsIsCurrent = pathname === discordDocsPath

  return (
    <header className={`${styles.siteHeader} ${sticky ? styles.sticky : ''}`}>
      <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
        <span>Orchia</span>
        <span className={styles.brandSuffix}>Studio</span>
      </Link>

      <nav className={styles.headerNav} aria-label="Primary navigation">
        <Link
          className={styles.headerLink}
          to={discordDocsPath}
          aria-current={discordDocsIsCurrent ? 'page' : undefined}
        >
          Try in Discord
        </Link>
      </nav>
    </header>
  )
}
