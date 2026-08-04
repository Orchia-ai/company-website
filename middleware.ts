// Vercel Edge Middleware — serves OG-tagged HTML to social crawlers.
// Browsers and search crawlers get the normal SPA; social bots get a lightweight
// HTML shell with route-specific tags.

const SOCIAL_BOT_UA = /facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|pinterest|vkshare|xing-contenttabreceiver/i

interface SharePage {
  title: string
  description: string
  ogImage: string
  imageAlt: string
  type: 'website' | 'article'
  imageType?: string
  imageWidth?: number
  imageHeight?: number
}

const SITE_URL = 'https://orchia.studio'

const PAGES: Record<string, SharePage> = {
  '/': {
    title: 'Orchia Studio — Every specialist. One shared production.',
    description: 'Orchia connects writing, art, camera, and audience decisions so every specialist keeps control of their craft while the production stays in sync.',
    ogImage: `${SITE_URL}/og-home-2026-08-v3.png`,
    imageAlt: 'Content that gets better over time — Orchia Studio',
    type: 'website',
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
  },
  '/docs': {
    title: 'Documentation — Orchia Studio',
    description: 'Guides for creating, refining, and delivering video projects with Orchia Studio.',
    ogImage: `${SITE_URL}/og-docs-2026-08-v2.png`,
    imageAlt: 'Orchia Studio documentation',
    type: 'website',
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
  },
  '/docs/discord-video-workflow': {
    title: 'Discord video workflow — Orchia Studio',
    description: 'See how Orchia Studio creates, refines, reruns, and delivers complete AI-generated video projects directly inside Discord.',
    ogImage: `${SITE_URL}/og-discord-video-workflow-2026-08-v3.png`,
    imageAlt: 'How to Use in Discord — Orchia Studio',
    type: 'website',
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
  },
}

const POSTS: Record<string, Omit<SharePage, 'type'>> = {
  'marvels-flerken-ar-campaign': {
    title: 'From AR Campaigns to E-Commerce Features',
    description: 'Camera-based AR can help customers place furniture, try on fashion, and experience products more naturally inside a mobile commerce app.',
    ogImage: 'https://orchia.studio/email/flerken-thumbnail.jpg',
    imageAlt: 'From AR Campaigns to E-Commerce Features',
  },
  'realhand-vision-pipeline': {
    title: 'Bring Complex Products to Life with Interactive 3D',
    description: 'A browser-based 3D experience that helps customers understand form, scale, motion, and interaction before they ever see the physical product.',
    ogImage: 'https://img.youtube.com/vi/xwrGzC8Z14s/maxresdefault.jpg',
    imageAlt: 'Bring Complex Products to Life with Interactive 3D',
  },
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
})[character] ?? character)

export default function middleware(request: Request): Response | undefined {
  const ua = request.headers.get('user-agent') ?? ''
  if (!SOCIAL_BOT_UA.test(ua)) return undefined

  const url = new URL(request.url)
  const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
  let page = PAGES[pathname]

  if (!page) {
    const match = pathname.match(/^\/blog\/([^/]+)$/)
    if (!match) return undefined

    const post = POSTS[match[1]]
    if (!post) return undefined

    page = {
      ...post,
      title: `${post.title} — Orchia Studio`,
      type: 'article',
    }
  }

  const pageUrl = `${SITE_URL}${pathname}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const image = escapeHtml(page.ogImage)
  const imageAlt = escapeHtml(page.imageAlt)
  const imageDetails = [
    page.imageType && `  <meta property="og:image:type" content="${escapeHtml(page.imageType)}" />`,
    page.imageWidth && `  <meta property="og:image:width" content="${page.imageWidth}" />`,
    page.imageHeight && `  <meta property="og:image:height" content="${page.imageHeight}" />`,
  ].filter(Boolean).join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:type" content="${page.type}" />
  <meta property="og:site_name" content="Orchia Studio" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:alt" content="${imageAlt}" />
${imageDetails}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${imageAlt}" />
</head>
<body></body>
</html>`

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'vary': 'user-agent',
    },
  })
}

export const config = {
  matcher: ['/', '/docs', '/docs/:path*', '/blog/:slug*'],
}
