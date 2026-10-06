/**
 * Content edited in the admin panel, loaded once before the website renders (see main.tsx).
 * If the API is unreachable (e.g. static hosting, or a slow network) the site falls back to the
 * defaults built into the code, so it never shows a blank page.
 */
import type { PublicContent } from './types'

const empty: PublicContent = { images: {}, testimonials: null, posts: [] }
let content: PublicContent = empty

export async function loadContent(timeoutMs = 2500): Promise<PublicContent> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch('/api/content', { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const data = (await res.json()) as Partial<PublicContent>
      content = {
        images: data.images ?? {},
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : null,
        posts: Array.isArray(data.posts) ? data.posts : [],
      }
    }
  } catch {
    /* keep defaults */
  } finally {
    clearTimeout(timer)
  }
  return content
}

export const getContent = () => content
