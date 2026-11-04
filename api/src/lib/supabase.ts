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

/**
 * Administrative Auth operations are restricted to the trusted API.
 * The secret key must exist only in the Render/server environment.
 * Never reuse this client for ordinary per-user character queries.
 */
export function createAdminAuthClient() {
  const { supabaseUrl } = getSupabaseConfig()
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (!secretKey) {
    throw new Error('Account deletion service is not configured')
  }

  return createClient(supabaseUrl, secretKey, {
    auth: authOptions,
  })
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