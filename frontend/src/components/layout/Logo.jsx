import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="BookMyLand home">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5 ${
          light
            ? 'bg-white/95 text-leaf-700'
            : 'bg-gradient-to-br from-leaf-600 via-leaf-600 to-sage-800 text-white'
        }`}
      >
        <MapPin size={20} className={light ? 'text-leaf-600' : 'text-beige-100'} strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy-950'}`}>
          BookMy<span className={light ? 'text-leaf-300' : 'text-leaf-600'}>Land</span>
        </span>
        <span
          className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
            light ? 'text-white/60' : 'text-sage-600'
          }`}
        >
          Tamil Nadu
        </span>
      </span>
    </Link>
  )
}
