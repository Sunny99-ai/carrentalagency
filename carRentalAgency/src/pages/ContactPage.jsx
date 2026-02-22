import Seo from '../components/Seo'
import SectionHeader from '../components/SectionHeader'

function ContactPage() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Seo
        title="Contact SSRK TRAVELS AND SELF DRIVE CARS"
        description="Get in touch for self-drive and outstation booking support."
      />
      <div className="mx-auto w-full max-w-4xl">
        <SectionHeader
          overline="Contact"
          title="Talk to our booking desk."
          description="For quick support, call or message us directly."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-premium">
          <h2 className="font-display text-3xl text-ink">Reach Us</h2>
          <p className="mt-4 text-slate-600">Cell: +91 8247253417</p>
          <p className="text-slate-600">Cell: +91 9533732579</p>
          <p className="text-slate-600">Address: Main Road, Khanapur, Narsampet-506132</p>
          <p className="text-slate-600">Proprietor: SSRK BROTHERS</p>
          <p className="mt-6 text-sm text-slate-500">
            Response window: 7:00 AM to 10:00 PM (Mon-Sat)
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
