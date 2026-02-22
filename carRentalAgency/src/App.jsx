import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import OutstationPage from './pages/OutstationPage'
import PaymentPage from './pages/PaymentPage'
import SelfDrivePage from './pages/SelfDrivePage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="self-drive-pricing" element={<SelfDrivePage />} />
        <Route path="outstation-rentals" element={<OutstationPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
