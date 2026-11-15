import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileText,
  Heart,
  MapPin,
  Route,
  Ruler,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PropertyCard from '../components/property/PropertyCard.jsx'
import EnquiryForm from '../components/enquiry/EnquiryForm.jsx'
import { formatArea, formatPrice, postedLabel } from '../utils/format.js'

export default function PropertyDetailsPage() {
  const { propertyId } = useParams()
  const { getListingById, approvedListings, loading } = useListings()
  const listing = getListingById(propertyId)
  const property = listing && listing.status === 'Approved' ? listing : null
  const { isFavorite, toggleFavorite } = useFavorites()
  const [activeImage, setActiveImage] = useState(0)
  const [enquirySheetOpen, setEnquirySheetOpen] = useState(false)

  usePageTitle(property ? property.title : 'Property not found')

  useEffect(() => {
    setActiveImage(0)
  }, [propertyId])

  if (loading.public && !property) {
    return (
      <Container className="py-20">
        <p className="text-center text-sm text-navy-500">Loading property…</p>
      </Container>
    )
  }

  if (!property) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Property not found"
          description="This listing does not exist, is still under review, or may have been removed."
          action={
            <Button to="/properties" variant="navy" size="md">
              Browse properties
            </Button>
          }
        />
      </Container>
    )
  }

  const saved = isFavorite(property.id)
  const related = approvedListings
    .filter(
      (item) =>
        item.id !== property.id &&
        (item.district === property.district || item.type === property.type),
    )
    .slice(0, 3)

  const pricePerUnit =
    property.areaUnit === 'sq.ft.'
      ? `₹${Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft.`
      : property.areaUnit === 'acres'
        ? `₹${(property.price / property.area / 100000).toFixed(1)} L/acre`
        : null

  const facts = [
    { icon: Ruler, label: 'Area', value: formatArea(property.area, property.areaUnit) },
    { icon: Route, label: 'Dimensions', value: property.dimensions || '—' },
    { icon: Compass, label: 'Facing', value: property.facing ? `${property.facing} facing` : '—' },
    { icon: FileText, label: 'Ownership', value: property.ownership || '—' },
  ]

  return (
    <section className="bg-white pb-40 pt-8 sm:pt-10 lg:pb-16">
      <Container>
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-navy-400" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-navy-700">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/properties" className="transition-colors hover:text-navy-700">
            Properties
          </Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[16rem] truncate text-navy-700">{property.title}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-3xl border border-navy-100 bg-navy-50">
              <img
                src={property.images[activeImage]}
                alt={`${property.title} preview ${activeImage + 1}`}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {property.images.map((image, index) => (
                <button
                  key={`${property.id}-image-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === index
                      ? 'border-leaf-500 ring-2 ring-leaf-100'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img
                    src={image}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="navy">{property.type}</Badge>
                {property.featured ? (
                  <Badge variant="amber">
                    <Star size={12} className="fill-current" /> Featured
                  </Badge>
                ) : null}
                <Badge variant="green">
                  <ShieldCheck size={12} /> Document check workflow
                </Badge>
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-balance text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                    {property.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-navy-500">
                    <MapPin size={15} className="text-leaf-600" />
                    {property.locality}, {property.city}, {property.district}
                  </p>
                  <p className="mt-1 text-xs text-navy-400">{postedLabel(property)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(property.id)}
                  className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    saved
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-navy-200 text-navy-700 hover:border-navy-900'
                  }`}
                  aria-pressed={saved}
                >
                  <Heart size={16} className={saved ? 'fill-current' : ''} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="text-3xl font-extrabold tracking-tight text-navy-950">
                  {formatPrice(property.price)}
                </p>
                {pricePerUnit ? <p className="pb-1 text-sm text-navy-500">{pricePerUnit}</p> : null}
                <span className="mb-1 rounded-full bg-leaf-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-leaf-700 ring-1 ring-inset ring-leaf-200">
                  Verified listing
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-navy-400">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-navy-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-navy-950">About this property</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy-600 sm:text-base">
                {property.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-700 ring-1 ring-inset ring-leaf-100"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-navy-950">Amenities & features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm text-navy-700"
                  >
                    <CheckCircle2 size={16} className="flex-shrink-0 text-leaf-600" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-navy-950">Available documents</h2>
              <p className="mt-1 text-sm text-navy-500">
                Documents listed by the seller. Availability is verified by our team before
                registration.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.documents.map((document) => (
                  <li
                    key={document}
                    className="flex items-center gap-2.5 rounded-xl bg-navy-50/70 px-4 py-3 text-sm font-medium text-navy-700"
                  >
                    <FileText size={16} className="flex-shrink-0 text-navy-500" />
                    {document}
                  </li>
                ))}
              </ul>
            </div>

            <div id="location" className="mt-10 scroll-mt-24 rounded-3xl border border-navy-100 bg-cream p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-leaf-600 shadow-sm">
                  <MapPin size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Location</h2>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    This property is located in <strong>{property.locality}</strong>, {property.city},{' '}
                    {property.district}. Exact boundaries, approach roads and nearby facilities are
                    confirmed with our team during a site visit.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {property.mapLink ? (
                  <a
                    href={property.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    <ExternalLink size={16} /> View on Google Maps
                  </a>
                ) : (
                  <p className="text-xs text-navy-400">Map location not provided by the seller.</p>
                )}
                <a
                  href="#enquiry"
                  className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
                >
                  <ShieldCheck size={16} /> Request a site visit
                </a>
              </div>
            </div>
          </div>

          <aside id="enquiry" className="scroll-mt-24 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy-400">Asking price</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-navy-950">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <Badge variant="green">
                  <UserRound size={12} /> {property.sellerType}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-navy-50/70 px-3.5 py-3 text-xs text-navy-600">
                <ShieldCheck size={16} className="flex-shrink-0 text-leaf-600" />
                Listed by a {property.sellerType.toLowerCase()} · Approved by BookMyLand
              </div>

              <div className="my-5 h-px bg-navy-100" />

              <h2 className="text-base font-extrabold text-navy-950">Enquire about this property</h2>
              <p className="mb-5 mt-1 text-xs leading-relaxed text-navy-500">
                Share your details and our team will help with availability, documents and site
                visits.
              </p>

              <EnquiryForm property={property} />
            </div>

            <Button to="/properties" variant="outline" size="md" className="mt-4 w-full">
              <ArrowLeft size={15} /> Back to all properties
            </Button>
          </aside>
        </div>

        {related.length > 0 ? (
          <div className="mt-16 border-t border-navy-100 pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-navy-950">
                  Similar properties
                </h2>
                <p className="mt-1 text-sm text-navy-500">
                  More options in the same district or of the same property type.
                </p>
              </div>
              <Link
                to="/properties"
                className="hidden text-sm font-bold text-leaf-700 underline-offset-4 hover:underline sm:block"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Mobile Sticky Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 flex items-center justify-between border-t border-navy-100 bg-white/95 px-4 py-3 shadow-float backdrop-blur-md lg:hidden">
          <div>
            <p className="text-[10px] font-bold uppercase text-navy-400">Total Price</p>
            <p className="text-lg font-black text-navy-950">{formatPrice(property.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => setEnquirySheetOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-soft transition-all active:scale-95"
          >
            <ShieldCheck size={16} />
            <span>Enquire / Site Visit</span>
          </button>
        </div>

        {/* Slide-Up Mobile Enquiry Sheet */}
        {enquirySheetOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-sage-950/60 p-0 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEnquirySheetOpen(false)
            }}
          >
            <div
              className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2.25rem] bg-white shadow-2xl animate-slide-up"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="h-1.5 w-12 rounded-full bg-navy-200" />
              </div>

              <div className="flex items-center justify-between border-b border-navy-100 px-5 py-3.5">
                <div>
                  <h2 className="text-base font-extrabold text-navy-950">Book Site Visit & Enquiry</h2>
                  <p className="text-xs text-navy-500 line-clamp-1 max-w-[260px]">{property.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnquirySheetOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-600 hover:bg-rose-50 hover:text-rose-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <EnquiryForm property={property} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
