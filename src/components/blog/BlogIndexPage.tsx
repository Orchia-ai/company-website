import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import OrchiaBackground from '../OrchiaBackground'
import { getAllPosts } from '../../content/loadPosts'
import BlogCard from './BlogCard'

export default function BlogIndexPage() {
  const [scrolled, setScrolled] = useState(false)
  const posts = getAllPosts()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Helmet>
        <title>Journal — Orchia Studio</title>
        <meta name="description" content="Case studies and field notes from Orchia Studio." />
      </Helmet>
      <OrchiaBackground />
      <div className="site-shell site-enter site-visible" style={{ position: 'relative', zIndex: 1 }}>
        <Header scrolled={scrolled} />
        <main>
          <section className="blog-index">
            <header className="blog-index-head">
              <span className="mono-label">Journal · Case Studies</span>
              <h1 className="blog-index-title">Field notes.</h1>
              <p className="blog-index-lead">
                How we approach the work — methods, technologies, and lessons from shipped products.
              </p>
            </header>
            {posts.length === 0 ? (
              <p className="blog-index-empty">No entries yet. Check back soon.</p>
            ) : (
              <div className="blog-grid">
                {posts.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
