import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import { img } from '../assets'
import { ButtonLink } from '../components/ui/Button'
import { CtaBand } from '../components/ui/CtaBand'
import { Figure } from '../components/ui/Figure'
import { ArrowDown, Minus, Plus } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import {
  engagementOptions,
  serviceCategories,
  serviceFaqs,
  type Service,
  type ServiceCategory,
} from '../data/services'
import s from './Services.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')
/** Keep each "·" separator on the line of the word before it, so wrapped scope lines never start with a dot. */
const keepDots = (text: string) => text.replaceAll(' · ', '\u00a0· ')

type Tone = 'light' | 'dark'

/** Grounds for the category sections, in page order: paper, blueprint navy, white. */
const grounds: { className: string; tone: Tone }[] = [
  { className: 'section--paper', tone: 'light' },
  { className: 'bg-grid-dark', tone: 'dark' },
  { className: 'section--white', tone: 'light' },
]

/* ------------------------------------------------------------------ */

/** Section label with the sheet code at the far end of the rule: (01) AUDIT ———— A-100 */
function SheetLabel({ num, category, tone }: { num: string; category: ServiceCategory; tone: Tone }) {
  return (
    <div className={cx(s.sheetLabel, tone === 'dark' && s.sheetLabelDark)}>
      <SectionLabel num={num} label={category.title} tone={tone} className={s.sheetLabelMain} />
      <span className={s.sheetCode}>{category.code}</span>
    </div>
  )
}

/** Ghost sheet code and two-line heading, with the intro and an enquiry link beside them. */
function CategoryHead({ category, tone }: { category: ServiceCategory; tone: Tone }) {
  return (
    <div className={s.head}>
      <div className={s.headMain}>
        <span className={s.ghost} aria-hidden="true">
          {category.code}
        </span>
        <h2 className={`h2 ${s.headTitle}`} id={`${category.id}-title`}>
          <span>{category.heading[0]}</span> <span>{category.heading[1]}</span>
        </h2>
      </div>
      <div className={s.headAside} data-reveal>
        <p className={s.headLead}>{category.intro}</p>
        <ButtonLink to="/contact" variant={tone === 'dark' ? 'text-light' : 'text'} arrow>
          {category.cta}
        </ButtonLink>
      </div>
    </div>
  )
}

/**
 * One service: photo tagged with its sheet code, title, summary and numbered scope lines.
 * The reveal animation sits on an inner wrapper so its offset doesn't skew jumps to /services#<id>.
 */
function ServiceCard({ service, style }: { service: Service; style?: CSSProperties }) {
  return (
    <article id={service.id} className={s.card} aria-labelledby={`${service.id}-title`}>
      <div className={s.cardInner} data-reveal style={style}>
        <Figure
          src={service.image}
          alt={service.imageAlt}
          tag={service.code}
          objectPosition={service.objectPosition}
          className={s.cardFigure}
        />
        <h3 className={s.cardTitle} id={`${service.id}-title`}>
          {service.title}
        </h3>
        <p className={s.cardText}>{service.summary}</p>
        <ul className={s.cardList}>
          {service.items.map((item, i) => (
            <li key={item}>
              <span className={s.cardNum}>{pad(i + 1)}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
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
  const serviceCount = serviceCategories.reduce((n, c) => n + c.services.length, 0)

  return (
    <>
      <Seo
        title="Services"
        description="Audit, construction and design services from one consultancy — structural audits and certification, non-destructive tests, public health and HVAC engineering, fire and life safety, electrical, gas and utility systems, and BIM modeling."
        path="/services"
      />

      {/* ---------------- Hero (light) ---------------- */}
      <section className={`section--white hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroText}>
            <SectionLabel num="B" label="Services" rule={false} />
            <h1 className={`h1 ${s.heroTitle}`}>
              <span>Audit, construction</span> <span>and design{'\u00a0'}— under</span>{' '}
              <span className={s.steel}>one roof.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Explore our range of services: from auditing and testing an existing building to engineering and
              designing the services of a new one — from one consultancy.
            </p>
          </div>

          <nav aria-label="Service categories on this page" className={s.index}>
            <div className={s.indexHead}>
              <span>Sheet index</span>
              <span className={s.indexHeadCount}>{pad(serviceCount)} services</span>
            </div>
            <ul className={s.indexList}>
              {serviceCategories.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className={s.indexLink}>
                    <span className={s.indexCode}>{c.code}</span>
                    <span className={s.indexText}>
                      <span className={s.indexTitle}>{c.title}</span>
                      <span className={s.indexScope}>{keepDots(c.scope)}</span>
                    </span>
                    <ArrowDown size={22} className={s.indexArrow} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---------------- 01 Audit · 02 Construction · 03 Design ---------------- */}
      {serviceCategories.map((c, i) => {
        const ground = grounds[i % grounds.length]
        const threeUp = c.services.length > 2
        return (
          <section
            key={c.id}
            id={c.id}
            className={`section ${ground.className}`}
            aria-labelledby={`${c.id}-title`}
          >
            <div className="container stack">
              <SheetLabel num={pad(i + 1)} category={c} tone={ground.tone} />
              <CategoryHead category={c} tone={ground.tone} />
              <div className={cx(s.cards, threeUp && s.cardsThree)}>
                {c.services.map((service, j) => (
                  <ServiceCard key={service.id} service={service} style={delay((j % (threeUp ? 3 : 2)) * 110)} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

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
