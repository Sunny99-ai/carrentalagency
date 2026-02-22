import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/ssrk-logo.png'

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 flex-col items-center gap-2">
          <img src={logo} alt="SSRK logo" className="h-16 w-16 rounded-xl object-cover shadow-premium" />
          <span className="max-w-[150px] text-center text-[10px] font-semibold leading-tight tracking-[0.08em] text-slate-700 sm:text-[11px]">
            SSRK TRAVELS AND SELF DRIVE CARS
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
        <div className="flex items-center gap-3">
          <NavLink
            to="/booking"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Book Now
          </NavLink>
          <button
            type="button"
            onClick={() => setIsMobileOpen((current) => !current)}
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 md:hidden"
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
