import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabasePublishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase authentication is not configured')
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  }
}

const authOptions = {
  autoRefreshToken: false,
  persistSession: false,
  detectSessionInUrl: false,
}

export function createAuthClient() {
  const {
    supabaseUrl,
    supabasePublishableKey,
  } = getSupabaseConfig()

  return createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: authOptions,
    },
  )
}

export function createUserDatabaseClient(
  accessToken: string,
) {
  if (
    typeof accessToken !== 'string' ||
    accessToken.length === 0 ||
    accessToken.length > 8192 ||
    /\s/.test(accessToken)
  ) {
    throw new Error('Verified user access token is required')
  }

  const {
    supabaseUrl,
    supabasePublishableKey,
  } = getSupabaseConfig()

  return createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: authOptions,
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  )
}