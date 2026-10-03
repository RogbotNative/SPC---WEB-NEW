import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import { img } from '../assets'
import { ButtonLink } from '../components/ui/Button'
import { CtaBand } from '../components/ui/CtaBand'
import { Figure } from '../components/ui/Figure'
import { ArrowDown, CheckIcon, DocIcon, Minus, Plus } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import {
  disciplineDetails,
  disciplines,
  engagementOptions,
  serviceFaqs,
  type DisciplineDetail,
  type ServiceLine,
} from '../data/services'
import s from './Services.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')
/** Keep each "·" separator on the line of the word before it, so wrapped scope lines never start with a dot. */
const keepDots = (text: string) => text.replaceAll(' · ', '\u00a0· ')

type Tone = 'light' | 'dark'

/* ------------------------------------------------------------------ */

/** Section label with the sheet code at the far end of the rule: (01) STRUCTURAL ———— S-100 */
function SheetLabel({ num, detail, tone = 'light' }: { num: string; detail: DisciplineDetail; tone?: Tone }) {
  return (
    <div className={cx(s.sheetLabel, tone === 'dark' && s.sheetLabelDark)}>
      <SectionLabel num={num} label={detail.label} tone={tone} className={s.sheetLabelMain} />
      <span className={s.sheetCode}>{detail.code}</span>
    </div>
  )
}

/** Ghost sheet code, two-line heading and intro shared by the three discipline sections. */
function DisciplineHead({ detail, className }: { detail: DisciplineDetail; className?: string }) {
  return (
    <div className={cx(s.head, className)}>
      <span className={s.ghost} aria-hidden="true">
        {detail.code}
      </span>
      <h2 className={`h2 ${s.headTitle}`} id={`${detail.id}-title`}>
        <span>{detail.heading[0]}</span> <span>{detail.heading[1]}</span>
      </h2>
      <p className={s.headLead}>{detail.intro}</p>
    </div>
  )
}

