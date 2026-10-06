/**
 * Admin sign-in.
 *
 * The email and password are managed from the admin panel (see credentials.ts); passwords are stored as
 * scrypt hashes. Sessions are a signed, HttpOnly, SameSite=Strict cookie that expires after 8 hours, and
 * changing the email or password signs out every other session. Five wrong passwords from one address in
 * 15 minutes lock that address out for 15 minutes.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { currentCredentials, type Credentials } from './credentials.js'
import { HttpError } from './http.js'
import { verifyPassword } from './password.js'
import { serverSecret } from './secrets.js'
import { privateDir, readJson, writeJson } from './storage.js'

export const SESSION_HOURS = 8
const MAX_FAILS = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCK_MS = 15 * 60 * 1000

const sha256 = (s: string) => createHash('sha256').update(s).digest()
const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64url')
const normaliseEmail = (s: string) => s.trim().toLowerCase()

/* ---------------- Passwords ---------------- */

/** Constant-time check of a password against the current credentials. */
export async function checkPassword(password: string, creds?: Credentials): Promise<boolean> {
  const c = creds ?? (await currentCredentials())
  return c.hashed ? verifyPassword(password, c.password) : timingSafeEqual(sha256(password), sha256(c.password))
}

/** Checks email and password together; both checks always run so timing doesn't reveal which was wrong. */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const c = await currentCredentials()
  const emailOk = timingSafeEqual(sha256(normaliseEmail(email)), sha256(normaliseEmail(c.email)))
  const passOk = await checkPassword(password, c)
  return emailOk && passOk
}

/* ---------------- Sessions ---------------- */

interface SessionPayload {
  u: string
  iat: number
  exp: number
  /** Fingerprint of the current credentials: changing the email or password invalidates old sessions. */
  fp: string
  n: string
}

const fingerprint = (c: Credentials) => sha256(`${normaliseEmail(c.email)}:${c.password}`).toString('base64url').slice(0, 22)

const sign = (data: string) => createHmac('sha256', serverSecret()).update(data).digest('base64url')

const isHttps = (request: Request) =>
  (request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '')) === 'https'

/** `__Host-` cookies must be Secure; plain http (local development) uses an unprefixed name. */
const cookieName = (request: Request) => (isHttps(request) ? '__Host-spc_admin' : 'spc_admin')

export async function createSessionCookie(request: Request): Promise<{ cookie: string; expiresAt: string }> {
  const c = await currentCredentials()
  const now = Date.now()
  const payload: SessionPayload = {
    u: c.email,
    iat: now,
    exp: now + SESSION_HOURS * 3600 * 1000,
    fp: fingerprint(c),
    n: randomBytes(8).toString('base64url'),
  }
  const body = b64url(JSON.stringify(payload))
  const token = `${body}.${sign(body)}`
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Strict', `Max-Age=${SESSION_HOURS * 3600}`]
  if (isHttps(request)) attrs.push('Secure')
  return { cookie: `${cookieName(request)}=${token}; ${attrs.join('; ')}`, expiresAt: new Date(payload.exp).toISOString() }
}

export function clearSessionCookie(request: Request): string {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0']
  if (isHttps(request)) attrs.push('Secure')
  return `${cookieName(request)}=; ${attrs.join('; ')}`
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

export interface Session {
  email: string
  expiresAt: string
  credentials: Credentials
}

/** Returns the signed-in session, or throws 401. */
export async function requireSession(request: Request): Promise<Session> {
  const token = readCookie(request, cookieName(request))
  if (!token) throw new HttpError(401, 'Please sign in.')
  const [body, mac] = token.split('.')
  if (!body || !mac) throw new HttpError(401, 'Please sign in.')
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(mac)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new HttpError(401, 'Please sign in.')
  let payload: SessionPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
  } catch {
    throw new HttpError(401, 'Please sign in.')
  }
  if (payload.exp <= Date.now()) throw new HttpError(401, 'Your session has expired. Please sign in again.')
  const c = await currentCredentials()
  if (payload.fp !== fingerprint(c)) throw new HttpError(401, 'Your sign-in details were changed. Please sign in again.')
  return { email: c.email, expiresAt: new Date(payload.exp).toISOString(), credentials: c }
}

/* ---------------- Lockout after repeated failures ---------------- */

interface Attempts {
  [ip: string]: { fails: number[]; lockedUntil?: number }
}

const attemptsFile = () => `${privateDir()}/sign-in-attempts.json`

async function loadAttempts(): Promise<Attempts> {
  const all = (await readJson<Attempts>(attemptsFile())) ?? {}
  const now = Date.now()
  for (const [ip, rec] of Object.entries(all)) {
    rec.fails = rec.fails.filter((t) => now - t < WINDOW_MS)
    if (!rec.fails.length && (!rec.lockedUntil || rec.lockedUntil < now)) delete all[ip]
  }
  return all
}

/** Minutes left on a lock for this address, or 0. */
export async function lockedMinutes(ip: string): Promise<number> {
  const rec = (await loadAttempts())[ip]
  if (!rec?.lockedUntil) return 0
  const left = rec.lockedUntil - Date.now()
  return left > 0 ? Math.ceil(left / 60000) : 0
}

/** Records a failed attempt. Returns minutes locked if this attempt triggered a lock, else 0. */
export async function recordFailure(ip: string): Promise<number> {
  const all = await loadAttempts()
  const rec = (all[ip] ??= { fails: [] })
  rec.fails.push(Date.now())
  let locked = 0
  if (rec.fails.length >= MAX_FAILS) {
    rec.lockedUntil = Date.now() + LOCK_MS
    rec.fails = []
    locked = LOCK_MS / 60000
  }
  await writeJson(attemptsFile(), all)
  return locked
}

export async function clearFailures(ip: string): Promise<void> {
  const all = await loadAttempts()
  if (!all[ip]) return
  delete all[ip]
  await writeJson(attemptsFile(), all)
}
