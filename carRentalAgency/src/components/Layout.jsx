import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import WhatsAppButton from './WhatsAppButton'

function Layout() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="pt-44 sm:pt-48 lg:pt-52">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout
