/** GET /api/admin/session — who is signed in, when the session ends, and the previous sign-in. */
import type { SessionInfo } from '../../src/cms/types.js'
import { readActivity } from '../_lib/activity.js'
import { requireSession } from '../_lib/auth.js'
import { handle, json } from '../_lib/http.js'

export const GET = handle(async (request) => {
  const session = requireSession(request)
  const logins = (await readActivity()).filter((e) => e.type === 'login_success')
  // logins[0] is this session's own sign-in; the one before it is "last time".
  const prev = logins[1]
  const info: SessionInfo = {
    username: session.username,
    expiresAt: session.expiresAt,
    lastLogin: prev ? { at: prev.at, ip: prev.ip, userAgent: prev.userAgent } : null,
  }
  return json(info)
})
