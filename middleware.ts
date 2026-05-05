// Vercel Edge Middleware — serves OG-tagged HTML to social crawlers for blog routes.
// Browsers get the normal SPA; bots get a lightweight HTML shell with correct meta tags.

const BOT_UA = /facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|applebot|googlebot|bingbot|yandexbot|pinterest|vkshare|xing-contenttabreceiver/i

interface PostOG {
  title: string
  description: string
  ogImage: string
}

const POSTS: Record<string, PostOG> = {
  'marvels-flerken-ar-campaign': {
    title: 'From AR Campaigns to E-Commerce Features',
    description: 'Camera-based AR can help customers place furniture, try on fashion, and experience products more naturally inside a mobile commerce app.',
    ogImage: 'https://orchia.studio/email/flerken-thumbnail.jpg',
  },
  'realhand-vision-pipeline': {
    title: 'Bring Complex Products to Life with Interactive 3D',
    description: 'A browser-based 3D experience that helps customers understand form, scale, motion, and interaction before they ever see the physical product.',
    ogImage: 'https://img.youtube.com/vi/xwrGzC8Z14s/maxresdefault.jpg',
  },
}

export default function middleware(request: Request): Response | undefined {
  const ua = request.headers.get('user-agent') ?? ''
  if (!BOT_UA.test(ua)) return undefined

  const url = new URL(request.url)
  const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (!match) return undefined

  const post = POSTS[match[1]]
  if (!post) return undefined

  const pageTitle = `${post.title} — Orchia Studio`
  const pageUrl = url.href

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${pageTitle}</title>
  <meta name="description" content="${post.description}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Orchia Studio" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${post.description}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${post.ogImage}" />
  <meta property="og:image:alt" content="${post.title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${post.description}" />
  <meta name="twitter:image" content="${post.ogImage}" />
  <meta name="twitter:image:alt" content="${post.title}" />
</head>
<body></body>
</html>`

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: ['/blog/:slug*'],
}
