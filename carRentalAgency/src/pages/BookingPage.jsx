import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'
import usePricing from '../hooks/usePricing'

const initialForm = {
  name: '',
  phone: '',
  pickupLocation: '',
  dropLocation: '',
  date: '',
  time: '',
  timeHour: '',
  timeMinute: '',
  timePeriod: 'AM',
  outstationKm: '',
  selfDriveHours: '',
  selfDriveKm: '',
  carType: '5 Seater',
  acType: 'A/C',
  tripType: 'Self Drive',
  paymentOption: 'full',
}

const SEVEN_SEATER_ADDON = 500
const EXTRA_KM_RATE = 5
const SELF_DRIVE_RATE_CHART = {
  12: [
    { km: 100, price: 1000 },
    { km: 150, price: 1250 },
    { km: 200, price: 1400 },
    { km: 250, price: 1600 },
    { km: 300, price: 1750 },
    { km: 350, price: 1850 },
    { km: 400, price: 2000 },
    { km: 500, price: 2500 },
    { km: 600, price: 3000 },
  ],
  24: [
    { km: 100, price: 1500 },
    { km: 150, price: 1700 },
    { km: 200, price: 1800 },
    { km: 250, price: 1900 },
    { km: 300, price: 2000 },
    { km: 350, price: 2000 },
    { km: 400, price: 2000 },
    { km: 500, price: 2500 },
    { km: 600, price: 3000 },
    { km: 650, price: 3500 },
    { km: 700, price: 3700 },
    { km: 800, price: 4000 },
    { km: 900, price: 4500 },
    { km: 1000, price: 5000 },
  ],
  36: [
    { km: 100, price: 2000 },
    { km: 150, price: 2200 },
    { km: 200, price: 2300 },
    { km: 250, price: 2400 },
    { km: 300, price: 2500 },
    { km: 350, price: 2500 },
    { km: 400, price: 2500 },
    { km: 500, price: 3000 },
    { km: 600, price: 3500 },
    { km: 650, price: 4000 },
    { km: 700, price: 4200 },
    { km: 800, price: 4500 },
    { km: 900, price: 5000 },
    { km: 1000, price: 5500 },
  ],
  48: [
    { km: 100, price: 2800 },
    { km: 150, price: 2900 },
    { km: 200, price: 3000 },
    { km: 250, price: 3000 },
    { km: 300, price: 3000 },
    { km: 350, price: 3000 },
    { km: 400, price: 3500 },
    { km: 500, price: 3500 },
    { km: 600, price: 3500 },
    { km: 650, price: 3600 },
    { km: 700, price: 3800 },
    { km: 800, price: 4000 },
    { km: 900, price: 4700 },
    { km: 1000, price: 5500 },
  ],
  60: [
    { km: 100, price: 3200 },
    { km: 150, price: 3400 },
    { km: 200, price: 3600 },
    { km: 250, price: 3800 },
    { km: 300, price: 4000 },
    { km: 350, price: 4200 },
    { km: 400, price: 4500 },
    { km: 500, price: 4600 },
    { km: 600, price: 4700 },
    { km: 650, price: 4800 },
    { km: 700, price: 4900 },
    { km: 800, price: 5000 },
    { km: 900, price: 5500 },
    { km: 1000, price: 6000 },
  ],
  72: [
    { km: 100, price: 3700 },
    { km: 150, price: 3800 },
    { km: 200, price: 4000 },
    { km: 250, price: 4300 },
    { km: 300, price: 4500 },
    { km: 350, price: 4700 },
    { km: 400, price: 4900 },
    { km: 500, price: 5200 },
    { km: 600, price: 5300 },
    { km: 650, price: 5400 },
    { km: 700, price: 5500 },
    { km: 800, price: 5600 },
    { km: 900, price: 5700 },
    { km: 1000, price: 5800 },
    { km: 1100, price: 5900 },
    { km: 1200, price: 6000 },
    { km: 1300, price: 6500 },
    { km: 1400, price: 6800 },
    { km: 1500, price: 7300 },
    { km: 1600, price: 7800 },
    { km: 1700, price: 8300 },
    { km: 1800, price: 8800 },
    { km: 1900, price: 9300 },
    { km: 2000, price: 9800 },
  ],
  90: [
    { km: 100, price: 5800 },
    { km: 150, price: 5900 },
    { km: 200, price: 6000 },
    { km: 250, price: 6000 },
    { km: 300, price: 6000 },
    { km: 350, price: 6500 },
    { km: 400, price: 7000 },
    { km: 500, price: 7000 },
    { km: 600, price: 7000 },
    { km: 650, price: 7100 },
    { km: 700, price: 7300 },
    { km: 800, price: 7500 },
    { km: 900, price: 8200 },
    { km: 1000, price: 9000 },
    { km: 1100, price: 9800 },
    { km: 1200, price: 10600 },
    { km: 1300, price: 11400 },
    { km: 1400, price: 12200 },
    { km: 1500, price: 13000 },
    { km: 1600, price: 13800 },
    { km: 1700, price: 14600 },
    { km: 1800, price: 15400 },
    { km: 1900, price: 16200 },
    { km: 2000, price: 17000 },
  ],
}

