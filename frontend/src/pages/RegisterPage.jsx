import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import AuthShell from '../components/auth/AuthShell.jsx'
import { tamilNaduDistricts } from '../data/districts.js'
import { useAuth } from '../context/AuthContext.jsx'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const iconFieldClass =
  'w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

const roleMap = {
  buyer: 'Buyer',
  owner: 'Owner',
  broker: 'Broker',
  builder: 'Builder',
}

const roles = [
  { value: 'Buyer', label: 'Buyer — search and save properties' },
  { value: 'Owner', label: 'Property owner — list your own land' },
  { value: 'Broker', label: 'Broker — manage client listings' },
  { value: 'Builder', label: 'Builder — publish projects' },
]

export default function RegisterPage() {
  usePageTitle('Create an account')
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleFromParam = roleMap[(searchParams.get('role') || '').toLowerCase()] || 'Buyer'

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: roleFromParam,
    district: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')

  useEffect(() => {
    setForm((current) => ({ ...current, role: roleFromParam }))
  }, [roleFromParam])

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }))
  }

  const isSeller = form.role !== 'Buyer'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.fullName.trim().length < 2) nextErrors.fullName = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const result = await register(form)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }
    setCreatedEmail(form.email.trim())
    setSubmitted(true)
  }

  return (
    <AuthShell>
      {submitted ? (
        <div className="py-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-white">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-navy-950">Account created</h1>
          <p className="mt-3 text-sm leading-relaxed text-navy-600">
            Your <strong>{form.role}</strong> account for <strong>{createdEmail}</strong> is ready.
            Now login with this email and the password you just set.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login', { state: { email: createdEmail } })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-700"
          >
            Go to login <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({
                fullName: '',
                email: '',
                phone: '',
                password: '',
                role: roleFromParam,
                district: '',
              })
              setSubmitted(false)
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
          >
            Create another account
          </button>
        </div>
      ) : (
        <>
          <span className="inline-flex rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-700 ring-1 ring-inset ring-leaf-100">
            {isSeller ? 'For sellers' : 'For buyers'}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950">
            {isSeller ? 'Create your seller account' : 'Create your buyer account'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            Owners, brokers and builders can list properties. Buyers can save shortlists and send
            enquiries. Choose the role that fits you.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            {errors.form ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {errors.form}
              </div>
            ) : null}

            <div>
              <label htmlFor="register-name" className={labelClass}>
                Full name
              </label>
              <div className="relative">
                <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  id="register-name"
                  type="text"
                  value={form.fullName}
                  onChange={(event) => update('fullName', event.target.value)}
                  placeholder="Your full name"
                  className={iconFieldClass}
                  aria-invalid={Boolean(errors.fullName)}
                />
              </div>
              {errors.fullName ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="register-email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input
                    id="register-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    placeholder="you@example.com"
                    className={iconFieldClass}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="register-phone" className={labelClass}>
                  Mobile number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input
                    id="register-phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    placeholder="10-digit mobile"
                    className={iconFieldClass}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="register-role" className={labelClass}>
                I am a
              </label>
              <div className="relative">
                <select
                  id="register-role"
                  value={form.role}
                  onChange={(event) => update('role', event.target.value)}
                  className={`${fieldClass} appearance-none pr-9`}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="register-district" className={labelClass}>
                  District <span className="font-medium normal-case text-navy-400">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    id="register-district"
                    value={form.district}
                    onChange={(event) => update('district', event.target.value)}
                    className={`${fieldClass} appearance-none pr-9`}
                  >
                    <option value="">Select district</option>
                    {tamilNaduDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => update('password', event.target.value)}
                    placeholder="Minimum 6 characters"
                    className={`${iconFieldClass} pr-11`}
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  Creating account <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Create account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-leaf-700 underline-offset-4 hover:underline">
              Login
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-xs leading-relaxed text-leaf-800">
            Your account is created securely on the BookMyLand server. You can login right after
            registering.
          </div>
        </>
      )}
    </AuthShell>
  )
}
