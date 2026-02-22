import { NavLink } from 'react-router-dom'
import Seo from '../components/Seo'

function NotFoundPage() {
  return (
    <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <Seo title="Page Not Found | SSRK TRAVELS AND SELF DRIVE CARS" />
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-premium">
        <h1 className="font-display text-5xl text-ink">404</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
        <NavLink
          to="/"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Back Home
        </NavLink>
      </div>
    </section>
  )
}

export default NotFoundPage
