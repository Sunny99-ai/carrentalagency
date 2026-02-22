import { useNavigate } from 'react-router-dom'
import usePricing from '../hooks/usePricing'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'

function FareCell({ value }) {
  return <span className={value ? 'font-semibold text-ink' : 'text-slate-400'}>{value || '-'}</span>
}

const parseKm = (value) => Number(String(value).replace(/[^0-9]/g, '')) || ''

function OutstationPage() {
  const navigate = useNavigate()
  const { pricing } = usePricing()
  const availability = pricing.availability?.outstation
  const isAvailable = availability?.isAvailable ?? true
  const carsAvailable = availability?.carsAvailable || ''
  const uniqueKmPricing = Array.from(
    new Map((pricing.outstation?.kmPricing || []).map((item) => [item.km, item])).values(),
  )

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Seo
        title="Outstation Rentals | SSRK TRAVELS AND SELF DRIVE CARS"
        description="Explore outstation destination pricing and KM-based rental rates for A/C and Non A/C rides."
      />
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          overline="Outstation Rentals"
          title="Destination-wise and KM-based fare chart."
          description="Choose location-based packages or KM-based slabs with transparent rates."
        />
        {!isAvailable ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-premium">
            <p className="text-base font-semibold text-rose-700">
              sorry vechiels are not available this time, come back after few hours.
            </p>
            {carsAvailable ? <p className="mt-2 text-sm text-rose-600">Cars available: {carsAvailable}</p> : null}
          </div>
        ) : null}

        {isAvailable ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-premium">
          <table className="w-full border-collapse bg-white text-sm">
            <thead className="bg-soft text-left text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">A/C</th>
                <th className="px-5 py-4">Non A/C</th>
                <th className="px-5 py-4">Book</th>
              </tr>
            </thead>
            <tbody>
              {(pricing.outstation?.locations || []).map((location) => (
                <tr key={location.name} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-700">{location.name}</td>
                  <td className="px-5 py-4">
                    <FareCell value={location.ac} />
                  </td>
                  <td className="px-5 py-4">
                    <FareCell value={location.nonAc} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/booking?tripType=outstation&dropLocation=${encodeURIComponent(location.name)}&carType=${encodeURIComponent('5 Seater')}`,
                        )
                      }
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : null}

        {isAvailable ? (
        <>
        <h2 className="mt-14 font-display text-3xl text-ink">KM Based Pricing</h2>
        <div className="mt-6 rounded-2xl border border-slate-200 shadow-premium">
          <table className="w-full table-fixed border-collapse bg-white text-xs sm:text-sm">
            <thead className="bg-soft text-left text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
              <tr>
                <th className="w-[34%] px-2 py-3 sm:px-5 sm:py-4">Distance</th>
                <th className="w-[33%] px-2 py-3 sm:px-5 sm:py-4">A/C</th>
                <th className="w-[33%] px-2 py-3 sm:px-5 sm:py-4">Non A/C</th>
                <th className="w-[25%] px-2 py-3 sm:px-5 sm:py-4">Book</th>
              </tr>
            </thead>
            <tbody>
              {uniqueKmPricing.map((item) => (
                <tr key={item.km} className="border-t border-slate-100">
                  <td className="px-2 py-3 font-semibold text-slate-700 sm:px-5 sm:py-4">{item.km}</td>
                  <td className="px-2 py-3 font-semibold text-ink sm:px-5 sm:py-4">{item.ac}</td>
                  <td className="px-2 py-3 sm:px-5 sm:py-4">
                    <span className={item.nonAc ? 'font-semibold text-ink' : 'text-slate-400'}>
                      {item.nonAc || '-'}
                    </span>
                  </td>
                  <td className="px-2 py-3 sm:px-5 sm:py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/booking?tripType=outstation&outstationKm=${parseKm(item.km)}&carType=${encodeURIComponent('5 Seater')}`)
                      }
                      className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        ) : null}
      </div>
    </section>
  )
}

export default OutstationPage
