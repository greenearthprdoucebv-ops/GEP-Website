const PRODUCT_IMAGE_BUCKET = 'Products'

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'

/** Resolve DB image_url: full URL, Storage path, or fallback placeholder. */
export function productImageUrl(imageUrl: string | null | undefined): string {
  const value = imageUrl?.trim()
  if (!value) return FALLBACK_PRODUCT_IMAGE

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  if (!supabaseUrl) return FALLBACK_PRODUCT_IMAGE

  const path = value.replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${path}`
}
