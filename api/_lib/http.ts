/** Small helpers shared by the /api functions. */
import { StorageNotConfiguredError } from './storage.js'

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')
  return new Response(JSON.stringify(data), { ...init, headers })
}

export const error = (status: number, message: string, init: ResponseInit = {}) =>
  json({ error: message }, { ...init, status })

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Reads a JSON body, rejecting anything over `limit` bytes. */
export async function readBody<T>(request: Request, limit = 1_000_000): Promise<T> {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > limit) throw new HttpError(413, 'That is too large to save in one go.')
  const text = await request.text()
  if (text.length > limit) throw new HttpError(413, 'That is too large to save in one go.')
  try {
    return JSON.parse(text) as T
  } catch {
    throw new HttpError(400, 'The request was not valid JSON.')
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim().slice(0, 64)
}

export const userAgent = (request: Request) => (request.headers.get('user-agent') ?? 'unknown').slice(0, 300)

/**
 * Cross-site request protection for state-changing admin calls: the browser must send our custom header
 * (impossible cross-site without a CORS preflight, which we never allow) and, when present, a same-site Origin.
 */
export function assertSameOrigin(request: Request) {
  if (request.headers.get('x-spc-admin') !== '1') throw new HttpError(403, 'Request blocked.')
  const origin = request.headers.get('origin')
  if (origin) {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
    let originHost = ''
    try {
      originHost = new URL(origin).host
    } catch {
      /* invalid origin */
    }
    if (!host || originHost !== host) throw new HttpError(403, 'Request blocked.')
  }
}

/** Wraps a handler so thrown HttpErrors and storage problems become friendly JSON errors. */
export function handle(fn: (request: Request) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    try {
      return await fn(request)
    } catch (e) {
      if (e instanceof HttpError) return error(e.status, e.message)
      if (e instanceof StorageNotConfiguredError) return error(503, e.message)
      console.error('[api]', e)
      return error(500, 'Something went wrong on the server. Please try again.')
    }
  }
}
