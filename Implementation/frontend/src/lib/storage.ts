import { supabase } from './supabase'

const STORAGE_BUCKET = 'Products'
const storageBaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')

export async function uploadStorageFile(file: File, folder = '') {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured'), path: '' }
  }

  const sanitizedFilename = file.name.replace(/\s+/g, '-').toLowerCase()
  const filePath = `${folder ? `${folder}/` : ''}${Date.now()}-${sanitizedFilename}`
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  return { data, error, path: filePath }
}

export function storagePublicUrl(path: string) {
  const value = path?.trim()
  if (!value || !storageBaseUrl) return ''
  const cleaned = value.replace(/^\/+/, '')
  return `${storageBaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${cleaned}`
}
