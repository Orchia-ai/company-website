import { Link } from 'react-router-dom'
import { getAllPosts } from '../../content/loadPosts'

export default function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) return null

  const total = String(posts.length).padStart(2, '0')

  return (
    <section className="section-block" id="journal">
      <div className="section-heading">
        <div className="section-meta">
          <span className="mono-label">S / 09 — Journal</span>
          <span className="mono-label">Case Studies</span>
        </div>
        <h2>
          Field notes from <em>the workshop floor</em>,<br />
          how the work actually gets made.
        </h2>
      </div>
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
              <div
                className="track-image"
                style={
                  post.featuredImage
                    ? {
                        backgroundImage: `url(${post.featuredImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }
              >
                <span className="track-image-num mono-label">
                  0{i + 1} / {total}
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
      <div className="blog-teaser-footer">
        <Link to="/blog" className="mono-label">View all entries →</Link>
      </div>
    </section>
  )
}
