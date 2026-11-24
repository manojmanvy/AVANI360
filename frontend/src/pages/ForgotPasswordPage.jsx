import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import AuthShell from '../components/auth/AuthShell.jsx'
import api, { getErrorMessage } from '../services/api.js'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password')
  const navigate = useNavigate()

  // Steps: 1 = Enter Email, 2 = Enter OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [devOtpNotice, setDevOtpNotice] = useState('')
  const [countdown, setCountdown] = useState(0)

  // Timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Step 1: Send OTP
  const handleSendOtp = async (event) => {
    if (event) event.preventDefault()
    setError('')
    setStatusMessage('')
    setDevOtpNotice('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() })
      setStatusMessage(data.message || 'OTP verification code sent to your email.')
      if (data.dev_otp) {
        setDevOtpNotice(`Demo OTP for testing: ${data.dev_otp}`)
      }
      setCountdown(60) // 60s cooldown
      setStep(2)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not send verification OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setError('')
    setDevOtpNotice('')

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      })
      setError('')
      setStep(3)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Incorrect or expired code. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (event) => {
    event.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-check.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: newPassword,
      })
      setStatusMessage(data.message || 'Password successfully updated!')
      setStep(4)
      setTimeout(() => navigate('/login'), 3500)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not reset password. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title={step === 4 ? 'Password Reset Complete' : 'Reset Your Password'}
      subtitle={
        step === 1
          ? 'Enter your registered email address and we will send a 6-digit verification code.'
          : step === 2
          ? `Enter the 6-digit security code sent to ${email}`
          : step === 3
          ? 'Create a strong, secure new password for your account.'
          : 'Your account has been secured with the new password.'
      }
      badge="Account Recovery"
      badgeTone="leaf"
    >
      {/* Progress Pills */}
      {step < 4 ? (
        <div className="mb-6 flex items-center justify-between border-b border-navy-100 pb-4 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-leaf-700' : 'text-navy-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step >= 1 ? 'bg-leaf-600 text-white' : 'bg-navy-200 text-navy-600'}`}>1</span>
            <span>Email</span>
          </div>
          <div className="h-0.5 w-8 bg-navy-200" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-leaf-700' : 'text-navy-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step >= 2 ? 'bg-leaf-600 text-white' : 'bg-navy-200 text-navy-600'}`}>2</span>
            <span>Verify OTP</span>
          </div>
          <div className="h-0.5 w-8 bg-navy-200" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-leaf-700' : 'text-navy-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step >= 3 ? 'bg-leaf-600 text-white' : 'bg-navy-200 text-navy-600'}`}>3</span>
            <span>New Password</span>
          </div>
        </div>
      ) : null}

      {/* Notifications / Alerts */}
      {error ? (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
          {error}
        </div>
      ) : null}

      {statusMessage && step < 4 ? (
        <div className="mb-5 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-xs font-medium text-leaf-800">
          {statusMessage}
        </div>
      ) : null}

      {devOtpNotice ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900">
          💡 {devOtpNotice}
        </div>
      ) : null}

      {/* STEP 1: Email Form */}
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className={labelClass}>
              Registered Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={fieldClass}
                required
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-[11px] text-navy-500">
              We will send a 6-digit OTP code directly to this Gmail / Email address from AVANI360.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-leaf-700 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{loading ? 'Sending Security Code...' : 'Send 6-Digit OTP'}</span>
            {!loading ? <ArrowRight size={16} /> : null}
          </button>
        </form>
      ) : null}

      {/* STEP 2: Enter OTP Form */}
      {step === 2 ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="reset-otp" className={labelClass}>
                6-Digit Security Code
              </label>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-semibold text-leaf-700 hover:underline"
              >
                Change email
              </button>
            </div>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                id="reset-otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className={`${fieldClass} text-center tracking-[0.4em] font-mono text-lg font-bold text-navy-950`}
                required
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-[11px] text-navy-500">
              Code expires in 10 minutes. Check your inbox and spam folder.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-leaf-700 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{loading ? 'Verifying Code...' : 'Verify Security Code'}</span>
            {!loading ? <ArrowRight size={16} /> : null}
          </button>

          {/* Resend button with cooldown */}
          <div className="pt-2 text-center">
            {countdown > 0 ? (
              <span className="flex items-center justify-center gap-1.5 text-xs text-navy-400">
                <Clock size={13} /> Resend OTP in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 hover:text-leaf-800"
              >
                <RotateCcw size={13} /> Didn't get code? Resend OTP
              </button>
            )}
          </div>
        </form>
      ) : null}

      {/* STEP 3: New Password Form */}
      {step === 3 ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className={labelClass}>
              New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`${fieldClass} pr-11`}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className={labelClass}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-leaf-700 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{loading ? 'Securing Account...' : 'Set New Password'}</span>
            {!loading ? <ShieldCheck size={16} /> : null}
          </button>
        </form>
      ) : null}

      {/* STEP 4: Success Message */}
      {step === 4 ? (
        <div className="py-4 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">Password Successfully Changed!</h3>
            <p className="mt-1.5 text-xs text-navy-600">
              You can now sign in with your new password. Redirecting to login in a few seconds...
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-leaf-700"
          >
            Go to Login Now <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}

      {/* Back to Login Footer */}
      <div className="mt-6 border-t border-navy-100 pt-5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-600 transition-colors hover:text-leaf-700"
        >
          <ArrowLeft size={14} /> Remember your password? Back to Login
        </Link>
      </div>
    </AuthShell>
  )
}
