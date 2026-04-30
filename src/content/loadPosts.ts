import type { BlogPost } from './types'

const modules = import.meta.glob('./blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[m[1]] = value
  }
  return { data, content: match[2] }
}

const posts: BlogPost[] = Object.values(modules)
  .map((raw) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      title: data.title ?? 'Untitled',
      slug: data.slug ?? '',
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      featuredImage: data.featuredImage || undefined,
      body: content,
    } satisfies BlogPost
  })
  .filter((p) => p.slug)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
