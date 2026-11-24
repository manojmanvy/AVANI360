import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PropertyFilters from '../components/property/PropertyFilters.jsx'
import PropertyGrid from '../components/property/PropertyGrid.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import { budgetOptions } from '../data/districts.js'

export default function PropertiesPage() {
  usePageTitle('Properties in Tamil Nadu')

  const { approvedListings, loading, error } = useListings()
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    q: searchParams.get('q') || '',
    district: searchParams.get('district') || '',
    type: searchParams.get('type') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  }

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const maxPrice = Number(filters.maxPrice) || 0

    const filtered = approvedListings.filter((property) => {
      const searchable = `${property.title} ${property.locality} ${property.city} ${property.district} ${property.type}`
      if (q && !searchable.toLowerCase().includes(q)) return false
      if (filters.district && property.district !== filters.district) return false
      if (filters.type && property.type !== filters.type) return false
      if (maxPrice && property.price > maxPrice) return false
      return true
    })

    const sorted = [...filtered]
    if (filters.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (filters.sort === 'area-desc') sorted.sort((a, b) => b.area - a.area)
    else
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

    return sorted
  }, [approvedListings, filters.q, filters.district, filters.type, filters.maxPrice, filters.sort])

  const chips = []
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”` })
  if (filters.district) chips.push({ key: 'district', label: filters.district })
  if (filters.type) chips.push({ key: 'type', label: filters.type })
  if (filters.maxPrice) {
    const budget = budgetOptions.find((option) => option.value === filters.maxPrice)
    chips.push({ key: 'maxPrice', label: budget ? budget.label : 'Budget' })
  }

  return (
    <section className="bg-cream">
      <div className="relative overflow-hidden border-b border-sage-200 bg-gradient-to-br from-cream via-beige-100 to-sage-100">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden="true" />
        <Container className="relative py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-xs font-semibold text-navy-400" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-navy-700">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-navy-700">Properties</span>
          </nav>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Explore properties across Tamil Nadu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
            Filter by district, property type and budget. Every listing shown here has been reviewed
            and approved by the AVANI360 team.
          </p>
        </Container>
      </div>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside>
            <PropertyFilters
              filters={filters}
              onChange={updateFilter}
              onClear={clearFilters}
              resultCount={results.length}
              totalCount={approvedListings.length}
            />
          </aside>

          <div>
            <div className="flex flex-col gap-3 border-b border-navy-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Live listings</h2>
                <p className="mt-0.5 text-sm text-navy-500">
                  {results.length} {results.length === 1 ? 'property' : 'properties'} found
                </p>
              </div>

              {chips.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => updateFilter(chip.key, '')}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-rose-200 hover:text-rose-600"
                    >
                      {chip.label}
                      <X size={12} />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-leaf-700 underline-offset-4 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6">
              {loading.public && approvedListings.length === 0 ? (
                <p className="py-14 text-center text-sm text-navy-500">Loading properties…</p>
              ) : approvedListings.length === 0 ? (
                <EmptyState
                  title="No live listings yet"
                  description="Approved seller listings appear here. Check back soon, or list your own land to get started."
                  action={
                    <Button to="/list-property" variant="navy" size="md">
                      List your property
                    </Button>
                  }
                />
              ) : results.length > 0 ? (
                <PropertyGrid properties={results} />
              ) : (
                <EmptyState
                  title="No listings match these filters"
                  description="Try a different district, property type or budget."
                  action={
                    <Button variant="navy" size="md" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
