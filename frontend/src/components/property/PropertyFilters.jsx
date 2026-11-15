import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { budgetOptions, propertyTypes, tamilNaduDistricts } from '../../data/districts.js'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

export default function PropertyFilters({ filters, onChange, onClear, resultCount, totalCount }) {
  const [open, setOpen] = useState(false)
  const activeCount = [filters.q, filters.district, filters.type, filters.maxPrice].filter(Boolean).length

  return (
    <div className="lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-2xl border border-navy-200 bg-white px-4 py-3.5 text-sm font-bold text-navy-900 shadow-soft lg:hidden"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-leaf-600" />
          Filters
          {activeCount > 0 ? (
            <span className="rounded-full bg-leaf-600 px-2 py-0.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          ) : null}
        </span>
        <span className="text-xs font-semibold text-navy-500">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>

      <div
        className={`${open ? 'mt-3 block' : 'hidden'} rounded-3xl border border-navy-100 bg-white p-5 shadow-soft lg:mt-0 lg:block`}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-navy-900">
            <SlidersHorizontal size={17} className="text-leaf-600" /> Refine search
          </h2>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-navy-500 transition-colors hover:text-rose-600"
          >
            <X size={13} /> Clear
          </button>
        </div>

        <p className="mt-1 text-xs text-navy-400">
          Showing {resultCount} of {totalCount} listings
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="filter-q" className={labelClass}>
              Keyword
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
              />
              <input
                id="filter-q"
                type="search"
                value={filters.q}
                onChange={(event) => onChange('q', event.target.value)}
                placeholder="Locality or project name"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="filter-district" className={labelClass}>
              District
            </label>
            <select
              id="filter-district"
              value={filters.district}
              onChange={(event) => onChange('district', event.target.value)}
              className={fieldClass}
            >
              <option value="">All districts</option>
              {tamilNaduDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-type" className={labelClass}>
              Property type
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(event) => onChange('type', event.target.value)}
              className={fieldClass}
            >
              <option value="">All types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-budget" className={labelClass}>
              Budget
            </label>
            <select
              id="filter-budget"
              value={filters.maxPrice}
              onChange={(event) => onChange('maxPrice', event.target.value)}
              className={fieldClass}
            >
              {budgetOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-sort" className={labelClass}>
              Sort by
            </label>
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={(event) => onChange('sort', event.target.value)}
              className={fieldClass}
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="area-desc">Largest area</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
