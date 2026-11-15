import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage, SESSION_KEY, TOKEN_KEY } from '../services/api.js'
import { mapUser, toApiRole } from '../services/mappers.js'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [initialising, setInitialising] = useState(true)

  const persistSession = useCallback((nextUser, token) => {
    if (token) window.localStorage.setItem(TOKEN_KEY, token)
    if (nextUser) window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    const token = window.localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setInitialising(false)
      return undefined
    }

    api
      .get('/auth/me')
      .then(({ data }) => {
        if (cancelled) return
        const mapped = mapUser(data)
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(mapped))
        setUser(mapped)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
      .finally(() => {
        if (!cancelled) setInitialising(false)
      })

    return () => {
      cancelled = true
    }
  }, [logout])

  const register = useCallback(
    async ({ fullName, email, phone, password, role, district }) => {
      try {
        await api.post('/auth/register', {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.replace(/\s+/g, ''),
          password,
          role: toApiRole(role),
          district: district || null,
        })
        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          error: getErrorMessage(error, 'Registration failed. Please try again.'),
        }
      }
    },
    [],
  )

  const login = useCallback(
    async (email, password) => {
      try {
        const { data } = await api.post('/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        })
        const mapped = mapUser(data.user)
        persistSession(mapped, data.access_token)
        return { ok: true, user: mapped }
      } catch (error) {
        return {
          ok: false,
          error: getErrorMessage(error, 'Login failed. Please check your details.'),
        }
      }
    },
    [persistSession],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initialising,
      register,
      login,
      logout,
    }),
    [user, initialising, register, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
