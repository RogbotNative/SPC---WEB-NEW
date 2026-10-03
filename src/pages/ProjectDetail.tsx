import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { brand } from '../assets'
import { ButtonLink } from '../components/ui/Button'
import { Figure } from '../components/ui/Figure'
import { ArrowRight } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { getNextProject, getProject, getProjectDetail, getProjectDisciplines } from '../data/projects'
import { disciplines as allDisciplines, type DisciplineId } from '../data/services'
import NotFound from './NotFound'
import s from './ProjectDetail.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')

/** Short names for the discipline tags in the hero. */
const shortName: Record<DisciplineId, string> = {
  structural: 'Structural',
  mep: 'MEP',
  supervision: 'Supervision',
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />

  const detail = getProjectDetail(project)
  const scopeIds = getProjectDisciplines(project)
  const scopeDisciplines = allDisciplines.filter((d) => scopeIds.includes(d.id))
  const next = getNextProject(project.slug)

  const narrative = [
    { title: 'The brief', text: detail.brief },
    { title: 'Our approach', text: detail.approach },
    { title: 'The outcome', text: detail.outcome },
  ]

  const dataCells = [
    { label: 'Client', value: detail.client },
    { label: 'Location', value: project.city },
    { label: 'Sector', value: project.sectorLabel },
    { label: 'Status', value: detail.status },
    { label: 'Built-up area', value: detail.area },
    { label: 'Storeys', value: detail.storeys },
    { label: 'Structural system', value: detail.structuralSystem },
    { label: 'SPC scope', value: project.scope, accent: true },
    { label: 'Design codes', value: detail.codes, wide: true },
    { label: 'Software', value: detail.software },
    { label: 'Duration', value: detail.duration },
  ]

  const [lead, ...rest] = detail.gallery.slice(0, 3)

  return (
    <>
      <Seo
        title={`${project.name} — Case study`}
        description={`Case study: ${project.sectorLabel.toLowerCase()} project in ${project.city} — ${project.scope} by SP Consulting Services.`}
        path={`/projects/${project.slug}`}
      />

      {/* ---------------- Hero ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={s.heroMedia}>
          <img
            src={project.image}
            alt={project.imageAlt}
            className={s.heroImg}
            style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className={s.heroGrid} aria-hidden="true">
            {['1', '2', '3'].map((n, i) => (
              <span key={n} className={s.gridline} style={{ left: `${(i + 1) * 25}%` }}>
                <span className={s.bubble}>{n}</span>
              </span>
            ))}
          </div>

          <div className={s.heroPanel}>
            <div className={`container ${s.heroPanelInner}`}>
              <div className={s.heroText}>
                <nav aria-label="Breadcrumb">
                  <ol className={s.breadcrumb}>
                    <li>
                      <Link to="/projects">Projects</Link>
                    </li>
                    <li aria-current="page">
                      <span aria-hidden="true" className={s.crumbSep}>
                        /
                      </span>
                      {project.code}
                    </li>
                  </ol>
                </nav>
                <h1 className={`h1 ${s.heroTitle}`}>{project.name}</h1>
                <p className={s.heroMeta}>
                  {project.sectorLabel} · {project.city}
                </p>
              </div>
              {scopeDisciplines.length > 0 && (
                <ul className={s.heroTags} aria-label="Disciplines in our scope">
                  {scopeDisciplines.map((d) => (
                    <li key={d.id} className={s.heroTag}>
                      <span className={s.heroTagCode}>{d.code}</span>
                      {shortName[d.id]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 01 Project data (title block) ---------------- */}
      <section className={`section section--paper ${s.dataSection}`}>
        <div className={`container ${s.dataStack}`}>
          <SectionLabel num="01" label="Project data" />
          <h2 className="visually-hidden">Project data</h2>
          <div className={s.titleBlock} data-reveal>
            <div className={s.tbLead}>
              <p className={s.tbNo}>
                <span className={s.tbLabel}>Project no.</span>
                <span className={s.tbCode}>{project.code}</span>
              </p>
              <div className={s.tbStamp} aria-hidden="true">
                <img src={brand.markColor} alt="" width={18} height={45} loading="lazy" />
                <span className={s.tbStampText}>
                  <span className={s.tbLabel}>Case study</span>
                  <span className={s.tbRev}>SPC · Rev A</span>
                </span>
              </div>
            </div>
            <dl className={s.tbGrid}>
              {dataCells.map((c) => (
                <div key={c.label} className={[s.tbCell, c.wide && s.tbWide].filter(Boolean).join(' ')}>
                  <dt className={s.tbLabel}>{c.label}</dt>
                  <dd className={[s.tbValue, c.accent && s.tbAccent].filter(Boolean).join(' ')}>{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- 02 Case study ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="02" label="Case study" />
          <h2 className={`h2 ${s.headline}`}>{detail.headline}</h2>
          <div className={s.narrative}>
            {narrative.map((n, i) => (
              <div key={n.title} className={s.narrativeRow} data-reveal style={delay(i * 80)}>
                <div className={s.narrativeHead}>
                  <span className={s.narrativeNum}>{pad(i + 1)}</span>
                  <h3 className="h3">{n.title}</h3>
                </div>
                <p className={s.narrativeText}>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 03 Scope by discipline ---------------- */}
      {scopeDisciplines.length > 0 && (
        <section className="section bg-grid-dark">
          <div className="container stack">
            <SectionLabel num="03" label="Scope by discipline" tone="dark" />
            <div className={s.scopeHead}>
              <h2 className="h2">Scope on this project.</h2>
              <span className={s.scopeSummary}>{project.scope}</span>
            </div>
            <div
              className={s.scopeGrid}
              style={{ '--cols': Math.max(scopeDisciplines.length, 2) } as CSSProperties}
            >
              {scopeDisciplines.map((d, i) => (
                <article key={d.id} className={s.scopeCard} data-reveal style={delay(i * 110)}>
                  <div className={s.scopeCode}>
                    <span>{d.code}</span>
                    <span className={s.scopeRule} aria-hidden="true" />
                  </div>
                  <h3 className={s.scopeTitle}>{d.title}</h3>
                  <ol className={s.scopeList}>
                    {(detail.scopeBullets[d.id] ?? []).map((item, j) => (
                      <li key={item}>
                        <span>{pad(j + 1)}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 04 Gallery ---------------- */}
      {lead && (
        <section className="section section--paper">
          <div className="container stack">
            <SectionLabel num={scopeDisciplines.length > 0 ? '04' : '03'} label="Gallery" />
            <h2 className="h2">From drawings to site.</h2>
            <div className={[s.gallery, rest.length === 0 && s.gallerySingle].filter(Boolean).join(' ')}>
              {[lead, ...rest].map((g, i) => (
                <div
                  key={g.src + i}
                  className={i === 0 ? s.galleryLead : s.galleryItem}
                  data-reveal
                  style={delay(i * 110)}
                >
                  <Figure
                    src={g.src}
                    alt={g.alt}
                    caption={`Fig. ${pad(i + 1)} — ${g.caption}`}
                    objectPosition={g.objectPosition}
                    className={s.galleryFigure}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 05 Next project ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <div className={s.moreHead}>
            <SectionLabel
              num={pad(3 + (scopeDisciplines.length > 0 ? 1 : 0) + (lead ? 1 : 0))}
              label="More work"
              className={s.moreLabel}
            />
            <ButtonLink to="/projects" variant="text" arrow>
              All projects
            </ButtonLink>
          </div>
          <h2 className="visually-hidden">More work</h2>
          <Link to={`/projects/${next.slug}`} className={s.next} data-reveal>
            <div className={s.nextImage}>
              <img
                src={next.image}
                alt={next.imageAlt}
                loading="lazy"
                decoding="async"
                style={next.imagePosition ? { objectPosition: next.imagePosition } : undefined}
              />
              <span className={s.nextTag}>{next.code}</span>
            </div>
            <div className={s.nextBody}>
              <div className={s.nextText}>
                <span className={s.nextEyebrow}>Next project</span>
                <span className={s.nextName}>{next.name}</span>
                <span className={s.nextMeta}>
                  {next.sectorLabel} · {next.scope} · {next.city}
                </span>
              </div>
              <div className={s.nextFoot}>
                <span className={s.nextCta}>View case study</span>
                <span className={s.nextBtn} aria-hidden="true">
                  <ArrowRight size={20} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
