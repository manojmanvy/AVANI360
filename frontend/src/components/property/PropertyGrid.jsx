import PropertyCard from './PropertyCard.jsx'

export default function PropertyGrid({ properties }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
