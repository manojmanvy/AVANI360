import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '', variant = 'default', showSubtitle = true }) {
  if (variant === 'brand') {
    return (
      <Link to="/" className={`inline-block transition-transform duration-200 hover:scale-[1.02] ${className}`} aria-label="AVANI360 home">
        <img
          src="/brand-logo.jpg"
          alt="AVANI 360 Real Estate & Developers"
          className="h-12 w-auto object-contain rounded-lg"
        />
      </Link>
    )
  }

  return (
    <Link to="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="AVANI360 home">
      <div className="relative flex-shrink-0">
        <img
          src="/profile-logo.jpg"
          alt="AVANI360 Profile Emblem"
          className="h-11 w-11 rounded-full object-cover shadow-soft ring-2 ring-leaf-600/30 transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy-950'}`}>
          AVANI<span className={light ? 'text-amber-400' : 'text-amber-600'}>360</span>
        </span>
        {showSubtitle && (
          <span
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
              light ? 'text-white/70' : 'text-sage-700'
            }`}
          >
            Real Estate & Developers
          </span>
        )}
      </span>
    </Link>
  )
}