/** "What we do" / "What you receive" hairline list with a count in the header. */
function LineList({
  title,
  items,
  marker,
  className,
  style,
}: {
  title: string
  items: ServiceLine[]
  marker: 'number' | 'doc'
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cx(s.list, className)} data-reveal style={style}>
      <div className={s.listHead}>
        <h3 className={s.listTitle}>{title}</h3>
        <span className={s.listCount}>{pad(items.length)}</span>
      </div>
      <ul className={s.listItems}>
        {items.map((it, i) => (
          <li key={it.label} className={cx(s.listItem, !!it.note && s.listItemNoted)}>
            {marker === 'number' ? (
              <span className={s.listNum}>{pad(i + 1)}</span>
            ) : (
              <DocIcon size={16} className={s.listDoc} />
            )}
            <span className={s.listLabel}>{it.label}</span>
            {it.note && <span className={s.listNote}>{it.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** FAQ accordion: one panel open at a time, first open by default. */
function FaqAccordion() {
  const [open, setOpen] = useState(0)
  const base = useId()

  return (
    <div className={s.faqList}>
      {serviceFaqs.map((f, i) => {
        const isOpen = open === i
        const btnId = `${base}-q${i}`
        const panelId = `${base}-a${i}`
        return (
          <div key={f.id} className={cx(s.faqItem, isOpen && s.faqOpen)}>
            <h3 className={s.faqQ}>
              <button
                type="button"
                id={btnId}
                className={s.faqButton}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className={s.faqNum} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className={s.faqText}>{f.question}</span>
                <span className={s.faqIcon} aria-hidden="true">
                  <Plus size={16} className={s.faqPlus} />
                  <Minus size={16} className={s.faqMinus} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={s.faqPanel}>
              <div className={s.faqPanelInner}>
                <p>{f.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Services() {
  const { structural, mep, supervision } = disciplineDetails

  return (
    <>
      <Seo
        title="Services"
        description="Structural design, MEP design and site supervision from one consultancy — RCC, steel and PT frames; HVAC, electrical, plumbing and fire; stage inspections through to commissioning and handover."
        path="/services"
      />

      {/* ---------------- Hero (light) ---------------- */}
      <section className={`section--white hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroText}>
            <SectionLabel num="B" label="Services" rule={false} />
            <h1 className={`h1 ${s.heroTitle}`}>
              <span>Structure, services</span> <span>and site{'\u00a0'}— under</span>{' '}
              <span className={s.steel}>one roof.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Structural design, MEP design and site supervision from one consultancy — coordinated on paper and
              checked on site, from brief to handover.
            </p>
          </div>

          <nav aria-label="Disciplines on this page" className={s.index}>
            <div className={s.indexHead}>
              <span>Sheet index</span>
              <span className={s.indexHeadCount}>{pad(disciplines.length)} disciplines</span>
            </div>
            <ul className={s.indexList}>
              {disciplines.map((d) => (
                <li key={d.id}>
                  <a href={`#${d.id}`} className={s.indexLink}>
                    <span className={s.indexCode}>{d.code}</span>
                    <span className={s.indexText}>
                      <span className={s.indexTitle}>{d.title}</span>
                      <span className={s.indexScope}>{keepDots(disciplineDetails[d.id].scope)}</span>
                    </span>
                    <ArrowDown size={22} className={s.indexArrow} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---------------- 01 Structural (S-100) ---------------- */}
      <section id="structural" className="section section--paper" aria-labelledby="structural-title">
        <div className="container stack">
          <SheetLabel num="01" detail={structural} />
          <div className={s.structural}>
            <Figure
              src={structural.figure.image}
              alt={structural.figure.alt}
              caption={structural.figure.caption}
              tag={structural.code}
              className={cx(s.figure, s.structFigure)}
            />
            <DisciplineHead detail={structural} className={s.areaHead} />
            <div className={s.structLists}>
              <LineList title="What we do" items={structural.services ?? []} marker="number" />
              <LineList title="What you receive" items={structural.deliverables} marker="doc" style={delay(120)} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 02 MEP (M-200) ---------------- */}
      <section id="mep" className="section bg-grid-dark" aria-labelledby="mep-title">
        <div className="container stack">
          <SheetLabel num="02" detail={mep} tone="dark" />
          <div className={s.mep}>
            <DisciplineHead detail={mep} className={s.areaHead} />
            <Figure
              src={mep.figure.image}
              alt={mep.figure.alt}
              caption={mep.figure.caption}
              tag={mep.code}
              className={cx(s.figure, s.mepFigure)}
            />
            <div className={s.mepSystems} data-reveal>
              <div className={s.listHead}>
                <h3 className={s.listTitle}>What we do</h3>
                <span className={s.listCount}>{pad(mep.systems?.length ?? 0)} systems</span>
              </div>
              <div className={s.systems}>
                {mep.systems?.map((sys) => (
                  <div key={sys.code} className={s.system}>
                    <span className={s.systemCode}>{sys.code}</span>
                    <h4 className={s.systemTitle}>{sys.title}</h4>
                    <ul className={s.systemItems}>
                      {sys.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.mepDeliverables}>
              <LineList title="What you receive" items={mep.deliverables} marker="doc" style={delay(120)} />
              {mep.note && (
                <p className={s.note} data-reveal style={delay(200)}>
                  {mep.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 03 Supervision (C-300) ---------------- */}
      <section id="supervision" className="section section--white" aria-labelledby="supervision-title">
        <div className="container stack">
          <SheetLabel num="03" detail={supervision} />
          <div className={s.supervision}>
            <div className={cx(s.figureWrap, s.supFigure)}>
              <Figure
                src={supervision.figure.image}
                alt={supervision.figure.alt}
                caption={supervision.figure.caption}
                tag={supervision.code}
                className={s.figure}
              />
              <span className={s.holdPoint}>
                <CheckIcon size={14} />
                {keepDots('Hold point · Released for pour')}
              </span>
            </div>
            <DisciplineHead detail={supervision} className={cx(s.areaHead, s.supHead)} />
            <LineList
              title="What we do"
              items={supervision.services ?? []}
              marker="number"
              className={s.supDo}
            />
            <LineList
              title="What you receive"
              items={supervision.deliverables}
              marker="doc"
              className={s.supReceive}
              style={delay(120)}
            />
          </div>
        </div>
      </section>

      {/* ---------------- 04 Engagement ---------------- */}
      <section id="engagement" className="section section--paper">
        <div className="container stack">
          <SectionLabel num="04" label="Engagement" />
          <div className={s.engHead}>
            <h2 className="h2">Three ways to engage us</h2>
            <p className={s.engIntro}>
              Every engagement is scoped in writing before work starts{'\u00a0'}— for structure, MEP or both.
            </p>
          </div>
          <div className={s.options}>
            {engagementOptions.map((o, i) => (
              <article
                key={o.id}
                className={cx(s.option, o.featured && s.optionFeatured)}
                data-reveal
                style={delay(i * 110)}
              >
                <div className={s.optTop}>
                  <div className={s.optMeta}>
                    <span className={s.optLetter}>{o.option}</span>
                    <span className={s.optScope}>{keepDots(o.scope)}</span>
                  </div>
                  <h3 className={s.optTitle}>{o.title}</h3>
                </div>
                <div className={s.optWho}>
                  <h4 className={s.optLabel}>Who it’s for</h4>
                  <p>{o.audience}</p>
                </div>
                <div className={s.optIncluded}>
                  <h4 className={s.optLabel}>Included</h4>
                  <ul>
                    {o.included.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ButtonLink
                  to="/contact"
                  variant={o.featured ? 'text-light' : 'text'}
                  arrow
                  className={s.optCta}
                >
                  {o.cta}
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 05 FAQ ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="05" label="FAQ" />
          <div className={s.faq}>
            <div className={s.faqIntro}>
              <h2 className={`h2 ${s.faqTitle}`}>
                <span>Questions,</span> <span>answered.</span>
              </h2>
              <p>
                Short answers to what clients ask before appointing a structural and MEP consultant. For anything
                else, write to us.
              </p>
              <ButtonLink to="/contact" variant="text" arrow className={s.faqLink}>
                Ask us something else
              </ButtonLink>
            </div>
            <FaqAccordion />
          </div>
        </div>
      </section>

      <CtaBand
        num="06"
        title="Tell us what you’re building."
        text={`Send your architectural drawings and a few details about the site. We will reply with a scope, a fee and a timeline within ${site.contact.replyTime}.`}
        image={img.craneFrame}
      />
    </>
  )
}
