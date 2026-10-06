import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SocialVideoScroller, { type SocialVideoItem } from './SocialVideoScroller'
import StudioSiteHeader from './StudioSiteHeader'
import filmStyles from './home-film-page.module.css'
import styles from './home-v2-page.module.css'
import pageStyles from './company-promotion-page.module.css'

const COMPANY_PROMOTION_VIDEOS: readonly SocialVideoItem[] = [
  {
    id: 'orchia-promotion-video-37-1',
    name: 'Orchia Promotional Video',
    src: 'https://media.lingyizhou.com/Compressed/orchia-promotion-video-37-1-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/orchia-promotion-video-37-1.mp4',
    poster: '/videos/orchia-promotion-video-37-1.jpg',
    handle: '@orchia.studio',
    caption: 'Orchia Studio · company promotion video.',
  },
]

export default function CompanyPromotionPage() {
  useEffect(() => {
    document.body.classList.add('film-mode')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <div className={`${filmStyles.page} ${styles.v2Page}`}>
      <Helmet>
        <title>Company Promotion — Turn your business into a video | Orchia Studio</title>
        <meta name="description" content="Turn your business into a video. Show what you do through a custom company promotion video. Watch Orchia Studio's example." />
        <link rel="canonical" href="https://orchia.studio/company-promotion-video" />
      </Helmet>
      <div className={styles.intro}>
        <StudioSiteHeader sticky />
        <main>
          <section className={styles.hero} aria-labelledby="company-promotion-hero-title">
            <div className={styles.heroSignup}>
              <h1 id="company-promotion-hero-title">Turn your business into a video.</h1>
              <p className={pageStyles.description}>
                Show what you do and why it matters with a custom company promotion video.
                See how Orchia Studio tells its own story.
              </p>
              <p className={styles.heroCreateAlt}>Select a video to watch the full company promotion example.</p>
            </div>
            <div className={styles.heroVideoWall}>
              <SocialVideoScroller
                videos={COMPANY_PROMOTION_VIDEOS}
                pixelsPerSecond={26}
                ariaLabel="Looping previews of the Orchia company promotion video"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
