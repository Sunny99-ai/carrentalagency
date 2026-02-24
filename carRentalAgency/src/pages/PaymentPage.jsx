import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'
import SuccessPopup from '../components/SuccessPopup'
import { saveBooking } from '../services/bookingsApi'

const ownerWhatsappNumber = (import.meta.env.VITE_OWNER_WHATSAPP_NUMBER || '9533732579').replace(/\D/g, '')

const isMobileDevice = () => /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(window.navigator.userAgent)

const buildWhatsAppBookingMessage = (booking) => {
  if (!booking) return ''

  const lines = [
    'Hello Owner, new booking payment has been submitted.',
    `Booking ID: ${booking._id || '-'}`,
    `Name: ${booking.name || '-'}`,
    `Phone: ${booking.phone || '-'}`,
    `Trip Type: ${booking.tripType || '-'}`,
    `Pickup: ${booking.pickupLocation || '-'}`,
    `Drop: ${booking.dropLocation || '-'}`,
    `Date: ${booking.date || '-'}`,
    `Time: ${booking.time || '-'}`,
    `Car Type: ${booking.carType || '-'}`,
    `Amount: ${booking.finalAmount ? `Rs ${booking.finalAmount}` : '-'}`,
    `Payment Status: ${booking.paymentStatus || 'under_verification'}`,
  ]

  if (booking.tripType === 'Self Drive') {
    lines.push(`Self Drive Hours: ${booking.selfDriveHours || '-'}`)
    lines.push(`Self Drive KM: ${booking.selfDriveKm || '-'}`)
  } else {
    lines.push(`Outstation KM: ${booking.outstationKm || booking.billedKm || '-'}`)
    lines.push(`A/C Type: ${booking.acType || '-'}`)
  }

  return lines.join('\n')
}

function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingPayload = location.state?.bookingPayload || null
  const amount = bookingPayload?.finalAmount || ''
  const [selectedPaymentFile, setSelectedPaymentFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentUploadMessage, setPaymentUploadMessage] = useState('')
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [savedBooking, setSavedBooking] = useState(null)

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
      const response = await saveBooking({
        ...bookingPayload,
        paymentScreenshotDataUrl: optimizedDataUrl,
        paymentStatus: 'under_verification',
        paymentScreenshotUploadedAt: new Date().toISOString(),
      })

      if (!response?.success || !response?.booking) {
        throw new Error('Booking save response is invalid. Please try again.')
      }

      setSavedBooking(response.booking)
      setIsSuccessPopupOpen(true)
      setPaymentUploadMessage('Booking and payment screenshot submitted. We will verify and confirm you by contact.')
      setSelectedPaymentFile(null)
    } catch (error) {
      setPaymentUploadMessage(error.message || 'Failed to upload screenshot. Try a smaller image.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotifyOwner = () => {
    if (!savedBooking) return
    if (!ownerWhatsappNumber) {
      setPaymentUploadMessage('Owner WhatsApp number is not configured.')
      return
    }

    const encodedMessage = encodeURIComponent(buildWhatsAppBookingMessage(savedBooking))
    const link = `https://wa.me/${ownerWhatsappNumber}?text=${encodedMessage}`

    if (isMobileDevice()) {
      window.location.href = link
      return
    }
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false)
    navigate('/')
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
      <SuccessPopup open={isSuccessPopupOpen} booking={savedBooking} onNotifyOwner={handleNotifyOwner} onClose={closeSuccessPopup} />
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
            <p className="mt-3 text-sm font-semibold text-slate-700">Waiting charges and toll gate charges are applicable.</p>
          </div>

          {amount ? <p className="mt-4 text-lg font-semibold text-ink">Amount to pay: Rs {amount}</p> : null}

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
    </section>
  )
}

export default PaymentPage
