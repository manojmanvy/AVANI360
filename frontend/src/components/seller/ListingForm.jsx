import { useState } from 'react'
import { ImagePlus, Link2, Loader2, MapPin, Plus, Trash2, Upload, X } from 'lucide-react'
import { propertyTypes, tamilNaduDistricts } from '../../data/districts.js'

const fieldClass =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-100'

const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-500'

const areaUnits = ['sq.ft.', 'sq.m.', 'acres', 'cents', 'grounds']
const facingOptions = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']

const MAX_IMAGES = 6
const MAX_FILE_BYTES = 1.5 * 1024 * 1024

const emptyForm = {
  title: '',
  type: propertyTypes[0],
  district: '',
  city: '',
  locality: '',
  price: '',
  area: '',
  areaUnit: 'sq.ft.',
  dimensions: '',
  facing: 'East',
  ownership: 'Patta',
  description: '',
  highlights: '',
  documents: '',
  amenities: '',
  mapLink: '',
}

function toCommaString(value) {
  return Array.isArray(value) ? value.join(', ') : value || ''
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export default function ListingForm({ initialListing, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() =>
    initialListing
      ? {
          title: initialListing.title || '',
          type: initialListing.type || propertyTypes[0],
          district: initialListing.district || '',
          city: initialListing.city || '',
          locality: initialListing.locality || '',
          price: initialListing.price != null ? String(initialListing.price) : '',
          area: initialListing.area != null ? String(initialListing.area) : '',
          areaUnit: initialListing.areaUnit || 'sq.ft.',
          dimensions: initialListing.dimensions || '',
          facing: initialListing.facing || 'East',
          ownership: initialListing.ownership || 'Patta',
          description: initialListing.description || '',
          highlights: toCommaString(initialListing.highlights),
          documents: toCommaString(initialListing.documents),
          amenities: toCommaString(initialListing.amenities),
          mapLink: initialListing.mapLink || '',
        }
      : emptyForm,
  )
  const [images, setImages] = useState(initialListing?.images || [])
  const [urlInput, setUrlInput] = useState('')
  const [errors, setErrors] = useState({})
  const [imageError, setImageError] = useState('')

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }))
  }

  const addImageUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setImageError('Image link must start with http:// or https://')
      return
    }
    if (images.length >= MAX_IMAGES) {
      setImageError(`You can add up to ${MAX_IMAGES} photos.`)
      return
    }
    setImages((current) => [...current, url])
    setUrlInput('')
    setImageError('')
  }

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      setImageError(`You can add up to ${MAX_IMAGES} photos.`)
      return
    }

    const nextImages = []
    let error = ''
    for (const file of files.slice(0, remaining)) {
      if (!file.type.startsWith('image/')) {
        error = 'Only image files are allowed.'
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        error = `${file.name} is larger than 1.5 MB. Please use a smaller image or a link.`
        continue
      }
      try {
        nextImages.push(await readFileAsDataUrl(file))
      } catch {
        error = 'One image could not be read. Please try another file.'
      }
    }

    if (nextImages.length > 0) {
      setImages((current) => [...current, ...nextImages].slice(0, MAX_IMAGES))
    }
    setImageError(error)
  }

  const removeImage = (index) => {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const validate = () => {
    const nextErrors = {}
    if (form.title.trim().length < 5) nextErrors.title = 'Enter a clear listing title (min 5 characters).'
    if (!form.district) nextErrors.district = 'Select a district.'
    if (!form.city.trim()) nextErrors.city = 'Enter the city or town.'
    if (!form.locality.trim()) nextErrors.locality = 'Enter the locality or area.'
    if (!(Number(form.price) > 0)) nextErrors.price = 'Enter a valid asking price.'
    if (!(Number(form.area) > 0)) nextErrors.area = 'Enter a valid area.'
    if (form.description.trim().length < 20) {
      nextErrors.description = 'Add a description of at least 20 characters.'
    }
    if (images.length === 0) nextErrors.images = 'Add at least one photo (upload or image link).'
    if (form.mapLink.trim() && !/^https?:\/\//i.test(form.mapLink.trim())) {
      nextErrors.mapLink = 'Map link must start with http:// or https://'
    }
    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      title: form.title.trim(),
      type: form.type,
      district: form.district,
      city: form.city.trim(),
      locality: form.locality.trim(),
      price: Number(form.price),
      area: Number(form.area),
      areaUnit: form.areaUnit,
      dimensions: form.dimensions.trim(),
      facing: form.facing,
      ownership: form.ownership.trim(),
      description: form.description.trim(),
      highlights: splitList(form.highlights),
      documents: splitList(form.documents),
      amenities: splitList(form.amenities),
      images,
      mapLink: form.mapLink.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.form ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {errors.form}
        </div>
      ) : null}

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy-900">Basic details</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="listing-title" className={labelClass}>Listing title</label>
            <input
              id="listing-title"
              type="text"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. 3 cent plot near Saravanampatti main road"
              className={fieldClass}
            />
            {errors.title ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.title}</p> : null}
          </div>

          <div>
            <label htmlFor="listing-type" className={labelClass}>Property type</label>
            <select id="listing-type" value={form.type} onChange={(event) => update('type', event.target.value)} className={fieldClass}>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="listing-district" className={labelClass}>District</label>
            <select id="listing-district" value={form.district} onChange={(event) => update('district', event.target.value)} className={fieldClass}>
              <option value="">Select district</option>
              {tamilNaduDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {errors.district ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.district}</p> : null}
          </div>

          <div>
            <label htmlFor="listing-city" className={labelClass}>City / town</label>
            <input id="listing-city" type="text" value={form.city} onChange={(event) => update('city', event.target.value)} placeholder="e.g. Coimbatore" className={fieldClass} />
            {errors.city ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.city}</p> : null}
          </div>

          <div>
            <label htmlFor="listing-locality" className={labelClass}>Locality / area</label>
            <input id="listing-locality" type="text" value={form.locality} onChange={(event) => update('locality', event.target.value)} placeholder="e.g. Saravanampatti" className={fieldClass} />
            {errors.locality ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.locality}</p> : null}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy-900">Pricing & size</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="listing-price" className={labelClass}>Asking price (₹)</label>
            <input id="listing-price" type="number" min="0" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="e.g. 4200000" className={fieldClass} />
            {errors.price ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.price}</p> : null}
          </div>
          <div>
            <label htmlFor="listing-area" className={labelClass}>Area</label>
            <input id="listing-area" type="number" min="0" value={form.area} onChange={(event) => update('area', event.target.value)} placeholder="e.g. 1800" className={fieldClass} />
            {errors.area ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.area}</p> : null}
          </div>
          <div>
            <label htmlFor="listing-unit" className={labelClass}>Area unit</label>
            <select id="listing-unit" value={form.areaUnit} onChange={(event) => update('areaUnit', event.target.value)} className={fieldClass}>
              {areaUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="listing-dimensions" className={labelClass}>Dimensions</label>
            <input id="listing-dimensions" type="text" value={form.dimensions} onChange={(event) => update('dimensions', event.target.value)} placeholder="e.g. 30 × 60 ft" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="listing-facing" className={labelClass}>Facing</label>
            <select id="listing-facing" value={form.facing} onChange={(event) => update('facing', event.target.value)} className={fieldClass}>
              {facingOptions.map((facing) => (
                <option key={facing} value={facing}>{facing}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="listing-ownership" className={labelClass}>Ownership / document</label>
            <input id="listing-ownership" type="text" value={form.ownership} onChange={(event) => update('ownership', event.target.value)} placeholder="e.g. Patta" className={fieldClass} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy-900">Description & tags</h3>
        <div className="mt-3 space-y-4">
          <div>
            <label htmlFor="listing-description" className={labelClass}>Description</label>
            <textarea
              id="listing-description"
              rows={4}
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Describe the land, road access, surroundings and why a buyer should consider it."
              className={`${fieldClass} resize-none`}
            />
            {errors.description ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.description}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="listing-highlights" className={labelClass}>Highlights</label>
              <input id="listing-highlights" type="text" value={form.highlights} onChange={(event) => update('highlights', event.target.value)} placeholder="Corner plot, 30 ft road" className={fieldClass} />
              <p className="mt-1 text-[11px] text-navy-400">Comma separated</p>
            </div>
            <div>
              <label htmlFor="listing-documents" className={labelClass}>Documents</label>
              <input id="listing-documents" type="text" value={form.documents} onChange={(event) => update('documents', event.target.value)} placeholder="Patta, Chitta, EC" className={fieldClass} />
              <p className="mt-1 text-[11px] text-navy-400">Comma separated</p>
            </div>
            <div>
              <label htmlFor="listing-amenities" className={labelClass}>Amenities</label>
              <input id="listing-amenities" type="text" value={form.amenities} onChange={(event) => update('amenities', event.target.value)} placeholder="Road, water, electricity" className={fieldClass} />
              <p className="mt-1 text-[11px] text-navy-400">Comma separated</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy-900">Photos</h3>
        <p className="mt-1 text-xs text-navy-500">
          Add up to {MAX_IMAGES} photos. Upload files (max 1.5 MB each) or paste image links.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="url"
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              placeholder="https://example.com/photo.jpg"
              className={`${fieldClass} pl-10`}
            />
          </div>
          <button
            type="button"
            onClick={addImageUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
          >
            <Plus size={16} /> Add link
          </button>
        </div>

        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy-300 bg-navy-50/50 px-4 py-4 text-sm font-semibold text-navy-700 transition-colors hover:border-leaf-400 hover:bg-leaf-50/40">
          <Upload size={17} className="text-leaf-600" />
          Upload photos from device
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </label>

        {imageError ? <p className="mt-2 text-xs font-medium text-rose-600">{imageError}</p> : null}
        {errors.images ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.images}</p> : null}

        {images.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${index}-${image.slice(0, 24)}`} className="group relative overflow-hidden rounded-xl border border-navy-100">
                <img src={image} alt={`Listing photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-sage-950/70 text-white transition-colors hover:bg-rose-600"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-4 py-6 text-xs text-navy-400">
            <ImagePlus size={18} /> No photos added yet.
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy-900">Map location</h3>
        <div className="mt-3">
          <label htmlFor="listing-map" className={labelClass}>Google Maps link</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              id="listing-map"
              type="url"
              value={form.mapLink}
              onChange={(event) => update('mapLink', event.target.value)}
              placeholder="https://maps.google.com/..."
              className={`${fieldClass} pl-10`}
            />
          </div>
          <p className="mt-1 text-[11px] text-navy-400">
            Open Google Maps, right-click the plot, copy the link and paste it here. Buyers will see a
            "View on Google Maps" button.
          </p>
          {errors.mapLink ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.mapLink}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {initialListing ? 'Update listing' : 'Submit for review'}
        </button>
      </div>
    </form>
  )
}
