import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import type { SessionInfo, SiteContent } from '../cms/types'
import { api } from './api'
import s from './admin.module.css'
import { Ctx, type Toast } from './adminContext'
import { IconAlert, IconCheck } from './components/icons'

export function AdminProvider({
  session: initialSession,
  initialContent,
  signOut,
  children,
}: {
  session: SessionInfo
  initialContent: SiteContent
  signOut: () => Promise<void>
  children: ReactNode
}) {
  const [session, setSession] = useState(initialSession)
  const [content, setContent] = useState(initialContent)
  const refreshSession = useCallback(async () => setSession(await api.session()), [])
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const notify = useCallback((message: string, tone: Toast['tone'] = 'ok') => {
    const id = nextId.current++
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 8000 : 5000)
  }, [])

  const value = useMemo(
    () => ({ session, refreshSession, content, setContent, notify, signOut }),
    [session, refreshSession, content, notify, signOut],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={s.toasts} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={[s.toast, t.tone === 'error' && s.toastError].filter(Boolean).join(' ')}>
            {t.tone === 'error' ? <IconAlert /> : <IconCheck />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
