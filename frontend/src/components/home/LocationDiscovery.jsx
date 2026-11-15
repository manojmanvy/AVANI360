import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Button from '../ui/Button.jsx'
import { popularDistricts } from '../../data/districts.js'
import { useListings } from '../../context/ListingsContext.jsx'

export default function LocationDiscovery() {
  const { approvedListings } = useListings()

  return (
    <section className="bg-gradient-to-b from-sage-50 via-beige-50 to-cream py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Discover Tamil Nadu"
          title="Explore by district, not just by city"
          description="From metro corridors to the southern districts, start where you want to live, build or invest."
          actions={
            <Button to="/properties" variant="outline" size="md" className="hidden sm:inline-flex">
              All districts <ArrowRight size={16} />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularDistricts.map((district) => {
            const count = approvedListings.filter((property) => property.district === district.name).length

            return (
              <Link
                key={district.name}
                to={`/properties?district=${encodeURIComponent(district.name)}`}
                className={`group relative flex min-h-[10.5rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${district.gradient} p-5 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}
              >
                <span
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/15 bg-white/10 transition-transform duration-500 group-hover:scale-125"
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <MapPin size={17} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
                <div className="relative mt-6">
                  <h3 className="text-lg font-bold">{district.name}</h3>
                  <p className="mt-0.5 text-xs text-white/70">{district.tagline}</p>
                  <p className="mt-3 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                    {count} {count === 1 ? 'listing' : 'listings'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-sage-200 bg-white/80 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-navy-600">
            Looking in a different district? Explore live listings from all 38 Tamil Nadu districts.
          </p>
          <Button to="/properties" variant="navy" size="sm">
            Browse properties <ArrowRight size={15} />
          </Button>
        </div>
      </Container>
    </section>
  )
}
