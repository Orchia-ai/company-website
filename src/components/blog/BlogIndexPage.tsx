import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
// The shared site stylesheet used to arrive via App.tsx; routes are now
// code-split, so each page that needs it declares the dependency itself.
import '../../App.css'
import Footer from '../Footer'
import OrchiaBackground from '../OrchiaBackground'
import { getAllPosts } from '../../content/loadPosts'
import StudioSiteHeader from '../../pages/StudioSiteHeader'

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const total = String(posts.length).padStart(2, '0')

  return (
    <>
      <Helmet>
        <title>Journal — Orchia Studio</title>
        <meta name="description" content="Case studies and field notes from Orchia Studio." />
      </Helmet>
      <OrchiaBackground />
      <StudioSiteHeader sticky />
      <div className="site-shell shared-header-shell site-enter site-visible" style={{ position: 'relative', zIndex: 1 }}>
        <main>
          <section className="section-block blog-index-section">
            <div className="section-heading">
              <div className="section-meta">
                <span className="mono-label">Journal</span>
                <span className="mono-label">Case Studies</span>
              </div>
              <h2>
                Field notes from <em>the workshop floor</em>,<br />
                {' '}how the work actually gets made.
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
                          /\.(mp4|webm|mov)$/i.test(post.featuredImage) ? (
                            <video
                              className="track-image-img"
                              src={post.featuredImage}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <img
                              className="track-image-img"
                              src={post.featuredImage}
                              alt=""
                              loading="lazy"
                            />
                          )
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
                        {post.tldr && (
                          <p className="track-tldr">
                            <span className="mono-label">TL;DR</span> {post.tldr}
                          </p>
                        )}
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
