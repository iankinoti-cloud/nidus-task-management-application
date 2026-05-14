import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// In production we also reject obvious placeholder/template values so a
// freshly-cloned-and-deployed repo shows a helpful message instead of
// silently failing.  In development we only reject genuinely empty values so
// the local dev server can still render (auth will be non-functional but the
// landing page and UI are fully viewable).
const isProd = import.meta.env.PROD

const isInvalid = (v: string) => {
  if (!v) return true
  if (isProd) {
    return (
      v === 'https://placeholder.supabase.co' ||
      v === 'placeholder-anon-key' ||
      v.includes('your-project') ||
      v.includes('your-anon-key')
    )
  }
  return false
}

export const configError: string | null =
  isInvalid(supabaseUrl) || isInvalid(supabaseAnonKey)
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
