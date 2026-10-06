/**
 * POST /api/admin/upload — raw image bytes with an image Content-Type. Returns { url }.
 * The admin panel shrinks photos in the browser first, so uploads stay well under Vercel's 4.5 MB limit.
 */
import { logActivity } from '../_lib/activity.js'
import { requireSession } from '../_lib/auth.js'
import { assertSameOrigin, error, handle, json } from '../_lib/http.js'
import { uploadImage } from '../_lib/storage.js'

const MAX_BYTES = 4 * 1024 * 1024

/** Accepted types, checked against the file's first bytes rather than trusting the browser. */
const types: { mime: string; ext: string; match: (b: Uint8Array) => boolean }[] = [
  { mime: 'image/jpeg', ext: 'jpg', match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', ext: 'png', match: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    mime: 'image/webp',
    ext: 'webp',
    match: (b) => String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP',
  },
]

export const POST = handle(async (request) => {
  assertSameOrigin(request)
  requireSession(request)
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) return error(413, 'That photo is too large (4 MB maximum).')
  const bytes = new Uint8Array(await request.arrayBuffer())
  if (!bytes.length) return error(400, 'No photo was received.')
  if (bytes.length > MAX_BYTES) return error(413, 'That photo is too large (4 MB maximum).')
  const type = types.find((t) => t.match(bytes))
  if (!type) return error(415, 'Please upload a JPG, PNG or WebP photo.')
  const url = await uploadImage(bytes, type.ext, type.mime)
  await logActivity(request, 'file_uploaded', `Uploaded a photo (${Math.round(bytes.length / 1024)} KB)`)
  return json({ url })
})
