import { createContext, useCallback, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'

const DEMO_ADMIN = {
  email: 'admin@avani360.in',
  password: 'admin123',
}

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const { user, isAuthenticated, login, logout } = useAuth()

  const isAdmin = isAuthenticated && user?.role === 'admin'

  const adminLogin = useCallback(
    async (email, password) => {
      const result = await login(email, password)
      if (!result.ok) return result
      if (result.user?.role !== 'admin') {
        logout()
        return { ok: false, error: 'This account does not have admin access.' }
      }
      return { ok: true }
    },
    [login, logout],
  )

  const value = useMemo(
    () => ({
      session: isAdmin ? { name: user.fullName, email: user.email, role: user.role } : null,
      isAuthenticated: isAdmin,
      login: adminLogin,
      logout,
      demoCredentials: DEMO_ADMIN,
    }),
    [isAdmin, user, adminLogin, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  }
  return context
}
