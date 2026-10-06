/**
 * GET    /api/admin/posts?id=…  — one post with its body.
 * POST   /api/admin/posts       — create or update: { id?, title, excerpt, topic, coverUrl, coverAlt, html, featured, status }.
 * DELETE /api/admin/posts?id=…  — delete a post.
 */
import { randomUUID } from 'node:crypto'
import type { Post, PostStatus } from '../../src/cms/types.js'
import { logActivity } from '../_lib/activity.js'
import { requireSession } from '../_lib/auth.js'
import {
  metaOf,
  readMinutes,
  readPost,
  readSite,
  removePost,
  uniqueSlug,
  validatePost,
  writePost,
  writeSite,
} from '../_lib/content.js'
import { assertSameOrigin, error, handle, HttpError, json, readBody } from '../_lib/http.js'

const idParam = (request: Request) => {
  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new HttpError(400, 'Unknown post.')
  return id
}

export const GET = handle(async (request) => {
  requireSession(request)
  const post = await readPost(idParam(request))
  return post ? json(post) : error(404, 'Post not found.')
})

export const POST = handle(async (request) => {
  assertSameOrigin(request)
  requireSession(request)
  const body = await readBody<Record<string, unknown>>(request, 600_000)
  const input = validatePost(body)
  const status: PostStatus = body.status === 'published' ? 'published' : 'draft'
  const site = await readSite()
  const now = new Date().toISOString()

  const existingId = typeof body.id === 'string' && body.id ? body.id : null
  const existing = existingId ? site.posts.find((p) => p.id === existingId) : undefined
  if (existingId && !existing) throw new HttpError(404, 'That post no longer exists.')
  const id = existing?.id ?? randomUUID()

  const post: Post = {
    ...input,
    id,
    // Keep the address of a published post stable so shared links don't break.
    slug: existing?.status === 'published' ? existing.slug : uniqueSlug(input.title, site.posts, id),
    status,
    publishedAt: status === 'published' ? (existing?.publishedAt ?? now) : (existing?.publishedAt ?? null),
    updatedAt: now,
    readMinutes: readMinutes(input.html),
  }

  await writePost(post)
  const others = site.posts.filter((p) => p.id !== id).map((p) => (post.featured ? { ...p, featured: false } : p))
  await writeSite({ ...site, posts: [metaOf(post), ...others] })

  const was = existing?.status
  const type = !existing
    ? status === 'published' ? 'post_published' : 'post_created'
    : was !== status
      ? status === 'published' ? 'post_published' : 'post_unpublished'
      : 'post_updated'
  const verb = { post_created: 'Started a draft', post_published: 'Published', post_unpublished: 'Took offline', post_updated: 'Edited' }[type]
  await logActivity(request, type, `${verb} the post “${post.title}”`)
  return json(post)
})

export const DELETE = handle(async (request) => {
  assertSameOrigin(request)
  requireSession(request)
  const id = idParam(request)
  const site = await readSite()
  const meta = site.posts.find((p) => p.id === id)
  if (!meta) return error(404, 'Post not found.')
  await writeSite({ ...site, posts: site.posts.filter((p) => p.id !== id) })
  await removePost(id)
  await logActivity(request, 'post_deleted', `Deleted the post “${meta.title}”`)
  return json({ ok: true })
})
