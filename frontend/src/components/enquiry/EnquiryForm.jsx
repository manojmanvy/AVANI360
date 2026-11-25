import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Send, ShieldCheck, Store } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEnquiries } from '../../context/EnquiriesContext.jsx'

const fieldClass =
  'w-full rounded-xl border border-sage-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

export default function EnquiryForm({ property }) {
  const { user } = useAuth()
  const { addEnquiry } = useEnquiries()

  const initialForm = {
    name: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    message: '',
    siteVisit: false,
    visitDate: '',
  }

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your full name.'
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (form.siteVisit && !form.visitDate) {
      nextErrors.visitDate = 'Choose a preferred visit date.'
    }
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const result = await addEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      sellerId: property.sellerId,
      sellerName: property.sellerName,
      sellerType: property.sellerType,
      name: form.name.trim(),
      phone: form.phone.replace(/\s+/g, ''),
      email: form.email.trim(),
      message: form.message.trim(),
      siteVisit: form.siteVisit,
      visitDate: form.siteVisit ? form.visitDate : '',
      buyerAccountId: user?.id || null,
    })
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }
    setSubmitted(true)
  }

  const reset = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(false)
  }

  const isOwnListing = Boolean(
    user?.id && property?.sellerId && user.id === property.sellerId,
  )

  if (isOwnListing) {
    return (
      <div className="rounded-2xl border border-beige-300 bg-beige-100 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-beige-200 text-beige-700">
          <Store size={24} />
        </span>
        <h3 className="mt-4 text-base font-bold text-navy-900">This is your listing</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          You are logged in as the seller of this property, so you cannot send an enquiry to yourself.
          Real buyer enquiries will show up in your seller dashboard as an interest count.
        </p>
        <Link
          to="/seller"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf-700 to-leaf-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow"
        >
          Go to seller dashboard
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf-600 text-white">
          <CheckCircle2 size={24} />
        </span>
        <h3 className="mt-4 text-base font-bold text-navy-900">Interest sent to our team</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          The AVANI360 team has received your details and will contact you within one working day.
          Your name and phone number are shared with our team only, never with the seller.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 text-sm font-bold text-leaf-700 underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.form ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {errors.form}
        </div>
      ) : null}
      <div>
        <label htmlFor="enquiry-name" className={labelClass}>
          Full name
        </label>
        <input
          id="enquiry-name"
          type="text"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="Your name"
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-phone" className={labelClass}>
            Mobile number
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder="10-digit mobile"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone}</p> : null}
        </div>
        <div>
          <label htmlFor="enquiry-email" className={labelClass}>
            Email <span className="font-medium normal-case text-navy-400">(optional)</span>
          </label>
          <input
            id="enquiry-email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-message" className={labelClass}>
          Message <span className="font-medium normal-case text-navy-400">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          rows={3}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          placeholder={`I am interested in "${property.title}". Please share more details.`}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sage-200 bg-sage-50 p-3.5">
        <input
          type="checkbox"
          checked={form.siteVisit}
          onChange={(event) => update('siteVisit', event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-sage-300 text-leaf-600 focus:ring-leaf-500"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
            <CalendarDays size={15} className="text-leaf-600" /> Request a site visit
          </span>
          <span className="mt-0.5 block text-xs text-navy-500">
            Our team will coordinate a convenient time with the seller.
          </span>
        </span>
      </label>

      {form.siteVisit ? (
        <div>
          <label htmlFor="enquiry-date" className={labelClass}>
            Preferred visit date
          </label>
          <input
            id="enquiry-date"
            type="date"
            value={form.visitDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(event) => update('visitDate', event.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.visitDate)}
          />
          {errors.visitDate ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.visitDate}</p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition-all hover:shadow-glow focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} /> {submitting ? 'Sending...' : 'Send interest'}
      </button>

      <p className="flex items-start gap-1.5 text-center text-[11px] leading-relaxed text-navy-400">
        <ShieldCheck size={13} className="mt-0.5 flex-shrink-0 text-leaf-600" />
        Your details go to the AVANI360 team only. Sellers never see your contact information.
      </p>
    </form>
  )
}
