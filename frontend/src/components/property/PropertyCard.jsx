import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  Compass,
  FileCheck2,
  Heart,
  MapPin,
  Ruler,
  ShieldCheck,
  Star,
} from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatArea, formatPrice, formatUnitPrice, postedLabel } from '../../utils/format.js'
import { useFavorites } from '../../context/FavoritesContext.jsx'

export default function PropertyCard({ property }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(property.id)
  const detailPath = `/properties/${property.id}`
  const unitPrice = formatUnitPrice(property.price, property.area, property.areaUnit)
  const imageCount = property.images?.length || 1

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-sage-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-card">
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-leaf-400 via-beige-300 to-sage-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      {/* Property Image Showcase */}
      <div className="relative overflow-hidden bg-sage-100">
        <Link to={detailPath} className="block" aria-label={`View ${property.title}`}>
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'}
            alt={property.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-sage-950/60 via-transparent to-transparent" />
        </Link>

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-navy-900 shadow-sm backdrop-blur">
            {property.type}
          </span>
          {property.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-beige-300 px-2.5 py-1 text-[11px] font-black uppercase text-navy-950 shadow-sm">
              <Star size={11} className="fill-current" /> Featured
            </span>
          ) : null}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(property.id)}
          aria-label={saved ? 'Remove from saved properties' : 'Save property'}
          aria-pressed={saved}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-white text-rose-500 shadow-sm scale-110'
              : 'bg-sage-950/40 text-white hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart size={16} className={saved ? 'fill-current' : ''} />
        </button>

        {/* Bottom Badges on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-leaf-600/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur">
            <ShieldCheck size={13} /> Verified
          </span>

          {imageCount > 1 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sage-950/70 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
              <Camera size={12} /> {imageCount} Photos
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Price & Unit Rate (99acres style) */}
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-2xl font-black tracking-tight text-navy-950">
              {formatPrice(property.price)}
            </span>
            {unitPrice && (
              <span className="ml-2 text-xs font-semibold text-leaf-700">
                ({unitPrice})
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-navy-700">
            {formatArea(property.area, property.areaUnit)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 line-clamp-1 text-base font-bold text-navy-900 transition-colors group-hover:text-leaf-600">
          <Link to={detailPath}>{property.title}</Link>
        </h3>

        {/* Location */}
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-navy-500">
          <MapPin size={13} className="text-leaf-600 flex-shrink-0" />
          <span className="truncate">
            {property.locality ? `${property.locality}, ` : ''}{property.district}
          </span>
        </p>

        {/* Key Specification Tags (Dimensions, Facing, Ownership) */}
        <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] font-semibold text-navy-700">
          {property.dimensions && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-sage-200/80 bg-sage-100/70 px-2 py-1 text-sage-900">
              <Ruler size={12} className="text-sage-600" />
              {property.dimensions}
            </span>
          )}
          {property.facing && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-sage-200/80 bg-sage-100/70 px-2 py-1 text-sage-900">
              <Compass size={12} className="text-sage-600" />
              {property.facing} Facing
            </span>
          )}
          {property.ownership && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-leaf-200 bg-leaf-50 px-2 py-1 text-leaf-800">
              <FileCheck2 size={12} className="text-leaf-600" />
              {property.ownership}
            </span>
          )}
        </div>

        {/* Card Footer Action (99acres style) */}
        <div className="mt-5 flex items-center justify-between border-t border-sage-100 pt-3.5">
          <span className="text-[11px] font-medium text-navy-400">
            {postedLabel(property)}
          </span>

          <Link
            to={detailPath}
            className="inline-flex items-center gap-1 rounded-xl bg-sage-100 px-3 py-1.5 text-xs font-extrabold text-navy-900 transition-colors group-hover:bg-leaf-600 group-hover:text-white"
          >
            <span>View & Contact</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  )
}
