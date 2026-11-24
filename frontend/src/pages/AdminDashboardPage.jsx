import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  Clock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import { useEnquiries } from '../context/EnquiriesContext.jsx'
import api from '../services/api.js'
import { mapUser } from '../services/mappers.js'
import { formatDate, formatPrice, postedLabel } from '../utils/format.js'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'listings', label: 'Listings' },
  { id: 'enquiries', label: 'Buyer interests' },
  { id: 'users', label: 'Users' },
]

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Approved: 'bg-leaf-50 text-leaf-700 ring-leaf-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  New: 'bg-navy-50 text-navy-700 ring-navy-200',
  Contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
  Closed: 'bg-leaf-50 text-leaf-700 ring-leaf-200',
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

export default function AdminDashboardPage() {
  usePageTitle('Admin dashboard')
  const { session, logout } = useAdminAuth()
  const { listings, approveListing, rejectListing } = useListings()
  const { enquiries, setEnquiryStatus } = useEnquiries()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [listingQuery, setListingQuery] = useState('')
  const [enquiryQuery, setEnquiryQuery] = useState('')
  const [userQuery, setUserQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .get('/users', { params: { limit: 200 } })
      .then(({ data }) => {
        if (!cancelled) setUsers(data.map(mapUser))
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const counts = useMemo(
    () => ({
      totalListings: listings.length,
      pending: listings.filter((listing) => listing.status === 'Pending').length,
      approved: listings.filter((listing) => listing.status === 'Approved').length,
      rejected: listings.filter((listing) => listing.status === 'Rejected').length,
      enquiries: enquiries.length,
      newEnquiries: enquiries.filter((enquiry) => enquiry.status === 'New').length,
      users: users.length,
    }),
    [listings, enquiries, users],
  )

  const pendingListings = useMemo(
    () => listings.filter((listing) => listing.status === 'Pending'),
    [listings],
  )

  const filteredListings = useMemo(() => {
    const query = listingQuery.trim().toLowerCase()
    if (!query) return listings
    return listings.filter((listing) =>
      [listing.title, listing.district, listing.locality, listing.sellerName]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [listings, listingQuery])

  const filteredEnquiries = useMemo(() => {
    const query = enquiryQuery.trim().toLowerCase()
    if (!query) return enquiries
    return enquiries.filter((enquiry) =>
      [enquiry.name, enquiry.phone, enquiry.email, enquiry.propertyTitle, enquiry.sellerName]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [enquiries, enquiryQuery])

  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) =>
      [user.fullName, user.email, user.roleLabel, user.district]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [users, userQuery])

  const handleApprove = async (id) => {
    const result = await approveListing(id)
    if (!result.ok) window.alert(result.error)
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):')
    if (reason === null) return
    const result = await rejectListing(id, reason.trim())
    if (!result.ok) window.alert(result.error)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <section className="min-h-screen bg-cream py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white">
              <ShieldCheck size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-leaf-700">Admin console</p>
              <h1 className="text-xl font-extrabold text-navy-950">{session?.name || 'AVANI360 Admin'}</h1>
              <p className="text-xs text-navy-500">{session?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? 'bg-forest text-white'
                  : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
              }`}
            >
              {item.label}
              {item.id === 'enquiries' && counts.newEnquiries > 0 ? (
                <span className="ml-2 rounded-full bg-leaf-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {counts.newEnquiries}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === 'overview' ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard icon={Building2} label="Total listings" value={counts.totalListings} tone="navy" />
              <StatCard icon={Clock} label="Pending review" value={counts.pending} tone="amber" />
              <StatCard icon={CheckCircle2} label="Approved" value={counts.approved} tone="green" />
              <StatCard icon={MessageSquare} label="Buyer interests" value={counts.enquiries} tone="navy" />
              <StatCard icon={Users} label="Registered users" value={counts.users} tone="navy" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-navy-950">Pending approvals</h2>
                  <button
                    type="button"
                    onClick={() => setTab('listings')}
                    className="text-xs font-bold text-leaf-700 hover:underline"
                  >
                    View all
                  </button>
                </div>
                {pendingListings.length === 0 ? (
                  <p className="mt-6 rounded-xl bg-leaf-50 px-4 py-6 text-center text-sm font-semibold text-leaf-700">
                    All caught up. No listings waiting for review.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-navy-100">
                    {pendingListings.slice(0, 5).map((listing) => (
                      <li key={listing.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-navy-900">{listing.title}</p>
                          <p className="text-xs text-navy-500">
                            {listing.sellerName} · {listing.locality}, {listing.district} · {formatPrice(listing.price)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(listing.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-leaf-700"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(listing.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-navy-950">Latest buyer interests</h2>
                  <button
                    type="button"
                    onClick={() => setTab('enquiries')}
                    className="text-xs font-bold text-leaf-700 hover:underline"
                  >
                    View all
                  </button>
                </div>
                {enquiries.length === 0 ? (
                  <p className="mt-6 rounded-xl bg-navy-50 px-4 py-6 text-center text-sm font-semibold text-navy-500">
                    No buyer interests yet. They appear here after buyers enquire on approved listings.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-navy-100">
                    {enquiries.slice(0, 5).map((enquiry) => (
                      <li key={enquiry.id} className="py-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-navy-900">{enquiry.name}</p>
                          <StatusPill status={enquiry.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-navy-500">{enquiry.propertyTitle}</p>
                        <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-navy-500">
                          <span className="inline-flex items-center gap-1">
                            <Phone size={12} /> {enquiry.phone}
                          </span>
                          {enquiry.email ? (
                            <span className="inline-flex items-center gap-1">
                              <Mail size={12} /> {enquiry.email}
                            </span>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
                  Buyer contact details are shown only in this admin console. Sellers see an interest
                  count, never the buyer's name or phone.
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'listings' ? (
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-navy-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-extrabold text-navy-950">Listing approvals</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="search"
                  value={listingQuery}
                  onChange={(event) => setListingQuery(event.target.value)}
                  placeholder="Search title, seller or district"
                  className="w-full rounded-xl border border-navy-200 bg-white py-2 pl-10 pr-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-navy-50 text-xs font-bold uppercase tracking-wide text-navy-500">
                  <tr>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Seller</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Submitted</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-navy-50/40">
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-900">{listing.title}</p>
                        <p className="text-xs text-navy-500">
                          {listing.locality}, {listing.district} · {listing.type}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy-800">{listing.sellerName}</p>
                        <p className="text-xs text-navy-500">{listing.sellerType}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-navy-900">{formatPrice(listing.price)}</td>
                      <td className="px-5 py-4 text-xs text-navy-500">{postedLabel(listing)}</td>
                      <td className="px-5 py-4">
                        <StatusPill status={listing.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(listing.id)}
                            disabled={listing.status === 'Approved'}
                            className="rounded-full bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(listing.id)}
                            disabled={listing.status === 'Rejected'}
                            className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredListings.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-navy-500">No listings yet.</p>
            ) : null}
          </div>
        ) : null}

        {tab === 'enquiries' ? (
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-navy-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-navy-950">Buyer interests</h2>
                <p className="mt-1 text-xs text-navy-500">
                  Buyer details come only to the admin team. Sellers never see them.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="search"
                  value={enquiryQuery}
                  onChange={(event) => setEnquiryQuery(event.target.value)}
                  placeholder="Search buyer, phone or property"
                  className="w-full rounded-xl border border-navy-200 bg-white py-2 pl-10 pr-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-navy-50 text-xs font-bold uppercase tracking-wide text-navy-500">
                  <tr>
                    <th className="px-5 py-3">Buyer</th>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Seller</th>
                    <th className="px-5 py-3">Message</th>
                    <th className="px-5 py-3">Received</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-navy-50/40">
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-900">{enquiry.name}</p>
                        <p className="flex items-center gap-1 text-xs text-navy-600">
                          <Phone size={12} /> {enquiry.phone}
                        </p>
                        {enquiry.email ? (
                          <p className="flex items-center gap-1 text-xs text-navy-500">
                            <Mail size={12} /> {enquiry.email}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy-800">{enquiry.propertyTitle}</p>
                        {enquiry.siteVisit ? (
                          <p className="text-xs text-leaf-700">
                            Site visit: {enquiry.visitDate || 'date not set'}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-xs text-navy-600">
                        {enquiry.sellerName}
                        <br />
                        {enquiry.sellerType}
                      </td>
                      <td className="px-5 py-4 text-xs text-navy-600">
                        <p className="max-w-[16rem] whitespace-pre-line">{enquiry.message || '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-navy-500">{formatDate(enquiry.createdAt)}</td>
                      <td className="px-5 py-4">
                        <select
                          value={enquiry.status}
                          onChange={async (event) => {
                            const result = await setEnquiryStatus(
                              enquiry.id,
                              event.target.value,
                            )
                            if (!result.ok) window.alert(result.error)
                          }}
                          className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs font-semibold text-navy-800 focus:border-leaf-500 focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEnquiries.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-navy-500">No buyer interests yet.</p>
            ) : null}
          </div>
        ) : null}

        {tab === 'users' ? (
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-navy-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-extrabold text-navy-950">Registered users</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="search"
                  value={userQuery}
                  onChange={(event) => setUserQuery(event.target.value)}
                  placeholder="Search name, email, role or district"
                  className="w-full rounded-xl border border-navy-200 bg-white py-2 pl-10 pr-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-navy-50 text-xs font-bold uppercase tracking-wide text-navy-500">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">District</th>
                    <th className="px-5 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-navy-50/40">
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-900">{user.fullName}</p>
                        <p className="text-xs text-navy-500">{user.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-700 ring-1 ring-inset ring-navy-200">
                          {user.roleLabel || user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-navy-600">{user.district || '—'}</td>
                      <td className="px-5 py-4 text-navy-600">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-navy-500">No registered users yet.</p>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
