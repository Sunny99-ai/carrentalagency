const defaultApiBaseUrl = import.meta.env.DEV ? 'http://localhost:4000/api' : 'https://carrentalagency-api.onrender.com/api'
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl
const apiBaseUrl = /^https?:\/\//.test(rawBaseUrl) ? rawBaseUrl.replace(/\/$/, '') : defaultApiBaseUrl
const REQUEST_TIMEOUT_MS = 20000

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(`[bookingsApi] Using API base URL: ${apiBaseUrl}`)
}

async function request(path, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...options, signal: controller.signal })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Request failed')
  }
  return response.json()
}

export function getBookings() {
  return request('/bookings')
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
