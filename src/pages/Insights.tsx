import type { CSSProperties, FocusEvent, FormEvent, ReactNode } from 'react'
import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FilterChips, type ChipOption } from '../components/ui/FilterChips'
import { Figure } from '../components/ui/Figure'
import { ArrowRight, CheckIcon } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { articles, topics, type Article, type TopicId } from '../data/insights'
import s from './Insights.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')

type Filter = 'all' | TopicId

const chipOptions: ChipOption<Filter>[] = [{ id: 'all', label: 'All' }, ...topics]
const topicLabel = (id: TopicId) => topics.find((t) => t.id === id)?.label ?? id
const isFilter = (v: string | null): v is Filter => !!v && chipOptions.some((o) => o.id === v)

/** Keeps a keyboard-focused chip fully visible when the chips are a swipeable row (phones). */
const keepInView = (e: FocusEvent<HTMLElement>) => e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' })

const featured = articles.find((a) => a.featured)
const notes = articles.filter((a) => !a.featured)

/**
 * Articles have no pages yet. A card only becomes a link when its `to` is set in data/insights.ts;
 * until then it renders as a plain <article> with a "Coming soon" note instead of "Read article".
 */
function ArticleShell({ article, className, children }: { article: Article; className: string; children: ReactNode }) {
  return (
    <article className={className}>
      {article.to ? (
        <Link to={article.to} className={s.cardLink}>
          {children}
        </Link>
      ) : (
        <div className={s.cardLink}>{children}</div>
      )}
    </article>
  )
}

function ReadMore({ article, long }: { article: Article; long?: boolean }) {
  if (article.to) {
    return long ? (
      <span className={s.read}>
        Read article
        <ArrowRight />
      </span>
    ) : (
      <ArrowRight className={s.readArrow} />
    )
  }
  return <span className={s.soon}>Coming soon</span>
}

function Newsletter() {
  const uid = useId()
  const ids = { input: `${uid}-email`, error: `${uid}-error`, hint: `${uid}-hint` }
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle')

  const validate = (value: string) => {
    const v = value.trim()
    if (!v) return 'Enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address, like name@company.com.'
    return ''
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)
    const message = validate(email)
    setError(message)
    if (message) {
      e.currentTarget.querySelector<HTMLInputElement>('input')?.focus()
      return
    }
    setStatus('sending')
    try {
      const endpoint: string = site.forms.newsletterEndpoint
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: email.trim(), source: 'insights' }),
        })
        if (!res.ok) throw new Error(`Newsletter signup failed: ${res.status}`)
      } else {
        // No endpoint configured yet (see config/site.ts): simulate a successful signup.
        await new Promise((r) => setTimeout(r, 500))
      }
      setStatus('success')
      setEmail('')
      setTouched(false)
    } catch {
      setStatus('failed')
    }
  }

  const sending = status === 'sending'
  const done = status === 'success'

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-busy={sending}>
      <label htmlFor={ids.input} className={s.formLabel}>
        Work email
      </label>
      <div className={s.field}>
        <input
          id={ids.input}
          className={s.input}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && ids.error, !done && status !== 'failed' && ids.hint].filter(Boolean).join(' ') || undefined}
          onChange={(e) => {
            setEmail(e.target.value)
            if (touched) setError(validate(e.target.value))
            if (status === 'success' || status === 'failed') setStatus('idle')
          }}
        />
        {/* Error sits between input and button in the DOM so it stays under the input when stacked on phones */}
        {error && (
          <p id={ids.error} className={s.error}>
            {error}
          </p>
        )}
        <Button type="submit" arrow={!done} disabled={sending} className={s.submit}>
          {sending ? 'Subscribing…' : done ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>
      <div className={s.status} aria-live="polite">
        {done ? (
          <span className={s.success}>
            <CheckIcon className={s.check} />
            Subscribed — thank you.
          </span>
        ) : status === 'failed' ? (
          <span className={s.failed}>That didn’t go through. Please try again in a moment.</span>
        ) : (
          <span id={ids.hint} className={s.hint}>
            One email per new note. Unsubscribe at any time.
          </span>
        )}
      </div>
    </form>
  )
}

