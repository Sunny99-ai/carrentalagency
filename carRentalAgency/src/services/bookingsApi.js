const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://carrentalagency-api.onrender.com/api'
const apiBaseUrl = /^https?:\/\//.test(rawBaseUrl) ? rawBaseUrl.replace(/\/$/, '') : 'https://carrentalagency-api.onrender.com/api'

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(`[bookingsApi] Using API base URL: ${apiBaseUrl}`)
}

async function request(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Request failed')
  }
  return response.json()
}

export function getBookings() {
  return request('/bookings')
}

export function getBookingById(bookingId) {
  return request(`/bookings/${bookingId}`)
}

export function saveBooking(booking) {
  return request('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
}

export function uploadPaymentScreenshot(bookingId, paymentScreenshotDataUrl) {
  return request(`/bookings/${bookingId}/payment-screenshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentScreenshotDataUrl }),
  })
}
