/** POST /api/admin/logout — clears the session cookie. */
import { logActivity } from '../_lib/activity.js'
import { clearSessionCookie, requireSession } from '../_lib/auth.js'
import { assertSameOrigin, handle, HttpError, json } from '../_lib/http.js'

export const POST = handle(async (request) => {
  assertSameOrigin(request)
  try {
    await requireSession(request)
    await logActivity(request, 'logout', 'Signed out')
  } catch (e) {
    if (!(e instanceof HttpError)) throw e // already signed out: just clear the cookie
  }
  return json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie(request) } })
})
