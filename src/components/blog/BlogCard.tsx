import { Link } from 'react-router-dom'
import type { BlogPost } from '../../content/types'

interface Props {
  post: BlogPost
}

export default function BlogCard({ post }: Props) {
  const dateLabel = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      {post.featuredImage && (
        <div className="blog-card-image">
          <img src={post.featuredImage} alt="" loading="lazy" />
        </div>
      )}
      <div className="blog-card-body">
        {dateLabel && <span className="mono-label">{dateLabel}</span>}
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <span className="blog-card-cta">Read case study →</span>
      </div>
    </Link>
  )
}
