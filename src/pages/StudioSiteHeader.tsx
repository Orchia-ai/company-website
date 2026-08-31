import { Link, useLocation } from 'react-router-dom'

import styles from './studio-site-header.module.css'

const discordDocsPath = '/docs/discord-video-workflow'
const aboutUsPath = '/about-us'

export default function StudioSiteHeader({
  sticky = true,
  homePath = '/',
}: {
  sticky?: boolean
  homePath?: string
}) {
  const { pathname } = useLocation()
  const discordDocsIsCurrent = pathname === discordDocsPath
  const aboutUsIsCurrent = pathname === aboutUsPath

  return (
    <div className={sticky ? styles.stickySlot : undefined}>
      <header className={`${styles.siteHeader} ${sticky ? styles.sticky : ''}`}>
        <Link className={styles.brand} to={homePath} aria-label="Orchia Studio home">
          <span>Orchia</span>
          <span className={styles.brandSuffix}>Studio</span>
        </Link>

        <nav className={styles.headerNav} aria-label="Primary navigation">
          <Link
            className={styles.headerLink}
            to={aboutUsPath}
            aria-current={aboutUsIsCurrent ? 'page' : undefined}
          >
            About us
          </Link>
          <Link
            className={styles.headerLink}
            to={discordDocsPath}
            aria-current={discordDocsIsCurrent ? 'page' : undefined}
          >
            Try in Discord
          </Link>
        </nav>
      </header>
    </div>
  )
}
