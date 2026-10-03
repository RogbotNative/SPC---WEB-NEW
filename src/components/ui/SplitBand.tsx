import type { ReactNode } from 'react'
import { ButtonLink } from './Button'
import { SectionLabel } from './SectionLabel'
import s from './SplitBand.module.css'

interface Action {
  to: string
  label: string
  mono?: boolean
  ariaLabel?: string
}

interface Props {
  num: string
  label: string
  title: ReactNode
  text: ReactNode
  /** "light" = blueprint paper ground; "dark" = navy (photo under a scrim when `image` is given). */
  tone?: 'light' | 'dark'
  image?: string
  /** "xl" = 120px title (Process), "lg" = 104px title (Careers). */
  size?: 'xl' | 'lg'
  primary: Action
  secondary?: Action
}

/**
 * Closing band with the copy on the left and the buttons on the right (Process / Careers designs).
 * CtaBand stacks its buttons under the copy and is dark-only, so these two pages use this variant.
 */
export function SplitBand({ num, label, title, text, tone = 'dark', image, size = 'xl', primary, secondary }: Props) {
  const dark = tone === 'dark'
  return (
    <section
      className={[s.band, dark && s.dark, !dark && 'bg-grid-light on-light', dark && !image && 'bg-grid-dark']
        .filter(Boolean)
        .join(' ')}
    >
      {image && (
        <>
          <img src={image} alt="" className={s.bg} loading="lazy" decoding="async" />
          <span className={s.scrim} aria-hidden="true" />
        </>
      )}
      <div className={`container ${s.inner}`} data-reveal>
        <SectionLabel num={num} label={label} tone={dark ? 'dark' : 'light'} rule={!dark} />
        <h2 className={[s.title, s[size]].join(' ')}>{title}</h2>
        <div className={s.row}>
          <p className={s.text}>{text}</p>
          <div className={s.actions}>
            <ButtonLink to={primary.to} ariaLabel={primary.ariaLabel} mono={primary.mono} arrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                to={secondary.to}
                ariaLabel={secondary.ariaLabel}
                mono={secondary.mono}
                variant={dark ? 'outline-light' : 'outline-dark'}
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
