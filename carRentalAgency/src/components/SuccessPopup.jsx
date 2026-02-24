function SuccessPopup({ open, booking, onClose, onNotifyOwner }) {
  if (!open || !booking) return null

  const isSelfDrive = booking.tripType === 'Self Drive'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">Booking Submitted</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">Payment screenshot uploaded successfully</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your booking is saved and awaiting verification. Notify the owner on WhatsApp to speed up confirmation.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Booking ID:</span> {booking._id || '-'}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Name:</span> {booking.name || '-'}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Phone:</span> {booking.phone || '-'}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Trip Type:</span> {booking.tripType || '-'}
          </p>
          {isSelfDrive ? (
            <p className="mt-1">
              <span className="font-semibold text-slate-900">Hours/KM:</span> {booking.selfDriveHours || '-'} /{' '}
              {booking.selfDriveKm || '-'}
            </p>
          ) : (
            <p className="mt-1">
              <span className="font-semibold text-slate-900">Drop/KM:</span> {booking.dropLocation || '-'} /{' '}
              {booking.outstationKm || booking.billedKm || '-'}
            </p>
          )}
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Date & Time:</span> {booking.date || '-'} {booking.time || '-'}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Amount:</span> {booking.finalAmount ? `Rs ${booking.finalAmount}` : '-'}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onNotifyOwner}
            className="w-full rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb85a]"
          >
            Notify Owner
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPopup
