const PRODUCT_IMAGE_BUCKET = 'Products'

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'

function storageUrl(path: string): string {
  const value = path?.trim()
  if (!value) return FALLBACK_PRODUCT_IMAGE

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  if (!supabaseUrl) return FALLBACK_PRODUCT_IMAGE

  const cleanedPath = value.replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${cleanedPath}`
}

export function productImageUrl(imageUrl: string | null | undefined): string {
  const value = imageUrl?.trim()
  if (!value) return FALLBACK_PRODUCT_IMAGE

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return storageUrl(value)
}

export function resolveAssetUrl(value: string | null | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return storageUrl(trimmed)
}
