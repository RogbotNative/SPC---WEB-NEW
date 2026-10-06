/**
 * Content managed from the admin panel (/admin). Shared by the website, the admin panel
 * and the server functions in /api — keep this file free of runtime imports.
 */

export type PostTopic = 'structural' | 'mep' | 'site' | 'codes'
export type PostStatus = 'draft' | 'published'

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  /** Hidden testimonials stay in the admin panel but are not shown on the website. */
  visible: boolean
}

/** Everything about a blog post except its body — what the Insights page needs. */
export interface PostMeta {
  id: string
  slug: string
  title: string
  excerpt: string
  topic: PostTopic
  coverUrl: string
  coverAlt: string
  status: PostStatus
  /** Shown in the large "Featured" slot on the Insights page. */
  featured: boolean
  /** ISO date. Set when the post is first published. */
  publishedAt: string | null
  updatedAt: string
  readMinutes: number
}

export interface Post extends PostMeta {
  /** Body as HTML from the editor. Sanitised again before it is shown on the website. */
  html: string
}

/** The single content document stored at cms/site.json. */
export interface SiteContent {
  version: 1
  updatedAt: string
  /** Replaced photos: image key (see src/assets/index.ts) → uploaded photo URL. */
  images: Record<string, string>
  /** null until testimonials are first saved; the website then uses the default in config/site.ts. */
  testimonials: Testimonial[] | null
  /** Index of every post, drafts included. Bodies live in their own files. */
  posts: PostMeta[]
}

/** What the public website receives from /api/content (no drafts, no hidden testimonials). */
export interface PublicContent {
  images: Record<string, string>
  testimonials: Testimonial[] | null
  posts: PostMeta[]
}

export type ActivityType =
  | 'login_success'
  | 'login_failed'
  | 'login_locked'
  | 'logout'
  | 'credentials_changed'
  | 'photo_replaced'
  | 'photo_reset'
  | 'testimonials_saved'
  | 'post_created'
  | 'post_updated'
  | 'post_published'
  | 'post_unpublished'
  | 'post_deleted'
  | 'file_uploaded'

export interface ActivityEntry {
  id: string
  at: string
  type: ActivityType
  /** Human-readable summary, e.g. "Replaced the photo “Home — hero tower”". */
  detail: string
  ip: string
  userAgent: string
}

export interface SessionInfo {
  email: string
  expiresAt: string
  /** Still signing in with the temporary password set up at launch. */
  usingTemporaryPassword: boolean
  credentialsChangedAt: string | null
  lastLogin: { at: string; ip: string; userAgent: string } | null
}
