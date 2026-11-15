import { Link } from 'react-router-dom'
import { Mail, MapPin, ShieldAlert } from 'lucide-react'
import Logo from './Logo.jsx'

const exploreLinks = [
  { label: 'All properties', to: '/properties' },
  { label: 'Residential plots', to: '/properties?type=Residential+Plot' },
  { label: 'Apartments', to: '/properties?type=Apartment' },
  { label: 'Villas', to: '/properties?type=Villa' },
  { label: 'Farm land', to: '/properties?type=Farm+Land' },
]

const sellerLinks = [
  { label: 'List your property', to: '/list-property' },
  { label: 'Create an account', to: '/register' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Seller login', to: '/login' },
]

const companyLinks = [
  { label: 'About BookMyLand', to: '/#about' },
  { label: 'Government schemes', to: '/#schemes' },
  { label: 'Saved properties', to: '/favorites' },
  { label: 'Contact', to: '/#contact' },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden bg-forest text-white">
      <div className="h-1 w-full bg-gradient-to-r from-leaf-400 via-beige-300 to-sage-400" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.06]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              A Tamil Nadu-first land and property marketplace. We connect buyers with owners, brokers
              and builders, and support the journey from shortlist to registration.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="text-leaf-400" /> Chennai, Tamil Nadu, India
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-leaf-400" /> hello@bookmyland.in
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white/90">Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/60 transition-colors hover:text-leaf-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white/90">For sellers</h3>
            <ul className="mt-5 space-y-3">
              {sellerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/60 transition-colors hover:text-leaf-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white/90">Company</h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/60 transition-colors hover:text-leaf-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs leading-relaxed text-white/60">
          <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-beige-300" />
          <p>
            BookMyLand is not a government agency. We provide free informational guidance for
            government housing schemes only. We do not guarantee eligibility, approval, allotment or
            subsidy. Always confirm details with the concerned government department.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BookMyLand. All rights reserved.</p>
          <p>All listings are reviewed and approved by the BookMyLand team.</p>
        </div>
      </div>
    </footer>
  )
}
