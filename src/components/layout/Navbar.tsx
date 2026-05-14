import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui/Avatar'
import { Spinner } from '../ui/Spinner'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="p-1.5 bg-violet-600 rounded-lg group-hover:bg-violet-500 transition-colors">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Nidus</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </nav>
          )}

          {/* User section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <Avatar
                    name={profile?.full_name}
                    email={user.email}
                    avatarUrl={profile?.avatar_url}
                    size="sm"
                  />
                  <span className="text-sm text-slate-300 max-w-[140px] truncate">
                    {profile?.full_name ?? user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="btn-secondary !px-3 !py-1.5"
                >
                  {signingOut ? <Spinner size="sm" /> : <LogOut size={14} />}
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary !px-3 !py-1.5">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary !px-3 !py-1.5">
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 py-4 space-y-3 bg-slate-950">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Avatar
                  name={profile?.full_name}
                  email={user.email}
                  avatarUrl={profile?.avatar_url}
                  size="md"
                />
                <span className="text-sm text-slate-300 truncate">
                  {profile?.full_name ?? user.email}
                </span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-slate-300 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 text-slate-400 hover:text-white py-2 w-full"
              >
                {signingOut ? <Spinner size="sm" /> : <LogOut size={16} />}
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-slate-300 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn-primary w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
