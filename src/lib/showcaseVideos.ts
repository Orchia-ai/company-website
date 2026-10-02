// Keep every section on the same object keys so downloaded media can be reused.
export const SHOWCASE_VIDEOS = {
  promotion: {
    preview: 'https://media.lingyizhou.com/Compressed/orchia-promotion-video-37-1-540p.mp4',
    full: 'https://media.lingyizhou.com/high-res/orchia-promotion-video-37-1.mp4',
    poster: '/videos/orchia-promotion-video-37-1.jpg',
  },
  flowerpot: {
    preview: 'https://media.lingyizhou.com/Compressed/07-14-import-540p.mp4',
    full: 'https://media.lingyizhou.com/high-res/v2-07-14-import.mp4',
    poster: '/data-slides/thumbnails/07-14-import.jpg',
  },
  doubles: {
    preview: 'https://media.lingyizhou.com/Compressed/GardenMaster-540p.mp4',
    full: 'https://media.lingyizhou.com/high-res/GardenMaster.MP4',
  },
  yuna: {
    preview: 'https://media.lingyizhou.com/Compressed/Yuna-Day-One-clean-540p.mp4',
    full: 'https://media.lingyizhou.com/high-res/Yuna-Day-One-clean.mp4?v=20261002',
    poster: '/videos/Yuna-Day-One-clean-540p.jpg',
  },
  seattleHomeTour: {
    preview: 'https://media.lingyizhou.com/Compressed/final-540p.mp4',
    full: 'https://media.lingyizhou.com/high-res/final.mp4',
    poster: '/videos/final-540p.jpg',
  },
} as const
