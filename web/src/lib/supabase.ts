import { createClient } from '@supabase/supabase-js'
import { createPerTabAuthStorage } from './authStorage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables')
}

// The random instance key also prevents cross-tab Auth event broadcasts.
// The custom adapter still restores this tab's login after a reload.
const instanceStorageKey = `adventure-files-tab-${crypto.randomUUID()}`

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      storageKey: instanceStorageKey,
      storage: createPerTabAuthStorage(instanceStorageKey),
      detectSessionInUrl: true,
    },
  },
)