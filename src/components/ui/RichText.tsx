import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import s from './RichText.module.css'

const ALLOWED_TAGS = [
  'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
  'blockquote', 'hr', 'img', 'figure', 'figcaption', 'code', 'pre', 'span',
]
const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'target', 'rel', 'style']

let hooked = false
function addHooks() {
  if (hooked) return
  hooked = true
  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    // Only text alignment survives as inline style.
    if (data.attrName === 'style' && !/^text-align:\s*(left|right|center|justify);?$/i.test(data.attrValue.trim())) {
      data.keepAttr = false
    }
    // Photos only from our own uploads or https.
    if (data.attrName === 'src' && !/^(https:\/\/|\/__uploads\/)/.test(data.attrValue)) data.keepAttr = false
  })
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') ?? ''
      if (/^https?:\/\//.test(href) && !href.startsWith(location.origin)) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy')
      node.setAttribute('decoding', 'async')
    }
  })
}

/** Renders HTML written in the admin panel's editor, sanitised so nothing unsafe reaches the page. */
export function RichText({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(() => {
    addHooks()
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR, ADD_ATTR: ['loading', 'decoding'] })
  }, [html])
  return <div className={[s.prose, className].filter(Boolean).join(' ')} dangerouslySetInnerHTML={{ __html: clean }} />
}
