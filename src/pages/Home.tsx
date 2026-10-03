import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { img } from '../assets'
import { ButtonLink } from '../components/ui/Button'
import { CtaBand } from '../components/ui/CtaBand'
import { Figure } from '../components/ui/Figure'
import { ArrowRight, Plus } from '../components/ui/Icons'
import { Placeholder } from '../components/ui/Placeholder'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { stages } from '../data/process'
import { projects } from '../data/projects'
import { disciplines } from '../data/services'
import s from './Home.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

const coordination = [
  'Beam depths set around duct and pipe routes',
  'Sleeves and cut-outs fixed on the structural drawings',
  'Shafts and plant rooms sized with the loads they carry',
  'Clash checks completed before drawings are issued for construction',
]

const pins = [
  { label: '01', x: '20.5%', y: '18.3%' },
  { label: '02', x: '58%', y: '12.7%' },
  { label: '03', x: '84.4%', y: '31.3%' },
  { label: '04', x: '40%', y: '53%' },
]

export default function Home() {
  const [featured, ...rest] = projects
  const secondary = rest.slice(0, 2)

  return (
    <>
      <Seo
        description="SP Consulting Services designs the structure and building services for residential, commercial and institutional buildings — coordinated before the pour and supervised on site until handover."
        path="/"
      />

      {/* ---------------- Hero ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroGrid}>
            <div className={s.heroText}>
              <SectionLabel num="A" label="Structural · MEP · Site supervision" tone="dark" rule={false} />
              <h1 className={`display-xl ${s.heroTitle}`}>
                <span>Engineered</span>
                <span className="accent">to simplify.</span>
              </h1>
              <p className={`lead ${s.heroLead}`}>
                Structural and MEP engineering for residential, commercial and institutional buildings — designed
                together, coordinated before the pour, and supervised on site until handover.
              </p>
              <div className={s.heroActions}>
                <ButtonLink to="/contact" arrow>
                  Start a project
                </ButtonLink>
                <ButtonLink to="/projects" variant="outline-light">
                  See our work
                </ButtonLink>
              </div>
            </div>
            <Figure
              src={img.heroTower}
              alt="Tower under construction with a crane against a clear sky"
              caption={`Fig. 01 — [Project name], ${site.contact.city}`}
              gridlines={3}
              bubbles={['1', '2', '3']}
              dimension
              objectPosition="center 30%"
              priority
              className={s.heroFigure}
            />
          </div>

          <dl className={s.stats}>
            {site.stats.map((stat) => (
              <div key={stat.label} className={s.stat}>
                <dt className={s.statLabel}>{stat.label}</dt>
                <dd className={s.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- 01 Practice ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="01" label="Practice" />
          <div className={s.practice}>
            <h2 className={`h2 ${s.practiceTitle}`} data-reveal>
              One consultant for the frame — and everything that runs through it.
            </h2>
            <div className={s.practiceBody} data-reveal style={delay(120)}>
              <p className={`lead ${s.practiceLead}`}>
                Most site problems start when structure and building services are designed by different teams on
                different timelines. At SP Consulting Services, structural and MEP engineers work from one set of
                assumptions — so beam depths, shaft sizes and sleeve positions are settled on paper, not argued
                about on site.
              </p>
              <ol className={s.numbered}>
                <li>
                  <span>01</span>One point of responsibility for structure and services
                </li>
                <li>
                  <span>02</span>Drawings detailed for how they will actually be built
                </li>
                <li>
                  <span>03</span>Engineers on site at every critical stage
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 02 Disciplines ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="02" label="Disciplines" />
          <div className={s.headRow}>
            <h2 className="h2">
              Three disciplines.
              <br />
              One set of drawings.
            </h2>
            <ButtonLink to="/services" variant="text" arrow>
              All services
            </ButtonLink>
          </div>
          <div className={s.disciplines}>
            {disciplines.map((d, i) => (
              <article key={d.id} className={s.discipline} data-reveal style={delay(i * 110)}>
                <Figure src={d.image} alt={d.imageAlt} tag={d.code} className={s.disciplineFigure} />
                <h3 className={`h3 ${s.disciplineTitle}`}>{d.title}</h3>
                <p className="body">{d.summary}</p>
                <ul className={`hairlist ${s.disciplineList}`}>
                  {d.highlights.map((h) => (
                    <li key={h}>
                      {h}
                      <Plus size={14} className={s.plus} />
                    </li>
                  ))}
                </ul>
                <ButtonLink to={`/services#${d.id}`} variant="text" arrow className={s.disciplineLink}>
                  {d.linkLabel}
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 03 Coordination ---------------- */}
      <section className="section bg-grid-dark">
        <div className={`container ${s.coord}`}>
          <Figure
            src={img.officeServices}
            alt="Office floor with exposed ducts and services below the slab"
            caption="Fig. 02 — Services zone below slab"
            pins={pins}
            className={s.coordFigure}
          />
          <div className={s.coordText} data-reveal>
            <SectionLabel num="03" label="Coordination" tone="dark" rule={false} />
            <h2 className="h2">Coordinated before the pour.</h2>
            <p className={`lead ${s.coordLead}`}>
              A clash found on a drawing costs an eraser. The same clash found after the slab is cast costs a core
              cutter, a delay and an argument. We resolve it on paper.
            </p>
            <ol className={s.coordList}>
              {coordination.map((item, i) => (
                <li key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- 04 Selected work ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="04" label="Selected work" />
          <div className={s.headRow}>
            <h2 className="h2">Selected projects</h2>
            <ButtonLink to="/projects" variant="text" arrow>
              View all projects
            </ButtonLink>
          </div>
          <div className={s.work}>
            {[featured, ...secondary].map((p, i) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className={[s.workCard, i === 0 && s.workFeatured].filter(Boolean).join(' ')}
                data-reveal
                style={delay(i * 110)}
              >
                <div className={s.workImage}>
                  <img src={p.image} alt={p.imageAlt} loading="lazy" decoding="async" />
                </div>
                <div className={s.workCaption}>
                  <div>
                    <span className={s.workName}>{p.name}</span>
                    <span className="meta">
                      {p.sectorLabel} · {p.scope}
                    </span>
                  </div>
                  <span className={s.workCity}>
                    {p.city}
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 05 Process ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="05" label="Process" />
          <div className={s.headRow}>
            <h2 className="h2">
              From brief to handover,
              <br />
              in five stages.
            </h2>
            <ButtonLink to="/process" variant="text" arrow>
              How we work
            </ButtonLink>
          </div>
          <ol className={s.stages}>
            {stages.map((st, i) => (
              <li key={st.num} className={s.stage} data-reveal style={delay(i * 90)}>
                <div className={s.stageHead}>
                  <span className={[s.stageNum, i === stages.length - 1 && s.stageNumLast].filter(Boolean).join(' ')}>
                    {st.num}
                  </span>
                  <span className={s.stageLine} aria-hidden="true" />
                </div>
                <div className={s.stageBody}>
                  <h3 className="h4">{st.title}</h3>
                  <p className="body">{st.short}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- 06 Clients ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="06" label="Clients" />
          <div className={s.clients}>
            <figure className={s.quote} data-reveal>
              <blockquote>
                <span aria-hidden="true" className={s.quoteMark}>
                  “
                </span>
                {site.testimonial.quote}
              </blockquote>
              <figcaption className="meta">{site.testimonial.attribution}</figcaption>
            </figure>
            <div className={s.logos} data-reveal style={delay(120)}>
              {Array.from({ length: site.clientLogoSlots }, (_, i) => (
                <Placeholder key={i} label="[Client logo]" variant="dashed" className={s.logo} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        num="07"
        title="Bring us in early."
        text={`Share your architectural drawings and site details. We will come back with a scope, a fee and a timeline within ${site.contact.replyTime}.`}
        image={img.cranesDusk}
      />
    </>
  )
}
