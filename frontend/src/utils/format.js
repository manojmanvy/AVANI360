export function formatPrice(value) {
  if (!Number.isFinite(value)) return '—'
  if (value >= 10000000) return `₹${trimNumber(value / 10000000)} Cr`
  if (value >= 100000) return `₹${trimNumber(value / 100000)} L`
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatArea(area, unit) {
  if (!Number.isFinite(area)) return '—'
  return `${area.toLocaleString('en-IN')} ${unit}`
}

export function formatPosted(days) {
  if (days <= 0) return 'Posted today'
  if (days === 1) return 'Posted 1 day ago'
  if (days < 7) return `Posted ${days} days ago`
  const weeks = Math.round(days / 7)
  return weeks === 1 ? 'Posted 1 week ago' : `Posted ${weeks} weeks ago`
}

export function daysSince(dateString) {
  if (!dateString) return 0
  const time = new Date(dateString).getTime()
  if (Number.isNaN(time)) return 0
  return Math.max(0, Math.floor((Date.now() - time) / 86400000))
}

export function postedLabel(listing) {
  if (listing?.createdAt) return formatPosted(daysSince(listing.createdAt))
  return formatPosted(listing?.postedDaysAgo ?? 0)
}

export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatUnitPrice(price, area, unit) {
  if (!Number.isFinite(price) || !Number.isFinite(area) || area <= 0) return null
  const rate = Math.round(price / area)
  return `₹${rate.toLocaleString('en-IN')}/${unit || 'sq.ft.'}`
}

function trimNumber(value) {
  return Number(value.toFixed(2)).toLocaleString('en-IN')
}
