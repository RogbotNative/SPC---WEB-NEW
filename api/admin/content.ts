/**
 * GET /api/admin/content — everything, drafts included.
 * PUT /api/admin/content — { images } or { testimonials }.
 */
import { photoSlots } from '../../src/cms/photoSlots.js'
import { logActivity } from '../_lib/activity.js'
import { requireSession } from '../_lib/auth.js'
import { readSite, validateImages, validateTestimonials, writeSite } from '../_lib/content.js'
import { assertSameOrigin, handle, HttpError, json, readBody } from '../_lib/http.js'

const labelOf = (key: string) => photoSlots.find((s) => s.key === key)?.label ?? key

export const GET = handle(async (request) => {
  requireSession(request)
  return json(await readSite())
})

export const PUT = handle(async (request) => {
  assertSameOrigin(request)
  requireSession(request)
  const body = await readBody<{ images?: unknown; testimonials?: unknown }>(request, 200_000)
  const site = await readSite()

  if (body.images !== undefined) {
    const images = validateImages(body.images)
    const changes: [string, 'photo_replaced' | 'photo_reset', string][] = []
    for (const key of new Set([...Object.keys(site.images), ...Object.keys(images)])) {
      if (site.images[key] === images[key]) continue
      changes.push(
        images[key]
          ? [key, 'photo_replaced', `Replaced the photo “${labelOf(key)}”`]
          : [key, 'photo_reset', `Put back the original photo “${labelOf(key)}”`],
      )
    }
    const saved = await writeSite({ ...site, images })
    for (const [, type, detail] of changes) await logActivity(request, type, detail)
    return json(saved)
  }

  if (body.testimonials !== undefined) {
    const testimonials = validateTestimonials(body.testimonials)
    const saved = await writeSite({ ...site, testimonials })
    const shown = testimonials.filter((t) => t.visible).length
    await logActivity(request, 'testimonials_saved', `Saved testimonials (${testimonials.length} in total, ${shown} shown on the website)`)
    return json(saved)
  }

  throw new HttpError(400, 'Nothing to save.')
})
