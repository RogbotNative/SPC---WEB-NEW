import { Link } from 'react-router-dom'
import { brand } from '../../assets'
import { site } from '../../config/site'
import s from './Footer.module.css'

const disciplines = [
  { to: '/services#structural', label: 'Structural design' },
  { to: '/services#mep', label: 'MEP design' },
  { to: '/services#supervision', label: 'Site supervision' },
  { to: '/services#engagement', label: 'Audits & peer review' },
]

const company = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/process', label: 'Process' },
  { to: '/insights', label: 'Insights' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

const YEAR = new Date().getFullYear()

/** Site footer with a drawing title block. `sheet`/`title` change per page. */
export function Footer({ sheet, title }: { sheet: string; title: string }) {
  return (
    <footer className={`bg-grid-dark ${s.footer}`}>
      <div className={`container ${s.inner}`}>
        <div className={s.grid}>
          <div className={s.brand}>
            <Link to="/" className={s.lockup} aria-label={`${site.name}, home`}>
              <img src={brand.markReverse} alt="" className={s.mark} width={36} height={90} loading="lazy" />
              <span className={s.lockupText}>
                <img src={brand.wordmarkWhite} alt="" className={s.wordmark} width={276} height={30} loading="lazy" />
                <span className={s.tagline}>{site.tagline}</span>
              </span>
            </Link>
            <p className={s.about}>
              Structural and MEP design, with site supervision through to handover — for residential, commercial
              and institutional buildings.
            </p>
          </div>

          <nav aria-label="Disciplines" className={s.col}>
            <h2 className={s.colTitle}>Disciplines</h2>
            <ul className={s.links}>
              {disciplines.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className={s.col}>
            <h2 className={s.colTitle}>Company</h2>
            <ul className={s.links}>
              {company.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.col}>
            <h2 className={s.colTitle}>Office</h2>
            <address className={s.address}>
              <span>
                {site.contact.addressLines.map((line) => (
                  <span key={line} className={s.line}>
                    {line}
                  </span>
                ))}
              </span>
              <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
              <a href={site.contact.emailHref}>{site.contact.email}</a>
            </address>
          </div>
        </div>

        <dl className={s.titleBlock}>
          <div className={s.cell}>
            <dt>Project</dt>
            <dd>{site.name}</dd>
          </div>
          <div className={s.cell}>
            <dt>Sheet</dt>
            <dd>{title}</dd>
          </div>
          <div className={s.cell}>
            <dt>Dwg no.</dt>
            <dd>SPC-WEB-{sheet}</dd>
          </div>
          <div className={`${s.cell} ${s.narrow}`}>
            <dt>Scale</dt>
            <dd>1:1</dd>
          </div>
          <div className={`${s.cell} ${s.narrow}`}>
            <dt>Rev</dt>
            <dd>A</dd>
          </div>
          <div className={`${s.cell} ${s.copyright}`}>
            <dt className="visually-hidden">Copyright</dt>
            <dd>
              © {YEAR} {site.name}
            </dd>
          </div>
        </dl>
      </div>
    </footer>
  )
}
