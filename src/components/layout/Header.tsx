import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand } from '../../assets'
import { nav, site } from '../../config/site'
import { ButtonLink } from '../ui/Button'
import { CloseIcon, MenuIcon } from '../ui/Icons'
import s from './Header.module.css'

export type HeaderVariant = 'dark' | 'light'

function Logo({ tone, className }: { tone: HeaderVariant; className?: string }) {
  const dark = tone === 'dark'
  return (
    <Link to="/" className={[s.logo, className].filter(Boolean).join(' ')} aria-label={`${site.name}, home`}>
      <img src={dark ? brand.markReverse : brand.markColor} alt="" className={s.mark} width={21} height={52} />
      <span className={s.logoText}>
        <img
          src={dark ? brand.wordmarkWhite : brand.wordmarkNavy}
          alt=""
          className={s.wordmark}
          width={184}
          height={20}
        />
        <span className={s.descriptor}>{site.descriptor}</span>
      </span>
    </Link>
  )
}

export function Header({ variant }: { variant: HeaderVariant }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Solid background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  // Lock scroll, handle Escape and move focus while the menu is open.
  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  const headerClass = [s.header, s[variant], (scrolled || variant === 'light') && s.solid].filter(Boolean).join(' ')

  return (
    <>
      <header className={headerClass}>
        <div className={`container ${s.bar}`}>
          <Logo tone={variant} />

          <nav aria-label="Primary" className={s.nav}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => [s.navLink, isActive && s.active].filter(Boolean).join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={s.actions}>
            <a href={site.contact.phoneHref} className={s.phone}>
              {site.contact.phoneDisplay}
            </a>
            <ButtonLink to="/contact" arrow className={s.cta}>
              Start a project
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className={s.toggle}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={[s.menu, 'bg-grid-dark', open && s.menuOpen].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
      >
        <div className={`container ${s.menuBar}`}>
          <Logo tone="dark" />
          <button ref={closeRef} type="button" className={s.toggle} aria-label="Close menu" onClick={closeMenu}>
            <CloseIcon />
          </button>
        </div>
        <div className={`container ${s.menuBody}`}>
          <nav aria-label="Mobile">
            <ol className={s.menuList}>
              <li>
                <NavLink to="/" end className={({ isActive }) => [s.menuLink, isActive && s.menuActive].filter(Boolean).join(' ')}>
                  <span className={s.menuNum}>00</span>
                  Home
                </NavLink>
              </li>
              {nav.map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => [s.menuLink, isActive && s.menuActive].filter(Boolean).join(' ')}
                  >
                    <span className={s.menuNum}>{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>
          <ButtonLink to="/contact" arrow block>
            Start a project
          </ButtonLink>
          <div className={s.menuContact}>
            <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
            <a href={site.contact.emailHref}>{site.contact.email}</a>
          </div>
        </div>
      </div>
    </>
  )
}
