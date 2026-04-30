import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import Header from '../Header'
import Footer from '../Footer'
import OrchiaBackground from '../OrchiaBackground'
import { getPostBySlug } from '../../content/loadPosts'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getPostBySlug(slug)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const dateLabel = post?.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} — Orchia Studio` : 'Not found — Orchia Studio'}</title>
        {post && <meta name="description" content={post.excerpt} />}
        {post?.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Helmet>
      <OrchiaBackground />
      <Header scrolled={scrolled} />
      <div className="site-shell site-enter site-visible" style={{ position: 'relative', zIndex: 1 }}>
        <main>
          <article className="blog-post">
            <Link to="/blog" className="blog-post-back mono-label">← Back to journal</Link>
            {post ? (
              <>
                <header className="blog-post-head">
                  <span className="mono-label">{dateLabel}</span>
                  <h1 className="blog-post-title">{post.title}</h1>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                </header>
                {post.featuredImage && (
                  <div className="blog-post-hero">
                    <img src={post.featuredImage} alt="" />
                  </div>
                )}
                <div className="blog-post-body post-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {post.body}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="blog-post-missing">
                <h1 className="blog-post-title">Entry not found</h1>
                <p>That case study isn't here. It may have moved or been retired.</p>
              </div>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}
