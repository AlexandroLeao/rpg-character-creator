import { createClient } from '@supabase/supabase-js'

export function createAuthClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabasePublishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase authentication is not configured')
  }

  return createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  )
}
