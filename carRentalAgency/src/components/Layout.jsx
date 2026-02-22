import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import WhatsAppButton from './WhatsAppButton'

function Layout() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout
