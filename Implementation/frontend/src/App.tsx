import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { About } from './pages/About'
import { Catalogue } from './pages/Catalogue'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Imprint } from './pages/Imprint'
import { NewsletterConfirm } from './pages/NewsletterConfirm'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Admin — isolated layout (no navbar / footer / cookie banner) */}
      <Route path="admin" element={<AdminLogin />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />

      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="newsletter/confirm" element={<NewsletterConfirm />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="imprint" element={<Imprint />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
