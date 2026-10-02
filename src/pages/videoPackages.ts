import { SHOWCASE_VIDEOS } from '../lib/showcaseVideos'

export const VIDEO_PACKAGES = [
  {
    tier: 'Basic',
    duration: '30 seconds',
    durationAdjective: '30-second',
    regularPrice: '$200',
    betaPrice: '$99',
    checkoutUrl: 'https://buy.stripe.com/aFaaEY6p9bWz3FTgTw2go02',
    videoSrc:
      SHOWCASE_VIDEOS.flowerpot.preview,
    poster: '/data-slides/thumbnails/07-14-import.jpg',
  },
  {
    tier: 'Premium',
    duration: '1 minute',
    durationAdjective: '1-minute',
    regularPrice: '$400',
    betaPrice: '$199',
    checkoutUrl: 'https://buy.stripe.com/00w14o9BlaSv4JXgTw2go01',
    videoSrc:
      SHOWCASE_VIDEOS.doubles.preview,
    poster: '/data-slides/thumbnails/07-23.jpg',
  },
] as const
