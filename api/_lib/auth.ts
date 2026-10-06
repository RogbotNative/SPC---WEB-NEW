/**
 * Admin sign-in.
 *
 * Credentials come from environment variables set in Vercel (never from the code or the browser):
 *   ADMIN_USERNAME       the sign-in name
 *   ADMIN_PASSWORD_HASH  scrypt hash from `npm run admin:hash-password` (recommended)
 *     or ADMIN_PASSWORD  the password itself (simpler; Vercel stores env vars encrypted)
 *   SESSION_SECRET       32+ random characters used to sign the session cookie
 *
 * Sessions are a signed, HttpOnly, SameSite=Strict cookie that expires after 8 hours. Changing the password
 * (or SESSION_SECRET) signs out every open session. Five wrong passwords from one address in 15 minutes lock
 * that address out for 15 minutes.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { HttpError } from './http.js'
import { verifyPassword } from './password.js'
import { privateDir, readJson, writeJson } from './storage.js'

export const SESSION_HOURS = 8
const MAX_FAILS = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCK_MS = 15 * 60 * 1000

const sha256 = (s: string) => createHash('sha256').update(s).digest()
const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64url')

interface AdminConfig {
  username: string
  secret: string
  /** Password hash or password — only used for verification and to fingerprint sessions. */
  passwordMaterial: string
  hashed: boolean
}

function config(): AdminConfig {
  const username = process.env.ADMIN_USERNAME?.trim()
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const plain = process.env.ADMIN_PASSWORD
  const secret = process.env.SESSION_SECRET ?? ''
  if (!username || (!hash && !plain) || secret.length < 32) {
    throw new HttpError(
      503,
      'Admin sign-in is not set up yet. Add ADMIN_USERNAME, ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD) and a SESSION_SECRET of at least 32 characters to the environment variables, then redeploy.',
    )
  }
  return { username, secret, passwordMaterial: hash || plain!, hashed: Boolean(hash) }
}

/** Throws a 503 with setup instructions if the credentials are missing. */
export const assertConfigured = () => void config()

/* ---------------- Passwords ---------------- */

/** Constant-time check of both username and password. */
export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const cfg = config()
  const userOk = timingSafeEqual(sha256(username.trim().toLowerCase()), sha256(cfg.username.toLowerCase()))
  const passOk = cfg.hashed
    ? await verifyPassword(password, cfg.passwordMaterial)
    : timingSafeEqual(sha256(password), sha256(cfg.passwordMaterial))
  return userOk && passOk
}

/* ---------------- Sessions ---------------- */

interface SessionPayload {
  u: string
  iat: number
  exp: number
  /** Fingerprint of the current credentials: changing the password invalidates old sessions. */
  fp: string
  n: string
}

const fingerprint = (cfg: AdminConfig) =>
  sha256(`${cfg.username}:${cfg.passwordMaterial}`).toString('base64url').slice(0, 22)

const sign = (data: string, secret: string) => createHmac('sha256', secret).update(data).digest('base64url')

const isHttps = (request: Request) =>
  (request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '')) === 'https'

/** `__Host-` cookies must be Secure; plain http (local development) uses an unprefixed name. */
const cookieName = (request: Request) => (isHttps(request) ? '__Host-spc_admin' : 'spc_admin')

export function createSessionCookie(request: Request): { cookie: string; expiresAt: string } {
  const cfg = config()
  const now = Date.now()
  const payload: SessionPayload = {
    u: cfg.username,
    iat: now,
    exp: now + SESSION_HOURS * 3600 * 1000,
    fp: fingerprint(cfg),
    n: randomBytes(8).toString('base64url'),
  }
  const body = b64url(JSON.stringify(payload))
  const token = `${body}.${sign(body, cfg.secret)}`
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

/** Returns the signed-in session, or throws 401. */
export function requireSession(request: Request): { username: string; expiresAt: string } {
  const cfg = config()
  const token = readCookie(request, cookieName(request))
  if (!token) throw new HttpError(401, 'Please sign in.')
  const [body, mac] = token.split('.')
  if (!body || !mac) throw new HttpError(401, 'Please sign in.')
  const expected = Buffer.from(sign(body, cfg.secret))
  const given = Buffer.from(mac)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new HttpError(401, 'Please sign in.')
  let payload: SessionPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
  } catch {
    throw new HttpError(401, 'Please sign in.')
  }
  if (payload.exp <= Date.now()) throw new HttpError(401, 'Your session has expired. Please sign in again.')
  if (payload.u !== cfg.username || payload.fp !== fingerprint(cfg)) throw new HttpError(401, 'Please sign in again.')
  return { username: payload.u, expiresAt: new Date(payload.exp).toISOString() }
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
