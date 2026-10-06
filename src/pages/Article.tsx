import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { img } from '../assets'
import { CtaBand } from '../components/ui/CtaBand'
import { Figure } from '../components/ui/Figure'
import { ArrowRight } from '../components/ui/Icons'
import { RichText } from '../components/ui/RichText'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import type { Post } from '../cms/types'
import { formatPostDate, topics } from '../data/insights'
import NotFound from './NotFound'
import s from './Article.module.css'

type Loaded = { status: 'ready'; post: Post } | { status: 'missing' } | { status: 'failed' }
type State = { status: 'loading' } | Loaded

/** A blog post written in the admin panel: /insights/:slug */
export default function Article() {
  const { slug = '' } = useParams()
  // Result keyed by slug, so moving to another post shows "loading" without resetting state in the effect.
  const [result, setResult] = useState<{ slug: string; value: Loaded } | null>(null)
  const state: State = result?.slug === slug ? result.value : { status: 'loading' }

  useEffect(() => {
    let live = true
    const setState = (value: Loaded) => setResult({ slug, value })
    fetch(`/api/post?slug=${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        if (!live) return
        if (res.status === 404) return setState({ status: 'missing' })
        if (!res.ok) return setState({ status: 'failed' })
        setState({ status: 'ready', post: (await res.json()) as Post })
      })
      .catch(() => live && setState({ status: 'failed' }))
    return () => {
      live = false
    }
  }, [slug])

  if (state.status === 'missing') return <NotFound />

  const post = state.status === 'ready' ? state.post : null
  const topic = post ? topics.find((t) => t.id === post.topic)?.label : null

  return (
    <>
      {post && <Seo title={post.title} description={post.excerpt || post.title} path={`/insights/${post.slug}`} />}

      <article aria-busy={state.status === 'loading'}>
        <header className={`section--white hero-offset ${s.hero}`}>
          <div className={`container ${s.heroInner}`}>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <Link to="/insights">Insights</Link>
              <span aria-hidden="true">/</span>
              <span>{topic ?? '…'}</span>
            </nav>
            <SectionLabel num="F" label={topic ? `${topic} · Note` : 'Note'} rule={false} />
            {post ? (
              <>
                <h1 className={s.title}>{post.title}</h1>
                {post.excerpt && <p className={s.lead}>{post.excerpt}</p>}
                <p className={s.meta}>
                  {formatPostDate(post.publishedAt)} · {post.readMinutes} min read
                </p>
              </>
            ) : state.status === 'failed' ? (
              <>
                <h1 className={s.title}>This note couldn’t be loaded.</h1>
                <p className={s.lead}>Please check your connection and try again.</p>
              </>
            ) : (
              <div className={s.skeleton} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        </header>

        {post && (
          <section className={`section--paper ${s.body}`}>
            <div className={`container ${s.bodyInner}`}>
              {post.coverUrl && (
                <Figure src={post.coverUrl} alt={post.coverAlt} tag={topic ?? undefined} priority className={s.cover} />
              )}
              <RichText html={post.html} className={s.text} />
              <Link to="/insights" className={s.back}>
                <ArrowRight className={s.backArrow} />
                All insights
              </Link>
            </div>
          </section>
        )}
      </article>

      <CtaBand
        num="02"
        title="Have a project in mind?"
        text="Share your drawings and a few details about the site. We will come back with a scope, a fee and a timeline."
        image={img.cranesDusk}
      />
    </>
  )
}
