import { useEffect, useRef, type ReactNode } from 'react'
import { Bubble } from '../../components/ui/SectionLabel'
import s from '../admin.module.css'

import { cx } from '../format'

/** Page title block: (02) PHOTOS / big title / one-line explanation / actions on the right. */
export function PageHeader({
  num,
  label,
  title,
  intro,
  actions,
}: {
  num: string
  label: string
  title: string
  intro?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className={s.head}>
      <div className={s.headText}>
        <div className={s.mono} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--steel)' }}>
          <Bubble>{num}</Bubble>
          {label}
        </div>
        <h1 className={s.title}>{title}</h1>
        {intro && <p className={s.intro}>{intro}</p>}
      </div>
      {actions && <div className={s.headActions}>{actions}</div>}
    </header>
  )
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx(s.panel, className)}>
      {title && (
        <div className={s.panelHead}>
          <h2 className={s.panelTitle}>{title}</h2>
          {action}
        </div>
      )}
      <div className={s.panelBody}>{children}</div>
    </section>
  )
}

/** Accessible yes/no dialog built on the native <dialog> element. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  danger,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} className={s.dialog} onCancel={(e) => (e.preventDefault(), onCancel())} aria-labelledby="confirm-title">
      <div className={s.dialogBody}>
        <h2 id="confirm-title" className={s.dialogTitle}>
          {title}
        </h2>
        <div className={s.intro}>{children}</div>
      </div>
      <div className={s.dialogActions}>
        <button type="button" className={s.smallBtn} onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          type="button"
          className={cx(s.smallBtn, danger ? s.danger : s.smallPrimary)}
          onClick={onConfirm}
          disabled={busy}
          autoFocus
        >
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export function Spinner() {
  return <span className={s.spinner} aria-hidden="true" />
}
