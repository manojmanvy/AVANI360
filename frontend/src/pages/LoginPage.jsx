import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import AuthShell from '../components/auth/AuthShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

const sellerRoles = ['seller', 'builder']

export default function LoginPage() {
  usePageTitle('Login')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || null

  const [form, setForm] = useState({ email: location.state?.email || '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }))
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

    setSubmitting(true)
    const result = await login(form.email, form.password)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }

    const roleHome = sellerRoles.includes(result.user?.role) ? '/seller' : '/account'
    navigate(from || roleHome, { replace: true })
  }

  return (
    <AuthShell>
      <span className="inline-flex rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-700 ring-1 ring-inset ring-leaf-100">
        Welcome back
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950">
        Login to AVANI360
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Sign in with the email and password you used when creating your account.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {['Buyer', 'Owner', 'Broker', 'Builder'].map((role) => (
          <span
            key={role}
            className="rounded-full border border-navy-200 px-3 py-1 text-xs font-semibold text-navy-500"
          >
            {role}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
        {errors.form ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {errors.form}
          </div>
        ) : null}

        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="you@example.com"
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-leaf-700 transition-colors hover:text-leaf-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              id="login-password"
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
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              Logging in <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              Login <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-600">
        New to AVANI360?{' '}
        <Link to="/register" className="font-bold text-leaf-700 underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-navy-200 bg-navy-50 px-4 py-3 text-xs leading-relaxed text-navy-700">
        <p className="flex items-center gap-1.5 font-bold text-navy-900">
          <ShieldCheck size={14} /> AVANI360 team?
        </p>
        <p className="mt-1">
          Admin accounts use the separate{' '}
          <Link to="/admin/login" className="font-bold text-leaf-700 underline underline-offset-2">
            admin console login
          </Link>
          .
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-xs leading-relaxed text-leaf-800">
        Your account is secured with server-side authentication and a JWT session.
      </div>
    </AuthShell>
  )
}
