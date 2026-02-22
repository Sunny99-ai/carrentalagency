import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'
import { getBookingById } from '../services/bookingsApi'

const getCookie = (name) => {
  const prefix = `${name}=`
  const found = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
  return found ? decodeURIComponent(found.slice(prefix.length)) : ''
}

const setCookie = (name, value, maxAgeSeconds = 60 * 60 * 24 * 7) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`
}

function HomePage() {
  const [notification, setNotification] = useState('')

  useEffect(() => {
    let isMounted = true
    let timer = null

    const checkBookingStatus = async () => {
      const bookingId = getCookie('latestBookingId')
      if (!bookingId) return
      const alreadyShown = getCookie(`bookingNotificationShown_${bookingId}`)
      if (alreadyShown === 'true') return

      try {
        const booking = await getBookingById(bookingId)
        if (!isMounted) return
        if (booking?.paymentStatus === 'verified') {
          setNotification('Your booking succeeded.')
          setCookie(`bookingNotificationShown_${bookingId}`, 'true')
          timer = window.setTimeout(() => setNotification(''), 4500)
        }
      } catch {
        // Ignore transient fetch errors and retry on next interval tick.
      }
    }

    checkBookingStatus()
    const interval = window.setInterval(checkBookingStatus, 15000)

    return () => {
      isMounted = false
      window.clearInterval(interval)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Seo
        title="SSRK TRAVELS AND SELF DRIVE CARS | Premium Car Rental"
        description="Book premium self-drive and outstation rentals with transparent pricing and clean vehicles."
      />
      {notification ? (
        <div className="fixed right-4 top-36 z-[70] max-w-xs rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          {notification}
        </div>
      ) : null}
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
