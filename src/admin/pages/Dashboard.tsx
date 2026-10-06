import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ActivityEntry } from '../../cms/types'
import { photoSlots } from '../../cms/photoSlots'
import { timeAgo, deviceName, formatUntil } from '../format'
import s from '../admin.module.css'
import d from './Dashboard.module.css'
import { api } from '../api'
import { IconExternal, IconPen, IconPhoto, IconQuote, IconShield } from '../components/icons'
import { ActivityList } from './Security'
import { PageHeader, Panel } from '../components/ui'
import { useAdmin } from '../adminContext'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { session, content } = useAdmin()
  const [activity, setActivity] = useState<ActivityEntry[] | null>(null)

  useEffect(() => {
    api.activity().then(setActivity, () => setActivity([]))
  }, [])

  const replaced = Object.keys(content.images).length
  const published = content.posts.filter((p) => p.status === 'published').length
  const drafts = content.posts.length - published
  const shown = content.testimonials?.filter((t) => t.visible).length ?? 0
  const failedSince = activity?.filter((e) => e.type === 'login_failed' && (!session.lastLogin || e.at > session.lastLogin.at)).length ?? 0

  const actions = [
    {
      to: '/admin/photos',
      Icon: IconPhoto,
      title: 'Change photos',
      text: 'Swap any photo on the website for one of your own.',
      stat: `${replaced} of ${photoSlots.length} replaced`,
    },
    {
      to: '/admin/testimonials',
      Icon: IconQuote,
      title: 'Edit testimonials',
      text: 'Add, edit or hide what clients say about you.',
      stat: `${shown} shown on the website`,
    },
    {
      to: '/admin/blog/new',
      Icon: IconPen,
      title: 'Write a blog post',
      text: 'Type it like a Word document, add photos, publish.',
      stat: `${published} published · ${drafts} draft${drafts === 1 ? '' : 's'}`,
    },
  ]

  return (
    <div className={s.page}>
      <PageHeader
        num="01"
        label="Dashboard"
        title={`${greeting()}, ${session.username}.`}
        intro="What would you like to update today? Changes you make here appear on the website within about a minute."
        actions={
          <a href="/" target="_blank" rel="noopener" className={s.smallBtn}>
            <IconExternal size={18} />
            View website
          </a>
        }
      />

      <div className={d.actions}>
        {actions.map(({ to, Icon, title, text, stat }, i) => (
          <Link key={to} to={to} className={d.action}>
            <span className={d.actionTop}>
              <span className={d.actionIcon}>
                <Icon size={26} />
              </span>
              <span className={d.actionNum}>{String(i + 1).padStart(2, '0')}</span>
            </span>
            <span className={d.actionTitle}>{title}</span>
            <span className={d.actionText}>{text}</span>
            <span className={d.actionStat}>{stat}</span>
          </Link>
        ))}
      </div>

      <div className={d.split}>
        <Panel title="Recent activity" action={<Link to="/admin/security" className={s.mono} style={{ color: 'var(--steel)' }}>See all</Link>}>
          {activity ? <ActivityList entries={activity.slice(0, 6)} compact /> : <p className={s.muted}>Loading…</p>}
        </Panel>

        <Panel title="Your account">
          <ul className={d.facts}>
            <li>
              <span className={s.label}>Previous sign-in</span>
              <span>
                {session.lastLogin
                  ? `${timeAgo(session.lastLogin.at)} · ${deviceName(session.lastLogin.userAgent)}`
                  : 'This is the first sign-in recorded.'}
              </span>
            </li>
            <li>
              <span className={s.label}>This session ends</span>
              <span>{formatUntil(session.expiresAt)}</span>
            </li>
            <li>
              <span className={s.label}>Wrong passwords since then</span>
              <span className={failedSince ? d.warn : undefined}>
                {failedSince ? `${failedSince} failed attempt${failedSince === 1 ? '' : 's'} — check Security` : 'None'}
              </span>
            </li>
          </ul>
          <Link to="/admin/security" className={s.smallBtn} style={{ marginTop: 20 }}>
            <IconShield size={18} />
            Security &amp; sign-in history
          </Link>
        </Panel>
      </div>
    </div>
  )
}
