import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons'
import s from './Button.module.css'

type Variant = 'primary' | 'outline-light' | 'outline-dark' | 'text' | 'text-light'

interface CommonProps {
  variant?: Variant
  arrow?: boolean
  mono?: boolean
  block?: boolean
  className?: string
  children: ReactNode
}

const cls = ({ variant = 'primary', mono, block, className }: CommonProps) =>
  [s.btn, s[variant], mono && s.mono, block && s.block, className].filter(Boolean).join(' ')

/** Link styled as a button. Internal routes use react-router; tel:/mailto:/http/# use a plain anchor. */
export function ButtonLink({
  to,
  ariaLabel,
  ...props
}: CommonProps & { to: string; ariaLabel?: string }) {
  const content = (
    <>
      <span>{props.children}</span>
      {props.arrow && <ArrowRight />}
    </>
  )
  const isExternal = /^(https?:|mailto:|tel:|#)/.test(to)
  if (isExternal) {
    const newTab = to.startsWith('http')
    return (
      <a
        href={to}
        className={cls(props)}
        aria-label={ariaLabel}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <Link to={to} className={cls(props)} aria-label={ariaLabel}>
      {content}
    </Link>
  )
}

export function Button({
  variant,
  arrow,
  mono,
  block,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cls({ variant, mono, block, className, children })} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowRight />}
    </button>
  )
}
