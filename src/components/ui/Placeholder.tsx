import s from './Placeholder.module.css'

/** Blueprint-gridded box marking where a real image (portrait, logo, map) still has to go. */
export function Placeholder({
  label,
  className,
  variant = 'solid',
}: {
  label: string
  className?: string
  variant?: 'solid' | 'dashed'
}) {
  return (
    <div className={[s.box, s[variant], className].filter(Boolean).join(' ')} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  )
}
