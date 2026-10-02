import { useEffect, useRef, useState } from 'react'
import { useCachedVideoSource } from '../lib/useCachedVideoSource'
import styles from './home-film-page.module.css'
import { VIDEO_PACKAGES } from './videoPackages'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 3.5h11v17L12 17l-5.5 3.5v-17Z" />
    </svg>
  )
}

function VerticalSocialVideoDeck({ activeIndex }: { activeIndex: number }) {
  const cacheReady = Boolean(useCachedVideoSource('ready'))
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === activeIndex) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })
  }, [activeIndex, cacheReady])

  return (
    <div className={styles.pricingVideoColumn}>
      <div
        className={styles.pricingMedia}
        data-active-video={activeIndex}
        role="group"
        aria-label={`${VIDEO_PACKAGES[activeIndex].tier} vertical promotional video preview`}
      >
        <div className={styles.pricingVideoTrack} data-active-video={activeIndex}>
          {VIDEO_PACKAGES.map((videoPackage, index) => (
            <div
              className={`${styles.pricingVideoSlide} ${
                index === activeIndex ? styles.pricingVideoSlideActive : ''
              }`}
              key={videoPackage.tier}
              aria-hidden={index !== activeIndex}
            >
              <video
                className={styles.pricingVideo}
                ref={(element) => {
                  videoRefs.current[index] = element
                }}
                src={cacheReady ? videoPackage.videoSrc : undefined}
                poster={videoPackage.poster}
                autoPlay={index === 0}
                muted
                loop
                playsInline
                preload="none"
              />
              <div className={styles.pricingVideoShade} aria-hidden="true" />
              <div className={styles.pricingTikTok} aria-hidden="true">
                <div className={styles.pricingTikTokActions}>
                  <span className={`${styles.pricingTikTokAction} ${styles.pricingLike}`}>
                    <HeartIcon />
                    <small>12.8K</small>
                  </span>
                  <span className={`${styles.pricingTikTokAction} ${styles.pricingSave}`}>
                    <BookmarkIcon />
                    <small>Save</small>
                  </span>
                </div>
                <div className={styles.pricingTikTokCaption}>
                  <strong>@orchia.studio</strong>
                  <span>Crafted for your company</span>
                </div>
                <div className={styles.pricingTikTokProgress} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        Showing the {VIDEO_PACKAGES[activeIndex].tier} video preview.
      </p>
    </div>
  )
}

export default function VideoBetaPricing({ compact = false }: { compact?: boolean }) {
  const [activePackageIndex, setActivePackageIndex] = useState(0)

  return (
    <section
      className={`${styles.pricingSection} ${compact ? styles.pricingSectionCompact : ''}`}
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className={styles.pricingFrame}>
        <header className={styles.pricingHeader}>
          <div>
            <h2 className={styles.pricingHeading} id="pricing-title">
              <span className={styles.pricingHeadingLine}>
                Get your promotion video at the
              </span>{' '}
              <span className={styles.pricingHeadingLine}>
                pre-releasing price discount.
              </span>
            </h2>
          </div>
        </header>

        <div className={styles.pricingGrid}>
          <VerticalSocialVideoDeck activeIndex={activePackageIndex} />

          <div className={styles.pricingProducts}>
            {VIDEO_PACKAGES.map((videoPackage, index) => (
              <article
                className={`${styles.pricingCard} ${
                  index === 1 ? styles.pricingCardFeatured : ''
                } ${index === activePackageIndex ? styles.pricingCardActive : ''}`}
                key={videoPackage.tier}
                data-package-index={index}
                aria-current={index === activePackageIndex ? 'true' : undefined}
                tabIndex={0}
                onMouseEnter={() => setActivePackageIndex(index)}
                onFocusCapture={() => setActivePackageIndex(index)}
                onPointerDown={() => setActivePackageIndex(index)}
              >
                <div className={styles.pricingCardBody}>
                  <div className={styles.pricingTierLine}>
                    <div>
                      <p className={styles.pricingTier}>{videoPackage.tier}</p>
                      <h3>{videoPackage.duration}</h3>
                    </div>
                  </div>

                  <div className={styles.pricingPrice}>
                    <span className={styles.pricingRegular}>{videoPackage.regularPrice}</span>
                    <strong>{videoPackage.betaPrice}</strong>
                    <small>USD · one time</small>
                  </div>

                  <p className={styles.pricingCustomNote}>
                    <strong>Provide your company link.</strong>
                    <span>
                      We’ll craft a custom video for your brand, product, and audience.
                    </span>
                  </p>

                  <a
                    className={styles.pricingCheckout}
                    href={videoPackage.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Choose ${videoPackage.tier}: pay ${videoPackage.betaPrice} for a ${videoPackage.durationAdjective} promotional video with Stripe`}
                  >
                    <span>Choose {videoPackage.tier}</span>
                    <span aria-hidden="true">{videoPackage.betaPrice} ↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.pricingFootnote}>
          <span aria-hidden="true">◆</span>
          <p>Secure one-time checkout is hosted by Stripe. Beta pricing may change at release.</p>
        </div>
      </div>
    </section>
  )
}
