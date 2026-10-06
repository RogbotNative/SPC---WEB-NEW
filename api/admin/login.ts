/** POST /api/admin/login — { username, password } → session cookie. */
import { logActivity } from '../_lib/activity.js'
import {
  assertConfigured,
  checkCredentials,
  clearFailures,
  createSessionCookie,
  lockedMinutes,
  recordFailure,
} from '../_lib/auth.js'
import { assertSameOrigin, clientIp, error, handle, json, readBody } from '../_lib/http.js'

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
const minutes = (n: number) => `${n} minute${n === 1 ? '' : 's'}`

export const POST = handle(async (request) => {
  assertSameOrigin(request)
  assertConfigured()
  const ip = clientIp(request)

  const locked = await lockedMinutes(ip)
  if (locked) {
    await logActivity(request, 'login_locked', 'Sign-in blocked: too many wrong passwords from this address')
    return error(429, `Too many wrong attempts. For your security, sign-in is paused for ${minutes(locked)}.`)
  }

  const { username = '', password = '' } = await readBody<{ username?: string; password?: string }>(request, 4096)
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return error(400, 'Enter your username and password.')
  }

  if (!(await checkCredentials(username, password))) {
    await pause(400 + Math.random() * 400) // slow down guessing
    const lockedNow = await recordFailure(ip)
    await logActivity(request, 'login_failed', `Wrong username or password (tried “${username.slice(0, 40)}”)`)
    if (lockedNow) {
      return error(429, `Too many wrong attempts. For your security, sign-in is paused for ${minutes(lockedNow)}.`)
    }
    return error(401, 'That username or password is not right.')
  }

  await clearFailures(ip)
  const { cookie, expiresAt } = createSessionCookie(request)
  await logActivity(request, 'login_success', 'Signed in')
  return json({ ok: true, expiresAt }, { headers: { 'Set-Cookie': cookie } })
})
