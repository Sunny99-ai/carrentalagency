import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'
import { saveBooking } from '../services/bookingsApi'

const setCookie = (name, value, maxAgeSeconds = 60 * 60 * 24 * 7) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`
}

function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingPayload = location.state?.bookingPayload || null
  const totalAmount = Number(bookingPayload?.finalAmount) || 0
  const advanceAmount = totalAmount ? Math.min(500, totalAmount) : 0
  const [paymentOption, setPaymentOption] = useState('full')
  const amountToPay = paymentOption === 'advance' ? advanceAmount : totalAmount
  const remainingAmount = Math.max(0, totalAmount - amountToPay)
  const [selectedPaymentFile, setSelectedPaymentFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentUploadMessage, setPaymentUploadMessage] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const onPaymentFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedPaymentFile(file)
    setPaymentUploadMessage('')
  }

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file.'))
      reader.readAsDataURL(file)
    })

  const optimizeImageDataUrl = (dataUrl) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const maxWidth = 1200
        const scale = Math.min(1, maxWidth / image.width)
        const width = Math.round(image.width * scale)
        const height = Math.round(image.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Unable to process image.'))
          return
        }
        ctx.drawImage(image, 0, 0, width, height)
        const qualities = [0.72, 0.62, 0.52, 0.42]
        let optimized = canvas.toDataURL('image/jpeg', qualities[0])
        for (let index = 1; index < qualities.length && optimized.length > 6_000_000; index += 1) {
          optimized = canvas.toDataURL('image/jpeg', qualities[index])
        }
        resolve(optimized)
      }
      image.onerror = () => reject(new Error('Invalid image file.'))
      image.src = dataUrl
    })

  const onPaymentUpload = async () => {
    if (!bookingPayload || !selectedPaymentFile) return
    setIsSubmitting(true)
    setPaymentUploadMessage('')
    try {
      const rawDataUrl = await readFileAsDataUrl(selectedPaymentFile)
      const optimizedDataUrl = await optimizeImageDataUrl(rawDataUrl)
      const savedBooking = await saveBooking({
        ...bookingPayload,
        paymentOption,
        paidAmount: amountToPay,
        remainingAmount,
        paymentScreenshotDataUrl: optimizedDataUrl,
        paymentStatus: 'under_verification',
        paymentScreenshotUploadedAt: new Date().toISOString(),
      })
      const bookingId = savedBooking?._id || savedBooking?.id
      if (bookingId) {
        setCookie('latestBookingId', String(bookingId))
        setCookie(`bookingNotificationShown_${bookingId}`, 'false')
      }
      setPaymentUploadMessage('Booking and payment screenshot submitted. We will verify and confirm you by contact.')
      setSelectedPaymentFile(null)
      setShowSuccessPopup(true)
      setTimeout(() => navigate('/'), 1800)
    } catch (error) {
      setPaymentUploadMessage(error.message || 'Failed to upload screenshot. Try a smaller image.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookingPayload) {
    return (
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <Seo title="Payment | SSRK TRAVELS AND SELF DRIVE CARS" />
        <div className="mx-auto max-w-3xl">
          <SectionHeader overline="Payment" title="Booking details not found." description="Please fill booking form first." />
          <div className="text-center">
            <NavLink to="/booking" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              Go To Booking
            </NavLink>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Seo title="Payment | SSRK TRAVELS AND SELF DRIVE CARS" />
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          overline="Payment"
          title="Complete your payment"
          description="After sending payment upload the screenshot of payment, we will verify and confirm you by contact."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Trip Details</p>
            <p className="mt-2 text-sm text-slate-700">Trip Type: {bookingPayload.tripType}</p>
            {bookingPayload.tripType === 'Self Drive' ? (
              <>
                <p className="mt-1 text-sm text-slate-700">Hours: {bookingPayload.selfDriveHours || '-'}</p>
                <p className="mt-1 text-sm text-slate-700">KM: {bookingPayload.selfDriveKm || '-'}</p>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-700">Drop Location: {bookingPayload.dropLocation || '-'}</p>
                <p className="mt-1 text-sm text-slate-700">KM: {bookingPayload.outstationKm || bookingPayload.billedKm || '-'}</p>
              </>
            )}
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Waiting charges and toll gate charges are applicable.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentOption('full')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                paymentOption === 'full' ? 'border-ink bg-slate-50' : 'border-slate-300 bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-ink">Pay Full Amount</p>
              <p className="mt-1 text-sm text-slate-600">Rs {totalAmount || 0}</p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentOption('advance')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                paymentOption === 'advance' ? 'border-ink bg-slate-50' : 'border-slate-300 bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-ink">Pay Advance</p>
              <p className="mt-1 text-sm text-slate-600">Rs {advanceAmount} now, Rs {remainingAmount} pay later</p>
            </button>
          </div>
          {totalAmount ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-lg font-semibold text-ink">Amount to pay now: Rs {amountToPay}</p>
              {paymentOption === 'advance' ? (
                <p className="mt-1 text-sm text-slate-600">Remaining amount to pay later: Rs {remainingAmount}</p>
              ) : null}
            </div>
          ) : null}

          <img
            src="/upi-qr-placeholder.svg"
            alt="UPI QR placeholder"
            className="mt-5 w-full rounded-xl border border-slate-200 bg-white p-4"
          />

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Upload Payment Screenshot
            <input
              type="file"
              accept="image/*"
              onChange={onPaymentFileChange}
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={!selectedPaymentFile || isSubmitting}
            onClick={onPaymentUpload}
            className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking & Screenshot'}
          </button>
          {paymentUploadMessage ? <p className="mt-3 text-sm font-semibold text-accent">{paymentUploadMessage}</p> : null}
        </div>
      </div>
      {showSuccessPopup ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="absolute inset-0 -z-10 rounded-2xl bg-emerald-200/40 blur-xl" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <span className="absolute h-16 w-16 animate-ping rounded-full bg-emerald-200/70" />
              <svg className="relative h-9 w-9 text-emerald-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-4 text-base font-semibold text-ink">
              Success we will verify payment and inform you shortly
            </p>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default PaymentPage
