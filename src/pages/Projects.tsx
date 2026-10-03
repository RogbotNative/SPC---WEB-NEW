import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CtaBand } from '../components/ui/CtaBand'
import { FilterChips, type ChipOption } from '../components/ui/FilterChips'
import { ArrowRight } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { projects, sectorNames, sectorOrder, type Sector } from '../data/projects'
import s from './Projects.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')

type Filter = 'all' | Sector

const isSector = (v: string | null): v is Sector => !!v && (sectorOrder as string[]).includes(v)

const filterOptions: ChipOption<Filter>[] = [
  { id: 'all', label: 'All', count: pad(projects.length) },
  ...sectorOrder.map((id) => ({
    id,
    label: sectorNames[id],
    count: pad(projects.filter((p) => p.sector === id).length),
  })),
]

const sectors = [
  {
    title: 'Residential',
    text: 'Apartment towers, villas and gated communities — frames, basements and services planned into the layouts from day one.',
    items: ['Flat-slab & transfer structures', 'Water supply, drainage & STP', 'Fire hydrants & sprinklers'],
  },
  {
    title: 'Commercial',
    text: 'Offices, retail and fit-outs — long spans and clear ceiling zones, with HVAC and power sized for how the floors are used.',
    items: ['Long-span & post-tensioned floors', 'HVAC & ventilation', 'Electrical, lighting & ELV'],
  },
  {
    title: 'Institutional',
    text: 'Schools, campuses and public buildings — ductile detailing for seismic safety, and services that are easy to maintain.',
    items: ['Seismic design to IS 1893', 'Fire detection & alarms', 'Audits, retrofits & strengthening'],
  },
  {
    title: 'Industrial',
    text: 'Plants, warehouses and utility buildings — steel frames, machine foundations and plant rooms laid out around the equipment.',
    items: ['Structural steel & sheds', 'Equipment foundations', 'Pump rooms & pipework'],
  },
]

export default function Projects() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('sector')
  const filter: Filter = isSector(raw) ? raw : 'all'
  const visible = filter === 'all' ? projects : projects.filter((p) => p.sector === filter)
  const filterName = filter === 'all' ? 'All sectors' : sectorNames[filter]

  const pick = (id: Filter) => {
    if (id === filter) return
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('sector')
    else next.set('sector', id)
    // Push a history entry so Back steps through filters; keep the scroll position.
    setParams(next, { preventScrollReset: true })
  }

  return (
    <>
      <Seo
        title="Projects"
        description="Selected structural, MEP and site supervision commissions by SP Consulting Services across residential, commercial, institutional and industrial buildings."
        path="/projects"
      />

      {/* ---------------- Hero + filter ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <SectionLabel num="C" label="Projects" tone="dark" rule={false} />
          <div className={s.heroRow}>
            <h1 className={s.heroTitle}>Selected work</h1>
            <p className={`lead ${s.heroLead}`}>
              A selection of structural, MEP and site supervision commissions across residential, commercial,
              institutional and industrial buildings.
            </p>
          </div>

          <div className={s.filterBar}>
            <span className={s.filterLabel} aria-hidden="true">
              Filter by sector
            </span>
            <FilterChips
              options={filterOptions}
              value={filter}
              onChange={pick}
              label="Filter projects by sector"
              tone="dark"
              className={s.chips}
            />
            <p className={s.filterCount} aria-live="polite" aria-atomic="true">
              Showing <span className={s.countNum}>{pad(visible.length)}</span> of {pad(projects.length)}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 01 Project index ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <div className={s.indexHead}>
            <SectionLabel num="01" label="Project index" className={s.indexLabel} />
            <span className={s.indexFilter}>{filterName}</span>
          </div>
          <h2 className="visually-hidden">
            Project index{filter === 'all' ? '' : ` — ${filterName}`}
          </h2>

          {visible.length > 0 ? (
            <ul className={s.grid}>
              {visible.map((p, i) => (
                <li key={p.slug} className={s.item} data-reveal style={delay((i % 3) * 90)}>
                  <Link to={`/projects/${p.slug}`} className={s.card}>
                    <div className={s.cardImage}>
                      <img
                        src={p.image}
                        alt={p.imageAlt}
                        loading="lazy"
                        decoding="async"
                        style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                      />
                      <span className={s.cardTag}>{p.code}</span>
                    </div>
                    <div className={s.cardTitleRow}>
                      <h3 className={s.cardName}>{p.name}</h3>
                      <span className={s.cardCity}>{p.city}</span>
                    </div>
                    <div className={s.cardMetaRow}>
                      <span className={s.cardMeta}>
                        {sectorNames[p.sector]} · {p.scope}
                      </span>
                      <ArrowRight className={s.cardArrow} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.empty}>
              No projects in this sector yet.{' '}
              <Link to="/projects" className={s.emptyLink} preventScrollReset>
                Show all projects
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* ---------------- 02 Sectors ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="02" label="Sectors" />
          <h2 className="h2">Four sectors. One way of working.</h2>
          <div className={s.sectors}>
            {sectors.map((sec, i) => (
              <article key={sec.title} className={s.sector} data-reveal style={delay(i * 100)}>
                <div className={s.sectorHead}>
                  <span>{pad(i + 1)}</span>
                  <span className={s.sectorRule} aria-hidden="true" />
                </div>
                <h3 className={s.sectorTitle}>{sec.title}</h3>
                <p className={`body ${s.sectorText}`}>{sec.text}</p>
                <ul className={`hairlist ${s.sectorList}`}>
                  {sec.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        num="03"
        title={
          <>
            <span className={s.ctaLine}>Have a project</span>{' '}
            <span className={`accent ${s.ctaLine}`}>like these?</span>
          </>
        }
        text={`Send us the architectural drawings and the site location. We will come back with a scope, a fee and a timeline within ${site.contact.replyTime}.`}
        secondary={{ to: '/process', label: 'How we work' }}
      />
    </>
  )
}
