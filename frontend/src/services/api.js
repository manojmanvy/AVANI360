import axios from 'axios'

export const TOKEN_KEY = 'avani360:token'
export const SESSION_KEY = 'avani360:session'

// Automatically connect to live Render cloud backend in production / mobile APK builds
const defaultBaseURL = import.meta.env.DEV
  ? '/api/v1'
  : 'https://bookmyland-1.onrender.com/api/v1'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const detail = error?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || String(item)).join(', ')
  }
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
  if (!error?.response) return 'Could not reach the server. Is the backend running?'
  return fallback
}

export default api
