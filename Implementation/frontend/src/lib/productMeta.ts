/** Maps free-text availability from the database to a BEM modifier for styling. */
export function availabilityModifier(availability: string): string {
  const value = availability.trim().toLowerCase()
  if (!value) return 'default'
  if (value.includes('out of') || value === 'out of stock' || value === 'unavailable') {
    return 'out-of-stock'
  }
  if (value.includes('season')) return 'seasonal'
  if (value.includes('request') || value.includes('enquir')) return 'on-request'
  if (value.includes('stock') || value.includes('available') || value === 'in stock') {
    return 'in-stock'
  }
  return 'default'
}
