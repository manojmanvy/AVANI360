import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage } from '../services/api.js'
import { mapEnquiry, toEnquiryPayload } from '../services/mappers.js'
import { useAuth } from './AuthContext.jsx'

const EnquiriesContext = createContext(null)

export function EnquiriesProvider({ children }) {
  const { user } = useAuth()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadEnquiries = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/enquiries/mine', { params: { limit: 200 } })
      setEnquiries(data.items.map(mapEnquiry))
      setError('')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not load enquiries.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setEnquiries([])
      return
    }
    loadEnquiries()
  }, [user, loadEnquiries])

  const addEnquiry = useCallback(
    async (data) => {
      try {
        const { data: created } = await api.post('/enquiries', toEnquiryPayload(data))
        const enquiry = mapEnquiry(created)
        if (user) {
          setEnquiries((current) => [enquiry, ...current])
        }
        return { ok: true, enquiry }
      } catch (requestError) {
        return {
          ok: false,
          error: getErrorMessage(requestError, 'Could not send your enquiry.'),
        }
      }
    },
    [user],
  )

  const setEnquiryStatus = useCallback(async (id, status) => {
    try {
      const { data: updated } = await api.patch(`/enquiries/${id}/status`, { status })
      const enquiry = mapEnquiry(updated)
      setEnquiries((current) => current.map((item) => (item.id === id ? enquiry : item)))
      return { ok: true, enquiry }
    } catch (requestError) {
      return {
        ok: false,
        error: getErrorMessage(requestError, 'Could not update the enquiry status.'),
      }
    }
  }, [])

  const enquiriesForSeller = useCallback(
    (sellerId) => enquiries.filter((enquiry) => enquiry.sellerId === sellerId),
    [enquiries],
  )

  const countForProperty = useCallback(
    (propertyId) => enquiries.filter((enquiry) => enquiry.propertyId === propertyId).length,
    [enquiries],
  )

  const value = useMemo(
    () => ({
      enquiries,
      loading,
      error,
      loadEnquiries,
      addEnquiry,
      setEnquiryStatus,
      enquiriesForSeller,
      countForProperty,
    }),
    [
      enquiries,
      loading,
      error,
      loadEnquiries,
      addEnquiry,
      setEnquiryStatus,
      enquiriesForSeller,
      countForProperty,
    ],
  )

  return <EnquiriesContext.Provider value={value}>{children}</EnquiriesContext.Provider>
}

export function useEnquiries() {
  const context = useContext(EnquiriesContext)
  if (!context) {
    throw new Error('useEnquiries must be used inside EnquiriesProvider')
  }
  return context
}
