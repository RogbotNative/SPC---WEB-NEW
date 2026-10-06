/** Reading, validating and saving admin-managed content. */
import type { Post, PostMeta, PostTopic, PublicContent, SiteContent, Testimonial } from '../../src/cms/types.js'
import { isPhotoKey } from '../../src/cms/photoSlots.js'
import { HttpError } from './http.js'
import { readJson, removeFile, writeJson } from './storage.js'

const SITE_FILE = 'cms/site.json'
const postFile = (id: string) => `cms/posts/${id}.json`

export const TOPICS: PostTopic[] = ['structural', 'mep', 'site', 'codes']

const emptySite = (): SiteContent => ({ version: 1, updatedAt: new Date(0).toISOString(), images: {}, testimonials: null, posts: [] })

export async function readSite(): Promise<SiteContent> {
  const site = await readJson<SiteContent>(SITE_FILE)
  return site ? { ...emptySite(), ...site } : emptySite()
}

export async function writeSite(site: SiteContent): Promise<SiteContent> {
  const next = { ...site, updatedAt: new Date().toISOString() }
  await writeJson(SITE_FILE, next)
  return next
}

export function toPublic(site: SiteContent): PublicContent {
  return {
    images: site.images,
    testimonials: site.testimonials ? site.testimonials.filter((t) => t.visible) : null,
    posts: site.posts
      .filter((p) => p.status === 'published')
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')),
  }
}

export const readPost = (id: string) => readJson<Post>(postFile(id))
export const writePost = (post: Post) => writeJson(postFile(post.id), post)
export const removePost = (id: string) => removeFile(postFile(id))

/* ---------------- Validation ---------------- */

const str = (v: unknown, field: string, max: number, required = false): string => {
  if (v === undefined || v === null) v = ''
  if (typeof v !== 'string') throw new HttpError(400, `${field} must be text.`)
  const s = v.trim()
  if (required && !s) throw new HttpError(400, `${field} can’t be empty.`)
  if (s.length > max) throw new HttpError(400, `${field} is too long (maximum ${max} characters).`)
  return s
}

/** Photos must come from our own uploads: Vercel Blob in production, /__uploads/ in local development. */
export function isAllowedImageUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/__uploads/') && !process.env.VERCEL) return true
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com')
  } catch {
    return false
  }
}

export function validateImages(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400, 'Photos must be a list.')
  const out: Record<string, string> = {}
  for (const [key, url] of Object.entries(input as Record<string, unknown>)) {
    if (!isPhotoKey(key)) throw new HttpError(400, `Unknown photo “${key}”.`)
    if (typeof url !== 'string' || !isAllowedImageUrl(url)) throw new HttpError(400, 'That photo address is not allowed.')
    out[key] = url
  }
  return out
}

export function validateTestimonials(input: unknown): Testimonial[] {
  if (!Array.isArray(input)) throw new HttpError(400, 'Testimonials must be a list.')
  if (input.length > 30) throw new HttpError(400, 'Keep it to 30 testimonials or fewer.')
  return input.map((raw, i) => {
    const t = (raw ?? {}) as Record<string, unknown>
    const n = i + 1
    return {
      id: str(t.id, `Testimonial ${n} id`, 64) || crypto.randomUUID(),
      quote: str(t.quote, `Testimonial ${n} quote`, 700, true),
      name: str(t.name, `Testimonial ${n} name`, 80, true),
      role: str(t.role, `Testimonial ${n} role`, 80),
      company: str(t.company, `Testimonial ${n} company`, 120),
      visible: t.visible !== false,
    }
  })
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post'

const wordCount = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length

export interface PostInput {
  title: string
  excerpt: string
  topic: PostTopic
  coverUrl: string
  coverAlt: string
  html: string
  featured: boolean
}

export function validatePost(input: unknown): PostInput {
  const p = (input ?? {}) as Record<string, unknown>
  const topic = p.topic as PostTopic
  if (!TOPICS.includes(topic)) throw new HttpError(400, 'Pick a topic for the post.')
  const coverUrl = str(p.coverUrl, 'Cover photo', 500)
  if (coverUrl && !isAllowedImageUrl(coverUrl)) throw new HttpError(400, 'That cover photo address is not allowed.')
  const html = typeof p.html === 'string' ? p.html : ''
  if (html.length > 400_000) throw new HttpError(413, 'The post is too long to save. Try splitting it into two posts.')
  return {
    title: str(p.title, 'Title', 160, true),
    excerpt: str(p.excerpt, 'Summary', 300),
    topic,
    coverUrl,
    coverAlt: str(p.coverAlt, 'Cover photo description', 200),
    html,
    featured: p.featured === true,
  }
}

/** A slug based on the title that no other post uses. */
export function uniqueSlug(title: string, posts: PostMeta[], ownId?: string): string {
  const base = slugify(title)
  let slug = base
  for (let i = 2; posts.some((p) => p.slug === slug && p.id !== ownId); i++) slug = `${base}-${i}`
  return slug
}

export const readMinutes = (html: string) => Math.max(1, Math.round(wordCount(html) / 200))

export const metaOf = ({ html: _html, ...meta }: Post): PostMeta => meta
