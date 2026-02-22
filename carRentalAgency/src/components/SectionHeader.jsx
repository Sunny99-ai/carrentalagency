function SectionHeader({ overline, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl pt-6 text-center sm:pt-8">
      {overline ? (
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{overline}</p>
      ) : null}
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-lg text-slate-600">{description}</p> : null}
    </div>
  )
}

export default SectionHeader
