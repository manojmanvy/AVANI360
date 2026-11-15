import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import ScrollManager from '../components/layout/ScrollManager.jsx'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ScrollManager />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

