import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  fill: 'none',
  'aria-hidden': true as const,
  focusable: false as const,
})

export function ArrowRight({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ArrowDown({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function Plus({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function Minus({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M2 8h12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function MenuIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...rest}>
      <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function CloseIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} {...rest}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function DocIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M4 1.5h5.5L12.5 4.5v10h-8.5z M9.5 1.5v3h3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function CheckIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base(size)} {...rest}>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
