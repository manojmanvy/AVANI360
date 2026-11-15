import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Store } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const sellerRoles = ['seller', 'builder']

export default function SellerRoute() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!sellerRoles.includes(user?.role)) {
    return (
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-lg rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-card">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-beige-100 text-navy-700">
              <Store size={26} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-navy-950">Seller account needed</h1>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">
              Your current account is registered as a <strong>{user?.roleLabel || user?.role}</strong>. To list land,
              create an owner, broker or builder account and login with it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/register?role=owner" size="md">
                Create seller account
              </Button>
              <Button to="/account" variant="outline" size="md">
                My account
              </Button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return <Outlet />
}
