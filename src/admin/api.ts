/** Calls to the admin API. Every request carries the X-SPC-Admin header the server requires. */
import type { ActivityEntry, Post, PostStatus, PostTopic, SessionInfo, SiteContent, Testimonial } from '../cms/types'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Fired when the server says the session is over, so the app can show the sign-in screen. */
export const SIGNED_OUT_EVENT = 'spc-admin-signed-out'

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('X-SPC-Admin', '1')
  headers.set('Accept', 'application/json')
  if (init.body && typeof init.body === 'string') headers.set('Content-Type', 'application/json')
  let res: Response
  try {
    res = await fetch(path, { ...init, headers, credentials: 'same-origin', cache: 'no-store' })
  } catch {
    throw new ApiError(0, 'Can’t reach the server. Check your internet connection and try again.')
  }
  const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
  if (!res.ok) {
    if (res.status === 401 && !path.endsWith('/login')) window.dispatchEvent(new Event(SIGNED_OUT_EVENT))
    throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? `Something went wrong (${res.status}).`)
  }
  return data as T
}

export interface PostDraft {
  id?: string
  title: string
  excerpt: string
  topic: PostTopic
  coverUrl: string
  coverAlt: string
  html: string
  featured: boolean
  status: PostStatus
}

export const api = {
  session: () => call<SessionInfo>('/api/admin/session'),
  login: (username: string, password: string) =>
    call<{ ok: true; expiresAt: string }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => call<{ ok: true }>('/api/admin/logout', { method: 'POST' }),
  content: () => call<SiteContent>('/api/admin/content'),
  saveImages: (images: Record<string, string>) =>
    call<SiteContent>('/api/admin/content', { method: 'PUT', body: JSON.stringify({ images }) }),
  saveTestimonials: (testimonials: Testimonial[]) =>
    call<SiteContent>('/api/admin/content', { method: 'PUT', body: JSON.stringify({ testimonials }) }),
  post: (id: string) => call<Post>(`/api/admin/posts?id=${encodeURIComponent(id)}`),
  savePost: (draft: PostDraft) => call<Post>('/api/admin/posts', { method: 'POST', body: JSON.stringify(draft) }),
  deletePost: (id: string) => call<{ ok: true }>(`/api/admin/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  activity: () => call<ActivityEntry[]>('/api/admin/activity'),
  upload: (photo: Blob) =>
    call<{ url: string }>('/api/admin/upload', { method: 'POST', body: photo, headers: { 'Content-Type': photo.type } }),
}