export default function Insights() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('topic')
  const topic: Filter = isFilter(raw) ? raw : 'all'

  const setTopic = (id: Filter) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('topic')
    else next.set('topic', id)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const visible = topic === 'all' ? notes : notes.filter((a) => a.topic === topic)
  const gridLabel = topic === 'all' ? 'All notes' : `${topicLabel(topic)} notes`

  return (
    <>
      <Seo
        title="Insights"
        description="Short, practical notes on structural systems, building services, codes and site practice — for architects, developers and the engineers who work with them."
        path="/insights"
      />

      {/* ---------------- Hero (light) ---------------- */}
      <section className={`section--white hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroGrid}>
            <div className={s.heroTitleBlock}>
              <SectionLabel num="F" label="Insights" rule={false} />
              <h1 className={s.heroTitle}>Insights</h1>
            </div>
            <div className={s.heroIntro}>
              <p className={s.heroSub}>Notes from the drawing board and the site.</p>
              <p className="body">
                Short, practical notes on structural systems, building services, codes and site practice — for
                architects, developers and the engineers who work with them.
              </p>
            </div>
          </div>

          {notes.length > 0 && (
            <div className={s.filterBar}>
              <div className={s.filterGroup} onFocus={keepInView}>
                <span className={s.filterLabel} aria-hidden="true">
                  Topic
                </span>
                <FilterChips
                  options={chipOptions}
                  value={topic}
                  onChange={setTopic}
                  label="Filter notes by topic"
                  className={s.chipRow}
                />
              </div>
              <p className={s.count} aria-live="polite">
                Showing {pad(visible.length)} of {pad(notes.length)} notes
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- 01 Featured ---------------- */}
      {featured && (
        <section className={`section--paper ${s.featuredSection}`}>
          <div className={`container ${s.sectionStack}`}>
            <SectionLabel num="01" label="Featured" />
            <ArticleShell article={featured} className={s.featured}>
              <Figure
                src={featured.image}
                alt={featured.imageAlt}
                tag={featured.tag}
                caption={featured.caption}
                className={s.featuredFigure}
              />
              <div className={s.featuredBody}>
                <span className={s.topic}>{topicLabel(featured.topic)} · Featured</span>
                <h2 className={s.featuredTitle}>{featured.title}</h2>
                <p className={s.featuredExcerpt}>{featured.excerpt}</p>
                <div className={s.featuredFoot}>
                  <span className="meta">
                    {featured.date} · {featured.readTime}
                  </span>
                  <ReadMore article={featured} long />
                </div>
              </div>
            </ArticleShell>
          </div>
        </section>
      )}

      {/* ---------------- 02 All notes ---------------- */}
      {/* With only one post, it sits in the Featured slot and the grid is left out. */}
      {notes.length > 0 && (
        <section className={`section--paper ${s.notesSection}`} aria-labelledby="notes-title">
          <div className={`container ${s.sectionStack}`}>
            {/* The visible label is decorative; the hidden h2 carries the same text for assistive tech. */}
            <div aria-hidden="true">
              <SectionLabel num="02" label={gridLabel} />
            </div>
            <h2 id="notes-title" className="visually-hidden">
              {gridLabel}
            </h2>
            {visible.length > 0 ? (
              <div className={s.grid}>
                {visible.map((a, i) => (
                  <ArticleShell key={a.id} article={a} className={s.card}>
                    <div data-reveal style={delay((i % 3) * 90)} className={s.cardInner}>
                      <div className={s.cardImage}>
                        <img src={a.image} alt={a.imageAlt} loading="lazy" decoding="async" />
                        <span className={s.tag}>{a.tag}</span>
                      </div>
                      <span className={`${s.topic} ${s.cardTopic}`}>{topicLabel(a.topic)}</span>
                      <h3 className={s.cardTitle}>{a.title}</h3>
                      <p className={s.cardExcerpt}>{a.excerpt}</p>
                      <div className={s.cardFoot}>
                        <span className="meta">{a.date}</span>
                        <ReadMore article={a} />
                      </div>
                    </div>
                  </ArticleShell>
                ))}
              </div>
            ) : (
              <div className={s.empty}>
                <p className={s.emptyTitle}>No notes on this topic yet.</p>
                <p className="body">New notes are added as they are written. Browse everything in the meantime.</p>
                <Button variant="outline-dark" onClick={() => setTopic('all')}>
                  Show all notes
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------- 03 Newsletter ---------------- */}
      <section className={`section bg-grid-dark ${s.newsletter}`} aria-labelledby="newsletter-title">
        <div className={`container ${s.newsletterGrid}`}>
          <div className={s.newsletterText} data-reveal>
            <SectionLabel num="03" label="Newsletter" tone="dark" rule={false} />
            <h2 id="newsletter-title" className="h2">
              New notes, [monthly].
            </h2>
            <p className={s.newsletterLead}>
              Practical notes on structure, building services and site practice, sent when they are published.
            </p>
          </div>
          <div data-reveal style={delay(120)}>
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  )
}
