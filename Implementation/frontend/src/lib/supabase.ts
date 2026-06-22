import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseConfigError = hasSupabaseConfig
  ? null
  : 'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).'

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null
