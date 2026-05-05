export interface BlogPostMeta {
  title: string
  slug: string
  date: string
  excerpt: string
  tldr?: string
  featuredImage?: string
  ogImage?: string
  hideHero?: boolean
}

export interface BlogPost extends BlogPostMeta {
  body: string
}
