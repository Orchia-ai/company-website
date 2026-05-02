import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import OrchiaBackground from '../OrchiaBackground'
import { getAllPosts } from '../../content/loadPosts'

export default function BlogIndexPage() {
  const [scrolled, setScrolled] = useState(false)
  const posts = getAllPosts()
  const total = String(posts.length).padStart(2, '0')

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
      <Header scrolled={scrolled} />
      <div className="site-shell site-enter site-visible" style={{ position: 'relative', zIndex: 1 }}>
        <main>
          <section className="section-block blog-index-section">
            <div className="section-heading">
              <div className="section-meta">
                <span className="mono-label">Journal</span>
                <span className="mono-label">Case Studies</span>
              </div>
              <h2>
                Field notes from <em>the workshop floor</em>,<br />
                how the work actually gets made.
              </h2>
            </div>
            {posts.length === 0 ? (
              <p className="blog-index-empty">No entries yet. Check back soon.</p>
            ) : (
              <div className="tracks">
                {posts.map((post, i) => {
                  const dateLabel = post.date
                    ? new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''
                  return (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="track-card blog-track-card"
                    >
                      <div className="track-image">
                        {post.featuredImage && (
                          <img
                            className="track-image-img"
                            src={post.featuredImage}
                            alt=""
                            loading="lazy"
                          />
                        )}
                        <span className="track-image-num mono-label">
                          {String(i + 1).padStart(2, '0')} / {total}
                        </span>
                      </div>
                      <div className="track-content">
                        <div className="track-header">
                          <span className="track-tag">{dateLabel}</span>
                        </div>
                        <h3 className="track-headline">{post.title}</h3>
                        <ul className="track-list">
                          <li>{post.excerpt}</li>
                          <li>Read the full case study →</li>
                        </ul>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
