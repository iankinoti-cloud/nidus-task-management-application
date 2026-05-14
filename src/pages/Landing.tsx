import { Link } from 'react-router-dom'
import { Zap, CheckCircle2, Kanban, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const features = [
  {
    icon: Kanban,
    title: 'Sprint Boards',
    description: 'Visualise work with a real-time kanban board. Drag tasks across Backlog → In Progress → In Review → Done.',
  },
  {
    icon: Users,
    title: 'Team Assignment',
    description: 'Assign tasks to any team member. Everyone stays on the same page with live updates across all sessions.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Auth',
    description: 'Sign in with email/password, GitHub, or Google. Sessions are persisted without ever touching localStorage.',
  },
  {
    icon: CheckCircle2,
    title: 'Full Persistence',
    description: 'Every click, every status change is saved instantly to the database. No data loss. No stale state.',
  },
]

export function Landing() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 text-center px-4">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-800/50 rounded-full px-4 py-1.5 text-xs text-violet-300 font-medium mb-6">
          <Zap size={12} />
          v1.0.0 — Now live
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-3xl mx-auto mb-6">
          Your team's sprint<br />
          <span className="text-violet-400">command centre</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Nidus is a focused project management tool that helps agile teams create sprints,
          assign tasks, and track progress — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-6 py-3">
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-6 py-3">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Everything your team needs
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-lg mx-auto">
            No bloat, no noise — just the essential tools for shipping fast.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="nidus-card p-5 hover:border-slate-700 transition-colors">
                <div className="h-9 w-9 bg-violet-900/50 border border-violet-800/50 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to build something great?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Create your first sprint in under 60 seconds. No credit card required.
        </p>
        {!user && (
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Get started — it's free
            <ArrowRight size={16} />
          </Link>
        )}
      </section>
    </div>
  )
}
