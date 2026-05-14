import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-600">
        <p>Nidus v1.0.0 — Built with ♥ and React</p>
        <p className="mt-1">
          Crafted by{' '}
          <span className="font-semibold tracking-wide text-slate-400 hover:text-indigo-400 transition-colors duration-200 cursor-default">
            IAN KINOTI
          </span>{' '}
          <span className="text-slate-700">✦</span>{' '}
          <span className="italic text-slate-500">Software Engineer</span>
        </p>
      </footer>
    </div>
  )
}
