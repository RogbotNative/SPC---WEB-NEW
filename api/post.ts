/** GET /api/post?slug=… — one published blog post, body included. */
import { readPost, readSite } from './_lib/content.js'
import { error, handle, json } from './_lib/http.js'

export const GET = handle(async (request) => {
  const slug = new URL(request.url).searchParams.get('slug') ?? ''
  const meta = (await readSite()).posts.find((p) => p.slug === slug && p.status === 'published')
  if (!meta) return error(404, 'Post not found.')
  const post = await readPost(meta.id)
  if (!post) return error(404, 'Post not found.')
  return json(post, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=300' } })
})
