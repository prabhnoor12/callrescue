import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const localUrl = typeof window !== 'undefined' ? (localStorage.getItem('callrescue_supabase_url') || '') : ''
const localKey = typeof window !== 'undefined' ? (localStorage.getItem('callrescue_supabase_key') || '') : ''

const activeUrl = localUrl || envUrl
const activeKey = localKey || envKey

export const isConfigured = Boolean(
  activeUrl &&
  activeKey &&
  !activeUrl.includes('your-project')
)

export let supabase = isConfigured
  ? createClient(activeUrl, activeKey)
  : null

export function getActiveCredentials() {
  return {
    url: activeUrl,
    key: activeKey,
    isConfigured
  }
}

export function setCustomSupabaseCredentials(url, key) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('callrescue_supabase_url', url.trim())
      localStorage.setItem('callrescue_supabase_key', key.trim())
      supabase = createClient(url.trim(), key.trim())
    } else {
      localStorage.removeItem('callrescue_supabase_url')
      localStorage.removeItem('callrescue_supabase_key')
      supabase = envUrl && envKey ? createClient(envUrl, envKey) : null
    }
  }
}

export async function testSupabaseConnection() {
  if (!supabase) {
    return { success: false, message: 'Supabase credentials not configured' }
  }
  try {
    const { data, error } = await supabase.from('client_accounts').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message }
    }
    return { success: true, message: 'Successfully connected to Supabase database!' }
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' }
  }
}
