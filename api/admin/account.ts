/**
 * PUT /api/admin/account — change the sign-in email and/or password.
 * Body: { currentPassword, email?, newPassword? }. The current password is always required.
 * Saving signs out every other session; this browser gets a fresh session cookie.
 */
import { logActivity } from '../_lib/activity.js'
import { checkPassword, createSessionCookie, lockedMinutes, recordFailure, requireSession } from '../_lib/auth.js'
import { saveCredentials } from '../_lib/credentials.js'
import { assertSameOrigin, clientIp, error, handle, json, readBody } from '../_lib/http.js'
import { hashPassword } from '../_lib/password.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const PUT = handle(async (request) => {
  assertSameOrigin(request)
  const session = await requireSession(request)
  const ip = clientIp(request)
  const locked = await lockedMinutes(ip)
  if (locked) return error(429, `Too many wrong passwords. Please wait ${locked} minute${locked === 1 ? '' : 's'} and try again.`)

  const body = await readBody<{ currentPassword?: unknown; email?: unknown; newPassword?: unknown }>(request, 4096)
  const current = typeof body.currentPassword === 'string' ? body.currentPassword : ''
  const email = typeof body.email === 'string' ? body.email.trim() : session.email
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''

  if (!current) return error(400, 'Enter your current password to confirm the change.')
  if (!EMAIL.test(email) || email.length > 120) return error(400, 'Enter a valid email address, like name@company.com.')
  if (newPassword) {
    if (newPassword.length < 10) return error(400, 'The new password needs at least 10 characters.')
    if (newPassword.length > 200) return error(400, 'The new password is too long.')
    if (newPassword.toLowerCase() === email.toLowerCase()) return error(400, 'The password can’t be the same as the email.')
    if (newPassword === current) return error(400, 'The new password is the same as the current one.')
  }
  const emailChanged = email.toLowerCase() !== session.email.toLowerCase()
  if (!emailChanged && !newPassword) return error(400, 'Nothing to change — enter a new email or a new password.')

  if (!(await checkPassword(current, session.credentials))) {
    const lockedNow = await recordFailure(ip)
    await logActivity(request, 'login_failed', 'Wrong current password while changing sign-in details')
    return error(lockedNow ? 429 : 403, lockedNow ? 'Too many wrong passwords. Changes are paused for 15 minutes.' : 'Your current password is not right.')
  }

  // Keep the existing password if only the email changes (re-hashed so it is always stored hashed).
  await saveCredentials(email, await hashPassword(newPassword || current))
  const what = [emailChanged && `email to ${email}`, newPassword && 'password'].filter(Boolean).join(' and the ')
  await logActivity(request, 'credentials_changed', `Changed the sign-in ${what}. Other sessions were signed out.`)

  const { cookie, expiresAt } = await createSessionCookie(request)
  return json({ ok: true, email, expiresAt }, { headers: { 'Set-Cookie': cookie } })
})
