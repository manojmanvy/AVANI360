import { Link, useLocation } from 'react-router-dom'
import { Heart, Home, PlusCircle, Search, User } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function BottomNav() {
  const location = useLocation()
  const { favoriteIds } = useFavorites()
  const { isAuthenticated, user } = useAuth()
  const isSeller = ['seller', 'builder'].includes(user?.role)
  const postTarget = isSeller ? '/seller?new=true' : '/list-property'

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-sage-200/90 bg-cream/95 px-2 backdrop-blur-md lg:hidden"
      aria-label="Mobile Navigation"
    >
      <Link
        to="/"
        className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-semibold transition-colors ${
          isActive('/') ? 'text-leaf-600' : 'text-navy-500 hover:text-navy-900'
        }`}
      >
        <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span>Home</span>
      </Link>

      <Link
        to="/properties"
        className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-semibold transition-colors ${
          isActive('/properties') ? 'text-leaf-600' : 'text-navy-500 hover:text-navy-900'
        }`}
      >
        <Search size={20} strokeWidth={isActive('/properties') ? 2.5 : 2} />
        <span>Explore</span>
      </Link>

      {/* Post Property Center CTA */}
      <Link
        to={postTarget}
        className="group relative -top-3 flex flex-col items-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-leaf-700 to-leaf-500 text-white shadow-card transition-transform group-active:scale-95">
          <PlusCircle size={24} strokeWidth={2.5} />
        </div>
        <span className="mt-1 text-[11px] font-bold text-navy-800">
          Sell Land
        </span>
        <span className="absolute -top-1 -right-1 rounded-full bg-beige-300 px-1.5 py-0.2 text-[9px] font-extrabold uppercase text-navy-950 shadow-sm">
          Free
        </span>
      </Link>

      <Link
        to="/favorites"
        className={`relative flex flex-col items-center justify-center gap-1 py-1 text-xs font-semibold transition-colors ${
          isActive('/favorites') ? 'text-leaf-600' : 'text-navy-500 hover:text-navy-900'
        }`}
      >
        <div className="relative">
          <Heart size={20} strokeWidth={isActive('/favorites') ? 2.5 : 2} />
          {favoriteIds.length > 0 ? (
            <span className="absolute -top-1 -right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {favoriteIds.length}
            </span>
          ) : null}
        </div>
        <span>Saved</span>
      </Link>

      <Link
        to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
        className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-semibold transition-colors ${
          isActive('/account') || isActive('/admin') || isActive('/login')
            ? 'text-leaf-600'
            : 'text-navy-500 hover:text-navy-900'
        }`}
      >
        <User size={20} strokeWidth={isActive('/account') || isActive('/login') ? 2.5 : 2} />
        <span>{isAuthenticated ? 'Account' : 'Login'}</span>
      </Link>
    </nav>
  )
}

