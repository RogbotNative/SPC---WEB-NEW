/**
 * Server-side secret used to sign session cookies and to name the private storage folder.
 * Uses SESSION_SECRET if set; otherwise it is derived from BLOB_READ_WRITE_TOKEN, which Vercel adds
 * automatically when a Blob store is connected — so no manual setup is needed.
 */
import { createHmac } from 'node:crypto'
import { HttpError } from './http.js'

export function serverSecret(): string {
  const explicit = process.env.SESSION_SECRET
  if (explicit && explicit.length >= 32) return explicit
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) return createHmac('sha256', token).update('spc-admin-session-secret-v1').digest('base64url')
  if (process.env.VERCEL) {
    throw new HttpError(503, 'Storage is not connected. In Vercel, open Storage → Create → Blob and connect it to this project.')
  }
  return 'local-development-only-secret-not-for-production'
}
