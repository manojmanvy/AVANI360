import { Link } from 'react-router-dom'
import {
  FileCheck2,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import Container from '../ui/Container.jsx'
import SearchPanel from '../search/SearchPanel.jsx'

const trendingLocations = [
  { name: 'Chennai OMR', district: 'Chennai' },
  { name: 'Saravanampatti', district: 'Coimbatore' },
  { name: 'Madurai Ring Road', district: 'Madurai' },
  { name: 'Trichy Airport Rd', district: 'Tiruchirappalli' },
  { name: 'Hosur SIPCOT', district: 'Krishnagiri' },
  { name: 'Salem Bye-pass', district: 'Salem' },
]

const trustCards = [
  {
    icon: ShieldCheck,
    label: 'Review',
    title: '100% Admin Verified',
    iconClass: 'bg-leaf-100 text-leaf-700',
    bar: 'from-leaf-400 to-leaf-600',
  },
  {
    icon: FileCheck2,
    label: 'Transparency',
    title: 'Patta & DTCP Info',
    iconClass: 'bg-beige-200 text-beige-700',
    bar: 'from-beige-300 to-beige-500',
  },
  {
    icon: Users,
    label: 'Direct Connect',
    title: 'Owners & Builders',
    iconClass: 'bg-sage-200 text-sage-800',
    bar: 'from-sage-300 to-sage-500',
  },
  {
    icon: Landmark,
    label: 'Assistance',
    title: 'Free Govt Scheme Guide',
    iconClass: 'bg-leaf-100 text-leaf-700',
    bar: 'from-leaf-400 to-sage-500',
  },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-beige-100 to-sage-50 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sage-300/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-leaf-300/30 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Pill in Muted Sage & Green */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/85 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-leaf-500 animate-pulse" />
            <span className="text-xs font-bold text-navy-800">
              Tamil Nadu&apos;s Dedicated Land & Property Portal
            </span>
            <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-extrabold text-leaf-800">
              38 Districts
            </span>
          </div>

          {/* Strong Headline */}
          <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
            Find Verified{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-gradient-leaf">Land & Plots</span>
              <span
                className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-beige-300/70 sm:bottom-2 sm:h-4"
                aria-hidden="true"
              />
            </span>{' '}
            Across Tamil Nadu
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-navy-600 sm:text-base">
            Buy DTCP/CMDA approved layouts, agricultural farm lands, and commercial plots directly from verified owners & builders. No hidden broker fees.
          </p>
        </div>

        {/* Search Box */}
        <div className="mx-auto mt-8 max-w-4xl">
          <SearchPanel />

          {/* Trending Searches */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-navy-600">
              <TrendingUp size={13} className="text-leaf-600" /> Trending in TN:
            </span>
            {trendingLocations.map((item) => (
              <Link
                key={item.name}
                to={`/properties?district=${encodeURIComponent(item.district)}&q=${encodeURIComponent(item.name)}`}
                className="rounded-full border border-sage-300/80 bg-white/90 px-3 py-1 font-semibold text-navy-800 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-leaf-500 hover:bg-leaf-50 hover:text-leaf-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 4 Trust Columns with Sage & Warm Beige aesthetic */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map(({ icon: Icon, label, title, iconClass, bar }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-sage-200 bg-white/85 p-4 shadow-2xs backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sage-300 hover:shadow-card"
            >
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} aria-hidden="true" />
              <div className="flex items-center gap-3.5">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-navy-400">{label}</h2>
                  <p className="text-sm font-extrabold text-navy-950">{title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
