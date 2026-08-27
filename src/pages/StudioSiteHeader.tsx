import { Link, useLocation } from 'react-router-dom'

import styles from './studio-site-header.module.css'

const discordDocsPath = '/docs/discord-video-workflow'

export default function StudioSiteHeader({
  sticky = true,
  homePath = '/',
  pricingHref = '/#pricing',
}: {
  sticky?: boolean
  homePath?: string
  pricingHref?: string
}) {
  const { pathname } = useLocation()
  const discordDocsIsCurrent = pathname === discordDocsPath

  return (
    <div className={sticky ? styles.stickySlot : undefined}>
      <header className={`${styles.siteHeader} ${sticky ? styles.sticky : ''}`}>
        <Link className={styles.brand} to={homePath} aria-label="Orchia Studio home">
          <span>Orchia</span>
          <span className={styles.brandSuffix}>Studio</span>
        </Link>

        <nav className={styles.headerNav} aria-label="Primary navigation">
          <a className={styles.headerLink} href={pricingHref}>
            Beta pricing
          </a>
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
