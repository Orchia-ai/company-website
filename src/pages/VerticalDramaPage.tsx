import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import SocialVideoScroller, { type SocialVideoItem } from './SocialVideoScroller'
import StudioSiteHeader from './StudioSiteHeader'
import filmStyles from './home-film-page.module.css'
import styles from './home-v2-page.module.css'
import pageStyles from './vertical-drama-page.module.css'

const VERTICAL_DRAMA_VIDEOS: readonly SocialVideoItem[] = [
  {
    id: '07-14-import',
    name: 'Your brother wants an imported flowerpot',
    src: 'https://media.lingyizhou.com/Compressed/07-14-import-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/v2-07-14-import.mp4',
    poster: '/data-slides/thumbnails/07-14-import.jpg',
    handle: '@orchia.studio',
    caption: '1.45M views · 67% watched to the end.',
  },
  {
    id: '07-23-returned-with-99-doubles',
    name: 'I returned with 99 doubles to reclaim my home',
    src: 'https://media.lingyizhou.com/Compressed/GardenMaster-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/GardenMaster.MP4',
    poster: '/data-slides/thumbnails/07-23.jpg',
    handle: '@orchia.studio',
    caption: '633K views · 40% watched to the end.',
  },
  {
    id: 'BrotherNeedBetterPot',
    name: 'BrotherNeedBetterPot',
    src: 'https://media.lingyizhou.com/Compressed/BrotherNeedBetterPot-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/BrotherNeedBetterPot.MOV',
    poster: '/videos/BrotherNeedBetterPot-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'ForYou',
    name: 'ForYou',
    src: 'https://media.lingyizhou.com/Compressed/ForYou-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/ForYou.MOV',
    poster: '/videos/ForYou-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'LoveWho',
    name: 'LoveWho',
    src: 'https://media.lingyizhou.com/Compressed/LoveWho-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/LoveWho.MP4',
    poster: '/videos/LoveWho-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'NameBook',
    name: 'NameBook',
    src: 'https://media.lingyizhou.com/Compressed/NameBook-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/NameBook.MP4',
    poster: '/videos/NameBook-540p.jpg',
    handle: '@orchia.studio',
    caption: 'An Orchia video production.',
  },
  {
    id: 'Yuna-Day-One-clean',
    name: 'Yuna · Day One',
    src: 'https://media.lingyizhou.com/Compressed/Yuna-Day-One-clean-540p.mp4',
    fullSrc: 'https://media.lingyizhou.com/high-res/Yuna-Day-One-clean.mp4',
    poster: '/videos/Yuna-Day-One-clean-540p.jpg',
    handle: '@orchia.studio',
    caption: 'Yuna · Day One.',
  },
]
export default function VerticalDramaPage() {
  useEffect(() => {
    document.body.classList.add('film-mode')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('film-mode')
  }, [])

  return (
    <div className={`${filmStyles.page} ${styles.v2Page}`}>
      <Helmet>
        <title>Vertical Drama — Turn your story into a series | Orchia Studio</title>
        <meta name="description" content="Turn your story into a vertical drama. Explore short-form stories and character-driven videos from Orchia Studio." />
        <link rel="canonical" href="https://orchia.studio/vertical-drama-video" />
      </Helmet>
      <div className={styles.intro}>
        <StudioSiteHeader sticky />
        <main>
          <section className={styles.hero} aria-labelledby="vertical-drama-hero-title">
            <div className={styles.heroSignup}>
              <h1 id="vertical-drama-hero-title">Turn your story into a series.</h1>
              <p className={pageStyles.description}>
                Bring characters, unexpected turns, and new worlds to the vertical screen.
                Explore our short-form drama examples.
              </p>
              <p className={styles.heroCreateAlt}>Select a video to watch the full vertical drama example.</p>
            </div>
            <div className={styles.heroVideoWall}>
              <SocialVideoScroller
                videos={VERTICAL_DRAMA_VIDEOS}
                pixelsPerSecond={26}
                ariaLabel="Looping examples of vertical drama videos"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
