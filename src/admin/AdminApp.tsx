import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { brand } from '../assets'
import { Button } from '../components/ui/Button'
import type { SessionInfo, SiteContent } from '../cms/types'
import { cx } from './format'
import s from './admin.module.css'
import { api, ApiError, SIGNED_OUT_EVENT } from './api'
import {
  IconClose,
  IconDashboard,
  IconExternal,
  IconLock,
  IconLogout,
  IconMenu,
  IconPen,
  IconPhoto,
  IconQuote,
  IconShield,
} from './components/icons'
import { Spinner } from './components/ui'
import { useAdmin } from './adminContext'
import { AdminProvider } from './context'
import Blog from './pages/Blog'
import Dashboard from './pages/Dashboard'
import Photos from './pages/Photos'
import PostEditor from './pages/PostEditor'
import Security from './pages/Security'
import Testimonials from './pages/Testimonials'

type Phase =
  | { name: 'checking' }
  | { name: 'signed-out'; message?: string }
  | { name: 'not-set-up'; message: string }
  | { name: 'signed-in'; session: SessionInfo; content: SiteContent }

/** Keeps search engines out and gives the tab a clear title while the admin panel is open. */
function useAdminDocument() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.title = 'Site admin | SP Consulting Services'
    return () => meta.remove()
  }, [])
}

export default function AdminApp() {
  useAdminDocument()
  const [phase, setPhase] = useState<Phase>({ name: 'checking' })

  /** Loads the session and content; shows the sign-in screen if there is no valid session. */
  const enter = useCallback(
    () =>
      Promise.all([api.session(), api.content()]).then(
        ([session, content]) => setPhase({ name: 'signed-in', session, content }),
        (e: unknown) =>
          setPhase(e instanceof ApiError && e.status === 503 ? { name: 'not-set-up', message: e.message } : { name: 'signed-out' }),
      ),
    [],
  )

  useEffect(() => {
    void enter()
    // Only a session that ends while the panel is open gets the "session ended" message.
    const onSignedOut = () =>
      setPhase((p) => (p.name === 'signed-in' ? { name: 'signed-out', message: 'Your session ended. Please sign in again.' } : p))
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut)
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut)
  }, [enter])

  const signOut = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setPhase({ name: 'signed-out', message: 'You have signed out.' })
    }
  }, [])

  return (
    <div className={s.root}>
      {phase.name === 'checking' && (
        <div className={`bg-grid-dark ${s.splash}`}>
          <Spinner /> Opening site admin
        </div>
      )}
      {(phase.name === 'signed-out' || phase.name === 'not-set-up') && (
        <Login
          notice={phase.name === 'signed-out' ? phase.message : undefined}
          setupError={phase.name === 'not-set-up' ? phase.message : undefined}
          onSignedIn={enter}
        />
      )}
      {phase.name === 'signed-in' && (
        <AdminProvider session={phase.session} initialContent={phase.content} signOut={signOut}>
          <Shell onSignOut={signOut} />
        </AdminProvider>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Login({ notice, setupError, onSignedIn }: { notice?: string; setupError?: string; onSignedIn: () => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(setupError ?? '')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Enter your email and password.')
    setBusy(true)
    setError('')
    try {
      await api.login(email.trim(), password)
      setPassword('')
      await onSignedIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
      setBusy(false)
    }
  }

  return (
    <main className={s.login}>
      <div className={`bg-grid-dark ${s.loginArt}`}>
        <img src={brand.logoFullWhite} alt="SP Consulting Services" width={150} height={138} style={{ width: 150, height: 'auto' }} />
        <h1 className={s.loginArtTitle}>
          Site admin<span>Engineered to simplify.</span>
        </h1>
        <p className={s.loginArtNote}>
          Replace photos, update testimonials and write for the Insights blog. Changes appear on the website within a
          minute.
        </p>
      </div>
      <div className={s.loginPane}>
        <form className={s.loginForm} onSubmit={submit} noValidate aria-busy={busy}>
          <div>
            <p className={s.mono} style={{ color: 'var(--steel)' }}>
              SP Consulting Services
            </p>
            <h2 className={s.loginTitle}>Sign in</h2>
          </div>
          {notice && !error && <p className={s.notice}>{notice}</p>}
          {error && (
            <p className={s.alert} role="alert">
              {error}
            </p>
          )}
          <label className={s.field}>
            <span className={s.label}>Email</span>
            <input
              className={s.input}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Password</span>
            <span className={s.passwordWrap}>
              <input
                className={s.input}
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className={s.reveal} onClick={() => setShow((v) => !v)} aria-pressed={show}>
                {show ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          <Button type="submit" arrow block disabled={busy || Boolean(setupError)}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className={s.loginFoot}>
            <IconLock size={16} />
            Secure sign-in. After 5 wrong passwords, sign-in pauses for 15 minutes. Every sign-in is recorded.
          </p>
        </form>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', Icon: IconDashboard },
  { to: '/admin/photos', label: 'Photos', Icon: IconPhoto },
  { to: '/admin/testimonials', label: 'Testimonials', Icon: IconQuote },
  { to: '/admin/blog', label: 'Blog', Icon: IconPen },
  { to: '/admin/security', label: 'Security', Icon: IconShield },
]

function Shell({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const { session } = useAdmin()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  return (
    <div className={s.shell}>
      <div className={`bg-grid-dark ${s.topbar}`}>
        <img src={brand.wordmarkWhite} alt="SP Consulting Services — Site admin" width={150} height={16} />
        <button
          type="button"
          className={s.sideBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      <aside id="admin-menu" className={cx('bg-grid-dark', s.side, menuOpen && s.sideOpen)}>
        <div className={cx(s.brand, s.brandInSide)}>
          <img src={brand.markReverse} alt="" className={s.brandMark} width={18} height={45} />
          <span className={s.brandText}>
            <img src={brand.wordmarkWhite} alt="SP Consulting Services" className={s.brandWord} width={160} height={17} />
            <span className={s.brandLabel}>Site admin</span>
          </span>
        </div>
        <nav aria-label="Admin" className={s.nav}>
          {navItems.map(({ to, end, label, Icon }, i) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cx(s.navLink, isActive && s.navActive)}>
              <span className={s.navNum}>{String(i + 1).padStart(2, '0')}</span>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={s.sideFoot}>
          <div className={s.who}>
            <span className={s.whoLabel}>Signed in as</span>
            <span className={s.whoName}>{session.email}</span>
          </div>
          <a href="/" target="_blank" rel="noopener" className={s.sideBtn}>
            <IconExternal />
            View website
          </a>
          <button type="button" className={s.sideBtn} onClick={() => void onSignOut()}>
            <IconLogout />
            Sign out
          </button>
        </div>
      </aside>

      <main className={s.main} id="main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="photos" element={<Photos />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/new" element={<PostEditor key="new" />} />
          <Route path="blog/:id" element={<PostEditor />} />
          <Route path="security" element={<Security />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}
