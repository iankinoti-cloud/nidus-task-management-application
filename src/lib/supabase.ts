import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Expose missing-config error so main.tsx can catch and display it gracefully
// instead of crashing the entire JS module graph silently (blank page).
export const configError: string | null =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Vercel project settings (Settings → Environment Variables).'
    : null

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    // Limit realtime connections to reduce server load
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

export type { User, Session } from '@supabase/supabase-js'
