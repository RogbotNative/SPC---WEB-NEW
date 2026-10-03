import s from './FilterChips.module.css'

export interface ChipOption<T extends string> {
  id: T
  label: string
  count?: string
}

interface Props<T extends string> {
  options: ChipOption<T>[]
  value: T
  onChange: (id: T) => void
  /** Accessible name for the group, e.g. "Filter projects by sector". */
  label: string
  tone?: 'light' | 'dark'
  className?: string
}

/** Toggle-button group used for filtering lists (projects, insights, roles). */
export function FilterChips<T extends string>({ options, value, onChange, label, tone = 'light', className }: Props<T>) {
  return (
    <div role="group" aria-label={label} className={[s.chips, s[tone], className].filter(Boolean).join(' ')}>
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            className={[s.chip, active && s.active].filter(Boolean).join(' ')}
            aria-pressed={active}
            onClick={() => onChange(o.id)}
          >
            <span>{o.label}</span>
            {o.count && <span className={s.count}>{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
