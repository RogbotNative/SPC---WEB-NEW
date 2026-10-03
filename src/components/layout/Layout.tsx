import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { Footer } from './Footer'
import { Header, type HeaderVariant } from './Header'

/** Per-route settings, declared on each route's `handle` in App.tsx. */
export interface RouteHandle {
  /** "dark" = transparent header over a navy hero; "light" = white header. */
  header: HeaderVariant
  /** Drawing number shown in the footer title block, e.g. "A-02". */
  sheet: string
  /** Sheet name shown in the footer title block. */
  sheetTitle: string
}

const fallback: RouteHandle = { header: 'light', sheet: 'A-00', sheetTitle: 'Page' }

export function Layout() {
  const matches = useMatches()
  const handle =
    ([...matches].reverse().find((m) => m.handle)?.handle as RouteHandle | undefined) ?? fallback
  useReveal()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header variant={handle.header} />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer sheet={handle.sheet} title={handle.sheetTitle} />
      <ScrollRestoration />
    </>
  )
}
