import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import stamp from '../assets/stamp.png'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Self Drive Pricing', to: '/self-drive-pricing' },
  { label: 'Outstation Rentals', to: '/outstation-rentals' },
  { label: 'Booking', to: '/booking' },
  { label: 'Contact', to: '/contact' },
]
const titleWords = ['SSRK', 'TRAVELS', 'AND', 'SELF', 'DRIVE', 'CARS']

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [playTitleAnimation, setPlayTitleAnimation] = useState(false)

  const closeMobileMenu = () => setIsMobileOpen(false)

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 40)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setPlayTitleAnimation(true)
    }, 80)
    return () => window.clearTimeout(timerId)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-300 ${
        isCompact ? '-translate-y-1' : 'translate-y-0'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 transition-all duration-300 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 ${
          isCompact ? 'py-2 md:py-2' : 'py-5'
        }`}
      >
        <NavLink to="/" className="flex shrink-0 flex-col items-center gap-2 md:items-start">
          <img
            src="/new-logo.png"
            alt="SSRK logo"
            className={`rounded-xl object-cover transition-all duration-300 ${
              isCompact
                ? 'h-28 w-28 shadow-none sm:h-32 sm:w-32 md:h-16 md:w-16 md:shadow-premium lg:h-20 lg:w-20'
                : 'h-44 w-44 shadow-none sm:h-48 sm:w-48 md:h-20 md:w-20 md:shadow-premium lg:h-24 lg:w-24'
            }`}
          />
          <span
            className={`max-w-[360px] text-center font-extrabold uppercase leading-tight transition-all duration-300 md:text-left ${
              isCompact ? 'text-lg sm:text-xl lg:text-2xl' : 'text-2xl sm:text-3xl lg:text-3xl'
            }`}
            style={{ fontFamily: '"Outfit", "Sora", "Manrope", sans-serif', letterSpacing: '0.08em' }}
          >
            <span className="inline-flex items-center gap-2">
              <img
                src={stamp}
                alt=""
                aria-hidden="true"
                className={`shrink-0 object-contain transition-all duration-300 ${
                  isCompact ? 'h-[2.2em] w-[2.2em]' : 'h-[2.3em] w-[2.3em]'
                }`}
              />
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
                {titleWords.map((word, index) => (
                  <span
                    key={word}
                    className={`inline-block bg-gradient-to-b from-slate-900 via-cyan-800 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_8px_16px_rgba(15,23,42,0.2)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      playTitleAnimation ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <img
                src={stamp}
                alt=""
                aria-hidden="true"
                className={`shrink-0 object-contain transition-all duration-300 ${
                  isCompact ? 'h-[2.2em] w-[2.2em]' : 'h-[2.3em] w-[2.3em]'
                }`}
              />
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
