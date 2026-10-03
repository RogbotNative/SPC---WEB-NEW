import { ButtonLink } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Seo } from '../components/ui/Seo'
import s from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={`bg-grid-dark hero-offset ${s.page}`}>
      <Seo title="Page not found" description="The page you were looking for could not be found." path="/404" />
      <div className={`container ${s.inner}`}>
        <SectionLabel num="!" label="Error 404" tone="dark" rule={false} />
        <h1 className="h1">This sheet isn’t in the set.</h1>
        <p className={`lead ${s.lead}`}>
          The page you were looking for has moved or never existed. Try the home page, or tell us what you need.
        </p>
        <div className={s.actions}>
          <ButtonLink to="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline-light">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
