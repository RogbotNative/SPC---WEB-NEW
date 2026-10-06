import { useRef, useState, type DragEvent } from 'react'
import { defaultImages } from '../../assets'
import { FilterChips } from '../../components/ui/FilterChips'
import { photoGroups, photoSlots, type PhotoGroup, type PhotoSlot } from '../../cms/photoSlots'
import { cx, LIVE_SOON } from '../format'
import s from '../admin.module.css'
import p from './Photos.module.css'
import { api } from '../api'
import { preparePhoto } from '../images'
import { IconReset, IconUpload } from '../components/icons'
import { ConfirmDialog, PageHeader, Spinner } from '../components/ui'
import { useAdmin } from '../adminContext'

type Filter = 'all' | PhotoGroup

export default function Photos() {
  const { content, setContent, notify } = useAdmin()
  const [filter, setFilter] = useState<Filter>('all')
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [resetting, setResetting] = useState<PhotoSlot | null>(null)

  const slots = filter === 'all' ? photoSlots : photoSlots.filter((sl) => sl.group === filter)

  const replace = async (slot: PhotoSlot, file: File | undefined) => {
    if (!file || busyKey) return
    setBusyKey(slot.key)
    try {
      const photo = await preparePhoto(file)
      const { url } = await api.upload(photo)
      const saved = await api.saveImages({ ...content.images, [slot.key]: url })
      setContent(saved)
      notify(`“${slot.label}” replaced. ${LIVE_SOON}`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'The photo could not be replaced.', 'error')
    } finally {
      setBusyKey(null)
    }
  }

  const reset = async () => {
    if (!resetting) return
    const { [resetting.key]: _removed, ...rest } = content.images
    setBusyKey(resetting.key)
    try {
      setContent(await api.saveImages(rest))
      notify(`Original photo put back for “${resetting.label}”. ${LIVE_SOON}`)
      setResetting(null)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not put the original back.', 'error')
    } finally {
      setBusyKey(null)
    }
  }

  const replacedCount = Object.keys(content.images).length

  return (
    <div className={s.page}>
      <PageHeader
        num="02"
        label="Photos"
        title="Photos"
        intro="Click “Replace photo” (or drag a photo onto a card) to swap it for one of your own. Large phone photos are shrunk automatically and location data is removed."
      />

      <div className={p.toolbar}>
        <FilterChips<Filter>
          options={[{ id: 'all', label: 'All photos', count: String(photoSlots.length) }, ...photoGroups.map((g) => ({ id: g, label: g }))]}
          value={filter}
          onChange={setFilter}
          label="Show photos from"
        />
        <span className={s.mono} style={{ color: 'var(--muted)' }}>
          {replacedCount} replaced · {photoSlots.length - replacedCount} original
        </span>
      </div>

      <div className={p.grid}>
        {slots.map((slot) => (
          <PhotoCard
            key={slot.key}
            slot={slot}
            current={content.images[slot.key] ?? defaultImages[slot.key]}
            replaced={Boolean(content.images[slot.key])}
            busy={busyKey === slot.key}
            disabled={Boolean(busyKey)}
            onFile={(f) => void replace(slot, f)}
            onReset={() => setResetting(slot)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(resetting)}
        title="Put back the original photo?"
        confirmLabel="Put back original"
        busy={Boolean(busyKey)}
        onConfirm={() => void reset()}
        onCancel={() => setResetting(null)}
      >
        “{resetting?.label}” will go back to the photo the website launched with. You can replace it again at any time.
      </ConfirmDialog>
    </div>
  )
}

function PhotoCard({
  slot,
  current,
  replaced,
  busy,
  disabled,
  onFile,
  onReset,
}: {
  slot: PhotoSlot
  current: string
  replaced: boolean
  busy: boolean
  disabled: boolean
  onFile: (f: File | undefined) => void
  onReset: () => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const drop = (e: DragEvent) => {
    e.preventDefault()
    setOver(false)
    if (!disabled) onFile(e.dataTransfer.files[0])
  }

  return (
    <article
      className={cx(p.card, over && p.over)}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
      aria-busy={busy}
    >
      <div className={p.frame}>
        <img src={current} alt={`Current photo: ${slot.label}`} loading="lazy" decoding="async" />
        <span className={cx(s.pill, replaced ? s.pillLive : undefined, p.status)}>{replaced ? 'Your photo' : 'Original'}</span>
        {busy && (
          <span className={p.busy}>
            <Spinner /> Uploading…
          </span>
        )}
        {over && <span className={p.dropHint}>Drop to replace</span>}
      </div>
      <div className={p.body}>
        <h2 className={p.title}>{slot.label}</h2>
        <p className={p.used}>
          <span className={s.label}>Appears on</span>
          {slot.usedOn.join(' · ')}
        </p>
        <p className={s.hint}>Best shape: {slot.shape.toLowerCase()}</p>
        <div className={s.btnRow}>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => {
              onFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <button type="button" className={cx(s.smallBtn, s.smallPrimary)} onClick={() => input.current?.click()} disabled={disabled}>
            <IconUpload size={16} />
            Replace photo
          </button>
          {replaced && (
            <button type="button" className={s.smallBtn} onClick={onReset} disabled={disabled}>
              <IconReset size={16} />
              Put back original
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
