/** Activity log: every sign-in (successful or not) and every change made in the admin panel. */
import { randomUUID } from 'node:crypto'
import type { ActivityEntry, ActivityType } from '../../src/cms/types.js'
import { clientIp, userAgent } from './http.js'
import { privateDir, readJson, writeJson } from './storage.js'

const MAX_ENTRIES = 1000
const file = () => `${privateDir()}/activity.json`

export async function readActivity(): Promise<ActivityEntry[]> {
  return (await readJson<ActivityEntry[]>(file())) ?? []
}

export async function logActivity(request: Request, type: ActivityType, detail: string): Promise<ActivityEntry> {
  const entry: ActivityEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    type,
    detail: detail.slice(0, 300),
    ip: clientIp(request),
    userAgent: userAgent(request),
  }
  try {
    const entries = await readActivity()
    await writeJson(file(), [entry, ...entries].slice(0, MAX_ENTRIES))
  } catch (e) {
    // Never block a sign-in or a save because the log couldn't be written.
    console.error('[activity] could not write log', e)
  }
  return entry
}
