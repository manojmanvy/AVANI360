import { Trash2 } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PropertyCard from '../components/property/PropertyCard.jsx'

export default function FavoritesPage() {
  usePageTitle('Saved properties')
  const { favoriteIds, removeFavorite } = useFavorites()
  const { getListingById, loading } = useListings()

  const savedProperties = favoriteIds
    .map((id) => getListingById(id))
    .filter((property) => property && property.status === 'Approved')

  return (
    <section className="bg-cream">
      <div className="border-b border-sage-200 bg-gradient-to-br from-cream via-beige-100 to-sage-100">
        <Container className="py-10 sm:py-14">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Saved properties
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 sm:text-base">
            Keep the properties you like in one place. Your shortlist is stored on this device and
            only live, approved listings are shown here.
          </p>
        </Container>
      </div>

      <Container className="py-10 sm:py-14">
        {loading.public && favoriteIds.length > 0 ? (
          <p className="py-14 text-center text-sm text-navy-500">Loading saved properties…</p>
        ) : savedProperties.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-navy-600">
                {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => favoriteIds.forEach((id) => removeFavorite(id))}
              >
                <Trash2 size={15} /> Clear all
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No saved properties yet"
            description="Tap the heart icon on any property card to build your shortlist. Saved properties stay on this device."
            action={
              <Button to="/properties" variant="navy" size="md">
                Explore properties
              </Button>
            }
          />
        )}
      </Container>
    </section>
  )
}
