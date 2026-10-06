/** Formatting helpers for the admin panel. */

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ')

/** Message shown after a change, reminding the client that the public site updates within a minute. */
export const LIVE_SOON = 'It will show on the website within about a minute.'

/** "5 minutes ago", "Yesterday at 14:05", "12 Mar 2026 at 09:30" */
export function timeAgo(iso: string) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  const today = new Date()
  const yesterday = new Date(today.getTime() - 86400000)
  if (d.toDateString() === today.toDateString()) return `Today at ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${time}`
}

/** "Chrome on Windows" from a user-agent string. */
export function deviceName(ua: string) {
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : /Safari\//.test(ua)
            ? 'Safari'
            : /curl|node|python/i.test(ua)
              ? 'Script'
              : 'Browser'
  const os = /iPhone|iPad/.test(ua)
    ? 'iPhone/iPad'
    : /Android/.test(ua)
      ? 'Android'
      : /Windows/.test(ua)
        ? 'Windows'
        : /Mac OS X/.test(ua)
          ? 'Mac'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'unknown device'
  return `${browser} on ${os}`
}

/** A time in the future: "today at 14:30", "tomorrow at 09:00", "12 Mar at 09:30". */
export function formatUntil(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 86400000)
  if (d.toDateString() === today.toDateString()) return `today at ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `tomorrow at ${time}`
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at ${time}`
}
