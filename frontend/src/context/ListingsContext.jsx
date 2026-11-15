import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage } from '../services/api.js'
import { mapProperty, toPropertyPayload } from '../services/mappers.js'
import { SAMPLE_PROPERTIES } from '../data/sampleProperties.js'
import { useAuth } from './AuthContext.jsx'

const ListingsContext = createContext(null)

export function ListingsProvider({ children }) {
  const { user } = useAuth()
  const [approvedListings, setApprovedListings] = useState(SAMPLE_PROPERTIES)
  const [myListings, setMyListings] = useState([])
  const [adminListings, setAdminListings] = useState([])
  const [loading, setLoading] = useState({ public: false, mine: false, admin: false })
  const [error, setError] = useState('')

  const loadPublicListings = useCallback(async () => {
    setLoading((current) => ({ ...current, public: true }))
    try {
      const { data } = await api.get('/properties', { params: { limit: 100 } })
      const mapped = data.items.map(mapProperty)
      setApprovedListings(mapped.length > 0 ? mapped : SAMPLE_PROPERTIES)
      setError('')
    } catch {
      // If backend is unreachable (e.g. mobile APK client review), fall back to rich sample properties
      setApprovedListings(SAMPLE_PROPERTIES)
    } finally {
      setLoading((current) => ({ ...current, public: false }))
    }
  }, [])

  const loadMyListings = useCallback(async () => {
    setLoading((current) => ({ ...current, mine: true }))
    try {
      const { data } = await api.get('/properties/mine', { params: { limit: 200 } })
      setMyListings(data.map(mapProperty))
      setError('')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not load your listings.'))
    } finally {
      setLoading((current) => ({ ...current, mine: false }))
    }
  }, [])

  const loadAdminListings = useCallback(async () => {
    setLoading((current) => ({ ...current, admin: true }))
    try {
      const { data } = await api.get('/properties/mine', { params: { limit: 200 } })
      setAdminListings(data.map(mapProperty))
      setError('')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not load listings.'))
    } finally {
      setLoading((current) => ({ ...current, admin: false }))
    }
  }, [])

  useEffect(() => {
    loadPublicListings()
  }, [loadPublicListings])

  useEffect(() => {
    if (!user) {
      setMyListings([])
      setAdminListings([])
      return
    }
    if (user.role === 'admin') {
      loadAdminListings()
    } else if (user.role === 'seller' || user.role === 'builder') {
      loadMyListings()
    }
  }, [user, loadMyListings, loadAdminListings])

  const addListing = useCallback(
    async (data) => {
      try {
        const { data: created } = await api.post('/properties', toPropertyPayload(data))
        const listing = mapProperty(created)
        setMyListings((current) => [listing, ...current])
        loadPublicListings()
        return { ok: true, listing }
      } catch (requestError) {
        return {
          ok: false,
          error: getErrorMessage(requestError, 'Could not create the listing.'),
        }
      }
    },
    [loadPublicListings],
  )

  const updateListing = useCallback(
    async (id, data) => {
      try {
        const { data: updated } = await api.patch(`/properties/${id}`, toPropertyPayload(data))
        const listing = mapProperty(updated)
        setMyListings((current) =>
          current.map((item) => (item.id === id ? listing : item)),
        )
        setAdminListings((current) =>
          current.map((item) => (item.id === id ? listing : item)),
        )
        loadPublicListings()
        return { ok: true, listing }
      } catch (requestError) {
        return {
          ok: false,
          error: getErrorMessage(requestError, 'Could not update the listing.'),
        }
      }
    },
    [loadPublicListings],
  )

  const deleteListing = useCallback(
    async (id) => {
      try {
        await api.delete(`/properties/${id}`)
        setMyListings((current) => current.filter((item) => item.id !== id))
        setAdminListings((current) => current.filter((item) => item.id !== id))
        loadPublicListings()
        return { ok: true }
      } catch (requestError) {
        return {
          ok: false,
          error: getErrorMessage(requestError, 'Could not delete the listing.'),
        }
      }
    },
    [loadPublicListings],
  )

  const updateStatus = useCallback(
    async (id, status, rejectionReason = '') => {
      try {
        const { data: updated } = await api.patch(`/properties/${id}/status`, {
          status,
          rejection_reason: rejectionReason || null,
        })
        const listing = mapProperty(updated)
        setAdminListings((current) =>
          current.map((item) => (item.id === id ? listing : item)),
        )
        setMyListings((current) =>
          current.map((item) => (item.id === id ? listing : item)),
        )
        loadPublicListings()
        return { ok: true, listing }
      } catch (requestError) {
        return {
          ok: false,
          error: getErrorMessage(requestError, 'Could not update the listing status.'),
        }
      }
    },
    [loadPublicListings],
  )

  const approveListing = useCallback((id) => updateStatus(id, 'Approved'), [updateStatus])

  const rejectListing = useCallback(
    (id, reason = '') => updateStatus(id, 'Rejected', reason),
    [updateStatus],
  )

  const getListingById = useCallback(
    (id) =>
      approvedListings.find((item) => item.id === id) ||
      myListings.find((item) => item.id === id) ||
      adminListings.find((item) => item.id === id),
    [approvedListings, myListings, adminListings],
  )

  const listingsForSeller = useCallback(
    (sellerId) => {
      const pool = myListings.length > 0 ? myListings : adminListings
      return pool.filter((item) => item.sellerId === sellerId)
    },
    [myListings, adminListings],
  )

  const value = useMemo(
    () => ({
      listings: adminListings,
      approvedListings,
      myListings,
      adminListings,
      loading,
      error,
      loadPublicListings,
      loadMyListings,
      loadAdminListings,
      addListing,
      updateListing,
      deleteListing,
      approveListing,
      rejectListing,
      getListingById,
      listingsForSeller,
    }),
    [
      adminListings,
      approvedListings,
      myListings,
      loading,
      error,
      loadPublicListings,
      loadMyListings,
      loadAdminListings,
      addListing,
      updateListing,
      deleteListing,
      approveListing,
      rejectListing,
      getListingById,
      listingsForSeller,
    ],
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const context = useContext(ListingsContext)
  if (!context) {
    throw new Error('useListings must be used inside ListingsProvider')
  }
  return context
}
