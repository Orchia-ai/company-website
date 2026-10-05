import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SocialVideoScroller, { type SocialVideoItem } from './SocialVideoScroller'
import StudioSiteHeader from './StudioSiteHeader'
import filmStyles from './home-film-page.module.css'
import styles from './home-v2-page.module.css'
import houseStyles from './house-tour-page.module.css'

const HOUSE_TOUR_VIDEOS: readonly SocialVideoItem[] = [
  {
    id: 'house-tour-listing-20261005',
    name: 'Immersive House Tour',
    src: 'https://media.lingyizhou.com/Compressed/house-tour-listing-20261005-540p.mp4?v=20261005',
    fullSrc: 'https://media.lingyizhou.com/high-res/house-tour-listing-20261005.mp4',
    poster: '/videos/house-tour-listing-20261005.jpg',
    handle: '@orchia.studio',
    caption: 'An immersive online house tour.',
  },
  {
    id: 'seattle-home-tour',
    name: 'Seattle Home Tour',
    src: 'https://media.lingyizhou.com/Compressed/final-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/final.mp4',
    poster: '/videos/final-540p.jpg',
    handle: '@orchia.studio',
    caption: 'A Seattle home tour.',
  },
]

export default function HouseTourPage() {
  useEffect(() => {
    document.body.classList.add('film-mode')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <div className={`${filmStyles.page} ${styles.v2Page}`}>
      <Helmet>
        <title>House Tour — Turn your listing into a video | Orchia Studio</title>
        <meta name="description" content="Turn your listing into a video. Bring an immersive experience to online house tours and help buyers imagine life in the home." />
        <link rel="canonical" href="https://orchia.studio/house-tour-video" />
      </Helmet>
      <div className={styles.intro}>
        <StudioSiteHeader sticky />
        <main className={houseStyles.content}>
          <section className={styles.hero} aria-labelledby="house-tour-hero-title">
            <div className={styles.heroSignup}>
              <h1 id="house-tour-hero-title">Turn your listing into a video.</h1>
              <p className={houseStyles.description}>
                Bring an immersive experience to online house tours.
                Help buyers explore the space and imagine life in the home.
              </p>
              <p className={styles.heroCreateAlt}>Select a video to watch the full house tour.</p>
            </div>
            <div className={styles.heroVideoWall}>
              <SocialVideoScroller
                videos={HOUSE_TOUR_VIDEOS}
                pixelsPerSecond={26}
                ariaLabel="Looping previews of an immersive house tour video"
              />
            </div>
          </section>
          <section className={styles.bookingSection} id="book-a-call" aria-labelledby="booking-title">
            <header className={styles.bookingHeader}>
              <div>
                <h2 id="booking-title">Book a call.</h2>
                <p>Choose a time to talk about your listing and the house tour video you have in mind.</p>
              </div>
              <a
                className={styles.bookingLink}
                href="https://calendar.app.google/6x39SwYvynnyQzHq5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open booking page <span aria-hidden="true">↗</span>
                <span className={filmStyles.srOnly}> (opens in a new tab)</span>
              </a>
            </header>
            <div className={styles.bookingViewport}>
              <iframe
                className={styles.bookingCalendar}
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ39iVeXrG5uAckjVglfOwUsTWCgZZMgCemIeu1xi9_6M_vlPTpgs6ShCfje-2imMS5GW4C6Alpt?gv=true"
                title="Book an appointment with Orchia Studio on Google Calendar"
                width="100%"
                height="940"
                loading="lazy"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
