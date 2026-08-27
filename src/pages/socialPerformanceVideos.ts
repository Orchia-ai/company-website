export type SocialPerformanceVideo = {
  date: string
  title: string
  views: number
  viewsDisplay: string
  likes: number
  saves: number
  likesSaves: number
  ca: number
  thumbnail: string
  videoSrc?: string
  videoNote?: string
}

export type PlayableSocialPerformanceVideo = SocialPerformanceVideo & {
  videoSrc: string
}

export const SOCIAL_PERFORMANCE_VIDEOS: readonly SocialPerformanceVideo[] = [
  {
    date: '07-07',
    title: 'She changed one flowerpot, and suddenly everyone was chasing her',
    views: 4563,
    viewsDisplay: '4,563',
    likes: 178,
    saves: 157,
    likesSaves: 335,
    ca: 21,
    thumbnail: '/data-slides/thumbnails/07-07.jpg',
  },
  {
    date: '07-09',
    title: 'The moment my mother-in-law made the cut, I thought I was finished',
    views: 4528,
    viewsDisplay: '4,528',
    likes: 104,
    saves: 76,
    likesSaves: 180,
    ca: 44,
    thumbnail: '/data-slides/thumbnails/07-09.jpg',
  },
  {
    date: '07-12',
    title: 'Was she only a stand-in for his true love?',
    views: 202000,
    viewsDisplay: '202K',
    likes: 1013,
    saves: 387,
    likesSaves: 1400,
    ca: 60,
    thumbnail: '/data-slides/thumbnails/07-12-moon.jpg',
  },
  {
    date: '07-12',
    title: 'He gave my thorn to his sister, so I made him return it in public',
    views: 5214,
    viewsDisplay: '5,214',
    likes: 123,
    saves: 90,
    likesSaves: 213,
    ca: 49,
    thumbnail: '/data-slides/thumbnails/07-12-thorn.jpg',
  },
  {
    date: '07-14',
    title: 'Your brother wants an imported flowerpot',
    views: 1445000,
    viewsDisplay: '1.45M',
    likes: 5515,
    saves: 1348,
    likesSaves: 6863,
    ca: 67,
    thumbnail: '/data-slides/thumbnails/07-14-import.jpg',
    videoSrc:
      'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/data/07-14-import-LK31t0kKpAmxFm23y6N0ZNQTTJ22Ah.mp4',
    videoNote: 'Full-length production video with background music.',
  },
  {
    date: '07-14',
    title: 'The money tree paternity test',
    views: 5605,
    viewsDisplay: '5,605',
    likes: 87,
    saves: 33,
    likesSaves: 120,
    ca: 43,
    thumbnail: '/data-slides/thumbnails/07-14-money.jpg',
  },
  {
    date: '07-16',
    title: 'No favor from His Majesty',
    views: 185000,
    viewsDisplay: '185K',
    likes: 1570,
    saves: 387,
    likesSaves: 1957,
    ca: 65,
    thumbnail: '/data-slides/thumbnails/07-16.jpg',
  },
  {
    date: '07-23',
    title: 'I returned with 99 doubles to reclaim my home',
    views: 633000,
    viewsDisplay: '633K',
    likes: 1913,
    saves: 316,
    likesSaves: 2229,
    ca: 40,
    thumbnail: '/data-slides/thumbnails/07-23.jpg',
    videoSrc:
      'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/data/07-23-returned-with-99-doubles-8qEF700mxxZdc2MSqE46ZWQtqRooRN.mp4',
    videoNote: 'Full-length production video with background music.',
  },
  {
    date: '07-25',
    title: 'I built this road myself after leaving you',
    views: 605000,
    viewsDisplay: '605K',
    likes: 5299,
    saves: 920,
    likesSaves: 6219,
    ca: 45,
    thumbnail: '/data-slides/thumbnails/07-25.jpg',
  },
  {
    date: '07-28',
    title: 'He said the sun would kill me',
    views: 273000,
    viewsDisplay: '273K',
    likes: 553,
    saves: 86,
    likesSaves: 639,
    ca: 55,
    thumbnail: '/data-slides/thumbnails/07-28.jpg',
  },
]

export const PLAYABLE_SOCIAL_PERFORMANCE_VIDEOS = SOCIAL_PERFORMANCE_VIDEOS.filter(
  (video): video is PlayableSocialPerformanceVideo => Boolean(video.videoSrc),
).sort((left, right) => right.views - left.views)
