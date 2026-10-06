import { useEffect, useState } from 'react'
import { FilterChips } from '../../components/ui/FilterChips'
import type { ActivityEntry, ActivityType } from '../../cms/types'
import { cx, timeAgo, deviceName, formatUntil } from '../format'
import s from '../admin.module.css'
import a from './Security.module.css'
import { api } from '../api'
import { IconAlert, IconCheck, IconLock, IconLogout, IconPen, IconPhoto, IconQuote, IconUpload } from '../components/icons'
import { PageHeader, Panel, Spinner } from '../components/ui'
import { useAdmin } from '../adminContext'

type Filter = 'all' | 'signins' | 'failed' | 'changes'

const signInTypes: ActivityType[] = ['login_success', 'login_failed', 'login_locked', 'logout']
const failTypes: ActivityType[] = ['login_failed', 'login_locked']

const iconFor = (t: ActivityType) => {
  if (t === 'login_success') return IconCheck
  if (failTypes.includes(t)) return IconAlert
  if (t === 'logout') return IconLogout
  if (t.startsWith('photo')) return IconPhoto
  if (t === 'testimonials_saved') return IconQuote
  if (t === 'file_uploaded') return IconUpload
  return IconPen
}

/** Activity rows. Used here and (compact) on the dashboard. */
export function ActivityList({ entries, compact }: { entries: ActivityEntry[]; compact?: boolean }) {
  if (!entries.length) return <p className={s.muted}>Nothing recorded yet.</p>
  return (
    <ol className={cx(a.list, compact && a.compact)}>
      {entries.map((e) => {
        const Icon = iconFor(e.type)
        const fail = failTypes.includes(e.type)
        return (
          <li key={e.id} className={cx(a.row, fail && a.fail)}>
            <span className={a.icon}>
              <Icon size={18} />
            </span>
            <span className={a.what}>
              <span className={a.detail}>{e.detail}</span>
              <span className={a.meta}>
                <time dateTime={e.at} title={new Date(e.at).toLocaleString('en-GB')}>
                  {timeAgo(e.at)}
                </time>
                {!compact && (
                  <>
                    {' · '}
                    {deviceName(e.userAgent)} · IP {e.ip}
                  </>
                )}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default function Security() {
  const { session } = useAdmin()
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [limit, setLimit] = useState(50)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    api.activity().then(setEntries, (e: Error) => setError(e.message))
  }, [])

  const all = entries ?? []
  const shown = all.filter((e) =>
    filter === 'all'
      ? true
      : filter === 'signins'
        ? signInTypes.includes(e.type)
        : filter === 'failed'
          ? failTypes.includes(e.type)
          : !signInTypes.includes(e.type),
  )
  const failed24h = all.filter((e) => failTypes.includes(e.type) && now - Date.parse(e.at) < 86400000).length

  return (
    <div className={s.page}>
      <PageHeader
        num="05"
        label="Security"
        title="Security & activity"
        intro="Every sign-in — including wrong passwords — and every change made in this admin panel is recorded here, with the time, device and internet address."
      />

      <div className={a.cards}>
        <div className={a.card}>
          <span className={s.label}>This session</span>
          <span className={a.big}>Ends {formatUntil(session.expiresAt)}</span>
          <span className={s.hint}>For safety you are signed out automatically after 8 hours.</span>
        </div>
        <div className={a.card}>
          <span className={s.label}>Previous sign-in</span>
          <span className={a.big}>{session.lastLogin ? timeAgo(session.lastLogin.at) : 'None recorded'}</span>
          <span className={s.hint}>
            {session.lastLogin ? `${deviceName(session.lastLogin.userAgent)} · IP ${session.lastLogin.ip}` : 'This is the first sign-in.'}
          </span>
        </div>
        <div className={cx(a.card, failed24h > 0 && a.cardWarn)}>
          <span className={s.label}>Wrong passwords · last 24 h</span>
          <span className={a.big}>{entries ? failed24h : '…'}</span>
          <span className={s.hint}>
            {failed24h ? 'If this wasn’t you, change your password (see below).' : 'No failed sign-ins.'}
          </span>
        </div>
      </div>

      <Panel
        title="Activity log"
        action={
          <FilterChips<Filter>
            options={[
              { id: 'all', label: 'Everything' },
              { id: 'signins', label: 'Sign-ins' },
              { id: 'failed', label: 'Failed' },
              { id: 'changes', label: 'Changes' },
            ]}
            value={filter}
            onChange={setFilter}
            label="Filter activity"
          />
        }
      >
        {error ? (
          <p className={s.alert}>{error}</p>
        ) : !entries ? (
          <p className={s.muted}>
            <Spinner /> Loading…
          </p>
        ) : (
          <>
            <ActivityList entries={shown.slice(0, limit)} />
            {shown.length > limit && (
              <button type="button" className={s.smallBtn} style={{ marginTop: 16 }} onClick={() => setLimit((l) => l + 50)}>
                Show more ({shown.length - limit} older)
              </button>
            )}
          </>
        )}
      </Panel>

      <Panel title="Changing the password">
        <div className={a.steps}>
          <p className={s.intro}>
            <IconLock size={18} style={{ verticalAlign: '-3px', marginRight: 8, color: 'var(--steel)' }} />
            The username and password are kept in the website’s hosting settings, not in this panel, so nobody can
            change them from a browser. Your web developer can change them in a couple of minutes:
          </p>
          <ol>
            <li>Vercel → this project → Settings → Environment Variables.</li>
            <li>
              Update <code>ADMIN_PASSWORD_HASH</code> (made with <code>npm run admin:hash-password</code>) or{' '}
              <code>ADMIN_PASSWORD</code>.
            </li>
            <li>Redeploy. Every open session is signed out automatically.</li>
          </ol>
        </div>
      </Panel>
    </div>
  )
}
