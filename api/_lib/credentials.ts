/**
 * Admin sign-in details. They are changed from the admin panel (Security → Sign-in details) and stored,
 * hashed, in the private storage folder. Until then, the temporary sign-in below is used.
 * Order of precedence: details saved from the panel → ADMIN_USERNAME + ADMIN_PASSWORD(_HASH) env vars → temporary.
 */
import { privateDir, readJson, writeJson } from './storage.js'

export interface Credentials {
  /** Email address used to sign in (compared case-insensitively). */
  email: string
  /** scrypt hash (see password.ts), or a plain password when it comes from ADMIN_PASSWORD. */
  password: string
  hashed: boolean
  source: 'saved' | 'env' | 'temporary'
  changedAt: string | null
}

/** Temporary sign-in, replaced as soon as new details are saved in the panel. Only the password's hash is kept here. */
const TEMPORARY = {
  email: 'spcdesign7@gmail.com',
  passwordHash: 'scrypt:32768:8:1:UDZbgoDzdrgYjz-Qg4pIKQ:OLIgmHhCKXT2ZSh70ZMAwP0B0Iz9V4D7XuSO8bXu_fR7D9ieYAZ4bUGuGB4xnbW49_z4ceuTSd4TfWwnAepcHw',
}

interface Saved {
  email: string
  passwordHash: string
  changedAt: string
}

const file = () => `${privateDir()}/credentials.json`

export async function currentCredentials(): Promise<Credentials> {
  const saved = await readJson<Saved>(file())
  if (saved?.email && saved.passwordHash) {
    return { email: saved.email, password: saved.passwordHash, hashed: true, source: 'saved', changedAt: saved.changedAt }
  }
  const envUser = process.env.ADMIN_USERNAME?.trim()
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const envPlain = process.env.ADMIN_PASSWORD
  if (envUser && (envHash || envPlain)) {
    return { email: envUser, password: envHash || envPlain!, hashed: Boolean(envHash), source: 'env', changedAt: null }
  }
  return { email: TEMPORARY.email, password: TEMPORARY.passwordHash, hashed: true, source: 'temporary', changedAt: null }
}

export async function saveCredentials(email: string, passwordHash: string): Promise<void> {
  await writeJson(file(), { email, passwordHash, changedAt: new Date().toISOString() } satisfies Saved)
}
