import type { CSSProperties } from 'react'
import { img } from '../assets'
import { ButtonLink } from '../components/ui/Button'
import { Figure } from '../components/ui/Figure'
import { Placeholder } from '../components/ui/Placeholder'
import { Bubble, SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { designCodes } from '../data/services'
import s from './About.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

/** Small drawing "title block" under the hero intro. */
const titleBlock = [
  { label: 'Established', value: '[YEAR]' },
  { label: 'Office', value: site.contact.city },
  { label: 'Scope', value: 'Design + supervision' },
]

const principles = [
  {
    title: 'Simple is engineered',
    text: 'Simplicity is the result of analysis, not the absence of it. We run the numbers until the most buildable answer is also the safe one.',
  },
  {
    title: 'One coordinated set',
    text: 'Structure and services are designed from one set of assumptions. Beam depths, shafts and sleeves are agreed before any sheet is issued.',
  },
  {
    title: 'On site, not only on paper',
    text: 'Our engineers inspect at every critical stage, from reinforcement to commissioning. What is built is checked against what was drawn.',
  },
  {
    title: 'Codes are the floor',
    text: 'IS codes are the minimum we design to, not the target. Every design basis report states its assumptions, so nothing is hidden.',
  },
]

const leaders = ['Principal — Structural', 'Principal — MEP', 'Head of site supervision', 'Design & BIM lead']

/** Analysis and drafting tools — confirm the list with the client. */
const software = [
  { name: 'ETABS', use: 'Building analysis' },
  { name: 'SAFE', use: 'Slabs & foundations' },
  { name: 'STAAD.Pro', use: 'Frame analysis' },
  { name: 'Revit', use: 'BIM & coordination' },
  { name: 'AutoCAD', use: 'Drafting & detailing' },
]

const membershipSlots = 2

/** Horizontal gridlines (A, B) drawn across the hero figure, as a share of its height. */
const rows = [
  { label: 'A', top: '33.333%' },
  { label: 'B', top: '66.667%' },
]

export default function About() {
  const total = String(principles.length).padStart(2, '0')

  return (
    <>
      <Seo
        title="About"
        description="SP Consulting Services is an independent structural and MEP engineering consultancy. We design the frame and the services that run through it — then stay on site until both are built as drawn."
        path="/about"
      />

      {/* ---------------- Hero ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroText}>
            <SectionLabel num="A" label="About the practice" tone="dark" rule={false} />
            <h1 className={`h1 ${s.heroTitle}`}>
              <span>We engineer</span> <span>buildings to be</span>{' '}
              <span className="accent">simpler to build.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              SP Consulting Services is a structural and MEP engineering consultancy. We design the frame and the
              services that run through it — then stay on site until both are built as drawn.
            </p>
            <dl className={s.titleBlock}>
              {titleBlock.map((cell) => (
                <div key={cell.label} className={s.titleCell}>
                  <dt>{cell.label}</dt>
                  <dd>{cell.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={s.heroFigure}>
            <Figure
              src={img.concreteFrame}
              alt="Bare reinforced concrete frame of a building under construction"
              caption="Fig. 01 — RCC frame, [Project name]"
              gridlines={3}
              bubbles={['1', '2', '3']}
              priority
              className={s.heroImage}
            />
            {/* Drawing frame: gridline overruns, row gridlines with bubbles, and a dimension line */}
            <span className={s.overruns} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            {rows.map((r) => (
              <span key={r.label} className={s.row} style={{ top: r.top }} aria-hidden="true">
                <Bubble tone="white" size={28} className={s.rowBubble}>
                  {r.label}
                </Bubble>
              </span>
            ))}
            <span className={s.dimension} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 01 Our story ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="01" label="Our story" />
          <div className={s.story}>
            <div className={s.storyHead} data-reveal>
              <h2 className={`h2 ${s.storyTitle}`}>The drawing should make the site easier.</h2>
              <div className={s.callout}>
                <span className={s.calloutLabel}>Independent consultant</span>
                <p>
                  We design and supervise. We do not build — so on site, our only interest is that the work matches
                  the drawings.
                </p>
              </div>
            </div>
            <div className={s.storyBody} data-reveal style={delay(120)}>
              <p>
                SP Consulting Services was set up in [YEAR] by [Founder name] to fix a familiar problem: structure,
                building services and site supervision handled by three different firms, each working from its own
                assumptions — and the site left to reconcile them.
              </p>
              <p>
                We bring all three under one accountable consultant. The engineers who size the frame also route the
                services through it, and the same team checks the work on site — so questions are answered by people
                who know why the drawing says what it says.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 02 Principles ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="02" label="Principles" />
          <div className={s.headRow}>
            <h2 className="h2">How we work</h2>
            <ButtonLink to="/process" variant="text" arrow>
              See our process
            </ButtonLink>
          </div>
          <ol className={s.principles}>
            {principles.map((p, i) => (
              <li key={p.title} className={s.principle} data-reveal style={delay(i * 90)}>
                <div className={s.principleNum} aria-hidden="true">
                  <span className={s.bigNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.of}>/ {total}</span>
                </div>
                <div className={s.principleBody}>
                  <h3 className={s.principleTitle}>{p.title}</h3>
                  <p className="body">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- 03 Leadership ---------------- */}
      <section className="section section--paper">
        <div className="container stack">
          <SectionLabel num="03" label="Leadership" />
          <div className={s.headRow}>
            <h2 className="h2">The people who sign the drawings</h2>
            <ButtonLink to="/careers" variant="text" arrow>
              Join the team
            </ButtonLink>
          </div>
          <ul className={s.leaders}>
            {leaders.map((role, i) => (
              <li key={role} className={s.leader} data-reveal style={delay(i * 90)}>
                <Placeholder label="[Portrait]" className={s.portrait} />
                <h3 className={s.leaderName}>[Name]</h3>
                <p className={s.leaderRole}>{role}</p>
                <p className={s.leaderBio}>[Qualification, years of experience]</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- 04 Credentials ---------------- */}
      <section className={`section bg-grid-dark ${s.credentials}`}>
        <div className="container stack">
          <SectionLabel num="04" label="Credentials" tone="dark" />
          <h2 className="h2">The standards behind every sheet.</h2>
          <div className={s.credGrid}>
            <div className={`${s.credCol} ${s.credCodes}`} data-reveal>
              <div className={s.credHead}>
                <h3 className={s.credLabel}>Designed to</h3>
                <span className={s.credMeta}>IS · NBC · ECBC</span>
              </div>
              <ul className={s.codes} aria-label="Design codes">
                {designCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
              <p className={s.credText}>
                Concrete, steel, loading, seismic design and ductile detailing to the Indian Standards — with fire,
                electrical, plumbing and energy provisions checked against NBC 2016 and ECBC 2017.
              </p>
            </div>

            <div className={s.credCol} data-reveal style={delay(100)}>
              <div className={s.credHead}>
                <h3 className={s.credLabel}>Software</h3>
                <span className={s.credMeta}>[confirm]</span>
              </div>
              <ul className={s.software}>
                {software.map((sw) => (
                  <li key={sw.name}>
                    <span className={s.swName}>{sw.name}</span>
                    <span className={s.swUse}>{sw.use}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.credCol} data-reveal style={delay(200)}>
              <div className={s.credHead}>
                <h3 className={s.credLabel}>Memberships</h3>
              </div>
              <div className={s.memberships}>
                {Array.from({ length: membershipSlots }, (_, i) => (
                  <Placeholder
                    key={i}
                    label="[Professional body membership]"
                    variant="dashed"
                    className={s.membership}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Studio image band ---------------- */}
      <div className={s.studio}>
        <Figure
          src={img.studio}
          alt="Engineering studio interior with long desks and full-height glazing"
          caption={`Fig. 02 — The studio, ${site.contact.city}`}
          className={s.studioFigure}
        />
      </div>

      {/* ---------------- 05 Next step ---------------- */}
      <section className="section section--white">
        <div className={`container ${s.cta}`}>
          <SectionLabel num="05" label="Next step" />
          <h2 className={s.ctaTitle} data-reveal>
            Work with us{'\u00a0'}— <span>or join us.</span>
          </h2>
          <div className={s.ctaRow} data-reveal style={delay(120)}>
            <p className={s.ctaText}>
              Bring us a site and a set of architectural drawings, and we will return a scope and a fee. If you are an
              engineer who wants to see your drawings built, we would like to hear from you.
            </p>
            <div className={s.ctaActions}>
              <ButtonLink to="/contact" arrow>
                Start a project
              </ButtonLink>
              <ButtonLink to="/careers" variant="outline-dark" arrow>
                See open roles
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
