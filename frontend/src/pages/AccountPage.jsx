import { useNavigate } from 'react-router-dom'
import { Heart, LogOut, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function AccountPage() {
  usePageTitle('My account')
  const { user, logout } = useAuth()
  const { favoriteIds } = useFavorites()
  const navigate = useNavigate()

  const initials = (user?.fullName || 'B M')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <section className="bg-cream py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-[2rem] border border-sage-200 bg-white shadow-card">
            <div className="flex flex-col gap-5 border-b border-sage-200 bg-forest p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-600 text-xl font-extrabold">
                  {initials}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-leaf-300">My account</p>
                  <h1 className="text-2xl font-extrabold">{user?.fullName}</h1>
                  <p className="text-sm text-white/60">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
              <div>
                <h2 className="text-base font-extrabold text-navy-950">Profile details</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <UserRound size={17} className="mt-0.5 text-navy-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">Role</dt>
                      <dd className="font-semibold text-navy-900">
                        <Badge variant="green">{user?.roleLabel || user?.role}</Badge>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={17} className="mt-0.5 text-navy-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">Email</dt>
                      <dd className="font-semibold text-navy-900">{user?.email}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={17} className="mt-0.5 text-navy-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">Mobile</dt>
                      <dd className="font-semibold text-navy-900">{user?.phone || 'â€”'}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={17} className="mt-0.5 text-navy-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">District</dt>
                      <dd className="font-semibold text-navy-900">{user?.district || 'Not set'}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-navy-100 bg-cream p-5">
                  <div className="flex items-center gap-2 text-navy-900">
                    <Heart size={18} className="text-leaf-600" />
                    <p className="text-sm font-bold">Saved properties</p>
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-navy-950">{favoriteIds.length}</p>
                  <p className="text-xs text-navy-500">Shortlisted on this device</p>
                  <Button to="/favorites" variant="outline" size="sm" className="mt-3">
                    View saved
                  </Button>
                </div>

                <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-5 text-xs leading-relaxed text-leaf-800">
                  <p className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={14} /> Secured account
                  </p>
                  <p className="mt-1">
                    Your profile and session are stored securely on the AVANI360 server. Saved
                    properties remain on this device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
