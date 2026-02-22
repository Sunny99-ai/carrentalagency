function PricingCard({ title, fiveSeaterPrice, sevenSeaterPrice, details, onBook }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium transition hover:-translate-y-1">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <div className="mt-4 space-y-1">
        <p className="text-lg font-bold text-slate-700">5 Seater: {fiveSeaterPrice}</p>
        <p className="text-lg font-bold text-accent">7 Seater: {sevenSeaterPrice}</p>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        {details.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {onBook ? (
        <button
          type="button"
          onClick={onBook}
          className="mt-6 rounded-full bg-ink px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Book
        </button>
      ) : null}
    </article>
  )
}

export default PricingCard
