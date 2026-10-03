import type { CSSProperties, FocusEvent } from 'react'
import { useState } from 'react'
import { img } from '../assets'
import { SplitBand } from '../components/ui/SplitBand'
import { ButtonLink } from '../components/ui/Button'
import { FilterChips, type ChipOption } from '../components/ui/FilterChips'
import { Figure } from '../components/ui/Figure'
import { ArrowDown } from '../components/ui/Icons'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import { site } from '../config/site'
import { hiringSteps, roleDisciplines, roles, whyJoin, type Role, type RoleDiscipline } from '../data/careers'
import s from './Careers.module.css'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const pad = (n: number) => String(n).padStart(2, '0')

type Filter = 'all' | RoleDiscipline

const chipOptions: ChipOption<Filter>[] = [{ id: 'all', label: 'All' }, ...roleDisciplines]
const disciplineLabel = (id: RoleDiscipline) => roleDisciplines.find((d) => d.id === id)?.label ?? id

/** Keeps a keyboard-focused chip fully visible when the chips are a swipeable row (phones). */
const keepInView = (e: FocusEvent<HTMLElement>) => e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' })

/** mailto: link to the careers inbox with the role pre-filled in the subject line. */
const applyHref = (role: Role) =>
  `${site.contact.careersEmailHref}?subject=${encodeURIComponent(`Application — ${role.title}`)}`

/** "MEP Design Engineer — HVAC" → "MEP Design Engineer, HVAC" (reads better in a screen reader). */
const spokenTitle = (role: Role) => role.title.replace(/\s+—\s+/g, ', ')

export default function Careers() {
  const [discipline, setDiscipline] = useState<Filter>('all')
  const visible = discipline === 'all' ? roles : roles.filter((r) => r.discipline === discipline)

  return (
    <>
      <Seo
        title="Careers"
        description="Careers at SP Consulting Services: structural, MEP, site and BIM engineers who design the structure and services — then go to site and see their drawings built."
        path="/careers"
      />

      {/* ---------------- Hero ---------------- */}
      <section className={`bg-grid-dark hero-offset ${s.hero}`}>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <SectionLabel num="G" label="Careers" tone="dark" rule={false} />
            <h1 className={`h1 ${s.heroTitle}`}>
              <span>Engineering</span>{' '}
              <span>that gets</span>{' '}
              <span className="accent">built.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Engineers at SPC design the structure and services — then go to site and see their drawings built.
            </p>
            <div className={s.heroActions}>
              <ButtonLink to="#roles" className={s.downBtn}>
                See open roles
                <ArrowDown />
              </ButtonLink>
              <ButtonLink to={site.contact.careersEmailHref} variant="outline-light">
                Send your CV
              </ButtonLink>
            </div>
          </div>
          <Figure
            src={img.hardhat}
            alt="Red hard hat resting on the ground at a construction site"
            caption="Fig. 01 — On site, [Project name]"
            gridlines={3}
            bubbles={['1', '2', '3']}
            dimension
            objectPosition="64% center"
            priority
            className={s.heroFigure}
          />
        </div>
      </section>

      {/* ---------------- 01 Why SPC ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="01" label="Why SPC" />
          <div className={s.headRow}>
            <h2 className="h2">Why engineers join us</h2>
            <p className={s.headText}>
              We are a consultancy that designs and supervises. The people who draw the building are also the people
              who check it on site.
            </p>
          </div>
          <div className={s.why}>
            {whyJoin.map((w, i) => (
              <article key={w.title} className={s.whyItem} data-reveal style={delay(i * 110)}>
                <span className={s.whyNum}>{pad(i + 1)}</span>
                <h3 className={s.whyTitle}>{w.title}</h3>
                <p className="body">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 02 Open roles ---------------- */}
      <section id="roles" className="section section--paper" aria-labelledby="roles-title">
        <div className={`container ${s.rolesStack}`}>
          <SectionLabel num="02" label="Open roles" />
          <div className={s.rolesHead} onFocus={keepInView}>
            <h2 id="roles-title" className="h2">
              Open roles
            </h2>
            <FilterChips
              options={chipOptions}
              value={discipline}
              onChange={setDiscipline}
              label="Filter roles by discipline"
              className={s.chipRow}
            />
          </div>

          <div className={s.schedule}>
            <div className={s.scheduleHead}>
              <span aria-hidden="true">Ref</span>
              <span aria-hidden="true">Role</span>
              <span aria-hidden="true">Discipline</span>
              <p className={s.count} aria-live="polite">
                {pad(visible.length)} of {pad(roles.length)} roles
              </p>
            </div>

            {visible.length > 0 ? (
              <ul className={s.roleList}>
                {visible.map((r) => (
                  <li key={r.ref} className={s.role}>
                    <span className={s.ref}>
                      <span className="visually-hidden">Reference </span>
                      {r.ref}
                    </span>
                    <div className={s.roleMain}>
                      <h3 className={s.roleTitle}>{r.title}</h3>
                      <p className={s.roleMeta}>
                        {r.experience} · {r.location} · {r.type}
                      </p>
                    </div>
                    <span className={s.roleTagCell}>
                      <span className="visually-hidden">Discipline: </span>
                      <span className={s.roleTag}>{disciplineLabel(r.discipline)}</span>
                    </span>
                    <ButtonLink
                      to={applyHref(r)}
                      variant="text"
                      arrow
                      ariaLabel={`Apply for ${spokenTitle(r)}`}
                      className={s.apply}
                    >
                      Apply
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={s.empty}>
                <p className="body">No open roles in this discipline right now — send us your CV anyway.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 03 Hiring process ---------------- */}
      <section className="section section--white">
        <div className="container stack">
          <SectionLabel num="03" label="Hiring process" />
          <div className={s.headRow}>
            <h2 className="h2">From application to offer.</h2>
            <p className={`${s.headText} ${s.headTextNarrow}`}>
              We aim to reply to every application within [00] working days.
            </p>
          </div>
          <ol className={s.steps}>
            {hiringSteps.map((st, i) => (
              <li key={st.title} className={s.step} data-reveal style={delay(i * 90)}>
                <div className={s.stepHead}>
                  <span
                    className={[s.stepNum, i === hiringSteps.length - 1 && s.stepNumLast].filter(Boolean).join(' ')}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className={s.stepLine} aria-hidden="true" />
                </div>
                <div className={s.stepBody}>
                  <h3 className="h4">{st.title}</h3>
                  <p className="body">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- 04 Open application ---------------- */}
      <SplitBand
        tone="dark"
        size="lg"
        image={img.siteColumns}
        num="04"
        label="Open application"
        title="Don’t see your role?"
        text="Structural, MEP or site engineer who wants to design and build? Send your CV and a note on the work you want to do."
        primary={{ to: '/contact', label: 'Get in touch' }}
        secondary={{ to: site.contact.careersEmailHref, label: site.contact.careersEmail, mono: true }}
      />
    </>
  )
}
