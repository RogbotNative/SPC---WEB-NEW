import type { CSSProperties } from 'react'
import { img } from '../assets'
import { SplitBand } from '../components/ui/SplitBand'
import { Figure } from '../components/ui/Figure'
import { ArrowDown, DocIcon } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { coordinationPoints, stages } from '../data/process'
import s from './Process.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

/** Pin centres as a percentage of the figure box (positions taken from the 640×560 artboard). */
const pins = [
  { label: '01', x: '23.4%', y: '29.6%' },
  { label: '02', x: '59.7%', y: '20.4%' },
  { label: '03', x: '75.9%', y: '60%' },
]

export default function Process() {
  const total = String(stages.length).padStart(2, '0')

  return (
    <>
      <Seo
        title="Process"
        description="How a project moves through SP Consulting Services: five stages from brief and site study to site supervision and handover — each with a clear scope, the inputs we need from you and a defined set of deliverables."
        path="/process"
      />

      {/* ---------------- Hero + stage index ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <SectionLabel num="E" label="Process" tone="dark" rule={false} />
            <h1 className={`h1 ${s.heroTitle}`}>
              <span>How a project</span>{' '}
              <span>moves through</span>{' '}
              <span className="accent">SPC.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Five stages from first drawings to handover — each with a clear scope, the inputs we need from you and
              a defined set of deliverables.
            </p>
          </div>

          <nav aria-label="Process stages" className={s.index}>
            <div className={s.indexHead} aria-hidden="true">
              <span>Stage index</span>
              <span>Key output</span>
            </div>
            <ol className={s.indexList}>
              {stages.map((st, i) => (
                <li key={st.id}>
                  <a href={`#${st.id}`} className={s.indexLink}>
                    <span className={[s.indexNum, i === stages.length - 1 && s.indexNumLast].filter(Boolean).join(' ')}>
                      <span className="visually-hidden">Stage </span>
                      {st.num}
                    </span>
                    <span className={s.indexBody}>
                      <span className={s.indexTitle}>{st.title}</span>
                      <span className={s.indexOutput}>
                        <span className="visually-hidden">Key output: </span>
                        {st.keyOutput}
                        <ArrowDown className={s.indexArrow} />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* ---------------- Stages 01–05 ---------------- */}
      {stages.map((st, i) => (
        <section
          key={st.id}
          id={st.id}
          aria-labelledby={`${st.id}-title`}
          className={`section ${i % 2 === 0 ? 'section--paper' : 'section--white'} ${s.stage}`}
        >
          <div className={`container ${s.stageGrid}`}>
            <div className={s.stageIntro} data-reveal>
              <div className={s.stageMeta}>
                <span className={s.stageCount}>
                  Stage {st.num} / {total}
                </span>
                <span className={s.ticks} aria-hidden="true">
                  {stages.map((_, t) => (
                    <span key={t} className={t <= i ? s.tickOn : undefined} />
                  ))}
                </span>
                <span className={s.duration}>{st.duration}</span>
              </div>
              <div className={s.stageHeading}>
                <div className={s.bigNum} aria-hidden="true">
                  {st.num}
                </div>
                <div className={s.stageHeadingText}>
                  <h2 id={`${st.id}-title`} className={s.stageTitle}>
                    {st.title}
                  </h2>
                  <p className={s.stageSummary}>{st.summary}</p>
                </div>
              </div>
            </div>

            <div className={s.columns}>
              <div className={s.column} data-reveal style={delay(80)}>
                <h3 className={s.colTitle}>What we do</h3>
                <ul className={s.colList}>
                  {st.weDo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={s.column} data-reveal style={delay(160)}>
                <h3 className={s.colTitle}>What we need from you</h3>
                <ul className={s.colList}>
                  {st.weNeed.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={s.column} data-reveal style={delay(240)}>
                <h3 className={`${s.colTitle} ${s.colTitleReceive}`}>What you receive</h3>
                <ul className={`${s.colList} ${s.receive}`}>
                  {st.youReceive.map((item) => (
                    <li key={item}>
                      {item}
                      <DocIcon size={14} className={s.doc} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ---------------- 06 Coordination ---------------- */}
      <section className={`section bg-grid-dark ${s.coordSection}`} aria-labelledby="coordination-title">
        <div className={`container ${s.coord}`}>
          <Figure
            src={img.drawingsDesk}
            alt="Engineer reviewing printed drawings at a desk"
            caption="Fig. 01 — Coordination review"
            pins={pins}
            className={s.coordFigure}
          />
          <div className={s.coordText} data-reveal>
            <SectionLabel num="06" label="Coordination" tone="dark" rule={false} className={s.coordLabel} />
            <h2 id="coordination-title" className={`h2 ${s.coordHeading}`}>
              <span className={s.block}>One model.</span>{' '}
              <span className={`${s.block} accent`}>Fewer surprises.</span>
            </h2>
            <p className={s.coordLead}>
              Structure and MEP are designed in one office against one model, so conflicts surface at the desk — not
              on site.
            </p>
            <ol className={s.coordList}>
              {coordinationPoints.map((p, i) => (
                <li key={p.title}>
                  <span className={s.coordNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={s.coordTitle}>{p.title}</h3>
                    <p className={s.coordBody}>{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- 07 Start a project ---------------- */}
      <SplitBand
        tone="light"
        num="07"
        label="Start a project"
        title="Start at stage one."
        text={`Send your architectural drawings and site details. We will reply with a scope, fee and programme within ${site.contact.replyTime}.`}
        primary={{ to: '/contact', label: 'Start a project' }}
        secondary={{ to: '/services', label: 'See our services' }}
      />
    </>
  )
}
