import type { ReactNode } from 'react'
import { site } from '../../config/site'
import { ButtonLink } from './Button'
import { SectionLabel } from './SectionLabel'
import s from './CtaBand.module.css'

interface Props {
  num: string
  label?: string
  title: ReactNode
  text?: ReactNode
  /** Background photo (rendered under a navy scrim). Omit for the plain blueprint grid. */
  image?: string
  primary?: { to: string; label: string }
  /** Defaults to the phone number. */
  secondary?: { to: string; label: string; mono?: boolean }
}

/** Full-width closing call to action used at the bottom of most pages. */
export function CtaBand({
  num,
  label = 'Start a project',
  title,
  text,
  image,
  primary = { to: '/contact', label: 'Start a project' },
  secondary = { to: site.contact.phoneHref, label: site.contact.phoneDisplay, mono: true },
}: Props) {
  return (
    <section className={[s.band, !image && 'bg-grid-dark'].filter(Boolean).join(' ')}>
      {image && (
        <>
          <img src={image} alt="" className={s.bg} loading="lazy" decoding="async" />
          <span className={s.scrim} aria-hidden="true" />
        </>
      )}
      <div className={`container ${s.inner}`} data-reveal>
        <SectionLabel num={num} label={label} tone="dark" rule={false} />
        <h2 className={s.title}>{title}</h2>
        {text && <p className={`lead ${s.text}`}>{text}</p>}
        <div className={s.actions}>
          <ButtonLink to={primary.to} arrow>
            {primary.label}
          </ButtonLink>
          <ButtonLink to={secondary.to} variant="outline-light" mono={secondary.mono}>
            {secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
