/**
 * Storage for admin-managed content.
 * - On Vercel: Vercel Blob (needs BLOB_READ_WRITE_TOKEN, added when a Blob store is connected to the project).
 * - Locally (`npm run dev`): files under .data/, served by the dev server at /__uploads/.
 */
import { createHash, randomBytes } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, normalize } from 'node:path'
import { del, get, put } from '@vercel/blob'

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

/** Local storage root for development. */
export const LOCAL_ROOT = join(process.cwd(), '.data')

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Storage is not connected. In Vercel, open Storage → Create → Blob and connect it to this project.')
  }
}

function assertConfigured() {
  // Vercel's filesystem is read-only, so production must use Blob.
  if (!blobEnabled() && process.env.VERCEL) throw new StorageNotConfiguredError()
}

function localPath(pathname: string) {
  const p = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '')
  return join(LOCAL_ROOT, p)
}

/**
 * Folder for private records (activity log, sign-in attempts). Blob URLs are public, so the folder name is
 * derived from SESSION_SECRET and can't be guessed by anyone who doesn't know the secret.
 */
export function privateDir() {
  const secret = process.env.SESSION_SECRET ?? 'local-dev'
  return `private-${createHash('sha256').update(`spc-private:${secret}`).digest('hex').slice(0, 32)}`
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  assertConfigured()
  if (!blobEnabled()) {
    try {
      return JSON.parse(await readFile(localPath(pathname), 'utf8')) as T
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw e
    }
  }
  const res = await get(pathname, { access: 'public', useCache: false })
  if (!res || res.statusCode !== 200) return null
  return JSON.parse(await new Response(res.stream).text()) as T
}

export async function writeJson(pathname: string, data: unknown): Promise<void> {
  assertConfigured()
  const body = JSON.stringify(data)
  if (!blobEnabled()) {
    const file = localPath(pathname)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, body)
    return
  }
  await put(pathname, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  })
}

export async function removeFile(pathname: string): Promise<void> {
  assertConfigured()
  if (!blobEnabled()) {
    await rm(localPath(pathname), { force: true })
    return
  }
  await del(pathname)
}

/** Stores an uploaded photo under uploads/ with an unguessable name and returns its public URL. */
export async function uploadImage(bytes: Uint8Array, ext: string, contentType: string): Promise<string> {
  assertConfigured()
  const name = `uploads/${new Date().getFullYear()}/${randomBytes(12).toString('hex')}.${ext}`
  if (!blobEnabled()) {
    const file = localPath(name)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, bytes)
    return `/__${name}`
  }
  const blob = await put(name, Buffer.from(bytes), {
    access: 'public',
    addRandomSuffix: false,
    contentType,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  })
  return blob.url
}
