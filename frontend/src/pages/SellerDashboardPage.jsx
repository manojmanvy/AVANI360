import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  Plus,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import ListingForm from '../components/seller/ListingForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import { useEnquiries } from '../context/EnquiriesContext.jsx'
import { formatArea, formatDate, formatPrice, postedLabel } from '../utils/format.js'

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Approved: 'bg-leaf-50 text-leaf-700 ring-leaf-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.Pending}`}
    >
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    green: 'bg-leaf-50 text-leaf-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  }
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={19} />
      </div>
      <p className="mt-3 text-2xl font-extrabold text-navy-950">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</p>
    </div>
  )
}

export default function SellerDashboardPage() {
  usePageTitle('Seller dashboard')
  const { user } = useAuth()
  const {
    addListing,
    updateListing,
    deleteListing,
    listingsForSeller,
    loading,
  } = useListings()
  const { countForProperty, enquiriesForSeller } = useEnquiries()

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const myListings = listingsForSeller(user?.id)
  const editingListing = editingId ? myListings.find((listing) => listing.id === editingId) : null

  const counts = {
    total: myListings.length,
    pending: myListings.filter((listing) => listing.status === 'Pending').length,
    approved: myListings.filter((listing) => listing.status === 'Approved').length,
    rejected: myListings.filter((listing) => listing.status === 'Rejected').length,
  }
  const interestCount = enquiriesForSeller(user?.id).length

  const openCreate = () => {
    setEditingId(null)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (id) => {
    setEditingId(id)
    setFormError('')
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setFormError('')
  }

  const handleSubmit = async (data) => {
    setSubmitting(true)
    setFormError('')
    const result = editingListing
      ? await updateListing(editingListing.id, data)
      : await addListing(data)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    closeForm()
  }

  const handleDelete = async (listing) => {
    const confirmed = window.confirm(
      `Delete "${listing.title}"? This removes the listing permanently.`,
    )
    if (!confirmed) return
    const result = await deleteListing(listing.id)
    if (!result.ok) {
      window.alert(result.error)
    }
  }

  return (
    <section className="min-h-screen bg-cream py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-leaf-700">Seller dashboard</p>
            <h1 className="text-xl font-extrabold text-navy-950">{user?.fullName}</h1>
            <p className="text-xs text-navy-500">
              {user?.roleLabel || user?.role} · {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-leaf-700"
          >
            <Plus size={16} /> Add new listing
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={Building2} label="My listings" value={counts.total} tone="navy" />
          <StatCard icon={Clock} label="Pending review" value={counts.pending} tone="amber" />
          <StatCard icon={CheckCircle2} label="Approved & live" value={counts.approved} tone="green" />
          <StatCard icon={XCircle} label="Rejected" value={counts.rejected} tone="rose" />
          <StatCard icon={Users} label="Buyer interests" value={interestCount} tone="navy" />
        </div>

        {formOpen ? (
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-navy-950">
                  {editingListing ? 'Edit listing' : 'Add a new land listing'}
                </h2>
                <p className="mt-1 text-xs text-navy-500">
                  Submitted listings go to the AVANI360 admin team for approval before buyers can see
                  them.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm font-semibold text-navy-500 transition-colors hover:text-navy-900"
              >
                Close
              </button>
            </div>
            {formError ? (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {formError}
              </div>
            ) : null}
            <div className="mt-6">
              <ListingForm
                key={editingId || 'new'}
                initialListing={editingListing}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                submitting={submitting}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm">
          <div className="border-b border-navy-100 p-5">
            <h2 className="text-base font-extrabold text-navy-950">My listings</h2>
            <p className="mt-1 text-xs text-navy-500">
              Buyer contact details are visible only to the AVANI360 admin team. You can see how many
              buyers are interested.
            </p>
          </div>

          {loading.mine && myListings.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-navy-500">Loading your listings…</p>
          ) : myListings.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-500">
                <Building2 size={26} />
              </span>
              <h3 className="mt-4 text-base font-bold text-navy-900">No listings yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-navy-500">
                Add your first land listing with photos, details and a Google Maps location. It will be
                reviewed by our team before going live.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-leaf-700"
              >
                <Plus size={16} /> Add listing
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-navy-100">
              {myListings.map((listing) => {
                const interests = countForProperty(listing.id)
                return (
                  <li key={listing.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-xl bg-navy-50 sm:w-36">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={listing.status} />
                        <span className="text-xs font-semibold text-navy-400">{postedLabel(listing)}</span>
                      </div>
                      <h3 className="mt-2 truncate text-base font-bold text-navy-900">{listing.title}</h3>
                      <p className="mt-0.5 text-xs text-navy-500">
                        {listing.locality}, {listing.district} · {formatArea(listing.area, listing.areaUnit)}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-navy-900">{formatPrice(listing.price)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-navy-500">
                        <span className="inline-flex items-center gap-1">
                          <Users size={13} className="text-leaf-600" /> {interests} interested
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye size={13} /> {listing.status === 'Approved' ? 'Live to buyers' : 'Not public'}
                        </span>
                        <span>Submitted {formatDate(listing.createdAt)}</span>
                      </div>
                      {listing.status === 'Rejected' && listing.rejectionReason ? (
                        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                          Admin note: {listing.rejectionReason}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(listing.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:bg-navy-50"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(listing)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  )
}
