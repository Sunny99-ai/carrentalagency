function WhatsAppButton() {
  const phone = '918247253417'
  const prefilled = encodeURIComponent('Hello, I would like to book a car rental.')
  const link = `https://wa.me/${phone}?text=${prefilled}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-premium transition hover:scale-105 hover:bg-[#20bf5d]"
    >
      WhatsApp
    </a>
  )
}

export default WhatsAppButton
