import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  Compass,
  IndianRupee,
  MapPin,
  Search,
  Sprout,
  Store,
  Trees,
} from 'lucide-react'
import { budgetOptions, propertyTypes, tamilNaduDistricts } from '../../data/districts.js'

const searchTabs = [
  { id: 'all', label: 'All Land & Property', type: '' },
  { id: 'plots', label: 'Plots & Layouts', type: 'Residential Plot' },
  { id: 'agri', label: 'Agricultural & Farm', type: 'Agricultural Land' },
  { id: 'commercial', label: 'Commercial Land', type: 'Commercial Plot' },
  { id: 'villas', label: 'Villas & Houses', type: 'Villa' },
]

export default function SearchPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [district, setDistrict] = useState('')
  const [keyword, setKeyword] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleTabChange = (tab) => {
    setActiveTab(tab.id)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    
    // Type from active tab
    const selectedTab = searchTabs.find((t) => t.id === activeTab)
    if (selectedTab?.type) {
      params.set('type', selectedTab.type)
    }

    if (district) params.set('district', district)
    if (keyword.trim()) params.set('q', keyword.trim())
    if (maxPrice) params.set('maxPrice', maxPrice)

    navigate({ pathname: '/properties', search: params.toString() })
  }

  return (
    <div className="w-full">
      {/* 99acres-style Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        {searchTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-navy-950 shadow-soft ring-1 ring-sage-300'
                  : 'bg-white/50 text-navy-700 hover:bg-white hover:text-navy-950 backdrop-blur-sm'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Search Container in warm cream beige & sage */}
      <form
        onSubmit={handleSubmit}
        className="rounded-b-2xl rounded-tr-2xl border border-sage-200/90 bg-white/95 p-3 shadow-float backdrop-blur sm:p-4"
        aria-label="Search properties"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.3fr_1.1fr_auto]">
          {/* Location / District */}
          <div className="relative rounded-2xl border border-sage-200 bg-beige-50 px-3.5 py-2.5 transition-colors focus-within:border-leaf-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-leaf-100">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-navy-500">
              City / District
            </label>
            <div className="relative mt-0.5 flex items-center">
              <MapPin size={16} className="text-leaf-600 flex-shrink-0" />
              <select
                aria-label="Select district"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="w-full appearance-none bg-transparent pl-2 pr-6 text-sm font-bold text-navy-900 focus:outline-none"
              >
                <option value="">All Tamil Nadu</option>
                {tamilNaduDistricts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-1 text-navy-400" />
            </div>
          </div>

          {/* Locality or Keyword */}
          <div className="relative rounded-2xl border border-sage-200 bg-beige-50 px-3.5 py-2.5 transition-colors focus-within:border-leaf-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-leaf-100">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-navy-500">
              Locality / Landmark
            </label>
            <div className="relative mt-0.5 flex items-center">
              <Search size={16} className="text-leaf-600 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="e.g. OMR, Saravanampatti, Airport Rd..."
                className="w-full bg-transparent pl-2 text-sm font-semibold text-navy-900 placeholder:text-navy-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="relative rounded-2xl border border-sage-200 bg-beige-50 px-3.5 py-2.5 transition-colors focus-within:border-leaf-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-leaf-100">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-navy-500">
              Budget Range
            </label>
            <div className="relative mt-0.5 flex items-center">
              <IndianRupee size={16} className="text-leaf-600 flex-shrink-0" />
              <select
                aria-label="Select budget"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full appearance-none bg-transparent pl-2 pr-6 text-sm font-bold text-navy-900 focus:outline-none"
              >
                {budgetOptions.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-1 text-navy-400" />
            </div>
          </div>
          {/* 99acres-style Big Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 px-7 py-3 text-sm font-extrabold text-white shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105 active:scale-95 sm:py-2.5"
          >
            <Search size={18} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}
