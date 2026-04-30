import { Link } from 'react-router-dom'
import { getAllPosts } from '../../content/loadPosts'
import BlogCard from './BlogCard'

export default function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section className="blog-teaser" id="journal">
      <div className="blog-teaser-head">
        <span className="mono-label">Journal · Case Studies</span>
        <h2 className="blog-teaser-title">
          Field notes from<br />the workshop floor.
        </h2>
        <Link to="/blog" className="text-link">View all entries →</Link>
      </div>
      <div className="blog-grid">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  )
}
