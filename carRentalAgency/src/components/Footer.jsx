function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-soft">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-2xl">SSRK TRAVELS AND SELF DRIVE CARS</h3>
          <p className="mt-3 text-sm text-slate-600">
            Premium and clean self-drive and outstation car rentals with transparent pricing.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-700">Proprietor: SSRK BROTHERS</p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Contact</h4>
          <p className="mt-3 text-sm text-slate-700">Cell: +91 8247253417</p>
          <p className="text-sm text-slate-700">Cell: +91 9533732579</p>
          <p className="text-sm text-slate-700">Main Road, Khanapur, Narsampet-506132</p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Hours</h4>
          <p className="mt-3 text-sm text-slate-700">Mon - Sat: 7:00 AM to 10:00 PM</p>
          <p className="text-sm text-slate-700">Sunday: 8:00 AM to 8:00 PM</p>
        </div>
      </div>
      <p className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        Copyright {new Date().getFullYear()} SSRK TRAVELS AND SELF DRIVE CARS. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
