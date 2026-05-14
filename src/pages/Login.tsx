import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/ui/Spinner'
import { sanitizeAuthError } from '../lib/authErrors'

// ── Rate-limit constants ──────────────────────────────────────────────────────
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000 // 5 minutes
const RL_KEY = '_nidus_rl'

interface RLState {
  attempts: number
  lockoutUntil: number | null
}

function getRLState(): RLState {
  try {
    const raw = sessionStorage.getItem(RL_KEY)
    if (raw) return JSON.parse(raw) as RLState
  } catch {
    /* ignore parse errors */
  }
  return { attempts: 0, lockoutUntil: null }
}

function setRLState(state: RLState) {
  sessionStorage.setItem(RL_KEY, JSON.stringify(state))
}

function resetRL() {
  sessionStorage.removeItem(RL_KEY)
}

/** Return remaining lockout seconds (0 if not locked out). */
function lockedOutSeconds(): number {
  const { lockoutUntil } = getRLState()
  if (!lockoutUntil) return 0
  const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000)
  return remaining > 0 ? remaining : 0
}

// ── Safe redirect helper ──────────────────────────────────────────────────────
/**
 * Validate that the redirect target is a same-origin relative path.
 * Rejects absolute URLs and protocol-relative URLs (e.g. //evil.com).
 */
function safePath(raw: string | undefined): string {
  if (!raw) return '/dashboard'
  // Must start with exactly one slash and not be a protocol-relative URL
  if (/^\/(?!\/)/.test(raw)) return raw
  return '/dashboard'
}

// ── Icon helpers (inlined to avoid a separate file) ──────────────────────────
function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export function Login() {
  const { signInWithEmail, signInWithGithub, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // ── Safe redirect target ──────────────────────────────────────────────────
  const from = safePath(
    (location.state as { from?: { pathname?: string } })?.from?.pathname
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(lockedOutSeconds)

  // Update countdown every second while locked out
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      const secs = lockedOutSeconds()
      setCountdown(secs)
      if (secs <= 0) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // ── Rate-limit check ────────────────────────────────────────────────────
    const secs = lockedOutSeconds()
    if (secs > 0) {
      const mins = Math.ceil(secs / 60)
      setError(`Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`)
      return
    }

    setLoading(true)
    try {
      await signInWithEmail(email, password)
      resetRL()
      navigate(from, { replace: true })
    } catch (err: unknown) {
      // Increment attempt counter
      const prev = getRLState()
      // Reset counter if a prior lockout has expired
      const base = prev.lockoutUntil && Date.now() >= prev.lockoutUntil ? 0 : prev.attempts
      const next = base + 1
      if (next >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_MS
        setRLState({ attempts: next, lockoutUntil })
        const mins = LOCKOUT_MS / 60000
        setError(`Too many failed attempts. Try again in ${mins} minutes.`)
        setCountdown(LOCKOUT_MS / 1000)
      } else {
        setRLState({ attempts: next, lockoutUntil: null })
        const remaining = MAX_ATTEMPTS - next
        setError(
          `${sanitizeAuthError(err)} (${remaining} attempt${remaining !== 1 ? 's' : ''} remaining)`
        )
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGithub() {
    setError('')
    setSocialLoading('github')
    try {
      await signInWithGithub()
    } catch (err: unknown) {
      setError(sanitizeAuthError(err))
      setSocialLoading(null)
    }
  }

  async function handleGoogle() {
    setError('')
    setSocialLoading('google')
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      setError(sanitizeAuthError(err))
      setSocialLoading(null)
    }
  }

  const isLockedOut = countdown > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-violet-600 rounded-xl mb-4">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Nidus workspace</p>
        </div>

        <div className="nidus-card p-6 space-y-5">
          {error && (
            <div
              role="alert"
              className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGithub}
              disabled={!!socialLoading || loading || isLockedOut}
              className="btn-secondary justify-center"
            >
              {socialLoading === 'github' ? <Spinner size="sm" /> : <GithubIcon />}
              GitHub
            </button>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={!!socialLoading || loading || isLockedOut}
              className="btn-secondary justify-center"
            >
              {socialLoading === 'google' ? (
                <Spinner size="sm" />
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Google
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="nidus-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="nidus-input"
                required
                autoComplete="email"
                maxLength={254}
                disabled={isLockedOut}
              />
            </div>
            <div>
              <label htmlFor="password" className="nidus-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="nidus-input"
                required
                autoComplete="current-password"
                maxLength={128}
                disabled={isLockedOut}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!socialLoading || isLockedOut}
              className="btn-primary w-full justify-center"
            >
              {loading ? <Spinner size="sm" /> : null}
              {isLockedOut
                ? `Locked — wait ${Math.ceil(countdown / 60)}m`
                : loading
                ? 'Signing in…'
                : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
