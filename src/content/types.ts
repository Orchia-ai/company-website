export interface BlogPostMeta {
  title: string
  slug: string
  date: string
  excerpt: string
  featuredImage?: string
  hideHero?: boolean
}

export interface BlogPost extends BlogPostMeta {
  body: string
}
