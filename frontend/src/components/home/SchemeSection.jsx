import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Home,
  Landmark,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react'
import Container from '../ui/Container.jsx'
import { tamilNaduDistricts } from '../../data/districts.js'
import api, { getErrorMessage } from '../../services/api.js'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

const benefits = [
  'Scheme categories relevant to your district',
  'Eligibility and document checklists',
  'Step-by-step application guidance',
  'Coordination support with the right office',
]

const tnSchemesList = [
  {
    title: 'Tamil Nadu Housing Board (TNHB) Allotment',
    tag: 'Plots & Flats',
    desc: 'Government developed layouts & apartments across Chennai, Coimbatore, Madurai, Trichy, Salem and Hosur.',
    eligibility: 'Tamil Nadu native, age 21+, income category (EWS, LIG, MIG, HIG).',
    documents: ['Aadhaar Card', 'Income Certificate', 'Nativity Certificate', 'PAN Card'],
  },
  {
    title: 'PMAY - Housing For All (Urban & Rural)',
    tag: 'Subsidy up to ₹2.67 L',
    desc: 'Interest subsidy on home loans for first-time land purchasers building their home in Tamil Nadu.',
    eligibility: 'Family should not own a pucca house anywhere in India. Woman co-ownership preferred.',
    documents: ['Land Patta / Sale Deed', 'Approved Building Plan', 'Bank Statement', 'Aadhaar'],
  },
  {
    title: 'CMDA & DTCP Unapproved Plots Regularisation',
    tag: 'Legal Framework',
    desc: 'Framework enabling regularisation of individual unapproved plots registered before Oct 2016 in Tamil Nadu.',
    eligibility: 'Plot registered on or before 20.10.2016 with registered sale deed copy.',
    documents: ['Registered Sale Deed', 'Parent Documents', 'Patta copy', 'Field Inspection report'],
  },
  {
    title: 'Tamil Nilam e-Patta & Chitta Transfer Online',
    tag: 'Land Revenue Records',
    desc: 'Official digital land records service to verify ownership, survey number, sub-division and extract Chitta.',
    eligibility: 'Any registered buyer or owner holding registered deed in Tamil Nadu.',
    documents: ['Encumbrance Certificate (EC)', 'Sale Deed', 'Previous Patta Number', 'Aadhaar'],
  },
]

