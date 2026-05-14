import { Link } from 'react-router-dom'
import { ArrowLeft, Frown } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
        <Frown size={28} className="text-slate-500" />
      </div>
      <h1 className="text-5xl font-extrabold text-white mb-3">404</h1>
      <p className="text-lg text-slate-400 mb-2">Page not found</p>
      <p className="text-sm text-slate-600 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={15} />
        Back to home
      </Link>
    </div>
  )
}
