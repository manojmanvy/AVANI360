const roleLabels = {
  buyer: 'Buyer',
  seller: 'Seller',
  builder: 'Builder',
  admin: 'Admin',
}

const apiRoles = {
  Buyer: 'buyer',
  Owner: 'seller',
  Broker: 'seller',
  Builder: 'builder',
}

export function mapUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    roleLabel: roleLabels[user.role] || user.role,
    district: user.district || '',
    isActive: user.is_active,
    createdAt: user.created_at,
  }
}

export function toApiRole(role) {
  return apiRoles[role] || 'buyer'
}

export function mapProperty(property) {
  return {
    id: property.id,
    sellerId: property.seller_id,
    sellerName: property.seller_name,
    sellerType: property.seller_type,
    title: property.title,
    description: property.description || '',
    type: property.property_type,
    district: property.district,
    city: property.city || '',
    locality: property.locality || '',
    price: Number(property.price),
    area: property.area != null ? Number(property.area) : null,
    areaUnit: property.area_unit,
    dimensions: property.dimensions || '',
    facing: property.facing || '',
    ownership: property.ownership || '',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    latitude: property.latitude,
    longitude: property.longitude,
    mapLink: property.map_link || '',
    highlights: property.highlights || [],
    amenities: property.amenities || [],
    documents: property.documents || [],
    images: property.images || [],
    status: property.status,
    rejectionReason: property.rejection_reason || '',
    featured: property.featured,
    createdAt: property.created_at,
    updatedAt: property.updated_at,
  }
}

export function toPropertyPayload(listing) {
  return {
    title: listing.title,
    description: listing.description || null,
    property_type: listing.type,
    district: listing.district,
    city: listing.city || null,
    locality: listing.locality || null,
    price: listing.price,
    area: listing.area ?? null,
    area_unit: listing.areaUnit || 'sqft',
    dimensions: listing.dimensions || null,
    facing: listing.facing || null,
    ownership: listing.ownership || null,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    map_link: listing.mapLink || null,
    highlights: listing.highlights || [],
    amenities: listing.amenities || [],
    documents: listing.documents || [],
    images: listing.images || [],
  }
}

export function mapEnquiry(enquiry) {
  return {
    id: enquiry.id,
    propertyId: enquiry.property_id,
    propertyTitle: enquiry.property_title,
    sellerId: enquiry.seller_id,
    sellerName: enquiry.seller_name,
    sellerType: enquiry.seller_type,
    buyerId: enquiry.buyer_id,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email || '',
    message: enquiry.message || '',
    siteVisit: Boolean(enquiry.preferred_date),
    visitDate: enquiry.preferred_date || '',
    status: enquiry.status,
    createdAt: enquiry.created_at,
  }
}

export function toEnquiryPayload(enquiry) {
  return {
    property_id: enquiry.propertyId,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email || null,
    message: enquiry.message || null,
    preferred_date: enquiry.siteVisit ? enquiry.visitDate || null : null,
  }
}
