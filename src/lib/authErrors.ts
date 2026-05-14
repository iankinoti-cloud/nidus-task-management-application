/**
 * Maps raw Supabase / network error messages to safe, user-friendly strings.
 * Never expose internal error details to the client.
 */
const AUTH_ERROR_MAP: [string, string][] = [
  ['Invalid login credentials', 'Invalid email or password.'],
  ['invalid_grant', 'Invalid email or password.'],
  ['Email not confirmed', 'Please verify your email address before signing in.'],
  ['User already registered', 'An account with this email already exists.'],
  ['Password should be at least', 'Password does not meet the minimum requirements.'],
  ['Too many requests', 'Too many attempts. Please wait a moment and try again.'],
  ['rate limit', 'Too many attempts. Please wait a moment and try again.'],
  ['network', 'A network error occurred. Please check your connection.'],
  ['fetch', 'A network error occurred. Please check your connection.'],
]

export function sanitizeAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  const lower = raw.toLowerCase()

  for (const [key, friendly] of AUTH_ERROR_MAP) {
    if (lower.includes(key.toLowerCase())) return friendly
  }

  // Fallback — never expose raw error text
  return 'Authentication failed. Please try again.'
}
