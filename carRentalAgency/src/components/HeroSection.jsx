import { NavLink } from 'react-router-dom'
import homeBanner from 'ChatGPT Image Feb 23, 2026, 01_54_34 PM.png'

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Premium Fleet</p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-ink md:text-6xl">
            Elevated Car Rentals For Every Journey
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Reliable self-drive and outstation rentals with transparent pricing, clean vehicles, and
            seamless booking.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <NavLink
              to="/booking"
              className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Book Now
            </NavLink>
            <NavLink
              to="/outstation-rentals"
              className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-ink hover:text-ink"
            >
              Explore Outstation
            </NavLink>
          </div>
        </div>
        <div className="animate-fade-in">
          <img
            src={homeBanner}
            alt="SSRK Travels and Self Drive Cars promotional poster"
            className="w-full rounded-3xl bg-slate-100 object-contain shadow-premium"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
