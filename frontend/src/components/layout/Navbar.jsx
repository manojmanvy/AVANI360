import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  Heart,
  Landmark,
  LogOut,
  MapPin,
  Menu,
  PlusCircle,
  ShieldCheck,
  Trees,
  UserRound,
  Warehouse,
  X,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

const topCities = [
  'All Tamil Nadu',
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tiruppur',
  'Erode',
  'Tirunelveli',
  'Hosur',
  'Vellore',
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('All Tamil Nadu')
  const [cityDropdown, setCityDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { favoriteIds } = useFavorites()
  const { user, isAuthenticated, logout } = useAuth()
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth()

  const firstName = user?.fullName?.split(' ')[0]
  const isSeller = ['seller', 'builder'].includes(user?.role)
  const listTarget = isSeller ? '/seller?new=true' : '/list-property'

  useEffect(() => {
    setOpen(false)
    setCityDropdown(false)
  }, [location.pathname, location.hash])

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setCityDropdown(false)
    if (city === 'All Tamil Nadu') {
      navigate('/properties')
    } else {
      navigate(`/properties?district=${encodeURIComponent(city)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sage-200/80 bg-cream/90 backdrop-blur-md">
      {/* Top micro bar for Trust & Schemes */}
      <div className="hidden border-b border-white/10 bg-forest py-1.5 text-xs text-white/80 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-leaf-400">
              <ShieldCheck size={13} /> 100% Verified Tamil Nadu Land Portal
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-white/70">
              Greenyas Consultancy Services
            </span>
            <span className="text-white/30">•</span>
            <Link
              to="/#schemes"
              className="flex items-center gap-1 text-[11px] font-medium text-white/70 transition-colors hover:text-white"
            >
              <Landmark size={12} className="text-beige-300" /> Free TN Housing Schemes Guidance
            </Link>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            {isAdminAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-bold text-beige-300 hover:text-beige-200"
              >
                <ShieldCheck size={13} /> Admin Console
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-white/50 transition-colors hover:text-white/80"
              >
                Admin Portal
              </Link>
            )}
            <span className="text-white/30">•</span>
            <span className="text-white/60">Toll-free Help: 1800-BML-LAND</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Logo />

          {/* 99acres-style City Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setCityDropdown((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-sage-300 bg-sage-100/70 px-3.5 py-1.5 text-xs font-bold text-navy-800 transition-colors hover:border-leaf-500 hover:bg-white"
            >
              <MapPin size={13} className="text-leaf-600" />
              <span>{selectedCity}</span>
              <ChevronDown size={13} className="text-navy-400" />
            </button>

            {cityDropdown ? (
              <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-sage-200 bg-[#fdfcfa] p-2 shadow-card z-50">
                <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">
                  Select District / City
                </p>
                <div className="max-h-64 overflow-y-auto">
                  {topCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        selectedCity === city
                          ? 'bg-leaf-50 text-leaf-700'
                          : 'text-navy-700 hover:bg-sage-100/60'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-leaf-600" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-leaf-600' : 'text-navy-700 hover:text-navy-950'
              }`
            }
          >
            All Properties
          </NavLink>
          <Link
            to="/properties?type=Residential+Plot"
            className="text-sm font-semibold text-navy-700 transition-colors hover:text-navy-950"
          >
            Plots & Layouts
          </Link>
          <Link
            to="/properties?type=Agricultural+Land"
            className="text-sm font-semibold text-navy-700 transition-colors hover:text-navy-950"
          >
            Agri & Farm
          </Link>
          <Link
            to="/properties?type=Commercial+Plot"
            className="text-sm font-semibold text-navy-700 transition-colors hover:text-navy-950"
          >
            Commercial
          </Link>
          <Link
            to="/#schemes"
            className="text-sm font-semibold text-navy-700 transition-colors hover:text-navy-950"
          >
            Govt Schemes
          </Link>
        </nav>

        {/* Right Action Bar (Post Property, Favorites, Login) */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
            aria-label="Saved properties"
          >
            <Heart size={20} />
            {favoriteIds.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {favoriteIds.length}
              </span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/account'}
                className="flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3.5 py-2 text-xs font-bold text-navy-800 transition-colors hover:bg-navy-100"
              >
                <UserRound size={14} className="text-leaf-600" />
                <span>{firstName}</span>
                {user?.role === 'admin' && (
                  <span className="ml-1 rounded bg-navy-800 px-1 py-0.2 text-[9px] text-white">
                    Admin
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950"
            >
              Sign In
            </Link>
          )}

          {/* 99acres-style Prominent "Post Property FREE" Button */}
          <Link
            to={listTarget}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-soft transition-all duration-300 hover:shadow-card hover:brightness-105 active:scale-95"
          >
            <PlusCircle size={15} strokeWidth={2.5} />
            <span>Post Property</span>
            <span className="rounded-full bg-beige-300 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-navy-950 shadow-sm animate-pulse">
              FREE
            </span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to={listTarget}
            className="flex items-center gap-1 rounded-full bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm lg:hidden"
          >
            <span>Post</span>
            <span className="rounded bg-beige-300 px-1 py-0.2 text-[9px] text-navy-950 font-black">
              FREE
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 text-navy-800 transition-colors hover:bg-navy-50"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <div id="mobile-menu" className="border-t border-sage-200 bg-cream px-4 py-5 shadow-xl xl:hidden">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
              Filter by District
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-navy-100 pt-3">
            <Link
              to="/properties"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Browse All Properties
            </Link>
            <Link
              to="/properties?type=Residential+Plot"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Residential Plots & Layouts
            </Link>
            <Link
              to="/properties?type=Agricultural+Land"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Agricultural & Farm Land
            </Link>
            <Link
              to="/properties?type=Commercial+Plot"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Commercial Lands
            </Link>
            <Link
              to="/#schemes"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              TN Government Schemes
            </Link>
          </div>

          <div className="mt-4 border-t border-navy-100 pt-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-navy-900">{user?.fullName}</p>
                  <p className="text-xs text-navy-500">{user?.role?.toUpperCase()}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-xl border border-navy-200 py-2.5 text-center text-xs font-bold text-navy-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center rounded-xl bg-leaf-600 py-2.5 text-center text-xs font-bold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
