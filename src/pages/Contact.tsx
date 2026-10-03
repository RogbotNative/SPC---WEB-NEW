import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from 'react'
import { Button, ButtonLink } from '../components/ui/Button'
import { CheckIcon, CloseIcon, DocIcon } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import s from './Contact.module.css'

/* ------------------------------------------------------------------ */
/* Form model                                                          */
/* ------------------------------------------------------------------ */

interface Values {
  name: string
  organisation: string
  email: string
  phone: string
  location: string
  type: string
  stage: string
  area: string
  message: string
}

type TextField = keyof Values
type ErrorKey = 'name' | 'email' | 'phone' | 'location' | 'files'
type Errors = Partial<Record<ErrorKey, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const emptyValues: Values = {
  name: '',
  organisation: '',
  email: '',
  phone: '',
  location: '',
  type: '',
  stage: '',
  area: '',
  message: '',
}

const projectTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'institutional', label: 'Institutional' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'other', label: 'Other' },
]

const projectStages = [
  { value: 'concept', label: 'Concept / feasibility' },
  { value: 'design', label: 'Architecture in progress' },
  { value: 'construction', label: 'Under construction' },
  { value: 'existing', label: 'Existing building / audit' },
]

const serviceOptions = [
  { id: 'structural', label: 'Structural design' },
  { id: 'mep', label: 'MEP design' },
  { id: 'supervision', label: 'Site supervision' },
  { id: 'audit', label: 'Audit / peer review' },
]

const helpful = [
  'Architectural plans, sections and elevations',
  'Soil investigation report, if available',
  'Site location and a few photos',
]

const ACCEPT = ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png']
const MAX_TOTAL_BYTES = 20 * 1024 * 1024
/** Order in which fields appear — the first invalid one gets focus on submit. */
const ERROR_ORDER: ErrorKey[] = ['name', 'email', 'phone', 'location', 'files']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/

const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`

const totalBytes = (files: File[]) => files.reduce((sum, f) => sum + f.size, 0)

function validate(v: Values, files: File[]): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Enter your full name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email address in the format name@company.com.'
  const phone = v.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, '').length
    if (!PHONE_RE.test(phone) || digits < 7 || digits > 15)
      e.phone = 'Enter a phone number using digits, spaces and an optional +, e.g. +91 98765 43210.'
  }
  if (!v.location.trim()) e.location = 'Enter the project location — area and city.'
  const total = totalBytes(files)
  if (total > MAX_TOTAL_BYTES)
    e.files = `These files add up to ${formatBytes(total)} — the limit is 20 MB in total. Remove some, or email large drawings to ${site.contact.email}.`
  return e
}

const isAccepted = (f: File) => ACCEPT.some((ext) => f.name.toLowerCase().endsWith(ext))
const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`

/* Values from site config are typed as literals; widen them so empty checks read naturally. */
const endpoint: string = site.forms.contactEndpoint
const mapEmbedUrl: string = site.contact.mapEmbedUrl
const directionsUrl: string = site.contact.directionsUrl

/* ------------------------------------------------------------------ */
/* Small field wrapper                                                 */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
        {required && (
          <span className={s.req} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  )
}

