import { useNavigate } from 'react-router-dom'
import usePricing from '../hooks/usePricing'
import PricingCard from '../components/PricingCard'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'

const extractNumber = (value) => Number(String(value).replace(/[^0-9]/g, '')) || ''

function SelfDrivePage() {
  const navigate = useNavigate()
  const { pricing } = usePricing()
  const availability = pricing.availability?.selfDrive
  const isAvailable = availability?.isAvailable ?? true
  const carsAvailable = availability?.carsAvailable || ''

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Seo
        title="Self Drive Pricing | SSRK TRAVELS AND SELF DRIVE CARS"
        description="Compare 5-seater and 7-seater self-drive plans with clear extra charges."
      />
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          overline="Self Drive Pricing"
          title="Transparent plans for 5-seater and 7-seater rentals."
          description="7-seater fare is Rs 500 higher than the corresponding 5-seater plan."
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
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.selfDrive?.plans?.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              fiveSeaterPrice={plan.fiveSeaterPrice}
              sevenSeaterPrice={plan.sevenSeaterPrice}
              details={[
                `Duration: ${plan.duration}`,
                `Distance: ${plan.km}`,
                `5 Seater Plan Price: ${plan.fiveSeaterPrice}`,
                `7 Seater Plan Price: ${plan.sevenSeaterPrice}`,
              ]}
              onBook={() =>
                navigate(
                  `/booking?tripType=self-drive&selfDriveHours=${extractNumber(plan.duration)}&selfDriveKm=${extractNumber(plan.km)}&carType=${encodeURIComponent('5 Seater')}`,
                )
              }
            />
          ))}
        </div>
        ) : null}

        {isAvailable ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-soft p-6 shadow-premium">
          <h2 className="font-display text-3xl text-ink">Extra Charges</h2>
          <div className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <p>Extra KM: {pricing.selfDrive?.extraCharges?.extraKm}</p>
            <p>Extra Hour: {pricing.selfDrive?.extraCharges?.extraHour}</p>
          </div>
          <p className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink shadow-premium">
            7 Seater Pricing Rule: {pricing.selfDrive?.sevenSeaterAddOn}
          </p>
        </div>
        ) : null}
      </div>
    </section>
  )
}

export default SelfDrivePage