const parseNumber = (value) => Number(String(value).replace(/[^0-9.]/g, '')) || 0
const normalize = (value) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
const outstationSevenSeaterAddOn = 500
const pad = (value) => String(value).padStart(2, '0')

function getLocalDateString() {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

function toMinutesFrom12Hour(hourValue, minuteValue, period) {
  const hour = Number(hourValue)
  const minute = Number(minuteValue)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null

  const normalizedHour = hour % 12
  const periodOffset = period === 'PM' ? 12 : 0
  return (normalizedHour + periodOffset) * 60 + minute
}

function calculateRentalPrice(totalHours, totalDistanceKm) {
  const hours = Number(totalHours)
  const distanceKm = Number(totalDistanceKm)
  if (!Number.isFinite(hours) || !Number.isFinite(distanceKm) || distanceKm <= 0) return null

  const points = SELF_DRIVE_RATE_CHART[hours]
  if (!points?.length) return null

  const sorted = [...points].sort((a, b) => a.km - b.km)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (distanceKm <= first.km) {
    return {
      slab: `${hours}h-chart`,
      rentalDays: Math.ceil(hours / 24),
      extraHours: 0,
      baseFare: first.price,
      freeKmLimit: first.km,
      extraKm: 0,
      extraCharge: 0,
      finalAmount: first.price,
    }
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const start = sorted[index]
    const end = sorted[index + 1]

    if (distanceKm === start.km) {
      return {
        slab: `${hours}h-chart`,
        rentalDays: Math.ceil(hours / 24),
        extraHours: 0,
        baseFare: start.price,
        freeKmLimit: start.km,
        extraKm: 0,
        extraCharge: 0,
        finalAmount: start.price,
      }
    }

    if (distanceKm > start.km && distanceKm <= end.km) {
      const ratio = (distanceKm - start.km) / (end.km - start.km)
      const interpolated = Math.round(start.price + ratio * (end.price - start.price))
      return {
        slab: `${hours}h-chart`,
        rentalDays: Math.ceil(hours / 24),
        extraHours: 0,
        baseFare: interpolated,
        freeKmLimit: distanceKm,
        extraKm: 0,
        extraCharge: 0,
        finalAmount: interpolated,
      }
    }
  }

  const extraKm = distanceKm - last.km
  const extraCharge = extraKm * EXTRA_KM_RATE
  const finalAmount = Math.round(last.price + extraCharge)

  return {
    slab: `${hours}h-chart`,
    rentalDays: Math.ceil(hours / 24),
    extraHours: 0,
    baseFare: last.price,
    freeKmLimit: last.km,
    extraKm,
    extraCharge: Math.round(extraCharge),
    finalAmount,
  }
}

function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pricing } = usePricing()
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const todayString = getLocalDateString()
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const hourOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => String(index + 1)), [])
  const minuteOptions = useMemo(() => Array.from({ length: 60 }, (_, index) => pad(index)), [])
  const selfDriveKmOptions = useMemo(() => {
    const selectedHours = parseNumber(formData.selfDriveHours)
    const points = SELF_DRIVE_RATE_CHART[selectedHours] || []
    return [...points].sort((a, b) => a.km - b.km).map((point) => point.km)
  }, [formData.selfDriveHours])

  const prefilledFormData = useMemo(() => {
    const tripTypeParam = searchParams.get('tripType')
    const tripType =
      tripTypeParam === 'outstation' ? 'Outstation' : tripTypeParam === 'self-drive' ? 'Self Drive' : initialForm.tripType

    return {
      ...initialForm,
      tripType,
      dropLocation: searchParams.get('dropLocation') || '',
      outstationKm: searchParams.get('outstationKm') || '',
      selfDriveHours: searchParams.get('selfDriveHours') || '',
      selfDriveKm: searchParams.get('selfDriveKm') || '',
      carType: searchParams.get('carType') || initialForm.carType,
      acType: searchParams.get('acType') || initialForm.acType,
    }
  }, [searchParams])

  const hasPrefill = useMemo(
    () =>
      Boolean(
        searchParams.get('tripType') ||
          searchParams.get('dropLocation') ||
          searchParams.get('outstationKm') ||
          searchParams.get('selfDriveHours') ||
          searchParams.get('selfDriveKm'),
      ),
    [searchParams],
  )

  useEffect(() => {
    if (!hasPrefill) return
    setFormData((current) => ({ ...current, ...prefilledFormData }))
  }, [hasPrefill, prefilledFormData])

  useEffect(() => {
    if (formData.date !== todayString) return
    const selectedMinutes = toMinutesFrom12Hour(formData.timeHour, formData.timeMinute, formData.timePeriod)
    if (selectedMinutes === null || selectedMinutes > currentMinutes) return
    setFormData((current) => ({
      ...current,
      time: '',
      timeHour: '',
      timeMinute: '',
      timePeriod: 'AM',
    }))
  }, [formData.date, formData.timeHour, formData.timeMinute, formData.timePeriod, todayString, currentMinutes])

  useEffect(() => {
    if (formData.tripType !== 'Self Drive') return
    if (!formData.selfDriveKm) return
    const selectedKm = parseNumber(formData.selfDriveKm)
    if (selfDriveKmOptions.includes(selectedKm)) return
    setFormData((current) => ({ ...current, selfDriveKm: '' }))
  }, [formData.tripType, formData.selfDriveKm, selfDriveKmOptions])

  const matchedLocation = useMemo(() => {
    const target = normalize(formData.dropLocation)
    if (!target) return null
    return (pricing.outstation?.locations || []).find((item) => normalize(item.name) === target) || null
  }, [formData.dropLocation, pricing.outstation?.locations])

  const getDynamicOutstationPoints = useCallback((acType) =>
    (pricing.outstation?.kmPricing || [])
      .map((item) => ({
        km: parseNumber(item.km),
        price: parseNumber(acType === 'A/C' ? item.ac : item.nonAc),
      }))
      .filter((item) => item.km > 0 && item.price > 0)
      .sort((a, b) => a.km - b.km), [pricing.outstation?.kmPricing])

  const getDynamicCustomKmPrice = useCallback((kmValue, acType) => {
    const points = getDynamicOutstationPoints(acType)
    if (!kmValue || points.length < 2) return null

    const exact = points.find((point) => point.km === kmValue)
    if (exact) return { price: exact.price, billedKm: kmValue, note: `Exact KM slab used: ${kmValue} KM` }

    const interpolate = (start, end, targetKm) => {
      const ratio = (targetKm - start.km) / (end.km - start.km)
      return Math.round(start.price + ratio * (end.price - start.price))
    }

    if (kmValue < points[0].km) {
      return {
        price: interpolate(points[0], points[1], kmValue),
        billedKm: kmValue,
        note: `Custom KM price from ${points[0].km}-${points[1].km} KM range`,
      }
    }

    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index]
      const end = points[index + 1]
      if (kmValue > start.km && kmValue < end.km) {
        return {
          price: interpolate(start, end, kmValue),
          billedKm: kmValue,
          note: `Custom KM price from ${start.km}-${end.km} KM range`,
        }
      }
    }

    const secondLast = points[points.length - 2]
    const last = points[points.length - 1]
    return {
      price: interpolate(secondLast, last, kmValue),
      billedKm: kmValue,
      note: `Custom KM price above ${last.km} KM`,
    }
  }, [getDynamicOutstationPoints])

  const estimatedBill = useMemo(() => {
    const outstationSurcharge = formData.carType === '7 Seater' ? outstationSevenSeaterAddOn : 0

    if (formData.tripType === 'Self Drive') {
      const enteredHours = parseNumber(formData.selfDriveHours)
      const enteredKm = parseNumber(formData.selfDriveKm)
      if (!enteredHours || !enteredKm) return null

      const selfDrive = calculateRentalPrice(enteredHours, enteredKm)
      if (!selfDrive) return null

      const sevenSeaterCharge = formData.carType === '7 Seater' ? SEVEN_SEATER_ADDON : 0
      return {
        amount: selfDrive.finalAmount + sevenSeaterCharge,
        kmUsed: enteredKm,
        breakdown: [
          `Rental Days (24h blocks): ${selfDrive.rentalDays}`,
          `Applied Package: ${enteredHours} Hours`,
          `Rate Source: Fixed Chart`,
          `Extra Hours: ${selfDrive.extraHours}`,
          `Base Fare: Rs ${selfDrive.baseFare}`,
          `Free KM Limit: ${selfDrive.freeKmLimit} KM`,
          `Extra KM: ${selfDrive.extraKm} KM`,
          `Extra KM Charge: Rs ${selfDrive.extraCharge}`,
          ...(sevenSeaterCharge ? [`7 Seater Add-On: Rs ${sevenSeaterCharge}`] : []),
        ],
      }
    }

    const typedKm = parseNumber(formData.outstationKm)
    if (matchedLocation) {
      const locationRate = parseNumber(formData.acType === 'A/C' ? matchedLocation.ac : matchedLocation.nonAc)
      if (locationRate) {
        return {
          amount: locationRate + outstationSurcharge,
          kmUsed: typedKm || null,
          breakdown: [
            `Location Fare: ${matchedLocation.name} (${formData.acType})`,
            ...(outstationSurcharge ? [`7 Seater Add-On: Rs ${outstationSurcharge}`] : []),
          ],
        }
      }
    }

    const customResult = getDynamicCustomKmPrice(typedKm, formData.acType)
    if (!customResult) return null
    return {
      amount: customResult.price + outstationSurcharge,
      kmUsed: customResult.billedKm,
      breakdown: [
        customResult.note,
        ...(outstationSurcharge ? [`7 Seater Add-On: Rs ${outstationSurcharge}`] : []),
      ],
    }
  }, [formData, matchedLocation, getDynamicCustomKmPrice])

  const canSubmit = useMemo(() => {
    const baseValid = [
      formData.name,
      formData.phone,
      formData.pickupLocation,
      formData.date,
      formData.time,
      formData.tripType,
    ].every(Boolean)

    if (!baseValid || !estimatedBill) return false
    if (formData.tripType === 'Self Drive') {
      return Boolean(formData.selfDriveHours && formData.selfDriveKm && formData.carType)
    }

    if (!formData.dropLocation || !formData.acType || !formData.carType) return false
    if (matchedLocation && parseNumber(formData.acType === 'A/C' ? matchedLocation.ac : matchedLocation.nonAc)) {
      return true
    }
    return Boolean(formData.outstationKm)
  }, [estimatedBill, formData, matchedLocation])

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => {
      if (name === 'selfDriveHours') {
        return { ...current, selfDriveHours: value, selfDriveKm: '' }
      }
      return { ...current, [name]: value }
    })
  }

  const onTimePartChange = (name, value) => {
    setFormData((current) => {
      const next = { ...current, [name]: value }
      const { timeHour, timeMinute, timePeriod } = next
      next.time = timeHour && timeMinute ? `${timeHour}:${timeMinute} ${timePeriod}` : ''
      return next
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      navigate('/payment', {
        state: {
          bookingPayload: {
            ...formData,
            finalAmount: estimatedBill ? estimatedBill.amount : null,
            billedKm: estimatedBill ? estimatedBill.kmUsed : null,
          },
        },
      })
    } catch {
      setSubmitMessage('Unable to continue to payment right now. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Seo
        title="Book Car Rental | SSRK TRAVELS AND SELF DRIVE CARS"
        description="Submit your booking details for self-drive or outstation rental."
      />
      <div className="mx-auto w-full max-w-4xl">
        <SectionHeader overline="Booking" title="Reserve your ride in minutes." description="Fill your details and continue to payment." />

        <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium" onSubmit={onSubmit}>
          <h2 className="font-display text-3xl text-ink">Booking Form</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 text-sm font-semibold text-slate-600">
              Trip Type
              <select
                name="tripType"
                value={formData.tripType}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
              >
                <option>Self Drive</option>
                <option>Outstation</option>
              </select>
            </label>

            {[
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'pickupLocation', label: 'Pickup Location', type: 'text' },
              { name: 'date', label: 'Date', type: 'date' },
            ].map((field) => (
              <label key={field.name} className="text-sm font-semibold text-slate-600">
                {field.label}
                <input
                  required
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={onChange}
                  min={field.name === 'date' ? todayString : undefined}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
            ))}

            <label className="text-sm font-semibold text-slate-600">
              Time
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select
                  required
                  value={formData.timeHour}
                  onChange={(event) => onTimePartChange('timeHour', event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-3 text-sm text-ink outline-none transition focus:border-accent"
                >
                  <option value="">Hour</option>
                  {hourOptions.map((hour) => (
                    <option
                      key={hour}
                      value={hour}
                      disabled={
                        formData.date === todayString && formData.timeMinute
                          ? toMinutesFrom12Hour(hour, formData.timeMinute, formData.timePeriod) <= currentMinutes
                          : false
                      }
                    >
                      {hour}
                    </option>
                  ))}
                </select>
                <select
                  required
                  value={formData.timeMinute}
                  onChange={(event) => onTimePartChange('timeMinute', event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-3 text-sm text-ink outline-none transition focus:border-accent"
                >
                  <option value="">Minute</option>
                  {minuteOptions.map((minute) => (
                    <option
                      key={minute}
                      value={minute}
                      disabled={
                        formData.date === todayString && formData.timeHour
                          ? toMinutesFrom12Hour(formData.timeHour, minute, formData.timePeriod) <= currentMinutes
                          : false
                      }
                    >
                      {minute}
                    </option>
                  ))}
                </select>
                <select
                  required
                  value={formData.timePeriod}
                  onChange={(event) => onTimePartChange('timePeriod', event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-3 text-sm text-ink outline-none transition focus:border-accent"
                >
                  {['AM', 'PM'].map((period) => (
                    <option
                      key={period}
                      value={period}
                      disabled={
                        formData.date === todayString && formData.timeHour && formData.timeMinute
                          ? toMinutesFrom12Hour(formData.timeHour, formData.timeMinute, period) <= currentMinutes
                          : false
                      }
                    >
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            {formData.tripType === 'Self Drive' ? (
              <>
                <label className="text-sm font-semibold text-slate-600">
                  Car Type
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    <option>5 Seater</option>
                    <option>7 Seater</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  Hours
                  <select
                    required
                    name="selfDriveHours"
                    value={formData.selfDriveHours}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    <option value="">Select Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                    <option value="36">36 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="60">60 Hours</option>
                    <option value="72">72 Hours</option>
                    <option value="90">90 Hours</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  KM
                  <select
                    required
                    name="selfDriveKm"
                    value={formData.selfDriveKm}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                    disabled={!formData.selfDriveHours}
                  >
                    <option value="">{formData.selfDriveHours ? 'Select KM' : 'Select Hours First'}</option>
                    {selfDriveKmOptions.map((km) => (
                      <option key={km} value={km}>
                        {km} KM
                      </option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <label className="text-sm font-semibold text-slate-600">
                  Drop Location
                  <input
                    required
                    name="dropLocation"
                    type="text"
                    list="outstation-locations"
                    value={formData.dropLocation}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  />
                  <datalist id="outstation-locations">
                    {(pricing.outstation?.locations || []).map((location) => (
                      <option key={location.name} value={location.name} />
                    ))}
                  </datalist>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  KM
                  <input
                    required={!matchedLocation}
                    min="1"
                    name="outstationKm"
                    type="number"
                    value={formData.outstationKm}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  Car Type
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    <option>5 Seater</option>
                    <option>7 Seater</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  A/C Type
                  <select
                    name="acType"
                    value={formData.acType}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    <option>A/C</option>
                    <option>Non A/C</option>
                  </select>
                </label>
              </>
            )}
          </div>

          {estimatedBill ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-soft p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Estimated Bill</p>
              <p className="mt-2 font-display text-3xl text-ink">Rs {estimatedBill.amount}</p>
              <p className="mt-1 text-sm text-slate-600">Bill KM: {estimatedBill.kmUsed ? `${estimatedBill.kmUsed} KM` : 'N/A'}</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {estimatedBill.breakdown.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {formData.tripType === 'Self Drive' ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              A rate of five rupees per kilometer will be applied for distances exceeding the selected kilometers.
              A charge of 150 rupees per hour will be incurred for durations extending beyond the allotted hours.
            </p>
          ) : null}
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            If you need a car for a few days, such as 7, 15, or 30 days, please contact SSRK Travels and Self Drive Cars.
            We have the lowest prices for long-term rentals.
          </p>

          {estimatedBill ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Payment Option</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    formData.paymentOption === 'full' ? 'border-ink bg-slate-50 text-ink' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    value="full"
                    checked={formData.paymentOption === 'full'}
                    onChange={onChange}
                    className="mr-2"
                  />
                  Pay Full Amount
                </label>
                <label
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    formData.paymentOption === 'advance' ? 'border-ink bg-slate-50 text-ink' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    value="advance"
                    checked={formData.paymentOption === 'advance'}
                    onChange={onChange}
                    className="mr-2"
                  />
                  Pay Advance (Rs 500) & Pay Later
                </label>
              </div>
            </div>
          ) : null}
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Waiting charges and toll gate charges are applicable.
          </p>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-6 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Processing...' : 'Proceed To Payment'}
          </button>
          {submitMessage ? <p className="mt-3 text-sm font-semibold text-accent">{submitMessage}</p> : null}
        </form>
      </div>
    </section>
  )
}

export default BookingPage
