const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://carrentalagency-api.onrender.com/api'
const apiBaseUrl = /^https?:\/\//.test(rawBaseUrl) ? rawBaseUrl.replace(/\/$/, '') : 'https://carrentalagency-api.onrender.com/api'

async function request(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Request failed')
  }
  return response.json()
}

export function getPricing() {
  return request('/pricing')
}

export function updatePricing(data) {
  return request('/pricing', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

