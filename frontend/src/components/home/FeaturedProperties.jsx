import { ArrowRight, Building2 } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Button from '../ui/Button.jsx'
import PropertyGrid from '../property/PropertyGrid.jsx'
import { useListings } from '../../context/ListingsContext.jsx'

export default function FeaturedProperties() {
  const { approvedListings } = useListings()
  const featured = approvedListings.slice(0, 6)

  return (
    <section className="bg-gradient-to-b from-cream via-cream to-sage-50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Latest properties"
          title="Freshly approved listings"
          description="Every property here has been reviewed by our team. Browse live land and property listings from verified sellers."
          actions={
            <Button to="/properties" variant="outline" size="md" className="hidden sm:inline-flex">
              View all properties <ArrowRight size={16} />
            </Button>
          }
        />

        <div className="mt-8">
          {featured.length > 0 ? (
            <PropertyGrid properties={featured} />
          ) : (
            <div className="rounded-3xl border border-dashed border-sage-300 bg-white/80 px-6 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
                <Building2 size={26} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy-900">No live listings yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-navy-500">
                Approved seller listings will appear here. If you have land to sell, list it and our
                team will review it.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button to="/list-property" size="md">
                  List your property
                </Button>
                <Button to="/properties" variant="outline" size="md">
                  Browse properties
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 sm:hidden">
          <Button to="/properties" variant="outline" size="md" className="w-full">
            View all properties <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  )
}
