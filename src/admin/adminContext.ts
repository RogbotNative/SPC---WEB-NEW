import { createContext, useContext } from 'react'
import type { SessionInfo, SiteContent } from '../cms/types'

export interface Toast {
  id: number
  message: string
  tone: 'ok' | 'error'
}

export interface AdminState {
  session: SessionInfo
  refreshSession: () => Promise<void>
  content: SiteContent
  setContent: (c: SiteContent) => void
  notify: (message: string, tone?: Toast['tone']) => void
  signOut: () => Promise<void>
}

export const Ctx = createContext<AdminState | null>(null)

export function useAdmin() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAdmin must be used inside <AdminProvider>')
  return v
}
