import React, { useEffect, useMemo, useState } from 'react'

const apiBase = (import.meta.env.VITE_API_BASE_URL || 'https://carrentalagency-api.onrender.com/api').replace(/\/$/, '')

async function api(path, options) {
  const res = await fetch(`${apiBase}${path}`, options)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Request failed')
  return body
}

function updateArrayItem(list, index, key, value) {
  return list.map((item, i) => (i === index ? { ...item, [key]: value } : item))
}

function PaymentScreenshotCell({ url }) {
  if (!url) return <span>-</span>

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img
        src={url}
        alt="Payment proof"
        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }}
      />
      <a href={url} target="_blank" rel="noreferrer">
        View
      </a>
    </div>
  )
}

export default function App() {
  const [bookings, setBookings] = useState([])
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    setMessage('')
    try {
      const [bookingsData, pricingData] = await Promise.all([api('/bookings'), api('/pricing')])
      setBookings(bookingsData)
      setPricing(pricingData)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const bookingCount = useMemo(() => bookings.length, [bookings])
  const selfDriveBookings = useMemo(
    () => bookings.filter((item) => item.tripType === 'Self Drive'),
    [bookings],
  )
  const outstationBookings = useMemo(
    () => bookings.filter((item) => item.tripType === 'Outstation'),
    [bookings],
  )

  const savePricing = async () => {
    if (!pricing) return
    setSaving(true)
    setMessage('')

    try {
      const updated = await api('/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      })
      setPricing(updated)
      setMessage('Pricing updated successfully.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updatePaymentStatus = async (bookingId, paymentStatus) => {
    setMessage('')
    try {
      const updated = await api(`/bookings/${bookingId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      })
      setBookings((current) =>
        current.map((item) => (String(item._id || item.id) === String(bookingId) ? updated : item)),
      )
      setMessage(`Payment status updated to ${paymentStatus}.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>SSRK Admin Panel</h1>
        <small>API: {apiBase}</small>
      </div>

      {message ? (
        <div className="card">
          <strong>{message}</strong>
        </div>
      ) : null}

      <div className="card">
        <h2>Bookings ({bookingCount})</h2>
        {loading ? <p>Loading...</p> : null}

        {!loading ? (
          <>
            <h3>Self Drive Bookings ({selfDriveBookings.length})</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Pickup</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Hours</th>
                    <th>KM</th>
                    <th>Car Type</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Screenshot</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selfDriveBookings.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.pickupLocation}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>{item.selfDriveHours || '-'}</td>
                      <td>{item.selfDriveKm || '-'}</td>
                      <td>{item.carType || '-'}</td>
                      <td>{item.finalAmount ?? '-'}</td>
                      <td>{item.paymentStatus || '-'}</td>
                      <td>
                        <PaymentScreenshotCell url={item.paymentScreenshotUrl} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" onClick={() => updatePaymentStatus(item._id || item.id, 'verified')}>
                            Verify
                          </button>
                          <button type="button" onClick={() => updatePaymentStatus(item._id || item.id, 'failed')}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ marginTop: 16 }}>Outstation Bookings ({outstationBookings.length})</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>KM</th>
                    <th>Car Type</th>
                    <th>A/C Type</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Screenshot</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {outstationBookings.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.pickupLocation}</td>
                      <td>{item.dropLocation || '-'}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>{item.outstationKm || item.billedKm || '-'}</td>
                      <td>{item.carType || '-'}</td>
                      <td>{item.acType || '-'}</td>
                      <td>{item.finalAmount ?? '-'}</td>
                      <td>{item.paymentStatus || '-'}</td>
                      <td>
                        <PaymentScreenshotCell url={item.paymentScreenshotUrl} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" onClick={() => updatePaymentStatus(item._id || item.id, 'verified')}>
                            Verify
                          </button>
                          <button type="button" onClick={() => updatePaymentStatus(item._id || item.id, 'failed')}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>

      {pricing ? (
        <>
          <div className="card">
            <h2>Cars Availability</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Available</th>
                    <th>Cars Available (Optional)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Self Drive</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={pricing.availability?.selfDrive?.isAvailable ?? true}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            availability: {
                              ...(p.availability || {}),
                              selfDrive: {
                                ...(p.availability?.selfDrive || {}),
                                isAvailable: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={pricing.availability?.selfDrive?.carsAvailable || ''}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            availability: {
                              ...(p.availability || {}),
                              selfDrive: {
                                ...(p.availability?.selfDrive || {}),
                                carsAvailable: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="e.g. 4"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Outstation</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={pricing.availability?.outstation?.isAvailable ?? true}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            availability: {
                              ...(p.availability || {}),
                              outstation: {
                                ...(p.availability?.outstation || {}),
                                isAvailable: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={pricing.availability?.outstation?.carsAvailable || ''}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            availability: {
                              ...(p.availability || {}),
                              outstation: {
                                ...(p.availability?.outstation || {}),
                                carsAvailable: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="e.g. 3"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Self Drive Plans (Table)</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>KM</th>
                    <th>5 Seater</th>
                    <th>7 Seater</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.selfDrive.plans.map((plan, index) => (
                    <tr key={`${plan.title}-${index}`}>
                      <td>
                        <input
                          value={plan.title}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              selfDrive: {
                                ...p.selfDrive,
                                plans: updateArrayItem(p.selfDrive.plans, index, 'title', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={plan.duration}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              selfDrive: {
                                ...p.selfDrive,
                                plans: updateArrayItem(p.selfDrive.plans, index, 'duration', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={plan.km}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              selfDrive: {
                                ...p.selfDrive,
                                plans: updateArrayItem(p.selfDrive.plans, index, 'km', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={plan.fiveSeaterPrice}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              selfDrive: {
                                ...p.selfDrive,
                                plans: updateArrayItem(p.selfDrive.plans, index, 'fiveSeaterPrice', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={plan.sevenSeaterPrice}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              selfDrive: {
                                ...p.selfDrive,
                                plans: updateArrayItem(p.selfDrive.plans, index, 'sevenSeaterPrice', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Self Drive Extra Charges (Table)</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Extra KM</th>
                    <th>Extra Hour</th>
                    <th>7 Seater Rule</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        value={pricing.selfDrive.extraCharges.extraKm}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            selfDrive: {
                              ...p.selfDrive,
                              extraCharges: { ...p.selfDrive.extraCharges, extraKm: e.target.value },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={pricing.selfDrive.extraCharges.extraHour}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            selfDrive: {
                              ...p.selfDrive,
                              extraCharges: { ...p.selfDrive.extraCharges, extraHour: e.target.value },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={pricing.selfDrive.sevenSeaterAddOn}
                        onChange={(e) =>
                          setPricing((p) => ({
                            ...p,
                            selfDrive: { ...p.selfDrive, sevenSeaterAddOn: e.target.value },
                          }))
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Outstation Location Pricing (Table)</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>A/C</th>
                    <th>Non A/C</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.outstation.locations.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>
                        <input
                          value={item.name}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                locations: updateArrayItem(p.outstation.locations, index, 'name', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={item.ac || ''}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                locations: updateArrayItem(p.outstation.locations, index, 'ac', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={item.nonAc || ''}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                locations: updateArrayItem(p.outstation.locations, index, 'nonAc', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Outstation KM Pricing (Table)</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>KM</th>
                    <th>A/C</th>
                    <th>Non A/C</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.outstation.kmPricing.map((item, index) => (
                    <tr key={`${item.km}-${index}`}>
                      <td>
                        <input
                          value={item.km}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                kmPricing: updateArrayItem(p.outstation.kmPricing, index, 'km', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={item.ac || ''}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                kmPricing: updateArrayItem(p.outstation.kmPricing, index, 'ac', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={item.nonAc || ''}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              outstation: {
                                ...p.outstation,
                                kmPricing: updateArrayItem(p.outstation.kmPricing, index, 'nonAc', e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button className="btn-save" onClick={savePricing} disabled={saving}>
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </>
      ) : null}
    </div>
  )
}

