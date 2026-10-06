import { useEffect, useState, type FormEvent } from 'react'
import { FilterChips } from '../../components/ui/FilterChips'
import type { ActivityEntry, ActivityType } from '../../cms/types'
import { cx, timeAgo, deviceName, formatUntil } from '../format'
import s from '../admin.module.css'
import a from './Security.module.css'
import { api, ApiError } from '../api'
import { IconAlert, IconCheck, IconLock, IconLogout, IconPen, IconPhoto, IconQuote, IconUpload } from '../components/icons'
import { PageHeader, Panel, Spinner } from '../components/ui'
import { useAdmin } from '../adminContext'

type Filter = 'all' | 'signins' | 'failed' | 'changes'

const signInTypes: ActivityType[] = ['login_success', 'login_failed', 'login_locked', 'logout', 'credentials_changed']
const failTypes: ActivityType[] = ['login_failed', 'login_locked']

const iconFor = (t: ActivityType) => {
  if (t === 'login_success') return IconCheck
  if (failTypes.includes(t)) return IconAlert
  if (t === 'logout') return IconLogout
  if (t === 'credentials_changed') return IconLock
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

  const loadActivity = () => api.activity().then(setEntries, (e: Error) => setError(e.message))
  useEffect(() => {
    void loadActivity()
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
        intro="Change your sign-in email and password, and see every sign-in — including wrong passwords — and every change made in this panel, with the time, device and internet address."
      />

      {session.usingTemporaryPassword && (
        <p className={s.alert}>
          You’re still using the temporary password from setup. Set your own below — it takes a minute.
        </p>
      )}

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

      <SignInDetails onSaved={() => void loadActivity()} />

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

    </div>
  )
}

/** A rough guide to password strength: length matters most. */
function strength(pw: string): { label: string; level: 0 | 1 | 2 | 3 } {
  if (!pw) return { label: '', level: 0 }
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length
  if (pw.length < 10) return { label: 'Too short — use at least 10 characters', level: 1 }
  if (pw.length >= 16 || (pw.length >= 12 && variety >= 3)) return { label: 'Strong', level: 3 }
  return { label: 'Okay — longer is stronger (try a short phrase)', level: 2 }
}

/** Change the sign-in email and/or password. The current password confirms the change. */
function SignInDetails({ onSaved }: { onSaved: () => void }) {
  const { session, refreshSession, notify } = useAdmin()
  const [email, setEmail] = useState(session.email)
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [current, setCurrent] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const st = strength(next)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const emailChanged = email.trim().toLowerCase() !== session.email.toLowerCase()
    if (!emailChanged && !next) return setError('Enter a new email or a new password.')
    if (next && next.length < 10) return setError('The new password needs at least 10 characters.')
    if (next !== confirm) return setError('The two new passwords don’t match.')
    if (!current) return setError('Enter your current password to confirm.')
    setBusy(true)
    try {
      await api.changeAccount({ currentPassword: current, email: email.trim(), newPassword: next || undefined })
      await refreshSession()
      onSaved()
      setNext('')
      setConfirm('')
      setCurrent('')
      notify(
        next
          ? 'Sign-in details saved. Use the new password next time — any other devices have been signed out.'
          : 'Sign-in email saved. Any other devices have been signed out.',
      )
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="sign-in" className={s.panel} style={{ scrollMarginTop: 24 }}>
      <div className={s.panelHead}>
        <h2 className={s.panelTitle}>Sign-in details</h2>
        <span className={s.hint}>
          {session.credentialsChangedAt ? `Last changed ${timeAgo(session.credentialsChangedAt).toLowerCase()}` : 'Not changed yet'}
        </span>
      </div>
      <form className={cx(s.panelBody, a.form)} onSubmit={submit} noValidate aria-busy={busy}>
        <label className={s.field}>
          <span className={s.label}>Email you sign in with</span>
          <input className={s.input} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div className={a.pair}>
          <label className={s.field}>
            <span className={s.label}>New password (leave empty to keep it)</span>
            <input
              className={s.input}
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
            {st.level > 0 && (
              <span className={a.meter} data-level={st.level}>
                <span aria-hidden="true" />
                {st.label}
              </span>
            )}
          </label>
          <label className={s.field}>
            <span className={s.label}>Type the new password again</span>
            <input
              className={s.input}
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
        </div>
        <label className={s.check}>
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show passwords
        </label>
        <label className={s.field}>
          <span className={s.label}>Current password — to confirm it’s you</span>
          <input
            className={s.input}
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        {error && (
          <p className={s.alert} role="alert">
            {error}
          </p>
        )}
        <div className={a.formFoot}>
          <button type="submit" className={cx(s.smallBtn, s.smallPrimary)} disabled={busy}>
            {busy ? 'Saving…' : 'Save sign-in details'}
          </button>
          <span className={s.hint}>
            <IconLock size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Passwords are stored scrambled (hashed), never as plain text. Saving signs out every other device.
          </span>
        </div>
      </form>
    </section>
  )
}
