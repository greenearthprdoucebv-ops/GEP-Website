import { supabase } from './supabase'

const STORAGE_BUCKET = 'Products'
const storageBaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')

export async function uploadStorageFile(file: File, folder = '') {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured'), path: '' }
  }

  const ext = file.name.includes('.') ? `.${file.name.split('.').pop()!.toLowerCase()}` : ''
  const base = file.name.replace(/\.[^.]+$/, '')
  const sanitizedFilename = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // strip diacritics
    .replace(/[^\x00-\x7F]/g, '')     // strip non-ASCII (e.g. Chinese chars)
    .replace(/[^a-zA-Z0-9._-]/g, '-') // replace remaining special chars
    .replace(/-+/g, '-')              // collapse consecutive hyphens
    .replace(/^-|-$/g, '')            // trim edge hyphens
    .toLowerCase() + ext
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
