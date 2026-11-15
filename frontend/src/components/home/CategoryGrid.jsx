import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2, Home, Map, Sprout, Store, Trees } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import { categories } from '../../data/districts.js'
import { useListings } from '../../context/ListingsContext.jsx'

const icons = { Map, Building2, Home, Sprout, Store, Trees }

const tones = [
  {
    icon: 'bg-leaf-100 text-leaf-700 group-hover:bg-leaf-600 group-hover:text-white',
    bar: 'from-leaf-400 to-leaf-600',
    badge: 'text-leaf-700',
  },
  {
    icon: 'bg-sage-200 text-sage-800 group-hover:bg-sage-700 group-hover:text-white',
    bar: 'from-sage-300 to-sage-600',
    badge: 'text-sage-700',
  },
  {
    icon: 'bg-beige-200 text-beige-700 group-hover:bg-beige-500 group-hover:text-white',
    bar: 'from-beige-300 to-beige-500',
    badge: 'text-beige-700',
  },
]

export default function CategoryGrid() {
  const { approvedListings } = useListings()

  return (
    <section className="bg-clay py-16 sm:py-20 border-b border-sage-200/60">
      <Container>
        <SectionHeading
          eyebrow="Browse by category"
          title="Start with the kind of property you need"
          description="From build-ready residential plots to managed farm land, explore live listings across Tamil Nadu."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = icons[category.icon]
            const count = approvedListings.filter((property) => property.type === category.type).length
            const tone = tones[index % tones.length]

            return (
              <Link
                key={category.label}
                to={`/properties?type=${encodeURIComponent(category.type)}`}
                className="group relative overflow-hidden rounded-3xl border border-sage-200/90 bg-white/90 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-card"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.bar} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${tone.icon}`}
                  >
                    <Icon size={22} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-sage-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-leaf-600"
                  />
                </div>
                <h3 className="mt-5 text-base font-bold text-navy-950">{category.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{category.blurb}</p>
                <p className={`mt-4 text-xs font-bold ${tone.badge}`}>
                  {count} {count === 1 ? 'listing' : 'listings'}
                </p>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
