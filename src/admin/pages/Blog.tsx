import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FilterChips } from '../../components/ui/FilterChips'
import { topics } from '../../data/topics'
import { cx, timeAgo } from '../format'
import s from '../admin.module.css'
import b from './Blog.module.css'
import { IconExternal, IconPen, IconPlus } from '../components/icons'
import { PageHeader } from '../components/ui'
import { useAdmin } from '../adminContext'

type Filter = 'all' | 'published' | 'draft'

export default function Blog() {
  const { content } = useAdmin()
  const [filter, setFilter] = useState<Filter>('all')
  const posts = [...content.posts].sort((a, z) => z.updatedAt.localeCompare(a.updatedAt))
  const shown = filter === 'all' ? posts : posts.filter((p) => p.status === filter)
  const published = posts.filter((p) => p.status === 'published').length

  return (
    <div className={s.page}>
      <PageHeader
        num="04"
        label="Blog"
        title="Blog posts"
        intro="Posts appear on the Insights page. Save as a draft while you write; nothing is public until you click “Publish”."
        actions={
          <Link to="/admin/blog/new" className={cx(s.smallBtn, s.smallPrimary)}>
            <IconPlus size={18} />
            Write a new post
          </Link>
        }
      />

      {published === 0 && (
        <p className={s.notice}>
          The Insights page is currently showing sample notes. As soon as you publish your first post, they are replaced
          by your own posts.
        </p>
      )}

      {posts.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyTitle}>No posts yet.</p>
          <p className={s.intro}>
            Share what you know — a recent project, a common mistake you see on site, or a code change clients should know
            about. Writing works just like a Word document.
          </p>
          <Link to="/admin/blog/new" className={cx(s.smallBtn, s.smallPrimary)}>
            <IconPen size={18} />
            Write your first post
          </Link>
        </div>
      ) : (
        <>
          <FilterChips<Filter>
            options={[
              { id: 'all', label: 'All', count: String(posts.length) },
              { id: 'published', label: 'Published', count: String(published) },
              { id: 'draft', label: 'Drafts', count: String(posts.length - published) },
            ]}
            value={filter}
            onChange={setFilter}
            label="Show posts"
          />
          <ul className={b.list}>
            {shown.map((p) => (
              <li key={p.id} className={b.row}>
                <Link to={`/admin/blog/${p.id}`} className={b.thumb} tabIndex={-1} aria-hidden="true">
                  {p.coverUrl ? <img src={p.coverUrl} alt="" loading="lazy" /> : <span className={b.noCover}>No photo</span>}
                </Link>
                <div className={b.info}>
                  <div className={b.meta}>
                    <span className={cx(s.pill, p.status === 'published' ? s.pillLive : s.pillDraft)}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {p.featured && <span className={cx(s.pill, s.pillInfo)}>Featured</span>}
                    <span className={s.mono} style={{ color: 'var(--muted)' }}>
                      {topics.find((t) => t.id === p.topic)?.label}
                    </span>
                  </div>
                  <Link to={`/admin/blog/${p.id}`} className={b.title}>
                    {p.title}
                  </Link>
                  <span className={s.hint}>
                    Last edited {timeAgo(p.updatedAt).toLowerCase()} · {p.readMinutes} min read
                  </span>
                </div>
                <div className={b.actions}>
                  <Link to={`/admin/blog/${p.id}`} className={s.smallBtn}>
                    <IconPen size={16} />
                    Edit
                  </Link>
                  {p.status === 'published' && (
                    <a href={`/insights/${p.slug}`} target="_blank" rel="noopener" className={s.smallBtn}>
                      <IconExternal size={16} />
                      View
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