export default function SchemeSection() {
  const [form, setForm] = useState({ name: '', phone: '', district: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.'
    }
    if (!form.district) nextErrors.district = 'Select your district.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await api.post('/scheme-leads', {
        name: form.name.trim(),
        phone: form.phone.replace(/\s+/g, ''),
        district: form.district,
        message: `Government Housing Scheme Assistance Request for ${form.district} district.`,
      })
      setSubmitted(true)
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, 'Could not send your request. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="schemes" className="scroll-mt-20 bg-cream py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-10 sm:px-10 lg:px-12 lg:py-14 shadow-float">
          <div className="absolute inset-0 bg-dot-grid opacity-[0.07]" aria-hidden="true" />
          <div
            className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-leaf-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-leaf-300 ring-1 ring-inset ring-white/15">
                <Landmark size={14} /> Tamil Nadu Government Housing Schemes
              </span>
              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Free Guidance & Transparent Information
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
                Understanding TNHB, PMAY, DTCP Regularisation and Patta rules can be complex. Our team provides free informational guidance to help you make informed decisions.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-white/75">
                    <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-leaf-400" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Interactive Pop-Up Button */}
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/25 active:scale-95"
                >
                  <BookOpen size={15} className="text-leaf-400" />
                  <span>Browse 4 Top TN Schemes (Pop-up Guide)</span>
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-beige-300/30 bg-beige-300/10 px-4 py-3 text-xs leading-relaxed text-beige-100/90">
                <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-beige-300" />
                <p>
                  AVANI360 is an independent platform and not a government body. Guidance is purely informational and free. Please verify official terms with the respective departments.
                </p>
              </div>
            </div>

            {/* Quick Request Form */}
            <div className="rounded-3xl bg-white p-6 shadow-float sm:p-7">
              {submitted ? (
                <div className="py-6 text-center animate-fade-in">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600">
                    <CheckCircle2 size={28} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-navy-950">Request Received!</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    Our team will review your district requirements and contact you via phone or WhatsApp with free scheme guidance.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: '', phone: '', district: '' })
                      setSubmitted(false)
                    }}
                    className="mt-5 text-sm font-bold text-leaf-700 underline-offset-4 hover:underline"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <h3 className="text-lg font-extrabold text-navy-950">Request Free Scheme Advice</h3>
                    <p className="mt-1 text-xs text-navy-500">
                      Select your district. Our team will explain the active schemes and documentation.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="scheme-name" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      id="scheme-name"
                      type="text"
                      value={form.name}
                      onChange={(event) => update('name', event.target.value)}
                      placeholder="Your name"
                      className={fieldClass}
                    />
                    {errors.name ? (
                      <p className="mt-1 text-xs font-semibold text-rose-600">{errors.name}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="scheme-phone" className={labelClass}>
                      Mobile Number
                    </label>
                    <input
                      id="scheme-phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      placeholder="10-digit mobile number"
                      className={fieldClass}
                    />
                    {errors.phone ? (
                      <p className="mt-1 text-xs font-semibold text-rose-600">{errors.phone}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="scheme-district" className={labelClass}>
                      Target District
                    </label>
                    <div className="relative">
                      <select
                        id="scheme-district"
                        value={form.district}
                        onChange={(event) => update('district', event.target.value)}
                        className={`${fieldClass} appearance-none pr-9`}
                      >
                        <option value="">Select District</option>
                        {tamilNaduDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400"
                      />
                    </div>
                    {errors.district ? (
                      <p className="mt-1 text-xs font-semibold text-rose-600">{errors.district}</p>
                    ) : null}
                  </div>

                  {submitError ? (
                    <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                      {submitError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 py-3 text-sm font-extrabold text-white shadow-soft transition-all hover:shadow-card hover:brightness-105 active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Get Free Scheme Guidance'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* SLIDE-UP POPUP MODAL FOR TN HOUSING SCHEMES */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-sage-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false)
            }}
          >
            <div
              className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2.25rem] bg-white shadow-float sm:max-h-[85vh] sm:max-w-3xl sm:rounded-3xl animate-slide-up sm:animate-scale-up"
              role="dialog"
              aria-modal="true"
            >
              {/* Mobile Drag Bar */}
              <div className="flex items-center justify-center pt-3 pb-1 sm:hidden">
                <div className="h-1.5 w-12 rounded-full bg-navy-200" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 sm:px-8">
                <div>
                  <span className="rounded-full bg-leaf-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-leaf-700">
                    Tamil Nadu Guide
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-navy-950 sm:text-xl">
                    Major Government Housing Schemes & Rules
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-600 hover:bg-rose-50 hover:text-rose-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Schemes List */}
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 space-y-4">
                {tnSchemesList.map((scheme) => (
                  <div
                    key={scheme.title}
                    className="rounded-2xl border border-navy-100 bg-navy-50/50 p-5 shadow-2xs hover:border-leaf-200 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-extrabold text-navy-900">{scheme.title}</h4>
                      <span className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-bold text-leaf-800">
                        {scheme.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-navy-600">{scheme.desc}</p>

                    <div className="mt-3.5 grid gap-2 text-xs border-t border-navy-100 pt-3">
                      <p>
                        <strong className="text-navy-900">Eligibility:</strong>{' '}
                        <span className="text-navy-600">{scheme.eligibility}</span>
                      </p>
                      <div>
                        <strong className="text-navy-900">Required Documents:</strong>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {scheme.documents.map((doc) => (
                            <span
                              key={doc}
                              className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-semibold text-navy-700 shadow-2xs"
                            >
                              ✓ {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-navy-100 px-6 py-4 sm:px-8 bg-cream flex items-center justify-between">
                <p className="text-xs text-navy-500">Need specific help? Fill the guidance form.</p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-leaf-700 to-leaf-600 px-4 py-2 text-xs font-bold text-white hover:from-leaf-600 hover:to-leaf-500"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
