import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Logo from '../components/layout/Logo.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

export default function AdminLoginPage() {
  usePageTitle('Admin login')
  const { isAuthenticated, login, demoCredentials } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = await login(form.email, form.password)
    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }
    navigate(from, { replace: true })
  }

  const fillDemo = () => {
    setForm({ email: demoCredentials.email, password: demoCredentials.password })
    setErrors({})
  }

  return (
    <section className="bg-forest py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-600 text-white shadow-soft">
              <ShieldCheck size={26} />
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">Admin login</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Restricted access for the BookMyLand review team. Manage listings, users and document
              verification.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-sage-200 bg-white p-6 shadow-card sm:p-8"
            noValidate
          >
            {errors.form ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {errors.form}
              </div>
            ) : null}

            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Admin email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="admin@bookmyland.in"
                  className={fieldClass}
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {errors.email ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  placeholder="Enter your password"
                  className={`${fieldClass} pr-11`}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-leaf-700 to-leaf-600 px-5 py-3 text-sm font-bold text-white shadow-soft transition-all hover:shadow-glow"
            >
              Sign in as admin <ArrowRight size={16} />
            </button>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <p className="font-bold">Demo credentials</p>
              <p className="mt-1">
                Email: <strong>{demoCredentials.email}</strong>
                <br />
                Password: <strong>{demoCredentials.password}</strong>
              </p>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-2 font-bold text-amber-900 underline underline-offset-2"
              >
                Fill demo credentials
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <Logo light />
          </div>
        </div>
      </Container>
    </section>
  )
}
