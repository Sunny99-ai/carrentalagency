import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import stamp from '../assets/stamp.png'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Self Drive Pricing', to: '/self-drive-pricing' },
  { label: 'Outstation Rentals', to: '/outstation-rentals' },
  { label: 'Booking', to: '/booking' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <NavLink to="/" className="flex shrink-0 flex-col items-center gap-2 md:items-start">
          <img
            src="/new-logo.png"
            alt="SSRK logo"
            className="h-28 w-28 rounded-xl object-cover shadow-premium sm:h-32 sm:w-32 lg:h-36 lg:w-36"
          />
          <span className="max-w-[320px] text-center text-lg font-semibold leading-tight tracking-[0.08em] text-slate-700 sm:text-xl md:text-left lg:text-2xl">
            <span className="inline-flex items-center gap-2">
              <img src={stamp} alt="" aria-hidden="true" className="h-[1.2em] w-[1.2em] shrink-0 object-contain" />
              <span>SSRK TRAVELS AND SELF DRIVE CARS</span>
              <img src={stamp} alt="" aria-hidden="true" className="h-[1.2em] w-[1.2em] shrink-0 object-contain" />
            </span>
          </span>
        </NavLink>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition ${
                  isActive ? 'text-accent' : 'text-slate-600 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex w-full items-center justify-end gap-2 md:w-auto md:gap-3">
          <NavLink
            to="/booking"
            className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 sm:px-4 sm:text-sm md:px-5"
          >
            Book Now
          </NavLink>
          <button
            type="button"
            onClick={() => setIsMobileOpen((current) => !current)}
            className="inline-flex items-center rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 sm:px-4 sm:text-sm md:hidden"
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>
      {isMobileOpen ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-soft text-accent' : 'text-slate-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}

export default Navbar