function Chevron() {
  return (
    <svg className={s.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg className={s.dropIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 14v6h16v-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const uid = useId()
  const fid = (name: string) => `${uid}-${name}`
  const nameId = fid('name')

  const [values, setValues] = useState<Values>(emptyValues)
  const [services, setServices] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [touched, setTouched] = useState<Partial<Record<ErrorKey, boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [fileNotice, setFileNotice] = useState('')
  const [dragging, setDragging] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const focusFirstField = useRef(false)

  const errors = validate(values, files)
  const shown = (k: ErrorKey) => (k === 'files' || touched[k] || attempted ? errors[k] : undefined)

  // Move focus to the confirmation, or back to the first field after "Send another".
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'idle' && focusFirstField.current) {
      focusFirstField.current = false
      document.getElementById(nameId)?.focus()
    }
  }, [status, nameId])

  const set = (k: TextField) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  const blur = (k: ErrorKey) => () => setTouched((t) => (t[k] ? t : { ...t, [k]: true }))

  /** aria wiring for a validated input. */
  const a11y = (k: ErrorKey, id: string, hintId?: string) => {
    const err = shown(k)
    const describedBy = [hintId, err && `${id}-error`].filter(Boolean).join(' ')
    return {
      'aria-invalid': err ? (true as const) : undefined,
      'aria-describedby': describedBy || undefined,
    }
  }

  const toggleService = (id: string) =>
    setServices((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const incoming = Array.from(list)
    const ok = incoming.filter(isAccepted)
    const rejected = incoming.filter((f) => !isAccepted(f))
    setFiles((cur) => {
      const seen = new Set(cur.map(fileKey))
      return [...cur, ...ok.filter((f) => !seen.has(fileKey(f)))]
    })
    setFileNotice(
      rejected.length
        ? `Skipped ${rejected.map((f) => f.name).join(', ')} — attach PDF, DWG, DXF, JPG or PNG files.`
        : '',
    )
  }

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = '' // allow picking the same file again after removing it
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (key: string) => {
    setFiles((cur) => cur.filter((f) => fileKey(f) !== key))
    setFileNotice('')
  }

  const reset = () => {
    setValues(emptyValues)
    setServices([])
    setFiles([])
    setTouched({})
    setAttempted(false)
    setFileNotice('')
    setSentTo('')
    focusFirstField.current = true
    setStatus('idle')
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return
    setAttempted(true)

    const first = ERROR_ORDER.find((k) => errors[k])
    if (first) {
      document.getElementById(first === 'files' ? fid('files-btn') : fid(first))?.focus()
      return
    }

    const form = e.currentTarget
    // Honeypot: bots fill every field; people never see this one.
    const trap = form.elements.namedItem('company_website') as HTMLInputElement | null
    setStatus('submitting')

    const data = new FormData()
    ;(Object.keys(values) as TextField[]).forEach((k) => data.append(k, values[k].trim()))
    data.append(
      'services',
      serviceOptions
        .filter((o) => services.includes(o.id))
        .map((o) => o.label)
        .join(', '),
    )
    files.forEach((f) => data.append('attachments', f, f.name))
    data.append('_subject', `Project enquiry — ${values.name.trim()}`)

    try {
      if (trap?.value) {
        // Silently "succeed" for bots.
      } else if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else {
        await new Promise((r) => setTimeout(r, 900))
        console.info('[Contact] site.forms.contactEndpoint is not set — the enquiry was validated but not sent.')
      }
      setSentTo(values.email.trim())
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'
  const fileTotal = totalBytes(files)
  const filesError = shown('files')

  return (
    <>
      <Seo
        title="Contact"
        description="Start a project with SP Consulting Services. Share your architectural drawings and site details, and an engineer will review them and come back with a scope, a fee and a timeline."
        path="/contact"
      />

      {/* ---------------- Hero + enquiry form ---------------- */}
      <section className={`section--white hero-offset ${s.hero}`}>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.intro}>
            <SectionLabel num="D" label="Contact" rule={false} />
            <div className={s.introHead}>
              <h1 className={s.title}>
                <span>Let’s talk</span> <span>about your</span> <span className={s.titleAccent}>project.</span>
              </h1>
              <p className={`lead ${s.introLead}`}>
                Share your architectural drawings and site details, and tell us where the project stands. An engineer
                will review what you send and reply within {site.contact.replyTime}.
              </p>
            </div>

            <div className={s.infoGrid}>
              <dl className={s.contactList}>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={site.contact.emailHref}>{site.contact.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Office</dt>
                  <dd>
                    {site.contact.addressLines.map((line) => (
                      <span key={line} className={s.line}>
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>{site.contact.hours}</dd>
                </div>
              </dl>

              <div className={s.helpful}>
                <h2 className={s.helpfulTitle}>Helpful to include</h2>
                <ol className={s.helpfulList}>
                  {helpful.map((item, i) => (
                    <li key={item}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className={s.panelWrap}>
            <p className="visually-hidden" aria-live="polite">
              {submitting ? 'Sending your enquiry…' : ''}
            </p>

            {status === 'success' ? (
              <div className={`${s.panel} ${s.success}`}>
                <span className={s.successIcon} aria-hidden="true">
                  <CheckIcon size={28} />
                </span>
                <h2 ref={successRef} tabIndex={-1} className={s.successTitle}>
                  Thanks — we will reply within {site.contact.replyTime}.
                </h2>
                <p className={s.successText}>
                  Your enquiry is with our engineers.
                  {sentTo && (
                    <>
                      {' '}
                      We’ll reply to <strong className={s.successEmail}>{sentTo}</strong>.
                    </>
                  )}{' '}
                  If it’s urgent, call <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>.
                </p>
                <Button variant="outline-dark" onClick={reset} className={s.successBtn}>
                  Send another
                </Button>
              </div>
            ) : (
              <form
                className={s.panel}
                aria-labelledby={fid('form-title')}
                noValidate
                onSubmit={onSubmit}
                aria-busy={submitting || undefined}
              >
                <div className={s.panelHead}>
                  <h2 id={fid('form-title')} className={s.panelTitle}>
                    Project enquiry
                  </h2>
                  <span className={s.panelReq}>
                    <span className={s.req} aria-hidden="true">
                      *
                    </span>{' '}
                    Required
                  </span>
                </div>

                <div className={s.row}>
                  <Field id={fid('name')} label="Full name" required error={shown('name')}>
                    <input
                      id={fid('name')}
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={s.input}
                      value={values.name}
                      onChange={set('name')}
                      onBlur={blur('name')}
                      {...a11y('name', fid('name'))}
                    />
                  </Field>
                  <Field id={fid('organisation')} label="Organisation">
                    <input
                      id={fid('organisation')}
                      name="organisation"
                      type="text"
                      autoComplete="organization"
                      placeholder="Developer, architect or owner"
                      className={s.input}
                      value={values.organisation}
                      onChange={set('organisation')}
                    />
                  </Field>
                </div>

                <div className={s.row}>
                  <Field id={fid('email')} label="Email" required error={shown('email')}>
                    <input
                      id={fid('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      required
                      placeholder="name@company.com"
                      className={s.input}
                      value={values.email}
                      onChange={set('email')}
                      onBlur={blur('email')}
                      {...a11y('email', fid('email'))}
                    />
                  </Field>
                  <Field id={fid('phone')} label="Phone" error={shown('phone')}>
                    <input
                      id={fid('phone')}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91"
                      className={s.input}
                      value={values.phone}
                      onChange={set('phone')}
                      onBlur={blur('phone')}
                      {...a11y('phone', fid('phone'))}
                    />
                  </Field>
                </div>

                <div className={s.row}>
                  <Field id={fid('location')} label="Project location" required error={shown('location')}>
                    <input
                      id={fid('location')}
                      name="location"
                      type="text"
                      required
                      placeholder="Area, City"
                      className={s.input}
                      value={values.location}
                      onChange={set('location')}
                      onBlur={blur('location')}
                      {...a11y('location', fid('location'))}
                    />
                  </Field>
                  <Field id={fid('type')} label="Project type">
                    <div className={s.selectWrap}>
                      <select
                        id={fid('type')}
                        name="type"
                        className={`${s.input} ${s.select}`}
                        value={values.type}
                        onChange={set('type')}
                      >
                        <option value="">Select type</option>
                        {projectTypes.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </Field>
                </div>

                <div className={s.row}>
                  <Field id={fid('area')} label="Approx. built-up area (sq ft)">
                    <input
                      id={fid('area')}
                      name="area"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 25,000"
                      className={s.input}
                      value={values.area}
                      onChange={set('area')}
                    />
                  </Field>
                  <Field id={fid('stage')} label="Project stage">
                    <div className={s.selectWrap}>
                      <select
                        id={fid('stage')}
                        name="stage"
                        className={`${s.input} ${s.select}`}
                        value={values.stage}
                        onChange={set('stage')}
                      >
                        <option value="">Select stage</option>
                        {projectStages.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </Field>
                </div>

                <div role="group" aria-labelledby={fid('services')} className={s.field}>
                  <span id={fid('services')} className={s.label}>
                    Services needed
                  </span>
                  <div className={s.services}>
                    {serviceOptions.map((o) => {
                      const on = services.includes(o.id)
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={[s.service, on && s.serviceOn].filter(Boolean).join(' ')}
                          aria-pressed={on}
                          onClick={() => toggleService(o.id)}
                        >
                          <span className={s.box} aria-hidden="true">
                            <CheckIcon size={12} />
                          </span>
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Field id={fid('message')} label="Message">
                  <textarea
                    id={fid('message')}
                    name="message"
                    rows={5}
                    placeholder="Building type, number of floors, where the project stands and what you need from us."
                    className={`${s.input} ${s.textarea}`}
                    value={values.message}
                    onChange={set('message')}
                  />
                </Field>

                <div className={s.field}>
                  <div
                    className={[s.drop, dragging && s.dropActive, filesError && s.dropInvalid]
                      .filter(Boolean)
                      .join(' ')}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (!dragging) setDragging(true)
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
                    }}
                    onDrop={onDrop}
                  >
                    <UploadIcon />
                    <div className={s.dropText}>
                      <span className={s.dropTitle} id={fid('files-title')}>
                        Attach drawings (PDF, DWG)
                      </span>
                      <span className={s.dropHint} id={fid('files-hint')}>
                        Plans, sections, soil report, site photos · 20 MB max
                      </span>
                    </div>
                    <button
                      type="button"
                      id={fid('files-btn')}
                      className={s.dropBtn}
                      onClick={() => fileInputRef.current?.click()}
                      aria-describedby={[fid('files-title'), fid('files-hint'), filesError && fid('files-error')]
                        .filter(Boolean)
                        .join(' ')}
                      aria-invalid={filesError ? true : undefined}
                    >
                      Choose files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPT.join(',')}
                      className="visually-hidden"
                      tabIndex={-1}
                      aria-hidden="true"
                      onChange={onFileInput}
                    />
                  </div>

                  {files.length > 0 && (
                    <div className={s.fileBlock}>
                      <ul className={s.fileList} aria-label="Attached files">
                        {files.map((f) => {
                          const key = fileKey(f)
                          return (
                            <li key={key} className={s.file}>
                              <DocIcon className={s.fileIcon} />
                              <span className={s.fileName}>{f.name}</span>
                              <span className={s.fileSize}>{formatBytes(f.size)}</span>
                              <button
                                type="button"
                                className={s.fileRemove}
                                onClick={() => removeFile(key)}
                                aria-label={`Remove ${f.name}`}
                              >
                                <CloseIcon size={16} />
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <p className={[s.fileTotal, fileTotal > MAX_TOTAL_BYTES && s.fileTotalOver].filter(Boolean).join(' ')}>
                        {files.length} {files.length === 1 ? 'file' : 'files'} · {formatBytes(fileTotal)} of 20 MB
                      </p>
                    </div>
                  )}

                  <div aria-live="polite">
                    {filesError && (
                      <p id={fid('files-error')} className={s.error}>
                        {filesError}
                      </p>
                    )}
                    {fileNotice && <p className={s.notice}>{fileNotice}</p>}
                  </div>
                </div>

                {/* Honeypot — hidden from people and assistive tech */}
                <div className={s.trap} aria-hidden="true">
                  <label htmlFor={fid('trap')}>Company website</label>
                  <input id={fid('trap')} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {status === 'error' && (
                  <div className={s.sendError} role="alert">
                    <strong>Your enquiry couldn’t be sent.</strong> Please try again, or email your drawings to{' '}
                    <a href={site.contact.emailHref}>{site.contact.email}</a>.
                  </div>
                )}

                <div className={s.submitRow}>
                  <Button type="submit" arrow={!submitting} disabled={submitting} className={s.submit}>
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </Button>
                  <span className={s.orCall}>
                    Or call <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 01 Office ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="01" label="Office" />
          <h2 className="h2">Visit the office.</h2>
          <div className={s.map} data-reveal>
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title={`Map showing the ${site.name} office`}
                className={s.mapFrame}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className={`bg-grid-dark ${s.mapCanvas}`} role="img" aria-label="Map placeholder showing the office location">
                <span className={`${s.road} ${s.roadH}`} />
                <span className={`${s.road} ${s.roadV}`} />
                <span className={`${s.road} ${s.roadD}`} />
                {[s.b1, s.b2, s.b3, s.b4, s.b5, s.b6].map((b) => (
                  <span key={b} className={`${s.block} ${b}`} />
                ))}
                <span className={`${s.block} ${s.blockSite}`} />
                <span className={s.crossH} />
                <span className={s.crossV} />
                <span className={s.coords}>[Lat, Long]</span>
                <span className={s.pin} />
                <span className={s.north}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <path d="M6 1v12M1.5 5.5L6 1l4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  N
                </span>
                <span className={s.nts}>NTS · Map placeholder</span>
              </div>
            )}

            <div className={s.mapCard}>
              <span className={s.mapEyebrow}>Office</span>
              <h3 className={s.mapTitle}>{mapEmbedUrl ? site.name : '[Office location — embed map]'}</h3>
              <address className={s.mapAddress}>
                {site.contact.addressLines.map((line) => (
                  <span key={line} className={s.line}>
                    {line}
                  </span>
                ))}
              </address>
              {directionsUrl && (
                <div className={s.mapActions}>
                  <ButtonLink to={directionsUrl} variant="text-light" arrow>
                    Get directions
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
