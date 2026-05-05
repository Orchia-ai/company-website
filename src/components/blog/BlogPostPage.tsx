import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'
import Header from '../Header'
import Footer from '../Footer'
import OrchiaBackground from '../OrchiaBackground'
import { getPostBySlug } from '../../content/loadPosts'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const post = getPostBySlug(slug)
  const [scrolled, setScrolled] = useState(false)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const card = target?.closest?.('.reading-card') as HTMLAnchorElement | null
      if (!card || !card.href) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      const url = new URL(card.href)
      if (url.origin === window.location.origin) {
        navigate(url.pathname + url.search + url.hash)
      } else {
        setEmbedUrl(card.href)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  useEffect(() => {
    if (!embedUrl) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEmbedUrl(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [embedUrl])

  const dateLabel = post?.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : ''
  const featuredIsVideo = post?.featuredImage
    ? /\.(mp4|webm|mov)$/i.test(post.featuredImage)
    : false
  const rawOgImage = post?.ogImage ?? (post?.featuredImage && !featuredIsVideo ? post.featuredImage : undefined)
  const ogImage = rawOgImage
    ? rawOgImage.startsWith('http') ? rawOgImage : `${origin}${rawOgImage}`
    : undefined
  const pageTitle = post ? `${post.title} — Orchia Studio` : 'Not found — Orchia Studio'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        {post && <meta name="description" content={post.excerpt} />}

        {/* Open Graph (LinkedIn, Facebook, iMessage, Slack, Discord, etc.) */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Orchia Studio" />
        <meta property="og:title" content={post ? post.title : 'Orchia Studio'} />
        {post && <meta property="og:description" content={post.excerpt} />}
        <meta property="og:url" content={canonicalUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogImage && <meta property="og:image:width" content="1280" />}
        {ogImage && <meta property="og:image:height" content="720" />}
        {ogImage && <meta property="og:image:alt" content={post ? post.title : ''} />}
        {post?.date && <meta property="article:published_time" content={post.date} />}

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post ? post.title : 'Orchia Studio'} />
        {post && <meta name="twitter:description" content={post.excerpt} />}
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        {ogImage && <meta name="twitter:image:alt" content={post ? post.title : ''} />}
      </Helmet>
      <OrchiaBackground />
      <Header scrolled={scrolled} />
      <div className="site-shell site-enter site-visible" style={{ position: 'relative', zIndex: 1 }}>
        <main>
          <article className="blog-post">
            {post ? (
              <>
                <header className="blog-post-head">
                  <div className="blog-post-meta-row">
                    <Link to="/blog" className="blog-post-back mono-label">← Back to journal</Link>
                    <span className="mono-label">{dateLabel}</span>
                  </div>
                  <h1 className="blog-post-title">{post.title}</h1>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                </header>
                {post.featuredImage && !post.hideHero && (
                  <div className="blog-post-hero">
                    <img src={post.featuredImage} alt="" />
                  </div>
                )}
                <div className="blog-post-body post-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
                    {post.body}
                  </ReactMarkdown>
                </div>
                <ShareRow title={post.title} />
              </>
            ) : (
              <div className="blog-post-missing">
                <Link to="/blog" className="blog-post-back mono-label">← Back to journal</Link>
                <h1 className="blog-post-title">Entry not found</h1>
                <p>That case study isn't here. It may have moved or been retired.</p>
              </div>
            )}
          </article>
        </main>
        <Footer />
      </div>
      {/* embed modal */}
      {embedUrl && (
        <div
          className="embed-modal-backdrop"
          onClick={() => setEmbedUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="embed-modal" onClick={(e) => e.stopPropagation()}>
            <header className="embed-modal-header">
              <span className="embed-modal-url" title={embedUrl}>{embedUrl}</span>
              <a
                className="embed-modal-open"
                href={embedUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open ↗
              </a>
              <button
                type="button"
                className="embed-modal-close"
                onClick={() => setEmbedUrl(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </header>
            <div className="embed-modal-frame">
              <div className="embed-modal-fallback">
                <strong>Loading preview…</strong>
                <span>If this stays blank, the site has disabled embedding.</span>
                <a href={embedUrl} target="_blank" rel="noreferrer">Open in new tab ↗</a>
              </div>
              <iframe
                key={embedUrl}
                src={embedUrl}
                title="Embedded preview"
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [nativeSupported, setNativeSupported] = useState(false)

  useEffect(() => {
    setNativeSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const enc = encodeURIComponent
  const u = enc(url)
  const t = enc(title)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback: select+copy via temporary input
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {}
      document.body.removeChild(input)
    }
  }

  const onNativeShare = async () => {
    if (!navigator.share) return onCopy()
    try { await navigator.share({ title, url }) } catch { /* user-cancel is fine */ }
  }

  const items: { name: string; href: string; icon: React.ReactNode }[] = [
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M20.45 20.45h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.353V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.45H3.554V9h3.565zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${u}&title=${t}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.67 13.18a1.51 1.51 0 0 1-.06.4 4.32 4.32 0 0 1 .06.74c0 2.78-3.23 5.03-7.21 5.03-3.97 0-7.2-2.25-7.2-5.03 0-.25.02-.5.07-.74a1.5 1.5 0 1 1 1.79-2.42 8.81 8.81 0 0 1 4.83-1.55l.91-4.27.05-.13a.34.34 0 0 1 .17-.16.36.36 0 0 1 .25-.02l2.97.63a1.04 1.04 0 1 1-.06.7l-2.65-.56-.81 3.81a8.78 8.78 0 0 1 4.78 1.55 1.5 1.5 0 1 1 2.11 1.92zm-9.83.55a1.04 1.04 0 1 0 0 2.08 1.04 1.04 0 0 0 0-2.08zm6.32 0a1.04 1.04 0 1 0 0 2.08 1.04 1.04 0 0 0 0-2.08zm-.4 3.27a.38.38 0 0 0-.53 0 2.94 2.94 0 0 1-2.06.71 2.95 2.95 0 0 1-2.05-.71.38.38 0 0 0-.54.54 3.71 3.71 0 0 0 2.59.93 3.7 3.7 0 0 0 2.6-.93.38.38 0 0 0 0-.54z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: `mailto:?subject=${t}&body=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="share-row" role="group" aria-label="Share this article">
      <span className="share-row-label mono-label">Share</span>
      <div className="share-row-buttons">
        {items.map((it) => (
          <a
            key={it.name}
            className="share-row-btn"
            href={it.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share on ${it.name}`}
            title={`Share on ${it.name}`}
          >
            {it.icon}
          </a>
        ))}
        <button
          type="button"
          className={`share-row-btn share-row-btn--copy${copied ? ' is-copied' : ''}`}
          onClick={onCopy}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1 1" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1-1" />
            </svg>
          )}
        </button>
        {nativeSupported && (
          <button
            type="button"
            className="share-row-btn"
            onClick={onNativeShare}
            aria-label="Share via system menu (Instagram, Messages, and more)"
            title="More — Instagram, Messages, etc."
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
