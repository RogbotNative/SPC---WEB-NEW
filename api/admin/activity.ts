/** GET /api/admin/activity — the sign-in and change log, newest first. */
import { readActivity } from '../_lib/activity.js'
import { requireSession } from '../_lib/auth.js'
import { handle, json } from '../_lib/http.js'

export const GET = handle(async (request) => {
  requireSession(request)
  return json(await readActivity())
})
