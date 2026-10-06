import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Post, PostMeta } from '../../cms/types'
import { topics } from '../../data/topics'
import { cx, timeAgo, LIVE_SOON } from '../format'
import s from '../admin.module.css'
import pe from './PostEditor.module.css'
import { api, type PostDraft } from '../api'
import { Editor } from '../components/Editor'
import { IconBack, IconExternal, IconTrash, IconUpload } from '../components/icons'
import { preparePhoto } from '../images'
import { UnsavedGuard } from '../components/UnsavedGuard'
import { ConfirmDialog, Spinner } from '../components/ui'
import { useAdmin } from '../adminContext'

const emptyDraft: PostDraft = {
  title: '',
  excerpt: '',
  topic: 'structural',
  coverUrl: '',
  coverAlt: '',
  html: '',
  featured: false,
  status: 'draft',
}

const fromPost = (p: Post): PostDraft => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  topic: p.topic,
  coverUrl: p.coverUrl,
  coverAlt: p.coverAlt,
  html: p.html,
  featured: p.featured,
  status: p.status,
})

const snapshot = (d: PostDraft) => JSON.stringify({ ...d, status: undefined })

export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { content, setContent, notify } = useAdmin()
  const [draft, setDraft] = useState<PostDraft>(emptyDraft)
  const [saved, setSaved] = useState<Post | null>(null)
  const [clean, setClean] = useState(snapshot(emptyDraft))
  const [loading, setLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState<'save' | 'cover' | 'delete' | null>(null)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [goTo, setGoTo] = useState<string | null>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  const dirty = snapshot(draft) !== clean

  // Grow the title box with long titles (browsers without CSS field-sizing).
  useEffect(() => {
    const el = titleRef.current
    if (!el || CSS.supports('field-sizing', 'content')) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [draft.title, loading])

  useEffect(() => {
    if (!id) return
    let live = true
    api.post(id).then(
      (p) => {
        if (!live) return
        setDraft(fromPost(p))
        setSaved(p)
        setClean(snapshot(fromPost(p)))
        setLoading(false)
      },
      (e: Error) => live && (setLoadError(e.message), setLoading(false)),
    )
    return () => {
      live = false
    }
  }, [id])

  // Navigate only after the "saved" state has rendered, so the unsaved-changes guard doesn't fire.
  useEffect(() => {
    if (goTo) navigate(goTo, { replace: true })
  }, [goTo, navigate])

  const set = <K extends keyof PostDraft>(k: K, v: PostDraft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  const save = useCallback(
    async (status: PostDraft['status']) => {
      if (busy) return
      if (!draft.title.trim()) {
        setError('Give the post a title before saving.')
        document.getElementById('post-title')?.focus()
        return
      }
      if (status === 'published' && !draft.html.trim()) {
        setError('The post is empty. Write something before publishing.')
        return
      }
      setError('')
      setBusy('save')
      try {
        const post = await api.savePost({ ...draft, status })
        const meta: PostMeta = (({ html: _h, ...m }) => m)(post)
        setContent({
          ...content,
          posts: [meta, ...content.posts.filter((p) => p.id !== post.id).map((p) => (post.featured ? { ...p, featured: false } : p))],
        })
        setDraft(fromPost(post))
        setSaved(post)
        setClean(snapshot(fromPost(post)))
        const was = saved?.status
        notify(
          status === 'published'
            ? was === 'published'
              ? `Changes published. ${LIVE_SOON}`
              : `Published! ${LIVE_SOON}`
            : was === 'published'
              ? 'Post taken offline and saved as a draft.'
              : 'Draft saved. Only you can see it until you publish.',
        )
        if (!id) setGoTo(`/admin/blog/${post.id}`)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save the post.')
      } finally {
        setBusy(null)
      }
    },
    [busy, content, draft, id, notify, saved, setContent],
  )

  // Ctrl/⌘+S saves (keeping the current status)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void save(draft.status)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save, draft.status])

  const uploadCover = async (file: File | undefined) => {
    if (!file) return
    setBusy('cover')
    try {
      const { url } = await api.upload(await preparePhoto(file))
      set('coverUrl', url)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'The photo could not be uploaded.', 'error')
    } finally {
      setBusy(null)
    }
  }

  const remove = async () => {
    if (!saved) return
    setBusy('delete')
    try {
      await api.deletePost(saved.id)
      setContent({ ...content, posts: content.posts.filter((p) => p.id !== saved.id) })
      notify(`“${saved.title}” deleted.`)
      setClean(snapshot(draft))
      setConfirmDelete(false)
      setGoTo('/admin/blog')
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not delete the post.', 'error')
      setBusy(null)
    }
  }

  if (loading)
    return (
      <p className={s.muted}>
        <Spinner /> Opening the post…
      </p>
    )
  if (loadError)
    return (
      <div className={s.page}>
        <p className={s.alert}>{loadError}</p>
        <Link to="/admin/blog" className={s.smallBtn}>
          Back to all posts
        </Link>
      </div>
    )

  const isPublished = saved?.status === 'published'

  return (
    <div className={cx(s.page, pe.page)}>
      <UnsavedGuard dirty={dirty && busy !== 'save' && !goTo} />

      <div className={pe.top}>
        <Link to="/admin/blog" className={pe.back}>
          <IconBack size={18} />
          All posts
        </Link>
        <div className={pe.state}>
          <span className={cx(s.pill, isPublished ? s.pillLive : s.pillDraft)}>{isPublished ? 'Published' : 'Draft'}</span>
          <span className={s.hint} aria-live="polite">
            {busy === 'save' ? 'Saving…' : dirty ? 'Unsaved changes' : saved ? `Saved ${timeAgo(saved.updatedAt).toLowerCase()}` : 'Not saved yet'}
          </span>
        </div>
      </div>

      <div className={pe.layout}>
        <div className={pe.main}>
          <label className={s.field}>
            <span className="visually-hidden">Title</span>
            <textarea
              id="post-title"
              ref={titleRef}
              className={pe.title}
              value={draft.title}
              maxLength={160}
              rows={1}
              placeholder="Post title"
              onChange={(e) => set('title', e.target.value.replace(/\n/g, ' '))}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              autoFocus={!id}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Summary · shown on the Insights page under the title</span>
            <textarea
              className={s.textarea}
              value={draft.excerpt}
              maxLength={300}
              rows={2}
              placeholder="One or two sentences on what the reader will learn."
              onChange={(e) => set('excerpt', e.target.value)}
            />
            <span className={s.counter}>{draft.excerpt.length} / 300</span>
          </label>
          <Editor value={draft.html} onChange={(html) => set('html', html)} onError={(m) => notify(m, 'error')} />
        </div>

        <aside className={pe.side}>
          <section className={s.panel}>
            <div className={s.panelHead}>
              <h2 className={s.panelTitle}>Publish</h2>
            </div>
            <div className={cx(s.panelBody, pe.publish)}>
              {error && (
                <p className={s.alert} role="alert">
                  {error}
                </p>
              )}
              <p className={s.small}>
                {isPublished
                  ? 'This post is live on the Insights page. Changes go live when you click “Update”.'
                  : 'Drafts are only visible here. Publish when you’re happy with it.'}
              </p>
              {isPublished ? (
                <>
                  <button type="button" className={cx(s.smallBtn, s.smallPrimary, pe.wide)} disabled={Boolean(busy)} onClick={() => void save('published')}>
                    {busy === 'save' ? 'Saving…' : 'Update post'}
                  </button>
                  <button type="button" className={cx(s.smallBtn, pe.wide)} disabled={Boolean(busy)} onClick={() => void save('draft')}>
                    Take offline (back to draft)
                  </button>
                  <a href={`/insights/${saved?.slug}`} target="_blank" rel="noopener" className={cx(s.smallBtn, pe.wide)}>
                    <IconExternal size={16} />
                    View on website
                  </a>
                </>
              ) : (
                <>
                  <button type="button" className={cx(s.smallBtn, s.smallPrimary, pe.wide)} disabled={Boolean(busy)} onClick={() => void save('published')}>
                    {busy === 'save' ? 'Saving…' : 'Publish'}
                  </button>
                  <button type="button" className={cx(s.smallBtn, pe.wide)} disabled={Boolean(busy)} onClick={() => void save('draft')}>
                    Save draft
                  </button>
                </>
              )}
              <p className={s.hint}>Shortcut: {/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'}+S saves.</p>
            </div>
          </section>

          <section className={s.panel}>
            <div className={s.panelHead}>
              <h2 className={s.panelTitle}>Cover photo</h2>
            </div>
            <div className={cx(s.panelBody, pe.cover)}>
              <div className={pe.coverFrame}>
                {draft.coverUrl ? (
                  <img src={draft.coverUrl} alt={draft.coverAlt || 'Cover photo'} />
                ) : (
                  <span>No cover photo — a standard photo for the topic is used.</span>
                )}
                {busy === 'cover' && (
                  <span className={pe.coverBusy}>
                    <Spinner /> Uploading…
                  </span>
                )}
              </div>
              <input
                ref={coverInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => {
                  void uploadCover(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
              <div className={s.btnRow}>
                <button type="button" className={s.smallBtn} onClick={() => coverInput.current?.click()} disabled={Boolean(busy)}>
                  <IconUpload size={16} />
                  {draft.coverUrl ? 'Change photo' : 'Add photo'}
                </button>
                {draft.coverUrl && (
                  <button type="button" className={s.smallBtn} onClick={() => (set('coverUrl', ''), set('coverAlt', ''))} disabled={Boolean(busy)}>
                    Remove
                  </button>
                )}
              </div>
              {draft.coverUrl && (
                <label className={s.field}>
                  <span className={s.label}>Describe the photo</span>
                  <input
                    className={s.input}
                    value={draft.coverAlt}
                    maxLength={200}
                    placeholder="e.g. Column reinforcement on a residential site"
                    onChange={(e) => set('coverAlt', e.target.value)}
                  />
                  <span className={s.hint}>Read aloud to visitors who can’t see the photo, and used by Google.</span>
                </label>
              )}
            </div>
          </section>

          <section className={s.panel}>
            <div className={s.panelHead}>
              <h2 className={s.panelTitle}>Settings</h2>
            </div>
            <div className={cx(s.panelBody, pe.publish)}>
              <label className={s.field}>
                <span className={s.label}>Topic</span>
                <select className={s.select} value={draft.topic} onChange={(e) => set('topic', e.target.value as PostDraft['topic'])}>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={s.switch}>
                <input type="checkbox" role="switch" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} />
                Feature at the top of the Insights page
              </label>
            </div>
          </section>

          {saved && (
            <button type="button" className={cx(s.smallBtn, s.danger, pe.wide)} onClick={() => setConfirmDelete(true)} disabled={Boolean(busy)}>
              <IconTrash size={16} />
              Delete this post
            </button>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this post?"
        confirmLabel="Delete for good"
        danger
        busy={busy === 'delete'}
        onConfirm={() => void remove()}
        onCancel={() => setConfirmDelete(false)}
      >
        “{saved?.title}” will be removed from the website and from this panel. This can’t be undone. To hide it but
        keep it, use “Take offline” instead.
      </ConfirmDialog>
    </div>
  )
}
