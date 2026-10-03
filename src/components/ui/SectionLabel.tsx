import s from './SectionLabel.module.css'

interface Props {
  /** Text inside the gridline bubble, e.g. "01" or "A". */
  num: string
  label: string
  /** Use "dark" on navy/blueprint grounds. */
  tone?: 'light' | 'dark'
  /** Draw the hairline rule to the right (default true). */
  rule?: boolean
  className?: string
}

/** Numbered drawing-sheet style section label: (01) PRACTICE ———————— */
export function SectionLabel({ num, label, tone = 'light', rule = true, className }: Props) {
  return (
    <div className={[s.label, tone === 'dark' && s.dark, className].filter(Boolean).join(' ')}>
      <Bubble tone={tone}>{num}</Bubble>
      <span className={s.text}>{label}</span>
      {rule && <span className={s.rule} aria-hidden="true" />}
    </div>
  )
}

export function Bubble({
  children,
  tone = 'light',
  size = 30,
  className,
}: {
  children: string
  tone?: 'light' | 'dark' | 'white'
  size?: number
  className?: string
}) {
  return (
    <span
      className={[s.bubble, s[`bubble-${tone}`], className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
