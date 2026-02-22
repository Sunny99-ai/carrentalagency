import { NavLink } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'

function HomePage() {
  return (
    <>
      <Seo
        title="SSRK TRAVELS AND SELF DRIVE CARS | Premium Car Rental"
        description="Book premium self-drive and outstation rentals with transparent pricing and clean vehicles."
      />
      <HeroSection />
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeader
            overline="Why Choose Us"
            title="Built on trust, known for reliable travel support."
            description="SSRK TRAVELS AND SELF DRIVE CARS is focused on dependable service, clean vehicles, and transparent pricing for every customer."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              'Transparent pricing with no hidden surprises.',
              'Clean premium vehicles and quick turnarounds.',
              'Dedicated support for local and outstation travel.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 p-6 shadow-premium">
                <h2 className="font-display text-2xl text-ink">{item.split(' ')[0]}.</h2>
                <p className="mt-3 text-sm text-slate-600">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium sm:p-8">
            <h2 className="font-display text-3xl text-ink">Trusted and reliable for every ride</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Our customers choose SSRK TRAVELS AND SELF DRIVE CARS for one reason: consistency. From
              booking to pickup, we focus on punctual service, well-maintained cars, and clear communication.
              Whether you need a self-drive plan or an outstation rental, we work with a service-first mindset
              so your journey stays smooth and stress-free.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              We prioritize safety checks, transparent fare details, and responsive support before and during
              your trip. This commitment to reliability has helped us become a trusted travel partner for
              families, working professionals, and regular travelers across the region.
            </p>
          </div>
          <div className="mt-12 text-center">
            <NavLink
              to="/booking"
              className="inline-flex rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Reserve Your Ride
            </NavLink>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
