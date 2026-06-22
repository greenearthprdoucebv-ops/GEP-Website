import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import Navbar from '../components/Navbar'
import CookieBanner from '../components/CookieBanner'

export function RootLayout() {
  return (
    <div className="site-root">
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner privacyPolicyUrl="/privacy-policy" />
    </div>
  )
}