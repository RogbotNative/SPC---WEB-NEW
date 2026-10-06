import { useState } from 'react'
import type { Testimonial } from '../../cms/types'
import { cx, LIVE_SOON } from '../format'
import s from '../admin.module.css'
import t from './Testimonials.module.css'
import { api } from '../api'
import { IconDown, IconPlus, IconTrash, IconUp } from '../components/icons'
import { UnsavedGuard } from '../components/UnsavedGuard'
import { ConfirmDialog, PageHeader } from '../components/ui'
import { useAdmin } from '../adminContext'

const blank = (): Testimonial => ({ id: crypto.randomUUID(), quote: '', name: '', role: '', company: '', visible: true })
const same = (a: Testimonial[], b: Testimonial[]) => JSON.stringify(a) === JSON.stringify(b)

export default function Testimonials() {
  const { content, setContent, notify } = useAdmin()
  const saved = content.testimonials ?? []
  const [items, setItems] = useState<Testimonial[]>(saved)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dirty = !same(items, saved)

  const update = (i: number, patch: Partial<Testimonial>) => setItems((list) => list.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: number) =>
    setItems((list) => {
      const next = [...list]
      ;[next[i], next[i + d]] = [next[i + d], next[i]]
      return next
    })
  const add = () => {
    const item = blank()
    setItems((list) => [...list, item])
    requestAnimationFrame(() => document.getElementById(`quote-${item.id}`)?.focus())
  }

  const save = async () => {
    const problems: Record<string, string> = {}
    for (const x of items) {
      if (!x.quote.trim()) problems[x.id] = 'Add the quote, or delete this testimonial.'
      else if (!x.name.trim()) problems[x.id] = 'Add the name of the person who said it.'
    }
    setErrors(problems)
    if (Object.keys(problems).length) {
      notify('Some testimonials are missing details — see the highlighted cards.', 'error')
      return
    }
    setSaving(true)
    try {
      const next = await api.saveTestimonials(items)
      setContent(next)
      setItems(next.testimonials ?? [])
      notify(`Testimonials saved. ${LIVE_SOON}`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const shownCount = items.filter((x) => x.visible).length

  return (
    <div className={s.page}>
      <UnsavedGuard dirty={dirty && !saving} />
      <PageHeader
        num="03"
        label="Testimonials"
        title="Testimonials"
        intro="What clients say about SPC, shown on the home page. With more than one, visitors can click through them. Turn “Show on website” off to hide one without deleting it."
        actions={
          <button type="button" className={cx(s.smallBtn, s.smallPrimary)} onClick={add} disabled={items.length >= 30}>
            <IconPlus size={18} />
            Add testimonial
          </button>
        }
      />

      {content.testimonials === null && !items.length && (
        <p className={s.notice}>
          The home page is showing a placeholder quote. Add your first testimonial and click “Save changes” to replace it.
        </p>
      )}

      {items.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyTitle}>No testimonials yet.</p>
          <p className={s.intro}>Ask a happy client for a sentence or two about working with you, then add it here.</p>
          <button type="button" className={cx(s.smallBtn, s.smallPrimary)} onClick={add}>
            <IconPlus size={18} />
            Add your first testimonial
          </button>
        </div>
      ) : (
        <ol className={t.list}>
          {items.map((x, i) => (
            <li key={x.id} className={cx(t.card, !x.visible && t.hidden, errors[x.id] && t.invalid)}>
              <div className={t.cardHead}>
                <span className={s.mono} style={{ color: 'var(--steel)' }}>
                  Testimonial {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cx(s.pill, x.visible ? s.pillLive : undefined)}>{x.visible ? 'On website' : 'Hidden'}</span>
              </div>
              <div className={t.fields}>
                <label className={cx(s.field, t.quote)}>
                  <span className={s.label}>What they said</span>
                  <textarea
                    id={`quote-${x.id}`}
                    className={s.textarea}
                    value={x.quote}
                    maxLength={700}
                    rows={4}
                    placeholder="e.g. SPC caught every clash before we poured. Our site team never waited on a drawing."
                    onChange={(e) => update(i, { quote: e.target.value })}
                  />
                  <span className={s.counter}>{x.quote.length} / 700</span>
                </label>
                <label className={s.field}>
                  <span className={s.label}>Name</span>
                  <input className={s.input} value={x.name} maxLength={80} placeholder="e.g. Rajesh Kumar" onChange={(e) => update(i, { name: e.target.value })} />
                </label>
                <label className={s.field}>
                  <span className={s.label}>Role (optional)</span>
                  <input className={s.input} value={x.role} maxLength={80} placeholder="e.g. Managing Director" onChange={(e) => update(i, { role: e.target.value })} />
                </label>
                <label className={s.field}>
                  <span className={s.label}>Company (optional)</span>
                  <input className={s.input} value={x.company} maxLength={120} placeholder="e.g. Acme Builders" onChange={(e) => update(i, { company: e.target.value })} />
                </label>
              </div>
              {errors[x.id] && <p className={s.alert}>{errors[x.id]}</p>}
              <div className={t.cardFoot}>
                <label className={s.switch}>
                  <input type="checkbox" role="switch" checked={x.visible} onChange={(e) => update(i, { visible: e.target.checked })} />
                  Show on website
                </label>
                <div className={s.btnRow}>
                  <button type="button" className={cx(s.smallBtn, s.iconBtn)} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <IconUp size={16} />
                  </button>
                  <button
                    type="button"
                    className={cx(s.smallBtn, s.iconBtn)}
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    <IconDown size={16} />
                  </button>
                  <button type="button" className={cx(s.smallBtn, s.danger)} onClick={() => setRemoving(i)}>
                    <IconTrash size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {(dirty || saving) && (
        <div className={s.saveBar} role="region" aria-label="Unsaved changes">
          <span className={s.saveBarText}>
            <span className={s.dot} aria-hidden="true" />
            Unsaved changes · {shownCount} of {items.length} will show on the website
          </span>
          <div className={s.btnRow}>
            <button type="button" className={s.smallBtn} onClick={() => (setItems(saved), setErrors({}))} disabled={saving}>
              Undo changes
            </button>
            <button type="button" className={cx(s.smallBtn, s.smallPrimary)} onClick={() => void save()} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={removing !== null}
        title="Delete this testimonial?"
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          setItems((list) => list.filter((_, j) => j !== removing))
          setRemoving(null)
        }}
        onCancel={() => setRemoving(null)}
      >
        It will be removed when you click “Save changes”. To keep it but stop showing it, turn off “Show on website”
        instead.
      </ConfirmDialog>
    </div>
  )
}
