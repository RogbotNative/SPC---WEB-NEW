/** GET /api/content — photos, testimonials and published posts for the public website. */
import { readSite, toPublic } from './_lib/content.js'
import { handle, json } from './_lib/http.js'

export const GET = handle(async () => {
  const site = await readSite()
  // Cached briefly at Vercel's edge: admin changes show up on the website within about a minute.
  return json(toPublic(site), {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=300' },
  })
})
